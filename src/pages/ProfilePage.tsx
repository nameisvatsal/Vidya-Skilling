
import { useState } from "react";
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

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Get additional profile data from localStorage
  const profileData = (() => {
    try {
      const storedProfile = localStorage.getItem("vidya_user_profile");
      return storedProfile ? JSON.parse(storedProfile) : null;
    } catch (error) {
      console.error("Error parsing profile data:", error);
      return null;
    }
  })();

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      logout();
      toast({
        title: "Success",
        description: "You have been logged out",
      });
      setIsLoading(false);
    }, 500);
  };

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
                <p className="font-medium">{user?.name || "Not provided"}</p>
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
              
              {profileData?.preferredLanguage && (
                <div>
                  <p className="text-sm text-gray-500">Preferred Language</p>
                  <p className="font-medium">{profileData.preferredLanguage}</p>
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
                <p className="text-center text-gray-500 py-4">No courses enrolled yet</p>
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
                <p className="text-center text-gray-500 py-4">No certificates earned yet</p>
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
