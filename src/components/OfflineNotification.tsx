
import { useState, useEffect } from "react";
import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const OfflineNotification = () => {
  const [showNotification, setShowNotification] = useState(false);
  const [lastSynced, setLastSynced] = useState<string | null>(null);

  useEffect(() => {
    // Check if last synced time is in localStorage
    const storedLastSynced = localStorage.getItem('vidya_last_synced');
    if (storedLastSynced) {
      setLastSynced(storedLastSynced);
    }

    // Initial check of online status
    setShowNotification(!navigator.onLine);

    // Listen for online/offline events
    const handleOnlineStatus = () => {
      setShowNotification(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Function to try manual sync when user clicks button
  const handleTrySync = () => {
    if (navigator.onLine) {
      // In a real app, this would trigger your sync logic
      const now = new Date().toLocaleString();
      localStorage.setItem('vidya_last_synced', now);
      setLastSynced(now);
      setShowNotification(false);
    }
  };

  if (!showNotification) return null;

  return (
    <div className="bg-vidya-warning text-white py-2 px-4 text-sm z-50 sticky top-0">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <WifiOff size={16} />
          <span>You are currently offline. Your data will be synchronized when you reconnect.</span>
          {lastSynced && <span className="hidden md:inline ml-2 text-xs opacity-80">(Last synced: {lastSynced})</span>}
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="bg-transparent border-white hover:bg-white/20 text-white text-xs py-1 h-7"
          onClick={handleTrySync}
        >
          <RefreshCw size={14} className="mr-1" />
          Try Sync
        </Button>
      </div>
    </div>
  );
};

export default OfflineNotification;
