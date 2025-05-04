
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Wifi, WifiOff, CheckCircle, XCircle, RefreshCw, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { OfflineBackendService } from "@/services/OfflineBackendService";

// Mock data
const offlineItems = [
  {
    id: "1",
    type: "course",
    title: "Web Development Fundamentals",
    status: "synced",
    size: "120MB",
    lastSync: "2 hours ago",
  },
  {
    id: "2",
    type: "course",
    title: "Digital Marketing Skills",
    status: "pending",
    size: "85MB",
    lastSync: "Not synced",
  },
  {
    id: "3",
    type: "module",
    title: "Introduction to HTML",
    status: "synced",
    size: "25MB",
    lastSync: "1 day ago",
  },
  {
    id: "4",
    type: "quiz",
    title: "Web Development Quiz",
    status: "error",
    size: "2MB",
    lastSync: "Failed",
  },
];

const OfflineSyncPage = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [offlineStorage, setOfflineStorage] = useState({
    used: 235, // MB
    total: 500, // MB
  });
  const [items, setItems] = useState(offlineItems);
  const [deviceProfile, setDeviceProfile] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check online status
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);
    
    // Initial check
    setIsOnline(navigator.onLine);
    
    // Get device profile
    const fetchDeviceProfile = async () => {
      const profile = OfflineBackendService.getDeviceProfile();
      const updatedProfile = await OfflineBackendService.updateDeviceProfile(profile);
      setDeviceProfile(updatedProfile);
      
      // Update storage information based on device
      setOfflineStorage({
        used: Math.min(235, Math.floor(updatedProfile.storage_mb * 0.1)),
        total: Math.min(500, Math.floor(updatedProfile.storage_mb * 0.2))
      });
    };
    
    fetchDeviceProfile();

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
    };
  }, []);

  const handleSync = () => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "You are currently offline. Sync will be attempted when you're back online.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    setSyncProgress(0);

    // Simulate sync progress
    const interval = setInterval(() => {
      setSyncProgress((prev) => {
        const newProgress = prev + 20;
        if (newProgress >= 100) {
          clearInterval(interval);
          
          // Update pending items to synced
          const updatedItems = items.map((item) => {
            if (item.status === "pending") {
              return { ...item, status: "synced", lastSync: "Just now" };
            }
            return item;
          });
          
          setItems(updatedItems);
          setIsSyncing(false);
          
          toast({
            title: "Sync Complete",
            description: "All content has been synchronized",
          });
          
          return 100;
        }
        return newProgress;
      });
    }, 500);
  };

  const handleDeleteItem = (id: string) => {
    // Remove item from offline storage
    const itemToRemove = items.find((item) => item.id === id);
    if (!itemToRemove) return;
    
    const sizeInMB = parseInt(itemToRemove.size);
    
    setItems((prev) => prev.filter((item) => item.id !== id));
    setOfflineStorage((prev) => ({
      ...prev,
      used: Math.max(0, prev.used - sizeInMB),
    }));
    
    toast({
      title: "Content Removed",
      description: `${itemToRemove.title} has been removed from offline storage`,
    });
  };

  const handleProcessWithOfflineAI = () => {
    toast({
      title: "Processing with Offline AI",
      description: "Using lightweight LLM for content analysis",
    });
    
    // In a real app, this would call the offline backend service
    setTimeout(() => {
      toast({
        title: "Processing Complete",
        description: "Offline AI has analyzed the content",
      });
    }, 2000);
  };

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-vidya-light rounded-full">
              {isOnline ? (
                <Wifi className="text-vidya-primary h-6 w-6" />
              ) : (
                <WifiOff className="text-vidya-warning h-6 w-6" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold">Offline & Sync</h1>
              <p className="text-gray-600 dark:text-gray-400">
                Manage your offline content and synchronization
              </p>
            </div>
          </div>
          
          <Link to="/settings/offline/advanced">
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Settings size={14} />
              <span>Advanced</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <Badge className={isOnline ? "bg-green-500" : "bg-orange-500"}>
            {isOnline ? "Online" : "Offline"}
          </Badge>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isOnline
              ? "You're connected to the internet"
              : "You're currently offline. Some features may be limited."}
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Storage Usage</CardTitle>
            <CardDescription>
              Manage your offline storage space
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">
                  {offlineStorage.used}MB used of {offlineStorage.total}MB
                </span>
                <span className="text-sm text-gray-500">
                  {((offlineStorage.used / offlineStorage.total) * 100).toFixed(0)}%
                </span>
              </div>
              <Progress value={(offlineStorage.used / offlineStorage.total) * 100} className="h-2" />
            </div>
            
            {deviceProfile && (
              <div className="text-sm text-gray-500 mb-4">
                <p>Device: {deviceProfile.device_id}</p>
                <p>Available Storage: {Math.floor(deviceProfile.storage_mb / 1024)} GB</p>
              </div>
            )}
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => {
                  setOfflineStorage({
                    used: 0,
                    total: offlineStorage.total
                  });
                  setItems([]);
                  toast({
                    title: "Storage Cleared",
                    description: "All offline content has been removed",
                  });
                }}
              >
                Clear Cache
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Sync Status</CardTitle>
              <CardDescription>
                Synchronize your learning data with the server
              </CardDescription>
            </div>
            <Button 
              onClick={handleSync} 
              disabled={isSyncing} 
              className="flex items-center gap-2"
            >
              <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
              {isSyncing ? "Syncing..." : "Sync Now"}
            </Button>
          </CardHeader>
          
          <CardContent>
            {isSyncing && (
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Sync Progress</span>
                  <span className="text-sm">{syncProgress}%</span>
                </div>
                <Progress value={syncProgress} className="h-2" />
              </div>
            )}
            
            <div className="text-sm space-y-1">
              <p>
                <span className="font-medium">Last successful sync:</span>{" "}
                {isOnline ? "2 hours ago" : "Not available while offline"}
              </p>
              <p>
                <span className="font-medium">Pending uploads:</span>{" "}
                {items.filter((item) => item.status === "pending").length} items
              </p>
              <p>
                <span className="font-medium">Sync errors:</span>{" "}
                {items.filter((item) => item.status === "error").length} items
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Offline AI Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Offline AI Processing</CardTitle>
            <CardDescription>
              Use lightweight AI models when offline
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pb-0">
            <p className="text-sm mb-4">
              Process content with efficient on-device AI models when you're offline.
              These models provide basic functionality while conserving battery and storage.
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Quiz Generation</span>
                <Badge variant="outline">Available Offline</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Content Summarization</span>
                <Badge variant="outline">Available Offline</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Voice Recognition</span>
                <Badge variant="outline">Limited Offline</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Full Translation</span>
                <Badge variant="outline" className="text-gray-400">Online Only</Badge>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-between pt-4">
            <Link to="/settings/offline/advanced">
              <Button variant="outline" size="sm">
                Manage AI Settings
              </Button>
            </Link>
            <Button size="sm" onClick={handleProcessWithOfflineAI}>
              Process With Offline AI
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Offline Content</CardTitle>
            <CardDescription>
              Manage content available for offline use
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                      <h3 className="font-medium">{item.title}</h3>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      {item.status === "synced" && (
                        <CheckCircle size={14} className="text-green-500" />
                      )}
                      {item.status === "pending" && (
                        <RefreshCw size={14} className="text-orange-500" />
                      )}
                      {item.status === "error" && (
                        <XCircle size={14} className="text-red-500" />
                      )}
                      <span>
                        {item.status === "synced" && `Synced ${item.lastSync}`}
                        {item.status === "pending" && "Pending sync"}
                        {item.status === "error" && "Sync failed"}
                      </span>
                      <span>•</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              
              {items.length === 0 && (
                <div className="text-center py-8">
                  <Download className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                  <p className="text-gray-500">No offline content available</p>
                  <p className="text-sm text-gray-400 mb-4">
                    Download courses to access them when offline
                  </p>
                  <Button 
                    as={Link} 
                    to="/courses"
                  >
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OfflineSyncPage;
