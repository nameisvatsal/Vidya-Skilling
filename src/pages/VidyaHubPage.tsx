
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  MapPin, 
  UserPlus, 
  MessageSquare, 
  Wifi, 
  WifiOff 
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
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

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
  ]
};

const VidyaHubPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredHubs, setFilteredHubs] = useState(nearbyHubs);
  const [userHubData, setUserHubData] = useState<typeof userHub | null>(null);
  const [isJoiningHub, setIsJoiningHub] = useState(false);
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

  // Filter hubs based on search term
  useEffect(() => {
    if (searchTerm) {
      const filtered = nearbyHubs.filter(
        hub => 
          hub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          hub.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredHubs(filtered);
    } else {
      setFilteredHubs(nearbyHubs);
    }
  }, [searchTerm]);

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
                    Member since {new Date(userHubData.joinedDate).toLocaleDateString()}
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
                  <h3 className="font-medium mb-2">Hub Members</h3>
                  <ul className="space-y-2">
                    {userHubData.members.map((member) => (
                      <li key={member.id} className="flex items-center justify-between p-2 rounded-md bg-muted/40">
                        <div className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${member.online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                          <span>{member.name}</span>
                        </div>
                        <Badge variant="secondary">{member.role}</Badge>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Hub Activity</h3>
                  <div className="space-y-2">
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
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between flex-wrap gap-3">
              <Button onClick={handleSyncHub} variant="default" className="flex-1">
                <Wifi className="mr-2 h-4 w-4" /> Sync with Hub
              </Button>
              <Button onClick={handleMessageTrainer} variant="secondary" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" /> Message Hub Trainer
              </Button>
              <Button onClick={handleLeaveHub} variant="outline" className="flex-1">
                Leave Hub
              </Button>
            </CardFooter>
          </Card>
          
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
                Join a local learning community to connect with other students and trainers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Input 
                placeholder="Search by hub name or location..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-4"
              />
              
              {filteredHubs.length > 0 ? (
                <div className="space-y-4">
                  {filteredHubs.map((hub) => (
                    <Card key={hub.id} className="border border-muted">
                      <CardHeader className="py-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{hub.name}</CardTitle>
                            <div className="flex items-center text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5 mr-1" />
                              <span>{hub.location}</span>
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
                      <CardFooter className="pt-2 pb-3">
                        <Button 
                          className="w-full" 
                          onClick={() => handleJoinHub(hub.id)}
                          disabled={isJoiningHub}
                        >
                          <UserPlus className="mr-2 h-4 w-4" />
                          Join Hub
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
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
          
          <div>
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
        </div>
      )}
    </div>
  );
};

export default VidyaHubPage;
