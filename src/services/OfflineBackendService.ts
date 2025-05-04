
import { supabase } from "@/integrations/supabase/client";
import { useOffline } from "@/contexts/OfflineContext";

interface DeviceProfile {
  device_id: string;
  ram_mb: number;
  storage_mb: number;
  network_status: string; // "offline", "low-bandwidth", "online"
  preferred_languages: string[];
}

interface LearningRequest {
  user_id: string;
  topic: string;
  device_profile: DeviceProfile;
  last_sync_time?: string;
}

interface OfflineContentPackage {
  content_ids: string[];
  format: string; // "zip" | "tar" | "json"
}

interface DeviceCapabilities {
  is_online: boolean;
  has_low_bandwidth: boolean;
  preferred_languages: string[];
  storage_available_mb: number;
}

interface AdaptiveLearningRequest {
  user_id: string;
  topic: string;
  current_progress: Record<string, number>; // {content_id: completion_percentage}
  device_caps: DeviceCapabilities;
}

export const OfflineBackendService = {
  /**
   * Check if content needs synchronization
   */
  async checkSyncUpdates(userId: string, lastSync: Date): Promise<{ needs_update: boolean; update_size_kb: number }> {
    try {
      // In production environment, this would call your deployed FastAPI backend
      // For now, we'll use Supabase Edge Functions as an intermediary
      const { data, error } = await supabase.functions.invoke("offline-backend-service", {
        body: {
          action: "checkSyncUpdates",
          payload: { user_id: userId, last_sync: lastSync.toISOString() }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error checking sync updates:", error);
      
      // Fallback for offline situations
      return {
        needs_update: false,
        update_size_kb: 0
      };
    }
  },

  /**
   * Request content package optimized for offline use
   */
  async requestOfflinePackage(request: LearningRequest): Promise<{ package_url: string; size_mb: number; content_types: string[] }> {
    try {
      const { data, error } = await supabase.functions.invoke("offline-backend-service", {
        body: {
          action: "requestOfflinePackage",
          payload: request
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error requesting offline package:", error);
      
      // Fallback
      return {
        package_url: "",
        size_mb: 0,
        content_types: []
      };
    }
  },

  /**
   * Generate a lightweight learning path suitable for offline use
   */
  async generateLightweightPath(request: LearningRequest): Promise<{ content_order: string[]; estimated_duration: number; offline_compatible: boolean }> {
    try {
      const { data, error } = await supabase.functions.invoke("offline-backend-service", {
        body: {
          action: "generateLightweightPath",
          payload: request
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error generating lightweight path:", error);
      
      // Fallback
      return {
        content_order: [],
        estimated_duration: 0,
        offline_compatible: false
      };
    }
  },

  /**
   * Generate adaptive learning path using Gemini API
   */
  async generateAdaptiveLearningPath(request: AdaptiveLearningRequest): Promise<{ 
    recommendation: any; 
    generated_at: string; 
    source: "gemini" | "offline_cache" 
  }> {
    try {
      const { data, error } = await supabase.functions.invoke("gemini-learning-path", {
        body: {
          action: "generateLearningPath",
          payload: request
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error generating adaptive learning path:", error);
      
      // Fallback with simple recommendation
      return {
        recommendation: {
          recommended_content_order: ["article", "video", "exercise"],
          estimated_study_time: 2.5,
          difficulty_progression: "medium",
          language_suggestions: request.device_caps.preferred_languages,
          offline_compatibility_notes: "Using offline cache due to connection issues"
        },
        generated_at: new Date().toISOString(),
        source: "offline_cache"
      };
    }
  },

  /**
   * Optimize content for device capabilities
   */
  async optimizeContent(contentId: string, deviceCaps: DeviceCapabilities): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke("gemini-content-optimize", {
        body: {
          action: "optimizeContent",
          payload: { content_id: contentId, device_caps: deviceCaps }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error optimizing content:", error);
      
      // Fallback with basic recommendations
      return {
        format_recommendations: "Use text alternatives when offline",
        download_strategy: "Progressive download recommended",
        language_alternatives: deviceCaps.preferred_languages[0] || "en"
      };
    }
  },

  /**
   * Assess learning progress and get recommendations
   */
  async assessProgress(userId: string, responses: Record<string, any[]>): Promise<any> {
    try {
      const { data, error } = await supabase.functions.invoke("gemini-assess-progress", {
        body: {
          action: "assessProgress",
          payload: { user_id: userId, responses }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error assessing progress:", error);
      
      // Fallback
      return {
        strong_areas: [],
        weak_areas: [],
        content_adjustments: [],
        pace_recommendation: "steady"
      };
    }
  },

  /**
   * Transcribe audio for multilingual support
   */
  async transcribeAudio(audioData: Blob, language: string = "en"): Promise<{ original_text: string; translation: string; language: string }> {
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const audioBase64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64data = reader.result as string;
          resolve(base64data.split(',')[1]); // Remove the data URL prefix
        };
      });
      reader.readAsDataURL(audioData);
      const audioBase64 = await audioBase64Promise;

      const { data, error } = await supabase.functions.invoke("offline-backend-service", {
        body: {
          action: "transcribeAudio",
          payload: { audio_data: audioBase64, language }
        }
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error transcribing audio:", error);
      
      // Fallback
      return {
        original_text: "",
        translation: "",
        language: language
      };
    }
  },

  /**
   * Get current device profile
   */
  getDeviceProfile(): DeviceProfile {
    // Generate a stable device ID
    const getDeviceId = () => {
      let id = localStorage.getItem('vidya_device_id');
      if (!id) {
        id = 'device_' + Math.random().toString(36).substring(2, 15);
        localStorage.setItem('vidya_device_id', id);
      }
      return id;
    };

    // Estimate available RAM (this is just a rough approximation)
    const estimateRAM = () => {
      // navigator.deviceMemory is not in standard TypeScript types
      // Safely check if it exists in a type-safe way
      const nav = navigator as any;
      return nav.deviceMemory ? nav.deviceMemory * 1024 : 4096; // Default to 4GB if not available
    };

    // Estimate available storage
    const estimateStorage = async () => {
      try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
          const estimate = await navigator.storage.estimate();
          return Math.floor((estimate.quota || 0) / (1024 * 1024)); // Convert to MB
        }
        return 5120; // Default to 5GB
      } catch {
        return 5120; // Default to 5GB
      }
    };

    // Get network status
    const getNetworkStatus = () => {
      if (!navigator.onLine) return "offline";
      
      // In a real implementation, we would check connection quality
      // For now, just return "online"
      return "online";
    };

    return {
      device_id: getDeviceId(),
      ram_mb: estimateRAM(),
      storage_mb: 5120, // We'll get a real value asynchronously
      network_status: getNetworkStatus(),
      preferred_languages: navigator.languages.map(l => l.substring(0, 2)) || ["en"]
    };
  },

  /**
   * Update device profile with actual storage estimate
   */
  async updateDeviceProfile(profile: DeviceProfile): Promise<DeviceProfile> {
    try {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        profile.storage_mb = Math.floor((estimate.quota || 0) / (1024 * 1024));
      }
      return profile;
    } catch {
      return profile; // Return original if estimation fails
    }
  },
  
  /**
   * Get device capabilities in the format needed for Gemini API
   */
  async getDeviceCapabilities(): Promise<DeviceCapabilities> {
    const profile = await this.updateDeviceProfile(this.getDeviceProfile());
    
    return {
      is_online: profile.network_status !== "offline",
      has_low_bandwidth: profile.network_status === "low-bandwidth",
      preferred_languages: profile.preferred_languages,
      storage_available_mb: profile.storage_mb
    };
  }
};
