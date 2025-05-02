
import { supabase } from "@/integrations/supabase/client";

export type AIMode = "text" | "translation" | "adaptive-learning";

interface AIServiceOptions {
  prompt: string;
  model?: string;
  language?: {
    source?: string;
    target: string;
  };
  mode: AIMode;
}

export const AIService = {
  async generateContent({ prompt, model = "gemini-1.5-pro", language, mode }: AIServiceOptions) {
    try {
      // Try to use the Supabase Edge Function
      const { data, error } = await supabase.functions.invoke('gemini-ai', {
        body: { prompt, model, language, mode }
      });

      if (error) throw error;

      // Return the generated content
      return { 
        success: true, 
        result: data.result,
        data: data.data
      };
    } catch (error) {
      console.error("Error calling AI service:", error);
      
      // Fallback for offline mode - return pre-cached responses if available
      const offlineResponses = localStorage.getItem('vidya_offline_ai_responses');
      if (offlineResponses) {
        const responses = JSON.parse(offlineResponses);
        // Try to find a similar prompt response
        const similarPrompt = Object.keys(responses).find(key => 
          key.toLowerCase().includes(prompt.toLowerCase().substring(0, 10))
        );
        
        if (similarPrompt) {
          return { 
            success: true, 
            result: responses[similarPrompt],
            offline: true
          };
        }
      }
      
      return { 
        success: false, 
        error: (error as Error).message,
        result: "I'm unable to generate a response right now. Please try again later or check your connection."
      };
    }
  },
  
  async translateText(text: string, sourceLanguage: string, targetLanguage: string) {
    return this.generateContent({
      prompt: text,
      language: { source: sourceLanguage, target: targetLanguage },
      mode: "translation"
    });
  },

  async adaptContent(content: string, targetLanguage: string) {
    return this.generateContent({
      prompt: content,
      language: targetLanguage,
      mode: "adaptive-learning"
    });
  },

  // Cache responses for offline use
  cacheResponse(prompt: string, response: string) {
    try {
      const existingCache = localStorage.getItem('vidya_offline_ai_responses');
      const cache = existingCache ? JSON.parse(existingCache) : {};
      
      // Only store if it's not already in the cache
      if (!cache[prompt]) {
        cache[prompt] = response;
        // Limit cache size
        const keys = Object.keys(cache);
        if (keys.length > 50) {
          delete cache[keys[0]]; // Remove oldest entry
        }
        localStorage.setItem('vidya_offline_ai_responses', JSON.stringify(cache));
      }
    } catch (error) {
      console.error("Error caching response:", error);
    }
  }
};

export async function transcribeAudio(audioBase64: string, language?: string) {
  try {
    // Try to use the Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('whisper-transcription', {
      body: { audio: audioBase64, language }
    });

    if (error) throw error;

    return { 
      success: true, 
      text: data.text 
    };
  } catch (error) {
    console.error("Error transcribing audio:", error);
    return { 
      success: false, 
      error: (error as Error).message,
      text: ""
    };
  }
}
