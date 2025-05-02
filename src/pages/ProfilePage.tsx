
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [userCourses, setUserCourses] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const { toast } = useToast();

  // Fetch profile data and user courses on component mount
  useEffect(() => {
    if (user?.id) {
      fetchProfileData();
      fetchUserCourses();
      fetchCertificates();
    }
  }, [user?.id]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setProfileData(data);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      });
    }
  };
  
  const fetchUserCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('user_courses')
        .select(`
          *,
          course:courses(
            id,
            title,
            description,
            thumbnail_url,
            level,
            duration,
            category
          )
        `)
        .eq('user_id', user?.id);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setUserCourses(data);
      }
    } catch (error) {
      console.error("Error fetching user courses:", error);
    }
  };
  
  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select(`
          *,
          course:courses(
            id,
            title
          )
        `)
        .eq('user_id', user?.id);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setCertificates(data);
      }
    } catch (error) {
      console.error("Error fetching certificates:", error);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await logout();
      toast({
        title: "Success",
        description: "You have been logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="h-24 w-24 rounded-full bg-vidya-primary/20 flex items-center justify-center text-vidya-primary text-3xl font-bold">
                  {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{profileData?.name || "Not provided"}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{user?.email}</p>
              </div>
              
              {profileData?.location && (
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{profileData.location}</p>
                </div>
              )}
              
              {profileData?.phone && (
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{profileData.phone}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleLogout}
                disabled={isLoading}
              >
                {isLoading ? "Logging out..." : "Log out"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Learning Details</CardTitle>
              <CardDescription>Your educational details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileData?.education && (
                <div>
                  <p className="text-sm text-gray-500">Education Level</p>
                  <p className="font-medium">{profileData.education}</p>
                </div>
              )}
              
              {profileData?.preferred_language && (
                <div>
                  <p className="text-sm text-gray-500">Preferred Language</p>
                  <p className="font-medium">{profileData.preferred_language}</p>
                </div>
              )}
              
              {profileData?.interests && (
                <div>
                  <p className="text-sm text-gray-500">Skills Interested In</p>
                  <p className="font-medium">{profileData.interests}</p>
                </div>
              )}
              
              {profileData?.goals && (
                <div>
                  <p className="text-sm text-gray-500">Learning Goals</p>
                  <p className="font-medium">{profileData.goals}</p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => window.location.href = "/auth/profile-setup"}
              >
                Update Profile
              </Button>
            </CardFooter>
          </Card>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Courses</CardTitle>
                <CardDescription>Your enrolled courses</CardDescription>
              </CardHeader>
              <CardContent>
                {userCourses.length > 0 ? (
                  <div className="space-y-3">
                    {userCourses.slice(0, 3).map((enrollment: any) => (
                      <div key={enrollment.id} className="border-b pb-2">
                        <p className="font-medium">{enrollment.course?.title}</p>
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>{enrollment.course?.category}</span>
                          <span>{enrollment.progress}% Complete</span>
                        </div>
                      </div>
                    ))}
                    {userCourses.length > 3 && (
                      <p className="text-sm text-center text-muted-foreground">
                        +{userCourses.length - 3} more courses
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No courses enrolled yet</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/courses"}>
                  Browse Courses
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Certificates</CardTitle>
                <CardDescription>Your earned certificates</CardDescription>
              </CardHeader>
              <CardContent>
                {certificates.length > 0 ? (
                  <div className="space-y-3">
                    {certificates.slice(0, 3).map((cert: any) => (
                      <div key={cert.id} className="border-b pb-2">
                        <p className="font-medium">{cert.course?.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Issued: {new Date(cert.issue_date).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No certificates earned yet</p>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/credentials"}>
                  View Credentials
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
