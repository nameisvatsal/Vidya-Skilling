
import React, { useState } from "react";
import { AIVideosService } from "@/services/AIVideosService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Play, Search, Book, List, BrainCircuit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useOffline } from "@/contexts/OfflineContext";

interface LearningPathItem {
  video_id: string;
  title: string;
  recommended_order: number;
  speed: number;
  key_concepts: string[];
  estimated_time: number;
}

const AIVideoLearning: React.FC = () => {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [learningGoals, setLearningGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPathItem[] | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<{ type: string; content: string } | null>(null);
  const [analysisType, setAnalysisType] = useState<"summary" | "quiz" | "learning_style">("summary");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const { isOnline } = useOffline();
  
  const handleGenerateLearningPath = async () => {
    if (!playlistUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a YouTube playlist URL",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    try {
      const userId = user?.id || "anonymous";
      const goals = learningGoals.split(",").map(goal => goal.trim()).filter(goal => goal);
      
      const result = await AIVideosService.generateLearningPathFromPlaylist({
        playlist_url: playlistUrl,
        user_id: userId,
        learning_goals: goals.length > 0 ? goals : undefined
      });
      
      setLearningPath(result.path);
      
      toast({
        title: "Learning Path Generated",
        description: `Created a path with ${result.path.length} videos (${result.total_duration} minutes)`,
      });
    } catch (error) {
      console.error("Error generating learning path:", error);
      toast({
        title: "Error",
        description: "Failed to generate learning path. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleVideoSelect = (videoId: string) => {
    setActiveVideoId(videoId);
    setAnalysis(null);
  };
  
  const handleAnalyzeVideo = async () => {
    if (!activeVideoId) return;
    
    setIsAnalyzing(true);
    try {
      const result = await AIVideosService.analyzeVideo({
        video_id: activeVideoId,
        analysis_type: analysisType
      });
      
      setAnalysis(result);
    } catch (error) {
      console.error("Error analyzing video:", error);
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the video. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const renderAnalysisContent = () => {
    if (!analysis) return null;
    
    if (analysis.type === "summary") {
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Video Summary</h3>
          <div className="whitespace-pre-wrap text-sm">{analysis.content}</div>
        </div>
      );
    } else if (analysis.type === "quiz") {
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Quiz Questions</h3>
          <div className="whitespace-pre-wrap text-sm">{analysis.content}</div>
        </div>
      );
    } else if (analysis.type === "learning_style") {
      return (
        <div className="space-y-4">
          <h3 className="font-medium text-lg">Learning Recommendations</h3>
          <div className="whitespace-pre-wrap text-sm">{analysis.content}</div>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="container max-w-5xl mx-auto p-4 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>AI Video Learning Path Generator</CardTitle>
          <CardDescription>
            Generate a personalized learning path from YouTube playlists using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="playlist-url" className="text-sm font-medium">
              YouTube Playlist URL
            </label>
            <Input
              id="playlist-url"
              placeholder="https://www.youtube.com/playlist?list=..."
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="learning-goals" className="text-sm font-medium">
              Learning Goals (optional, comma separated)
            </label>
            <Input
              id="learning-goals"
              placeholder="Build a website, Learn JavaScript basics..."
              value={learningGoals}
              onChange={(e) => setLearningGoals(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleGenerateLearningPath} 
            disabled={loading || !isOnline}
            className="bg-vidya-primary hover:bg-vidya-dark"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <BrainCircuit className="mr-2 h-4 w-4" />
                Generate Learning Path
              </>
            )}
          </Button>
          {!isOnline && (
            <p className="ml-4 text-sm text-amber-500">
              This feature requires an internet connection.
            </p>
          )}
        </CardFooter>
      </Card>
      
      {learningPath && learningPath.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-xl font-bold">Learning Path</h2>
            <div className="space-y-2">
              {learningPath.map((item) => (
                <Card 
                  key={item.video_id}
                  className={`cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                    activeVideoId === item.video_id ? "border-vidya-primary" : ""
                  }`}
                  onClick={() => handleVideoSelect(item.video_id)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {item.estimated_time} minutes • {item.speed}x speed
                        </p>
                      </div>
                      <div className="bg-gray-100 dark:bg-gray-700 rounded-full w-6 h-6 flex items-center justify-center">
                        {item.recommended_order}
                      </div>
                    </div>
                    {item.key_concepts.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {item.key_concepts.map((concept, idx) => (
                          <span 
                            key={idx} 
                            className="bg-vidya-primary/10 text-vidya-primary text-xs px-2 py-0.5 rounded-full"
                          >
                            {concept}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            {activeVideoId ? (
              <>
                <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeVideoId}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                
                <Tabs defaultValue="summary" onValueChange={(v) => setAnalysisType(v as any)}>
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="summary">
                      <Search className="h-4 w-4 mr-2" />
                      Summary
                    </TabsTrigger>
                    <TabsTrigger value="quiz">
                      <List className="h-4 w-4 mr-2" />
                      Quiz
                    </TabsTrigger>
                    <TabsTrigger value="learning_style">
                      <Book className="h-4 w-4 mr-2" />
                      Learning Style
                    </TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4">
                    <Button 
                      onClick={handleAnalyzeVideo} 
                      disabled={isAnalyzing || !isOnline}
                      className="bg-vidya-primary hover:bg-vidya-dark"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BrainCircuit className="mr-2 h-4 w-4" />
                          Analyze Video
                        </>
                      )}
                    </Button>
                    
                    <div className="mt-6">
                      {isAnalyzing ? (
                        <div className="flex justify-center items-center py-12">
                          <Loader2 className="h-8 w-8 animate-spin text-vidya-primary" />
                        </div>
                      ) : (
                        renderAnalysisContent()
                      )}
                    </div>
                  </div>
                </Tabs>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <Play className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-center text-gray-500">
                  Select a video from your learning path to begin
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AIVideoLearning;
