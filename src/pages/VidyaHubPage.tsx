
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  MapPin, 
  UserPlus, 
  MessageSquare, 
  Wifi, 
  WifiOff,
  Building,
  School,
  GraduationCap,
  Landmark,
  Navigation,
  NavigationOff
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { mockHubs } from "@/mocks/hubsData";
import { VidyaHub } from "@/integrations/supabase/schema";

const VidyaHubPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [hubs, setHubs] = useState<any[]>([]);
  const [filteredHubs, setFilteredHubs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userHubData, setUserHubData] = useState<any | null>(null);
  const [isJoiningHub, setIsJoiningHub] = useState(false);
  const [filterDistance, setFilterDistance] = useState("all");
  const [filterTrainer, setFilterTrainer] = useState("all");
  const [filterState, setFilterState] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch hubs on component mount
  useEffect(() => {
    fetchHubs();
    if (user?.id) {
      fetchUserHubMembership();
    }
  }, [user?.id]);
  
  const fetchHubs = async () => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('vidya_hubs')
        .select('*');
        
      if (error) {
        throw error;
      }
      
      let hubsData;
      
      // If no data is returned from Supabase, use the mock data
      if (!data || data.length === 0) {
        hubsData = mockHubs;
        console.log("Using mock hub data since Supabase returned empty results");
      } else {
        hubsData = data;
      }
      
      // Add mock distance and trainer data (would be calculated based on user location in real app)
      const hubsWithExtraData = hubsData.map(hub => ({
        ...hub,
        distance: `${(Math.random() * 15).toFixed(1)} km`,
        hasTrainer: Math.random() > 0.3, // 70% chance of having a trainer
        isOnline: Math.random() > 0.2, // 80% chance of being online
        languages: ["English", "Hindi", ...(Math.random() > 0.5 ? ["Kannada"] : []), ...(Math.random() > 0.5 ? ["Tamil"] : [])],
        icon: getRandomHubIcon(),
        members: Math.floor(Math.random() * 30) + 5
      }));
      
      setHubs(hubsWithExtraData);
      setFilteredHubs(hubsWithExtraData);
    } catch (error) {
      console.error("Error fetching hubs:", error);
      toast({
        title: "Error",
        description: "Failed to load hubs",
        variant: "destructive",
      });
      
      // Use mock data as fallback in case of error
      const hubsWithExtraData = mockHubs.map(hub => ({
        ...hub,
        distance: `${(Math.random() * 15).toFixed(1)} km`,
        hasTrainer: Math.random() > 0.3,
        isOnline: Math.random() > 0.2,
        languages: ["English", "Hindi", ...(Math.random() > 0.5 ? ["Kannada"] : []), ...(Math.random() > 0.5 ? ["Tamil"] : [])],
        icon: getRandomHubIcon(),
        members: Math.floor(Math.random() * 30) + 5
      }));
      
      setHubs(hubsWithExtraData);
      setFilteredHubs(hubsWithExtraData);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get available states for filtering
  const getAvailableStates = () => {
    const states = hubs.map(hub => {
      // Extract state from location (assuming format "Rural StateName")
      const location = hub.location || "";
      if (location.startsWith("Rural ")) {
        return location.substring(6); // Remove "Rural " prefix
      }
      return location;
    });
    
    // Return unique states
    return [...new Set(states)].sort();
  };
  
  const fetchUserHubMembership = async () => {
    try {
      const { data, error } = await supabase
        .from('hub_visits')
        .select(`
          *,
          hub:vidya_hubs(*)
        `)
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1);
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        // Mock additional hub data that might come from other tables in a real implementation
        const hubVisit = data[0];
        
        const hubData = {
          id: hubVisit.hub_id,
          name: hubVisit.hub.name,
          joinedDate: new Date(hubVisit.created_at).toISOString().split('T')[0],
          role: "member",
          lastSync: new Date().toISOString(),
          // Mock hub members - would be fetched from database in real app
          members: [
            { id: "1", name: "Priya Singh", role: "trainer", online: true },
            { id: "2", name: "Anand Kumar", role: "member", online: true },
            { id: "3", name: "Deepika Verma", role: "member", online: false },
            { id: "4", name: "Raj Malhotra", role: "member", online: true },
            { id: "5", name: "Kiran Reddy", role: "member", online: true },
            { id: "6", name: "Arjun Nair", role: "member", online: false },
          ]
        };
        
        setUserHubData(hubData);
      }
    } catch (error) {
      console.error("Error fetching user hub membership:", error);
    }
  };
  
  const getRandomHubIcon = () => {
    const icons = [School, Building, Landmark, GraduationCap, Navigation];
    return icons[Math.floor(Math.random() * icons.length)];
  };

  // Filter hubs based on search term and filters
  useEffect(() => {
    if (!hubs.length) return;
    
    let filtered = [...hubs];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        hub => 
          hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hub.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (hub.description && hub.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Apply distance filter
    if (filterDistance !== "all") {
      filtered = filtered.filter(hub => {
        const distanceValue = parseFloat(hub.distance);
        if (filterDistance === "under5") {
          return distanceValue < 5;
        } else if (filterDistance === "5to10") {
          return distanceValue >= 5 && distanceValue <= 10;
        } else if (filterDistance === "over10") {
          return distanceValue > 10;
        }
        return true;
      });
    }
    
    // Apply trainer filter
    if (filterTrainer !== "all") {
      filtered = filtered.filter(hub => {
        if (filterTrainer === "withTrainer") {
          return hub.hasTrainer;
        } else if (filterTrainer === "withoutTrainer") {
          return !hub.hasTrainer;
        }
        return true;
      });
    }
    
    // Apply state filter
    if (filterState !== "all") {
      filtered = filtered.filter(hub => {
        // Extract state from location for comparison
        const hubState = hub.location.startsWith("Rural ") ? 
          hub.location.substring(6) : hub.location;
        return hubState === filterState;
      });
    }
    
    setFilteredHubs(filtered);
  }, [searchTerm, filterDistance, filterTrainer, filterState, hubs]);

  const handleJoinHub = async (hubId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please login to join a hub",
      });
      navigate("/auth/login");
      return;
    }
    
    setIsJoiningHub(true);
    
    try {
      // Find the hub data
      const selectedHub = hubs.find(hub => hub.id === hubId);
      
      if (selectedHub) {
        // Create hub_visit record in Supabase
        const { data, error } = await supabase
          .from('hub_visits')
          .insert({
            hub_id: hubId,
            user_id: user.id,
            status: 'active'
          })
          .select();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Create hub data based on the new visit and the selected hub
          const hubData = {
            id: selectedHub.id,
            name: selectedHub.name,
            joinedDate: new Date().toISOString().split('T')[0],
            role: "member",
            lastSync: new Date().toISOString(),
            members: [
              { id: "1", name: "Priya Singh", role: "trainer", online: true },
              { id: "2", name: "Anand Kumar", role: "member", online: true },
              { id: "3", name: "Deepika Verma", role: "member", online: false },
              { id: "4", name: "Raj Malhotra", role: "member", online: true },
              { id: "5", name: "Kiran Reddy", role: "member", online: true },
              { id: "6", name: "Arjun Nair", role: "member", online: false },
            ]
          };
          
          setUserHubData(hubData);
          
          toast({
            title: "Success",
            description: `You have joined ${selectedHub.name}`,
          });
        }
      }
    } catch (error) {
      console.error("Error joining hub:", error);
      toast({
        title: "Error",
        description: "Failed to join hub",
        variant: "destructive",
      });
    } finally {
      setIsJoiningHub(false);
    }
  };

  const handleLeaveHub = async () => {
    if (!user?.id || !userHubData?.id) {
      return;
    }
    
    try {
      // Delete hub_visit record from Supabase
      const { error } = await supabase
        .from('hub_visits')
        .delete()
        .eq('hub_id', userHubData.id)
        .eq('user_id', user.id);
        
      if (error) {
        throw error;
      }
      
      setUserHubData(null);
      
      toast({
        title: "Success",
        description: "You have left the hub",
      });
    } catch (error) {
      console.error("Error leaving hub:", error);
      toast({
        title: "Error",
        description: "Failed to leave hub",
        variant: "destructive",
      });
    }
  };

  const handleMessageTrainer = () => {
    toast({
      title: "Coming Soon",
      description: "Direct messaging will be available in the next update",
    });
  };

  const handleSyncHub = () => {
    toast({
      title: "Syncing Data",
      description: "Synchronizing with your hub...",
    });
    
    // Simulate sync process
    setTimeout(() => {
      if (userHubData) {
        const updatedHubData = {
          ...userHubData,
          lastSync: new Date().toISOString()
        };
        setUserHubData(updatedHubData);
        
        toast({
          title: "Sync Complete",
          description: "Your data has been synchronized with the hub",
        });
      }
    }, 2000);
  };

  const handleScheduleVisit = async (hubId: string) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please login to schedule a visit",
      });
      navigate("/auth/login");
      return;
    }
    
    try {
      const hub = hubs.find(h => h.id === hubId);
      
      if (hub) {
        // Create hub_visit record with scheduled status
        const { data, error } = await supabase
          .from('hub_visits')
          .insert({
            hub_id: hubId,
            user_id: user.id,
            status: 'scheduled'
          })
          .select();
          
        if (error) {
          throw error;
        }
        
        toast({
          title: "Visit Scheduled",
          description: `Your visit to ${hub.name} has been scheduled. A confirmation will be sent to your email.`,
        });
      }
    } catch (error) {
      console.error("Error scheduling visit:", error);
      toast({
        title: "Error",
        description: "Failed to schedule visit",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="page-container py-6 container mx-auto px-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Vidya Hubs</h1>
      
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-48 rounded-lg"></div>
          ))}
        </div>
      ) : userHubData ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{userHubData.name}</CardTitle>
                  <CardDescription>
                    Member since {formatDate(userHubData.joinedDate)}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Active Member
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-3">Hub Members</h3>
                  <div className="space-y-3">
                    {userHubData.members.map((member: any) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-muted/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name.split(' ').map((n: string) => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{member.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <span className={`h-2 w-2 rounded-full mr-1.5 ${member.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                              <span>{member.online ? 'Online' : 'Offline'}</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-3">Hub Activity</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-muted/40 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Last Synchronized</span>
                        <span className="text-sm font-medium">
                          {new Date(userHubData.lastSync).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Your Hub Role</span>
                        <Badge>{userHubData.role}</Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Hub Members</span>
                        <span className="text-sm font-medium">{userHubData.members.length}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Next Offline Session</span>
                        <span className="text-sm font-medium">May 5, 2025</span>
                      </div>
                    </div>
                    <div className="p-3 bg-muted/40 rounded-md">
                      <div className="flex justify-between">
                        <span className="text-sm">Available Resources</span>
                        <span className="text-sm font-medium">12 Computers, 3 Tablets</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row justify-between gap-3">
              <Button onClick={handleSyncHub} variant="default" className="w-full sm:w-auto">
                <Wifi className="mr-2 h-4 w-4" /> Sync with Hub
              </Button>
              <Button onClick={handleMessageTrainer} variant="secondary" className="w-full sm:w-auto">
                <MessageSquare className="mr-2 h-4 w-4" /> Message Hub Trainer
              </Button>
              <Button onClick={handleLeaveHub} variant="outline" className="w-full sm:w-auto">
                Leave Hub
              </Button>
            </CardFooter>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Hub Activities Schedule</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-muted/50">
                    <th className="text-left p-3 text-sm font-medium">Activity</th>
                    <th className="text-left p-3 text-sm font-medium">Date</th>
                    <th className="text-left p-3 text-sm font-medium">Time</th>
                    <th className="text-left p-3 text-sm font-medium">Trainer</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-muted/30">
                    <td className="p-3 text-sm">Group Study Session</td>
                    <td className="p-3 text-sm">May 5, 2025</td>
                    <td className="p-3 text-sm">10:00 AM - 12:00 PM</td>
                    <td className="p-3 text-sm">Priya Singh</td>
                  </tr>
                  <tr className="border-b border-muted/30">
                    <td className="p-3 text-sm">Practical Workshop</td>
                    <td className="p-3 text-sm">May 7, 2025</td>
                    <td className="p-3 text-sm">2:00 PM - 4:00 PM</td>
                    <td className="p-3 text-sm">Anand Kumar</td>
                  </tr>
                  <tr className="border-b border-muted/30">
                    <td className="p-3 text-sm">Mock Interview Session</td>
                    <td className="p-3 text-sm">May 10, 2025</td>
                    <td className="p-3 text-sm">11:00 AM - 1:00 PM</td>
                    <td className="p-3 text-sm">Priya Singh</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">What can you do in your Vidya Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Peer Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with other learners to share knowledge and solve problems together.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Offline Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access learning materials even without internet by syncing when connected.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mentor Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get guidance and support from experienced trainers and mentors.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Find a Vidya Hub near you</CardTitle>
              <CardDescription>
                Join a local learning community to connect with other students and trainers for offline learning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4 flex flex-col sm:flex-row gap-4">
                <Input 
                  placeholder="Search by hub name or location..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <div className="flex flex-wrap gap-2">
                  <Select value={filterDistance} onValueChange={setFilterDistance}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Distance" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Any Distance</SelectItem>
                      <SelectItem value="under5">Under 5 km</SelectItem>
                      <SelectItem value="5to10">5 to 10 km</SelectItem>
                      <SelectItem value="over10">Over 10 km</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterTrainer} onValueChange={setFilterTrainer}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Trainer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hubs</SelectItem>
                      <SelectItem value="withTrainer">With Trainer</SelectItem>
                      <SelectItem value="withoutTrainer">Without Trainer</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={filterState} onValueChange={setFilterState}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All States</SelectItem>
                      {getAvailableStates().map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              {filteredHubs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredHubs.map((hub) => {
                    const HubIcon = hub.icon || School;
                    return (
                      <Card key={hub.id} className="border border-muted hover:shadow-md transition-shadow">
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary/10 p-2 rounded-md">
                                <HubIcon className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{hub.name}</CardTitle>
                                <div className="flex items-center text-sm text-muted-foreground mt-1">
                                  <MapPin className="h-3.5 w-3.5 mr-1" />
                                  <span>{hub.location}</span>
                                </div>
                              </div>
                            </div>
                            <Badge 
                              variant={hub.isOnline ? "default" : "outline"}
                              className={hub.isOnline ? "bg-green-100 text-green-800 border-green-200" : ""}
                            >
                              {hub.isOnline ? (
                                <Wifi className="h-3 w-3 mr-1" />
                              ) : (
                                <WifiOff className="h-3 w-3 mr-1" />
                              )}
                              {hub.isOnline ? "Online" : "Offline"} Hub
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div className="flex items-center text-sm">
                              <Users className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{hub.members} members</span>
                            </div>
                            <div className="flex items-center text-sm">
                              <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                              <span>{hub.distance} away</span>
                            </div>
                            <div className="flex items-center text-sm">
                              {hub.hasTrainer && (
                                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-800 border-yellow-200">
                                  Trainer Available
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="mt-2">
                            <p className="text-sm text-muted-foreground line-clamp-2">{hub.description}</p>
                          </div>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hub.languages?.map((lang: string) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
                          {hub.facilities && (
                            <div className="mt-2">
                              <p className="text-xs text-muted-foreground">
                                <span className="font-semibold">Facilities:</span> {hub.facilities.join(", ")}
                              </p>
                            </div>
                          )}
                        </CardContent>
                        <CardFooter className="pt-2 pb-3 flex flex-col sm:flex-row gap-2">
                          <Button 
                            className="w-full sm:w-auto" 
                            onClick={() => handleJoinHub(hub.id)}
                            disabled={isJoiningHub}
                          >
                            <UserPlus className="mr-2 h-4 w-4" />
                            Join Hub
                          </Button>
                          <Button 
                            className="w-full sm:w-auto"
                            variant="outline"
                            onClick={() => handleScheduleVisit(hub.id)}
                          >
                            Schedule Visit
                          </Button>
                        </CardFooter>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-lg font-medium mb-2">No hubs found</p>
                  <p className="text-muted-foreground">
                    Try adjusting your search or check back later
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4">Why join a Vidya Hub?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Community Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Learn faster with peer support and group activities designed to enhance understanding.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Local Resources</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Access computers, internet, and study materials even if you don't have them at home.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect with local employers and get help finding job opportunities in your area.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="bg-muted/30 rounded-lg p-6 mt-6">
            <h3 className="text-lg font-semibold mb-3">How Vidya Hubs Work</h3>
            <ol className="list-decimal pl-5 space-y-3">
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Find a hub near you</span> - Search for hubs in your area that offer the resources you need.
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Join the hub</span> - Sign up to become a member and get access to offline learning resources.
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Attend sessions</span> - Participate in scheduled learning activities and workshops.
              </li>
              <li className="text-muted-foreground">
                <span className="font-medium text-foreground">Sync your progress</span> - When online, sync your progress with the Vidya platform.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default VidyaHubPage;
