
import { useState, useEffect } from "react";
import { Download, CheckCircle, WifiOff, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useOffline } from "@/contexts/OfflineContext";
import { OfflineBackendService } from "@/services/OfflineBackendService";

interface ModulePageOfflineControlsProps {
  moduleId: string;
  courseId: string;
  moduleTitle: string;
}

const ModulePageOfflineControls: React.FC<ModulePageOfflineControlsProps> = ({ 
  moduleId, 
  courseId, 
  moduleTitle 
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isUsingOfflineAI, setIsUsingOfflineAI] = useState(false);
  const { toast } = useToast();
  const { isOnline, getOfflineData } = useOffline();

  useEffect(() => {
    // Check if this module is already downloaded
    const moduleKey = `module_${moduleId}`;
    const moduleData = localStorage.getItem(moduleKey);
    
    if (moduleData) {
      setIsDownloaded(true);
    }
    
    // Listen for service worker messages about downloads
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'DOWNLOAD_PROGRESS' && event.data.contentId === moduleId) {
        setProgress(event.data.progress);
      }
      
      if (event.data && event.data.type === 'DOWNLOAD_COMPLETE' && event.data.contentId === moduleId) {
        setIsDownloading(false);
        setIsDownloaded(true);
        toast({
          title: "Download Complete",
          description: `${moduleTitle} is now available offline`,
        });
      }
    };
    
    navigator.serviceWorker.addEventListener('message', handleMessage);
    
    return () => {
      navigator.serviceWorker.removeEventListener('message', handleMessage);
    };
  }, [moduleId, moduleTitle, toast]);

  const handleDownload = async () => {
    if (isDownloaded) {
      toast({
        title: "Already Downloaded",
        description: "This module is already available offline",
      });
      return;
    }
    
    if (!isOnline) {
      toast({
        title: "Offline Mode",
        description: "Cannot download new content while offline",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsDownloading(true);
      setProgress(0);
      
      // Get device profile for optimized content
      const deviceProfile = await OfflineBackendService.updateDeviceProfile(
        OfflineBackendService.getDeviceProfile()
      );
      
      // In a real app, we'd trigger the service worker to download and cache the content
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'DOWNLOAD_CONTENT',
          contentId: moduleId,
          url: `/api/content/module/${moduleId}`
        });
      } else {
        // Fallback if service worker is not controlling the page yet
        simulateDownload();
      }
      
      // Store module metadata in localStorage
      const mockModuleData = {
        id: moduleId,
        courseId: courseId,
        title: moduleTitle,
        downloadedAt: new Date().toISOString(),
        size: "25MB"
      };
      
      // This happens immediately, but in a real app would happen after download completes
      localStorage.setItem(`module_${moduleId}`, JSON.stringify(mockModuleData));
      
    } catch (error) {
      console.error("Error downloading module:", error);
      setIsDownloading(false);
      
      toast({
        title: "Download Failed",
        description: "Failed to download module for offline use",
        variant: "destructive",
      });
    }
  };
  
  const simulateDownload = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        setIsDownloaded(true);
        
        toast({
          title: "Download Complete",
          description: `${moduleTitle} is now available offline`,
        });
      }
    }, 300);
  };
  
  const handleUseOfflineAI = () => {
    setIsUsingOfflineAI(true);
    
    // Simulate offline AI processing
    setTimeout(() => {
      setIsUsingOfflineAI(false);
      
      toast({
        title: "Offline AI Processing Complete",
        description: "Content has been analyzed with the lightweight model",
      });
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-md p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isDownloaded ? (
              <CheckCircle size={16} className="text-green-500" />
            ) : !isOnline ? (
              <WifiOff size={16} className="text-amber-500" />
            ) : (
              <Download size={16} className="text-vidya-primary" />
            )}
            <span className="font-medium text-sm">
              {isDownloaded 
                ? "Available Offline" 
                : !isOnline 
                  ? "Offline Mode" 
                  : "Download for Offline"}
            </span>
          </div>
        </div>
        
        {isDownloading && (
          <div className="mb-2">
            <Progress value={progress} className="h-1.5" />
            <div className="flex justify-end mt-1">
              <span className="text-xs text-gray-500">{progress}%</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant={isDownloaded ? "outline" : "default"}
            size="sm"
            className="w-full text-xs"
            onClick={handleDownload}
            disabled={isDownloading || (!isOnline && !isDownloaded)}
          >
            {isDownloaded 
              ? "Downloaded" 
              : isDownloading 
                ? "Downloading..." 
                : "Download Module"}
          </Button>
          
          {isDownloaded && (
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 text-xs"
              onClick={handleUseOfflineAI}
              disabled={isUsingOfflineAI}
            >
              <Cpu size={12} />
              {isUsingOfflineAI ? "Processing..." : "Use Offline AI"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePageOfflineControls;
