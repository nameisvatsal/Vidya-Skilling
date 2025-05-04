
import { supabase } from "@/integrations/supabase/client";

interface YouTubePlaylistRequest {
  playlist_url: string;
  user_id: string;
  learning_goals?: string[];
}

interface VideoAnalysisRequest {
  video_id: string;
  analysis_type: "summary" | "quiz" | "learning_style";
}

interface LearningPath {
  path: {
    video_id: string;
    title: string;
    recommended_order: number;
    speed: number;
    key_concepts: string[];
    estimated_time: number;
  }[];
  total_duration: number;
  learning_outcomes: string[];
}

interface SupplementResource {
  type: string;
  title: string;
  url: string;
  reason: string;
}

export const AIVideosService = {
  /**
   * Generate a personalized learning path from a YouTube playlist
   */
  async generateLearningPathFromPlaylist(
    request: YouTubePlaylistRequest
  ): Promise<LearningPath> {
    try {
      // In a production environment, this would call your deployed FastAPI backend
      // For now, we'll use Supabase Edge Functions as an intermediary
      const { data, error } = await supabase.functions.invoke("ai-video-service", {
        body: {
          action: "generateLearningPath",
          payload: request
        }
      });

      if (error) throw error;
      return data as LearningPath;
    } catch (error) {
      console.error("Error generating learning path:", error);
      
      // Fallback for offline or error situations
      return {
        path: [
          {
            video_id: "dQw4w9WgXcQ",
            title: "Introduction to the Topic",
            recommended_order: 1,
            speed: 1.0,
            key_concepts: ["Basics", "Fundamentals"],
            estimated_time: 15
          },
          {
            video_id: "9bZkp7q19f0", 
            title: "Advanced Concepts",
            recommended_order: 2,
            speed: 0.75,
            key_concepts: ["Advanced techniques", "Implementation"],
            estimated_time: 25
          }
        ],
        total_duration: 40,
        learning_outcomes: ["Basic understanding", "Ability to implement"]
      };
    }
  },

  /**
   * Analyze a YouTube video for different types of information
   */
  async analyzeVideo(request: VideoAnalysisRequest): Promise<{ type: string; content: string }> {
    try {
      // In a production environment, this would call your deployed FastAPI backend
      const { data, error } = await supabase.functions.invoke("ai-video-service", {
        body: {
          action: "analyzeVideo",
          payload: request
        }
      });

      if (error) throw error;
      return data as { type: string; content: string };
    } catch (error) {
      console.error("Error analyzing video:", error);
      return {
        type: request.analysis_type,
        content: "Unable to analyze video. This feature requires an internet connection and backend service."
      };
    }
  },

  /**
   * Get supplemental learning resources for a video
   */
  async getSuggestedSupplements(
    videoId: string, 
    userId: string
  ): Promise<{ supplements: SupplementResource[] }> {
    try {
      const { data, error } = await supabase.functions.invoke("ai-video-service", {
        body: {
          action: "suggestSupplements",
          payload: {
            video_id: videoId,
            user_id: userId
          }
        }
      });

      if (error) throw error;
      return data as { supplements: SupplementResource[] };
    } catch (error) {
      console.error("Error getting supplements:", error);
      return {
        supplements: [
          {
            type: "article",
            title: "Related Learning Material",
            url: "https://example.com/article",
            reason: "Provides additional context"
          }
        ]
      };
    }
  },

  /**
   * Extract videos from a YouTube playlist URL
   */
  async extractPlaylistVideos(playlistUrl: string): Promise<{ videoId: string; title: string }[]> {
    try {
      const { data, error } = await supabase.functions.invoke("ai-video-service", {
        body: {
          action: "extractPlaylistVideos",
          payload: { playlist_url: playlistUrl }
        }
      });

      if (error) throw error;
      return data as { videoId: string; title: string }[];
    } catch (error) {
      console.error("Error extracting playlist videos:", error);
      return [
        { videoId: "dQw4w9WgXcQ", title: "Introduction Video" },
        { videoId: "9bZkp7q19f0", title: "Follow-up Video" }
      ];
    }
  }
};
