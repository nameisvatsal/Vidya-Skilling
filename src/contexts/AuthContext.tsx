
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  email: string;
  name?: string;
  profileCompleted: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string) => Promise<void>;
  updateUserProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check for existing session on mount
  useEffect(() => {
    console.log("Checking auth state on mount");
    const checkAuth = () => {
      try {
        const storedUser = localStorage.getItem("vidya_user");
        const storedProfile = localStorage.getItem("vidya_user_profile");
        
        if (storedUser) {
          console.log("Found stored user data:", storedUser);
          const parsedUser = JSON.parse(storedUser);
          
          // If user has completed profile setup, merge that data
          if (storedProfile) {
            console.log("Found stored profile data:", storedProfile);
            const profile = JSON.parse(storedProfile);
            setUser({
              id: parsedUser.id || crypto.randomUUID(),
              email: parsedUser.email,
              name: profile.fullName,
              profileCompleted: true
            });
            console.log("User authenticated with profile");
          } else {
            setUser({
              id: parsedUser.id || crypto.randomUUID(),
              email: parsedUser.email,
              profileCompleted: false
            });
            console.log("User authenticated without profile");
          }
        } else {
          console.log("No stored user data found");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        localStorage.removeItem("vidya_user");
        localStorage.removeItem("vidya_user_profile");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful login - store basic user info
      const userId = crypto.randomUUID();
      const userData = { id: userId, email };
      
      // Important: Save to localStorage before updating state
      localStorage.setItem("vidya_user", JSON.stringify(userData));
      console.log("Saved user data to localStorage:", userData);
      
      // Check if user has completed profile setup
      const storedProfile = localStorage.getItem("vidya_user_profile");
      if (storedProfile) {
        const profile = JSON.parse(storedProfile);
        setUser({
          ...userData,
          name: profile.fullName,
          profileCompleted: true
        });
        navigate("/");
        console.log("User logged in with existing profile");
      } else {
        setUser({
          ...userData,
          profileCompleted: false
        });
        navigate("/auth/profile-setup");
        console.log("User logged in, redirecting to profile setup");
      }

      return Promise.resolve();
    } catch (error) {
      console.error("Login error:", error);
      return Promise.reject("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would call your backend API to create the user
      const userId = crypto.randomUUID();
      const userData = { id: userId, email };
      
      // Important: Save to localStorage before updating state
      localStorage.setItem("vidya_user", JSON.stringify(userData));
      console.log("Saved new user data to localStorage:", userData);
      
      // Set minimal user data
      setUser({
        id: userId,
        email,
        name,
        profileCompleted: false
      });
      
      console.log("User signed up successfully");
      navigate("/auth/profile-setup"); // Explicitly navigate to profile setup
      return Promise.resolve();
    } catch (error) {
      console.error("Signup error:", error);
      return Promise.reject("Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    console.log("Logging out user");
    localStorage.removeItem("vidya_user");
    // We don't remove the profile data on logout to persist it for future logins
    setUser(null);
    navigate("/auth/login");
  };
  
  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data, profileCompleted: true };
      setUser(updatedUser);
      
      const storedProfile = {
        fullName: updatedUser.name,
        // Add other profile fields as needed
      };
      
      // Save both user and profile data
      localStorage.setItem("vidya_user", JSON.stringify({
        id: updatedUser.id,
        email: updatedUser.email
      }));
      
      localStorage.setItem("vidya_user_profile", JSON.stringify(storedProfile));
      console.log("User profile updated and saved to localStorage:", updatedUser, storedProfile);
      
      // Redirect to home after profile is completed
      navigate("/");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
        signup,
        updateUserProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
