
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type User = {
  email: string;
  name?: string;
  profileCompleted?: boolean;
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUserProfile: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("vidya_user");
      const storedProfile = localStorage.getItem("vidya_user_profile");
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // If user has completed profile setup, merge that data
        if (storedProfile) {
          const profile = JSON.parse(storedProfile);
          setUser({
            ...parsedUser,
            name: profile.fullName,
            profileCompleted: true
          });
        } else {
          setUser({
            ...parsedUser,
            profileCompleted: false
          });
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // In a real app, this would be an API call to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login - store basic user info
      const userData = { email };
      localStorage.setItem("vidya_user", JSON.stringify(userData));
      
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
      } else {
        setUser({
          ...userData,
          profileCompleted: false
        });
        navigate("/auth/profile-setup");
      }
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("vidya_user");
    setUser(null);
    navigate("/auth/login");
  };
  
  const updateUserProfile = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("vidya_user", JSON.stringify(updatedUser));
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
