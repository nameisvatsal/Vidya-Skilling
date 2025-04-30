
import { useState, useEffect } from "react";
import { Wifi, WifiOff, CheckCircle, XCircle, RefreshCw, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
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
            
            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                Manage Storage
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
                  <Button>Browse Courses</Button>
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
