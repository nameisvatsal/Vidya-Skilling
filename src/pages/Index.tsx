
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Auto-redirect after 3 seconds
    const redirectTimeout = setTimeout(() => {
      navigate("/");
    }, 3000);
    
    // Clear timeout on unmount
    return () => clearTimeout(redirectTimeout);
  }, [navigate]);

  // Handle manual redirect
  const handleRedirect = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-vidya-primary">Vidya</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            AI-powered skilling for rural India
          </p>
        </div>
        
        <div className="h-1.5 w-16 bg-vidya-primary mx-auto rounded-full"></div>
        
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-300">
            Redirecting to home page...
          </p>
          <div className="animate-pulse mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
          </div>
        </div>
        
        <Button 
          onClick={handleRedirect}
          className="w-full bg-vidya-primary hover:bg-vidya-primary/90"
        >
          Go to Home Now <ArrowRight size={16} className="ml-2" />
        </Button>
        
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6">
          <p>Find a Vidya Hub near you for community-based learning</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
