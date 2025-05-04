
import { useState } from "react";
import { Download, CheckCircle, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline } from "@/contexts/OfflineContext";
import { OfflineBackendService } from "@/services/OfflineBackendService";

interface OfflineContentDownloaderProps {
  topic: string;
  onComplete?: () => void;
}

const OfflineContentDownloader: React.FC<OfflineContentDownloaderProps> = ({ topic, onComplete }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadedSize, setDownloadedSize] = useState(0);
  const [totalSize, setTotalSize] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { isOnline } = useOffline();

  const handleDownload = async () => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Cannot download content without a network connection",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to download content for offline use",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsDownloading(true);
      setProgress(0);
      setError(null);
      
      // Get device profile
      const deviceProfile = await OfflineBackendService.updateDeviceProfile(
        OfflineBackendService.getDeviceProfile()
      );
      
      // Request package
      const packageInfo = await OfflineBackendService.requestOfflinePackage({
        user_id: user.id,
        topic,
        device_profile: deviceProfile,
      });
      
      setTotalSize(packageInfo.size_mb);
      
      if (!packageInfo.package_url) {
        throw new Error("Failed to generate content package");
      }
      
      // In a real app, we would now download the package
      // For demo purposes, we'll simulate a download with progress updates
      const simulateDownload = () => {
        let currentProgress = 0;
        const downloadStep = 5;
        
        const interval = setInterval(() => {
          currentProgress += downloadStep;
          const downloadedMB = (packageInfo.size_mb * (currentProgress / 100)).toFixed(1);
          
          setProgress(currentProgress);
          setDownloadedSize(parseFloat(downloadedMB));
          
          if (currentProgress >= 100) {
            clearInterval(interval);
            setIsDownloading(false);
            setIsComplete(true);
            
            toast({
              title: "Download Complete",
              description: `${topic} is now available offline`,
            });
            
            if (onComplete) {
              onComplete();
            }
          }
        }, 500);
      };
      
      simulateDownload();
      
    } catch (err) {
      setError((err as Error).message);
      setIsDownloading(false);
      
      toast({
        title: "Download Failed",
        description: (err as Error).message,
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mb-4">
      <CardContent className="pt-4">
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium">Offline Content</span>
            {isComplete && (
              <span className="flex items-center text-green-500 text-sm">
                <CheckCircle size={14} className="mr-1" />
                Available Offline
              </span>
            )}
          </div>
          
          {isDownloading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{downloadedSize.toFixed(1)} MB / {totalSize.toFixed(1)} MB</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
          
          {error && (
            <div className="flex items-center text-red-500 text-sm mt-2">
              <AlertTriangle size={14} className="mr-1" />
              {error}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={isComplete ? "outline" : "default"}
          size="sm"
          className="w-full flex items-center justify-center gap-2"
          disabled={isDownloading || !isOnline}
          onClick={handleDownload}
        >
          <Download size={16} />
          {isComplete ? "Downloaded for Offline" : isDownloading ? "Downloading..." : "Download for Offline"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OfflineContentDownloader;
