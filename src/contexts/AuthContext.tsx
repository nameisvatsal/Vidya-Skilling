
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check for existing session on mount
  useEffect(() => {
    console.log("Checking auth state on mount");
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        // Get session from supabase
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          console.log("Found active session:", session.user.id);
          
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) {
            console.error("Error fetching profile:", error);
            throw error;
          }
          
          if (profile) {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              name: profile.name,
              profileCompleted: profile.profile_completed || false
            });
            console.log("User authenticated with profile");
          } else {
            setUser({
              id: session.user.id,
              email: session.user.email || '',
              profileCompleted: false
            });
            console.log("User authenticated without profile");
          }
        } else {
          console.log("No active session found");
          setUser(null);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        if (event === 'SIGNED_IN' && session) {
          // Fetch user profile
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser({
            id: session.user.id,
            email: session.user.email || '',
            name: profile?.name,
            profileCompleted: profile?.profile_completed || false
          });
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (profile?.profile_completed) {
          navigate("/");
          console.log("User logged in with existing profile");
        } else {
          navigate("/auth/profile-setup");
          console.log("User logged in, redirecting to profile setup");
        }
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
      // Register new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
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

  const logout = async () => {
    console.log("Logging out user");
    await supabase.auth.signOut();
    setUser(null);
    navigate("/auth/login");
  };
  
  const updateUserProfile = async (data: Partial<User>) => {
    if (user) {
      try {
        // Update profile in Supabase
        const { error } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            profile_completed: true
            // Add other profile fields as needed
          })
          .eq('id', user.id);
          
        if (error) {
          throw error;
        }
        
        const updatedUser = { ...user, ...data, profileCompleted: true };
        setUser(updatedUser);
        
        console.log("User profile updated in Supabase:", updatedUser);
        
        // Redirect to home after profile is completed
        navigate("/");
      } catch (err) {
        console.error("Error updating profile:", err);
      }
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
