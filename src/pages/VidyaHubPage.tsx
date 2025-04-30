
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
  Landmark
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

// Mock data for nearby hubs
const nearbyHubs = [
  {
    id: "1",
    name: "Bangalore Central Hub",
    location: "MG Road, Bangalore",
    members: 24,
    distance: "1.2 km",
    hasTrainer: true,
    languages: ["English", "Kannada", "Hindi"],
    isOnline: true,
    icon: School,
  },
  {
    id: "2",
    name: "HSR Layout Learning Center",
    location: "HSR Layout Sector 2, Bangalore",
    members: 18,
    distance: "3.5 km",
    hasTrainer: true,
    languages: ["English", "Tamil", "Hindi"],
    isOnline: true,
    icon: Building,
  },
  {
    id: "3",
    name: "Whitefield Community Hub",
    location: "Whitefield, Bangalore",
    members: 12,
    distance: "8.7 km",
    hasTrainer: false,
    languages: ["English", "Hindi"],
    isOnline: false,
    icon: Landmark,
  },
  {
    id: "4",
    name: "Electronic City Peer Group",
    location: "Electronic City Phase 1, Bangalore",
    members: 15,
    distance: "12.3 km",
    hasTrainer: true,
    languages: ["English", "Telugu", "Kannada"],
    isOnline: true,
    icon: GraduationCap,
  },
  {
    id: "5",
    name: "Koramangala Tech Hub",
    location: "Koramangala 5th Block, Bangalore",
    members: 20,
    distance: "4.8 km",
    hasTrainer: true,
    languages: ["English", "Kannada"],
    isOnline: true,
    icon: School,
  },
  {
    id: "6",
    name: "Indiranagar Learning Group",
    location: "Indiranagar 100ft Road, Bangalore",
    members: 16,
    distance: "5.2 km",
    hasTrainer: false,
    languages: ["English", "Hindi", "Tamil"],
    isOnline: true,
    icon: Building,
  },
  {
    id: "7",
    name: "Jayanagar Study Circle",
    location: "Jayanagar 4th Block, Bangalore",
    members: 14,
    distance: "6.5 km",
    hasTrainer: true,
    languages: ["English", "Kannada"],
    isOnline: true,
    icon: Landmark,
  },
  {
    id: "8",
    name: "Malleshwaram Knowledge Center",
    location: "Malleshwaram 8th Cross, Bangalore",
    members: 22,
    distance: "7.3 km",
    hasTrainer: true,
    languages: ["English", "Kannada", "Hindi"],
    isOnline: false,
    icon: GraduationCap,
  }
];

// Mock user hub data
const userHub = {
  id: "1",
  name: "Bangalore Central Hub",
  joinedDate: "2025-04-15",
  role: "member",
  lastSync: "2025-04-29T10:30:00",
  members: [
    { id: "1", name: "Priya Singh", role: "trainer", online: true },
    { id: "2", name: "Anand Kumar", role: "member", online: true },
    { id: "3", name: "Deepika Verma", role: "member", online: false },
    { id: "4", name: "Raj Malhotra", role: "member", online: true },
    { id: "5", name: "Kiran Reddy", role: "member", online: true },
    { id: "6", name: "Arjun Nair", role: "member", online: false },
  ]
};

const VidyaHubPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHubs, setFilteredHubs] = useState(nearbyHubs);
  const [userHubData, setUserHubData] = useState<typeof userHub | null>(null);
  const [isJoiningHub, setIsJoiningHub] = useState(false);
  const [filterDistance, setFilterDistance] = useState("all");
  const [filterTrainer, setFilterTrainer] = useState("all");
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already part of a hub
  useEffect(() => {
    const storedHubData = localStorage.getItem("vidya_user_hub");
    if (storedHubData) {
      setUserHubData(JSON.parse(storedHubData));
    }
  }, []);

  // Filter hubs based on search term and filters
  useEffect(() => {
    let filtered = nearbyHubs;
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        hub => 
          hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hub.location.toLowerCase().includes(searchTerm.toLowerCase())
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
    
    setFilteredHubs(filtered);
  }, [searchTerm, filterDistance, filterTrainer]);

  const handleJoinHub = (hubId: string) => {
    setIsJoiningHub(true);
    
    // Find the hub data
    const selectedHub = nearbyHubs.find(hub => hub.id === hubId);
    
    // Simulate API call to join hub
    setTimeout(() => {
      if (selectedHub) {
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
        
        // Save to localStorage
        localStorage.setItem("vidya_user_hub", JSON.stringify(hubData));
        setUserHubData(hubData);
        
        toast({
          title: "Success",
          description: `You have joined ${selectedHub.name}`,
        });
      }
      setIsJoiningHub(false);
    }, 1500);
  };

  const handleLeaveHub = () => {
    localStorage.removeItem("vidya_user_hub");
    setUserHubData(null);
    
    toast({
      title: "Success",
      description: "You have left the hub",
    });
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
        localStorage.setItem("vidya_user_hub", JSON.stringify(updatedHubData));
        setUserHubData(updatedHubData);
        
        toast({
          title: "Sync Complete",
          description: "Your data has been synchronized with the hub",
        });
      }
    }, 2000);
  };

  const handleScheduleVisit = (hubId: string) => {
    const hub = nearbyHubs.find(h => h.id === hubId);
    if (hub) {
      toast({
        title: "Visit Scheduled",
        description: `Your visit to ${hub.name} has been scheduled. A confirmation will be sent to your email.`,
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
    <div className="page-container py-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Vidya Hubs</h1>
      
      {userHubData ? (
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
                    {userHubData.members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between p-3 rounded-md bg-muted/40">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {member.name.split(' ').map(n => n[0]).join('')}
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
                          <div className="mt-2 flex flex-wrap gap-1">
                            {hub.languages.map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                          </div>
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
