
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, Database, HardDrive, Cpu, Languages, Settings, Save, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline } from "@/contexts/OfflineContext";
import { OfflineBackendService } from "@/services/OfflineBackendService";

const OfflineAdvancedSettingsPage = () => {
  const { user } = useAuth();
  const { isOnline } = useOffline();
  const { toast } = useToast();
  const [deviceProfile, setDeviceProfile] = useState(OfflineBackendService.getDeviceProfile());
  const [storagePath, setStoragePath] = useState("/data/local/vidya");
  const [maxStorage, setMaxStorage] = useState(1000);
  const [autoSync, setAutoSync] = useState(true);
  const [networkQuality, setNetworkQuality] = useState("auto");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(deviceProfile.preferred_languages);
  const [enableAI, setEnableAI] = useState(true);
  const [modelSize, setModelSize] = useState("small");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch actual device capabilities
    const updateProfile = async () => {
      try {
        const updatedProfile = await OfflineBackendService.updateDeviceProfile(deviceProfile);
        setDeviceProfile(updatedProfile);
        
        // Set reasonable defaults based on device capabilities
        if (updatedProfile.storage_mb < 1000) {
          setMaxStorage(Math.max(100, Math.floor(updatedProfile.storage_mb * 0.1)));
          setModelSize("tiny");
        } else if (updatedProfile.storage_mb < 5000) {
          setMaxStorage(500);
          setModelSize("small");
        } else {
          setMaxStorage(1000);
          setModelSize("medium");
        }
        
        // Load saved settings from localStorage
        const savedSettings = localStorage.getItem("vidya_offline_settings");
        if (savedSettings) {
          const settings = JSON.parse(savedSettings);
          setStoragePath(settings.storagePath || storagePath);
          setMaxStorage(settings.maxStorage || maxStorage);
          setAutoSync(settings.autoSync !== undefined ? settings.autoSync : autoSync);
          setNetworkQuality(settings.networkQuality || networkQuality);
          setPreferredLanguages(settings.preferredLanguages || preferredLanguages);
          setEnableAI(settings.enableAI !== undefined ? settings.enableAI : enableAI);
          setModelSize(settings.modelSize || modelSize);
        }
      } catch (error) {
        console.error("Error updating device profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    updateProfile();
  }, []);

  const handleSaveSettings = () => {
    // Save settings to localStorage
    const settings = {
      storagePath,
      maxStorage,
      autoSync,
      networkQuality,
      preferredLanguages,
      enableAI,
      modelSize
    };
    
    localStorage.setItem("vidya_offline_settings", JSON.stringify(settings));
    
    toast({
      title: "Settings Saved",
      description: "Your offline settings have been updated",
    });
  };

  // Map language codes to language names
  const languageNames: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    bn: "Bengali",
    te: "Telugu",
    ta: "Tamil",
    mr: "Marathi",
    ur: "Urdu",
    gu: "Gujarati",
    kn: "Kannada",
    ml: "Malayalam",
    pa: "Punjabi",
    or: "Odia"
  };
  
  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="flex justify-center py-20">
          <div className="animate-pulse flex space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link to="/settings/offline" className="text-sm text-vidya-primary hover:underline flex items-center">
          <ChevronLeft size={16} className="mr-1" />
          Back to Offline Settings
        </Link>
        
        <h1 className="text-2xl font-bold mt-4 mb-1">Advanced Offline Settings</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Configure advanced settings for offline functionality
        </p>
      </div>

      {/* Device Information */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <HardDrive size={18} className="mr-2" />
            Device Information
          </CardTitle>
          <CardDescription>
            Current device capabilities
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Device ID</Label>
              <div className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded border mt-1">
                {deviceProfile.device_id}
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>RAM</Label>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded border mt-1">
                  {deviceProfile.ram_mb} MB
                </div>
              </div>
              
              <div>
                <Label>Storage</Label>
                <div className="text-sm bg-gray-50 dark:bg-gray-800 p-2 rounded border mt-1">
                  {deviceProfile.storage_mb} MB (~{Math.floor(deviceProfile.storage_mb / 1024)} GB)
                </div>
              </div>
            </div>
            
            <div>
              <Label>Network Status</Label>
              <div className={`text-sm p-2 rounded border mt-1 ${
                deviceProfile.network_status === "offline" 
                  ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400" 
                  : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
              }`}>
                {deviceProfile.network_status === "offline" ? "Offline" : "Online"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Storage Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Database size={18} className="mr-2" />
            Storage Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="storage-path">Storage Path</Label>
              <Input
                id="storage-path"
                value={storagePath}
                onChange={(e) => setStoragePath(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Default location for cached learning content
              </p>
            </div>
            
            <div>
              <Label htmlFor="max-storage">Maximum Storage (MB)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="max-storage"
                  type="number"
                  value={maxStorage}
                  onChange={(e) => setMaxStorage(parseInt(e.target.value))}
                  className="mt-1"
                  min={100}
                  max={5000}
                />
                <span className="text-gray-500">MB</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Maximum disk space for offline content
              </p>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Auto Sync</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sync automatically when online
                </p>
              </div>
              <Switch
                id="auto-sync"
                checked={autoSync}
                onCheckedChange={setAutoSync}
              />
            </div>
            
            <div>
              <Label htmlFor="network-quality">Network Quality Threshold</Label>
              <Select value={networkQuality} onValueChange={setNetworkQuality}>
                <SelectTrigger id="network-quality" className="mt-1">
                  <SelectValue placeholder="Select network threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="low">Low Bandwidth</SelectItem>
                  <SelectItem value="medium">Medium Bandwidth</SelectItem>
                  <SelectItem value="high">High Bandwidth Only</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Minimum network quality required for syncing
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI and Language Settings */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu size={18} className="mr-2" />
            AI & Language Settings
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-ai">Enable Offline AI</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Use lightweight AI models when offline
                </p>
              </div>
              <Switch
                id="enable-ai"
                checked={enableAI}
                onCheckedChange={setEnableAI}
              />
            </div>
            
            {enableAI && (
              <div>
                <Label htmlFor="model-size">AI Model Size</Label>
                <Select value={modelSize} onValueChange={setModelSize}>
                  <SelectTrigger id="model-size" className="mt-1">
                    <SelectValue placeholder="Select model size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tiny">Tiny (100MB)</SelectItem>
                    <SelectItem value="small">Small (300MB)</SelectItem>
                    <SelectItem value="medium">Medium (700MB)</SelectItem>
                    <SelectItem value="large">Large (1.5GB)</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Smaller models use less storage but have reduced capabilities
                </p>
              </div>
            )}
            
            <Separator />
            
            <div>
              <Label>Preferred Languages</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {Object.entries(languageNames).map(([code, name]) => (
                  <div 
                    key={code} 
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`lang-${code}`}
                      checked={preferredLanguages.includes(code)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferredLanguages([...preferredLanguages, code]);
                        } else {
                          setPreferredLanguages(
                            preferredLanguages.filter(lang => lang !== code)
                          );
                        }
                      }}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor={`lang-${code}`}>{name}</Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select languages to download for offline use
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experimental Features */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Settings size={18} className="mr-2" />
            Experimental Features
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-4">
              <div className="flex items-start">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 mr-2" />
                <p className="text-sm text-amber-800 dark:text-amber-400">
                  These features are experimental and may not work as expected.
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="p2p-sharing">P2P Content Sharing</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Share cached content with nearby peers
                </p>
              </div>
              <Switch id="p2p-sharing" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="background-sync">Background Synchronization</Label>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Sync content in the background when idle
                </p>
              </div>
              <Switch id="background-sync" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        
        <Button 
          onClick={handleSaveSettings}
          className="flex items-center gap-2"
        >
          <Save size={16} />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default OfflineAdvancedSettingsPage;
