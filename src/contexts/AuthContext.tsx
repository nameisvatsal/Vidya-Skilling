
import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

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
  // Create a mock user that's always logged in
  const [user, setUser] = useState<User | null>({
    id: "mock-user-id",
    email: "demo@vidyaskills.com",
    name: "Demo User",
    profileCompleted: true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Skip auth check since we're always logged in
  useEffect(() => {
    console.log("Using mock authenticated user");
  }, []);

  const login = async (email: string, password: string) => {
    // Simply navigate to home
    navigate("/");
    return Promise.resolve();
  };
  
  const signup = async (email: string, password: string, name: string) => {
    // Simply navigate to home
    navigate("/");
    return Promise.resolve();
  };

  const logout = async () => {
    console.log("Logout function called but ignored in mock mode");
    // We don't actually log out in this mock version
  };
  
  const updateUserProfile = async (data: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...data } : null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true, // Always authenticated
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
