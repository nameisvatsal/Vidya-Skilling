
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useToast } from '@/hooks/use-toast';

type OfflineContextType = {
  isOnline: boolean;
  syncQueued: boolean;
  offlineData: Record<string, any>;
  queueSync: (key: string, data: any) => void;
  getOfflineData: (key: string) => any;
  syncData: () => Promise<void>;
};

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export const OfflineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncQueued, setSyncQueued] = useState<boolean>(false);
  const [offlineData, setOfflineData] = useState<Record<string, any>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load any saved offline data from localStorage
    const savedData = localStorage.getItem('vidya_offline_data');
    if (savedData) {
      try {
        setOfflineData(JSON.parse(savedData));
        if (Object.keys(JSON.parse(savedData)).length > 0) {
          setSyncQueued(true);
        }
      } catch (e) {
        console.error('Failed to parse offline data:', e);
      }
    }

    // Set up online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "You're back online",
        description: syncQueued ? "Your changes will be synced." : "Connected to network.",
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "You're offline",
        description: "Don't worry, your work will be saved locally.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncQueued, toast]);

  // Save offline data to localStorage whenever it changes
  useEffect(() => {
    if (Object.keys(offlineData).length > 0) {
      localStorage.setItem('vidya_offline_data', JSON.stringify(offlineData));
    }
  }, [offlineData]);

  const queueSync = (key: string, data: any) => {
    setOfflineData(prev => {
      const updated = { ...prev, [key]: data };
      setSyncQueued(true);
      return updated;
    });
  };

  const getOfflineData = (key: string) => {
    return offlineData[key];
  };

  const syncData = async () => {
    if (isOnline && syncQueued) {
      try {
        // Here you would implement the actual sync logic with your APIs
        // For now, we'll just simulate success
        toast({
          title: "Sync completed",
          description: "Your offline changes have been synchronized.",
        });
        setSyncQueued(false);
        setOfflineData({});
        localStorage.removeItem('vidya_offline_data');
        return Promise.resolve();
      } catch (error) {
        console.error('Sync failed:', error);
        toast({
          title: "Sync failed",
          description: "There was an error synchronizing your data.",
          variant: "destructive",
        });
        return Promise.reject(error);
      }
    }
    return Promise.resolve();
  };

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        syncQueued,
        offlineData,
        queueSync,
        getOfflineData,
        syncData,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error("useOffline must be used within an OfflineProvider");
  }
  return context;
};
