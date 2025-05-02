import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, List, Download, CheckCircle, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import EnhancedVoiceInput from "@/components/EnhancedVoiceInput";
import AdaptiveContent from "@/components/AdaptiveContent";
import { useOffline } from "@/contexts/OfflineContext";
import { AIService } from "@/services/AIService";
import LanguageSelector from "@/components/LanguageSelector";

// Mock course data
const courses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    modules: [
      {
        id: "m1",
        title: "Introduction to HTML",
        duration: "45 minutes",
        completed: true,
        type: "video",
        videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU",
        content: "HTML (HyperText Markup Language) is the standard language for creating web pages. It consists of elements that define the structure of content on a web page.",
        transcript: "In this lesson, we will learn about HTML, the building block of the web. HTML stands for HyperText Markup Language, and it is used to define the structure of web content."
      },
      {
        id: "m2",
        title: "CSS Basics",
        duration: "1 hour",
        completed: true,
        type: "video",
        videoUrl: "https://www.youtube.com/embed/yfoY53QXEnI",
        content: "CSS (Cascading Style Sheets) is used for styling HTML elements. It controls the layout, colors, fonts, and other visual aspects of a webpage.",
        transcript: "Today we're going to learn about CSS, which stands for Cascading Style Sheets. CSS is what makes websites look good by adding colors, layouts, and visual effects."
      },
      {
        id: "m3",
        title: "Introduction to JavaScript",
        duration: "1.5 hours",
        completed: false,
        type: "video",
        videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk",
        content: "JavaScript is a programming language that makes web pages interactive. It allows you to create dynamic elements and respond to user actions.",
        transcript: "In this module, we'll dive into JavaScript, the programming language that powers the interactive parts of websites. JavaScript lets you add functionality to web pages."
      },
      {
        id: "m4",
        title: "Building Your First Web Page",
        duration: "2 hours",
        completed: false,
        type: "project",
        content: "In this project, you will build a complete webpage using HTML, CSS, and JavaScript. Apply the concepts you've learned to create a responsive and interactive web page.",
        task: "Create a personal portfolio page with at least three sections: About Me, Skills, and Contact Form."
      },
      {
        id: "q1",
        title: "HTML & CSS Quiz",
        duration: "30 minutes",
        completed: false,
        type: "quiz",
        questions: [
          {
            question: "What does HTML stand for?",
            options: [
              "Hyper Text Markup Language",
              "Hyper Transfer Markup Language",
              "High Text Markup Language",
              "Hyperlink Text Markup Language"
            ],
            correctAnswer: 0
          },
          {
            question: "Which CSS property controls text size?",
            options: [
              "text-style",
              "font-size",
              "text-size",
              "font-height"
            ],
            correctAnswer: 1
          }
        ]
      }
    ]
  }
];

const ModulePlayerPage = () => {
  const { id, moduleId } = useParams<{ id: string; moduleId: string }>();
  const [course, setCourse] = useState<any | null>(null);
  const [module, setModule] = useState<any | null>(null);
  const [moduleIndex, setModuleIndex] = useState<number>(0);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string>("en");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [userQuestion, setUserQuestion] = useState<string>("");
  const [isLoadingAI, setIsLoadingAI] = useState<boolean>(false);
  const { toast } = useToast();
  const { isOnline, queueSync } = useOffline();
  
  useEffect(() => {
    // Find course and module
    const foundCourse = courses.find((c) => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      
      const foundModuleIndex = foundCourse.modules.findIndex((m: any) => m.id === moduleId);
      if (foundModuleIndex !== -1) {
        setModule(foundCourse.modules[foundModuleIndex]);
        setModuleIndex(foundModuleIndex);
      }
    }
    
    // Try to load from localStorage if offline
    if (!isOnline) {
      const offlineCourse = localStorage.getItem(`course_${id}`);
      if (offlineCourse) {
        try {
          const parsedCourse = JSON.parse(offlineCourse);
          setCourse(parsedCourse);
          
          const foundModuleIndex = parsedCourse.modules.findIndex((m: any) => m.id === moduleId);
          if (foundModuleIndex !== -1) {
            setModule(parsedCourse.modules[foundModuleIndex]);
            setModuleIndex(foundModuleIndex);
          }
        } catch (e) {
          console.error('Failed to parse offline course data:', e);
        }
      }
    }
  }, [id, moduleId, isOnline]);

  const handleComplete = () => {
    setIsCompleting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Update module completion status
      const updatedModules = [...course.modules];
      updatedModules[moduleIndex].completed = true;
      
      // Save to course data
      const updatedCourse = { ...course, modules: updatedModules };
      setCourse(updatedCourse);
      setModule({ ...module, completed: true });
      
      // Save to localStorage for offline access
      localStorage.setItem(`course_${id}`, JSON.stringify(updatedCourse));
      
      // If we're online, queue this for sync
      if (isOnline) {
        queueSync(`course_completion_${id}_${moduleId}`, {
          courseId: id,
          moduleId: moduleId,
          completed: true,
          timestamp: new Date().toISOString()
        });
      }
      
      toast({
        title: "Module Completed",
        description: "Your progress has been saved",
      });
      
      setIsCompleting(false);
    }, 1000);
  };

  const nextModule = () => {
    if (moduleIndex < course.modules.length - 1) {
      const nextModuleId = course.modules[moduleIndex + 1].id;
      window.location.href = `/courses/${id}/module/${nextModuleId}`;
    }
  };

  const prevModule = () => {
    if (moduleIndex > 0) {
      const prevModuleId = course.modules[moduleIndex - 1].id;
      window.location.href = `/courses/${id}/module/${prevModuleId}`;
    }
  };
  
  const handleVoiceInput = (text: string) => {
    setUserQuestion(text);
    handleAskAI(text);
  };
  
  const handleAskAI = async (question: string) => {
    if (!question.trim()) return;
    
    setIsLoadingAI(true);
    
    try {
      // Prepare context from current module content
      const context = module.content ? `Context: ${module.content}\n\n` : '';
      
      // Send to AI service
      const response = await AIService.generateContent({
        prompt: `${context}Question: ${question}\n\nAnswer this question based on the learning content. If the question isn't related to the content, politely say you can only answer questions about the course material.`,
        language: { target: currentLanguage },
        mode: "text"
      });
      
      if (response.success) {
        setAiResponse(response.result);
        
        // Cache this interaction for offline use
        const cacheKey = `ai_interaction_${Buffer.from(question.substring(0, 50)).toString('base64').substring(0, 20)}`;
        queueSync(cacheKey, {
          question,
          answer: response.result,
          timestamp: new Date().toISOString()
        });
      } else {
        setAiResponse("I'm sorry, I couldn't generate a response. Please try again later.");
        toast({
          title: "AI Response Error",
          description: "Could not get an answer from our AI assistant.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      setAiResponse("I'm sorry, I encountered an error while processing your question.");
      toast({
        title: "Error",
        description: "Failed to get AI response.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingAI(false);
    }
  };
  
  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  };

  if (!course || !module) {
    return (
      <div className="page-container">
        <p>Module not found</p>
      </div>
    );
  }

  const courseProgress = (
    (course.modules.filter((m: any) => m.completed).length / course.modules.length) *
    100
  ).toFixed(0);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="rounded-full bg-white dark:bg-gray-800 shadow-md"
        >
          <List size={20} />
        </Button>
      </div>
      
      {/* Sidebar */}
      <div
        className={`
          fixed inset-0 z-20 bg-white dark:bg-gray-900 w-80 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold">{course.title}</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsSidebarOpen(false)}
          >
            <ChevronLeft size={18} />
          </Button>
        </div>
        
        {/* Offline/Online indicator */}
        <div className={`px-4 py-2 text-xs flex items-center 
          ${isOnline ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}>
          <div className={`w-2 h-2 rounded-full mr-1 
            ${isOnline ? "bg-green-600 dark:bg-green-400" : "bg-amber-600 dark:bg-amber-400"}`}></div>
          {isOnline ? "Online" : "Offline Mode"}
        </div>
        
        <div className="p-4">
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Course Progress</span>
              <span>{courseProgress}%</span>
            </div>
            <Progress value={parseInt(courseProgress)} className="h-2" />
          </div>
          
          <div className="mb-4">
            <LanguageSelector 
              currentLanguage={currentLanguage}
              onLanguageChange={handleLanguageChange}
            />
          </div>
          
          <div className="mb-4">
            <Button 
              variant="outline"
              size="sm"
              className="w-full flex items-center gap-2"
              onClick={() => {
                // Save course for offline use
                localStorage.setItem(`course_${id}`, JSON.stringify(course));
                toast({
                  title: "Downloaded for Offline Use",
                  description: "This course is now available offline.",
                });
              }}
            >
              <Download size={14} />
              Save for Offline
            </Button>
          </div>
          
          <div className="space-y-1">
            {course.modules.map((m: any, index: number) => (
              <Link 
                key={m.id} 
                to={`/courses/${id}/module/${m.id}`}
                className={`
                  block p-2 rounded-md text-sm
                  ${moduleId === m.id 
                    ? "bg-vidya-primary text-white" 
                    : m.completed 
                      ? "bg-gray-100 dark:bg-gray-800" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <span>{index + 1}. {m.title}</span>
                  {m.completed && <CheckCircle size={16} />}
                </div>
                <div className="text-xs opacity-70 mt-1 flex items-center">
                  {m.type === "video" && <Play size={12} className="mr-1" />}
                  {m.type === "quiz" && "Quiz"}
                  {m.type === "project" && "Project"}
                  {m.duration && <span className="ml-1">{m.duration}</span>}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 overflow-auto pb-20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-4">
            <Link to={`/courses/${id}`} className="text-vidya-primary hover:underline flex items-center text-sm">
              <ChevronLeft size={16} className="mr-1" />
              Back to course
            </Link>
          </div>
          
          <h1 className="text-2xl font-bold mb-4">{module.title}</h1>
          
          {/* Module content */}
          {module.type === "video" && (
            <div className="space-y-6">
              <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src={module.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              
              <Tabs defaultValue="content">
                <TabsList>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="transcript">Transcript</TabsTrigger>
                  <TabsTrigger value="notes">Notes</TabsTrigger>
                  <TabsTrigger value="ai-support">AI Support</TabsTrigger>
                </TabsList>
                
                <TabsContent value="content" className="p-4">
                  <AdaptiveContent 
                    content={module.content}
                    language={currentLanguage}
                    showControls={true}
                  />
                </TabsContent>
                
                <TabsContent value="transcript" className="p-4">
                  <AdaptiveContent 
                    content={module.transcript}
                    language={currentLanguage}
                    showControls={true}
                  />
                </TabsContent>
                
                <TabsContent value="notes" className="p-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You can take notes here. Your notes will be saved locally for offline access.
                    </p>
                    
                    <textarea
                      className="w-full mt-2 p-3 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                      rows={5}
                      placeholder="Type your notes here..."
                    ></textarea>
                    
                    <div className="mt-4">
                      <Button size="sm">Save Notes</Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="ai-support" className="p-4">
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-2">Ask About This Lesson</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Use your voice or type to ask questions about the content in this module.
                      </p>
                      
                      <EnhancedVoiceInput 
                        onTextCapture={handleVoiceInput}
                        placeholder="Click to ask a question about this lesson"
                        language={currentLanguage}
                      />
                      
                      <div className="mt-4">
                        <input
                          type="text"
                          className="w-full p-3 border rounded-md dark:bg-gray-900 dark:border-gray-700"
                          placeholder="Or type your question here..."
                          value={userQuestion}
                          onChange={(e) => setUserQuestion(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleAskAI(userQuestion);
                            }
                          }}
                        />
                        
                        <div className="mt-2 flex justify-end">
                          <Button 
                            onClick={() => handleAskAI(userQuestion)}
                            disabled={isLoadingAI || !userQuestion.trim()}
                          >
                            {isLoadingAI ? "Processing..." : "Ask"}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    {(aiResponse || isLoadingAI) && (
                      <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
                        <h4 className="font-medium mb-2">AI Response</h4>
                        {isLoadingAI ? (
                          <div className="py-8 flex justify-center">
                            <div className="animate-pulse flex space-x-1">
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 dark:text-gray-300">{aiResponse}</p>
                        )}
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex flex-wrap gap-4 justify-between items-center pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    disabled={moduleIndex === 0} 
                    onClick={prevModule}
                  >
                    <ChevronLeft size={16} className="mr-1" />
                    Previous
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={moduleIndex === course.modules.length - 1}
                    onClick={nextModule}
                  >
                    Next
                    <ChevronRight size={16} className="ml-1" />
                  </Button>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => {
                      // Save module for offline use
                      localStorage.setItem(`module_${moduleId}`, JSON.stringify(module));
                      toast({
                        title: "Downloaded for Offline Use",
                        description: "This module is now available offline.",
                      });
                    }}
                  >
                    <Download size={16} />
                    Download
                  </Button>
                  
                  <Button
                    size="sm"
                    disabled={module.completed || isCompleting}
                    onClick={handleComplete}
                    className="bg-vidya-primary hover:bg-vidya-dark"
                  >
                    {isCompleting
                      ? "Saving..."
                      : module.completed
                      ? "Completed"
                      : "Mark as Complete"}
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {module.type === "quiz" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-6">Quiz: {module.title}</h2>
                
                {module.questions.map((q: any, index: number) => (
                  <div key={index} className="mb-8">
                    <h3 className="font-medium mb-3">
                      Question {index + 1}: {q.question}
                    </h3>
                    
                    <div className="space-y-3">
                      {q.options.map((option: string, optIndex: number) => (
                        <label 
                          key={optIndex} 
                          className="flex items-start p-3 border rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <input
                            type="radio"
                            name={`question-${index}`}
                            className="mt-1"
                          />
                          <span className="ml-2">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between mt-8 pt-4 border-t">
                  <Button variant="outline">
                    Save Progress
                  </Button>
                  <Button className="bg-vidya-primary hover:bg-vidya-dark">
                    Submit Quiz
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {module.type === "project" && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Project: {module.title}</h2>
                
                <div className="prose dark:prose-invert mb-6">
                  <p>{module.content}</p>
                  
                  <h3 className="text-lg font-medium mt-4 mb-2">Your Task:</h3>
                  <p>{module.task}</p>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h3 className="font-medium mb-3">Project Submission</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Project URL (if applicable)
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded-md dark:bg-gray-800"
                        placeholder="e.g., https://github.com/yourusername/project"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Project Description
                      </label>
                      <textarea
                        className="w-full p-2 border rounded-md dark:bg-gray-800"
                        rows={4}
                        placeholder="Describe your implementation and any challenges you faced..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Upload Files
                      </label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md p-6 text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Drag and drop files here, or click to select files
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          multiple
                        />
                        <Button variant="outline" size="sm" className="mt-2">
                          Select Files
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Or record your explanation with voice
                      </label>
                      <VoiceInput
                        onTextCapture={() => {}}
                        placeholder="Click the microphone to explain your project solution"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end mt-6">
                    <Button variant="outline" className="mr-2">
                      Save Draft
                    </Button>
                    <Button className="bg-vidya-primary hover:bg-vidya-dark">
                      Submit Project
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModulePlayerPage;
