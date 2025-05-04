
import { useState, useEffect } from "react";
import { AIService } from "@/services/AIService";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOffline } from "@/contexts/OfflineContext";
import { OfflineBackendService } from "@/services/OfflineBackendService";

interface AdaptiveContentProps {
  content: string;
  language: string;
  complexity?: "basic" | "intermediate" | "advanced";
  showControls?: boolean;
}

const AdaptiveContent = ({
  content,
  language = "en",
  complexity = "intermediate",
  showControls = true,
}: AdaptiveContentProps) => {
  const [adaptedContent, setAdaptedContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>(language);
  const [currentComplexity, setCurrentComplexity] = useState<string>(complexity);
  const { toast } = useToast();
  const { isOnline, queueSync, getOfflineData } = useOffline();
  
  // Create a unique key for this content to use in offline cache
  const contentKey = `adaptive_${Buffer.from(content.substring(0, 50)).toString('base64').substring(0, 20)}`;

  useEffect(() => {
    // On mount, check if we have offline data for this content
    const offlineData = getOfflineData(contentKey);
    if (offlineData && offlineData[currentLanguage]) {
      setAdaptedContent(offlineData[currentLanguage][currentComplexity] || content);
    } else {
      // If not, and if we're online, fetch it
      if (isOnline) {
        adaptContent();
      } else {
        setAdaptedContent(content);
      }
    }
  }, [content, language]); // eslint-disable-line react-hooks/exhaustive-deps

  const adaptContent = async () => {
    setIsLoading(true);
    
    try {
      // Check if we already have this adaptation cached offline
      const offlineData = getOfflineData(contentKey);
      if (offlineData && 
          offlineData[currentLanguage] && 
          offlineData[currentLanguage][currentComplexity]) {
        setAdaptedContent(offlineData[currentLanguage][currentComplexity]);
        setIsLoading(false);
        return;
      }
      
      // If not cached and we're offline, use the original content
      if (!isOnline) {
        toast({
          title: "Offline Mode",
          description: "Adaptive content is not available offline. Showing original content.",
        });
        setAdaptedContent(content);
        setIsLoading(false);
        return;
      }
      
      // Try to use the Gemini-powered optimization first
      try {
        const deviceCaps = await OfflineBackendService.getDeviceCapabilities();
        const optimizationResult = await OfflineBackendService.optimizeContent(
          contentKey,
          deviceCaps
        );
        
        // If optimization was successful, use it
        if (optimizationResult && optimizationResult.format_recommendations) {
          // Use the optimized content recommendations to adjust our approach
          
          // Then fall back to regular AIService for the actual content transformation
          const enhancedPrompt = `
            Adapt the following educational content to be more accessible for a ${currentComplexity} level learner.
            ${currentLanguage !== 'en' ? `Translate to ${currentLanguage}.` : ''}
            Make it engaging and easy to understand while preserving the key concepts.
            
            ${optimizationResult.format_recommendations}
            
            Content:
            ${content}
          `;
          
          processWithAIService(enhancedPrompt, offlineData);
        } else {
          // If the optimization API failed, just use regular AIService
          const enhancedPrompt = `
            Adapt the following educational content to be more accessible for a ${currentComplexity} level learner.
            ${currentLanguage !== 'en' ? `Translate to ${currentLanguage}.` : ''}
            Make it engaging and easy to understand while preserving the key concepts:
            
            ${content}
          `;
          
          processWithAIService(enhancedPrompt, offlineData);
        }
      } catch (error) {
        // If Gemini API fails, fall back to regular AIService
        const enhancedPrompt = `
          Adapt the following educational content to be more accessible for a ${currentComplexity} level learner.
          ${currentLanguage !== 'en' ? `Translate to ${currentLanguage}.` : ''}
          Make it engaging and easy to understand while preserving the key concepts:
          
          ${content}
        `;
        
        processWithAIService(enhancedPrompt, offlineData);
      }
    } catch (error) {
      console.error("Error adapting content:", error);
      setAdaptedContent(content);
      toast({
        title: "Error",
        description: "Failed to adapt content. Showing original version.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };
  
  const processWithAIService = async (prompt: string, offlineData: any) => {
    try {
      const response = await AIService.generateContent({
        prompt: prompt,
        language: { target: currentLanguage },
        mode: "adaptive-learning"
      });
      
      if (response.success) {
        setAdaptedContent(response.result);
        
        // Cache for offline use
        const newOfflineData = offlineData || {};
        if (!newOfflineData[currentLanguage]) {
          newOfflineData[currentLanguage] = {};
        }
        newOfflineData[currentLanguage][currentComplexity] = response.result;
        queueSync(contentKey, newOfflineData);
        
        // Also cache in AIService
        AIService.cacheResponse(prompt, response.result);
      } else {
        toast({
          title: "Adaptation Failed",
          description: "Could not adapt content. Showing original version.",
          variant: "destructive",
        });
        setAdaptedContent(content);
      }
    } catch (error) {
      console.error("Error in AI service:", error);
      setAdaptedContent(content);
      toast({
        title: "Error",
        description: "AI service failed. Showing original content.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleLanguageChange = (lang: string) => {
    setCurrentLanguage(lang);
    adaptContent();
  };
  
  const handleComplexityChange = (level: string) => {
    setCurrentComplexity(level);
    adaptContent();
  };

  return (
    <div className="space-y-4">
      {showControls && (
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <div className="space-x-2">
            <Button 
              variant={currentLanguage === "en" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleLanguageChange("en")}
            >
              English
            </Button>
            <Button 
              variant={currentLanguage === "hi" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleLanguageChange("hi")}
            >
              हिंदी
            </Button>
            <Button 
              variant={currentLanguage === "ta" ? "default" : "outline"} 
              size="sm"
              onClick={() => handleLanguageChange("ta")}
            >
              தமிழ்
            </Button>
          </div>
          
          <div className="space-x-2">
            <Button 
              variant={currentComplexity === "basic" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => handleComplexityChange("basic")}
            >
              Basic
            </Button>
            <Button 
              variant={currentComplexity === "intermediate" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => handleComplexityChange("intermediate")}
            >
              Intermediate
            </Button>
            <Button 
              variant={currentComplexity === "advanced" ? "secondary" : "outline"} 
              size="sm"
              onClick={() => handleComplexityChange("advanced")}
            >
              Advanced
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={adaptContent}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
      )}
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-vidya-primary mb-2" />
            <p className="text-sm text-gray-500">Adapting content...</p>
          </div>
        ) : (
          <div className="prose dark:prose-invert max-w-none">
            {adaptedContent || content}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdaptiveContent;
