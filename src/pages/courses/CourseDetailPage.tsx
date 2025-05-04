
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, Book, Award, User, Star, Calendar, Download, Share, Globe, FileVideo, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OfflineContentDownloader from "@/components/OfflineContentDownloader";
import { Course, getCourseById } from "@/mocks/coursesData";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) {
      setError("Course ID not provided");
      setIsLoading(false);
      return;
    }

    // Fetch course data
    setTimeout(() => {
      const foundCourse = getCourseById(id);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        setError("Course not found");
      }
      setIsLoading(false);
    }, 500); // Simulate API delay
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="container mx-auto py-12 px-4 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p>{error || "An unknown error occurred"}</p>
        <Button asChild className="mt-4">
          <Link to="/courses">Back to Course Catalog</Link>
        </Button>
      </div>
    );
  }

  const handleEnrollClick = () => {
    toast({
      title: "Enrolled Successfully!",
      description: `You've been enrolled in ${course.title}`,
    });
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answerIndex
    }));
  };

  const handleQuizSubmit = () => {
    let correctAnswers = 0;
    let totalQuestions = course.videoQuiz?.length || 0;
    
    course.videoQuiz?.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });
    
    setQuizSubmitted(true);
    
    toast({
      title: "Quiz Submitted",
      description: `You got ${correctAnswers} out of ${totalQuestions} correct!`,
    });
  };

  // Mock modules data
  const modules = [
    {
      id: "1",
      title: "Introduction to the Course",
      description: "Overview of what you'll learn and how to get started",
      duration: "15 minutes",
      type: "video",
      isCompleted: true,
    },
    {
      id: "2",
      title: "Core Concepts",
      description: "Fundamental principles and frameworks",
      duration: "45 minutes",
      type: "video",
      isCompleted: true,
    },
    {
      id: "3",
      title: "Practical Application",
      description: "Hands-on exercises to apply what you've learned",
      duration: "60 minutes",
      type: "exercise",
      isCompleted: false,
    },
    {
      id: "4",
      title: "Advanced Techniques",
      description: "Taking your skills to the next level",
      duration: "50 minutes",
      type: "video",
      isCompleted: false,
    },
    {
      id: "5",
      title: "Final Assessment",
      description: "Test your knowledge with a comprehensive quiz",
      duration: "30 minutes",
      type: "quiz",
      isCompleted: false,
    },
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
            
            <div className="flex flex-wrap gap-3 items-center mb-6">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{course.rating} ({course.reviewCount} reviews)</span>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {course.level}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Globe className="h-3 w-3" />
                {course.language === "en" ? "English" : 
                 course.language === "hi" ? "Hindi" : 
                 course.language === "ta" ? "Tamil" : "Telugu"}
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
              </Badge>
            </div>
            
            <div className="aspect-video rounded-lg overflow-hidden mb-6">
              <img 
                src={course.thumbnailUrl} 
                alt={course.title} 
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex items-center gap-4 mb-6">
              <img 
                src={course.instructorAvatar} 
                alt={course.instructorName} 
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <h3 className="font-medium">Instructor</h3>
                <p>{course.instructorName}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">About This Course</h2>
              <p>{course.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-vidya-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">{course.totalDuration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Book className="h-5 w-5 text-vidya-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Modules</p>
                    <p className="font-medium">{course.totalModules} modules</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-vidya-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Certificate</p>
                    <p className="font-medium">Upon completion</p>
                  </div>
                </div>
              </div>
            </div>
            
            <Tabs defaultValue="content" className="mt-6">
              <TabsList className="mb-6">
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="video-summary">Video Summary</TabsTrigger>
                <TabsTrigger value="video-quiz">Video Quiz</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              
              <TabsContent value="content" className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Course Modules</h2>
                    <div>
                      <Progress value={40} className="w-32 h-2" />
                      <p className="text-xs text-muted-foreground mt-1">40% Complete</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <Card key={module.id} className={module.isCompleted ? "bg-gray-50 dark:bg-gray-800/50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium flex items-center gap-2">
                                <span className="w-6 h-6 bg-vidya-primary text-white rounded-full flex items-center justify-center text-xs">
                                  {index + 1}
                                </span>
                                {module.title}
                                {module.isCompleted && (
                                  <Badge variant="outline" className="text-green-500 ml-2">Completed</Badge>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className="mb-2">{module.type}</Badge>
                              <div className="text-sm text-muted-foreground">{module.duration}</div>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              asChild
                            >
                              <Link to={`/courses/${course.id}/module/${module.id}`}>
                                {module.isCompleted ? "Review" : "Start"}
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Downloadable Resources</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Book className="h-5 w-5 text-vidya-primary" />
                          <div>
                            <p className="font-medium">Course Workbook</p>
                            <p className="text-sm text-muted-foreground">PDF, 2.5 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Book className="h-5 w-5 text-vidya-primary" />
                          <div>
                            <p className="font-medium">Practice Exercises</p>
                            <p className="text-sm text-muted-foreground">PDF, 1.8 MB</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="video-summary">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Video Summary</h2>
                  
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <FileVideo className="h-8 w-8 text-vidya-primary flex-shrink-0 mt-1" />
                        <div>
                          <h3 className="text-lg font-medium mb-2">Key Points from Video</h3>
                          <p className="text-muted-foreground">{course.videoSummary || "No summary available for this video."}</p>
                          
                          <div className="mt-4 flex flex-wrap gap-2">
                            {course.tags.map((tag) => (
                              <Badge key={tag} variant="outline">{tag}</Badge>
                            ))}
                          </div>
                          
                          <div className="mt-6">
                            <Button variant="outline" size="sm" className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Download Full Transcript
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="video-quiz">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Video Quiz</h2>
                  <p className="text-muted-foreground">Test your understanding of the concepts covered in this lesson.</p>
                  
                  {course.videoQuiz && course.videoQuiz.length > 0 ? (
                    <div className="space-y-8 mt-6">
                      {course.videoQuiz.map((quiz, questionIndex) => (
                        <Card key={questionIndex}>
                          <CardContent className="p-6">
                            <h3 className="text-lg font-medium mb-4">Question {questionIndex + 1}: {quiz.question}</h3>
                            
                            <RadioGroup 
                              onValueChange={(value) => handleAnswerSelect(questionIndex, parseInt(value))}
                              disabled={quizSubmitted}
                            >
                              <div className="space-y-4">
                                {quiz.options.map((option, optionIndex) => (
                                  <div key={optionIndex} className="flex items-start space-x-2">
                                    <RadioGroupItem 
                                      value={optionIndex.toString()} 
                                      id={`q${questionIndex}-opt${optionIndex}`} 
                                      className={quizSubmitted ? 
                                        (optionIndex === quiz.correctAnswer ? "border-green-500" : 
                                        selectedAnswers[questionIndex] === optionIndex ? "border-red-500" : "") : ""
                                      }
                                    />
                                    <Label 
                                      htmlFor={`q${questionIndex}-opt${optionIndex}`}
                                      className={quizSubmitted ? 
                                        (optionIndex === quiz.correctAnswer ? "text-green-600 font-medium" : 
                                        selectedAnswers[questionIndex] === optionIndex ? "text-red-600" : "") : ""
                                      }
                                    >
                                      {option}
                                    </Label>
                                  </div>
                                ))}
                              </div>
                            </RadioGroup>
                            
                            {quizSubmitted && (
                              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                                <p className="font-medium">
                                  {selectedAnswers[questionIndex] === quiz.correctAnswer ? 
                                    "✅ Correct!" : 
                                    "❌ Incorrect! The right answer is: " + quiz.options[quiz.correctAnswer]}
                                </p>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                      
                      {!quizSubmitted && (
                        <Button onClick={handleQuizSubmit} className="mt-4">
                          Submit Answers
                        </Button>
                      )}
                      
                      {quizSubmitted && (
                        <Button onClick={() => setQuizSubmitted(false)} variant="outline" className="mt-4">
                          Try Again
                        </Button>
                      )}
                    </div>
                  ) : (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <p>No quiz available for this course.</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Student Reviews</h2>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-4xl font-bold">{course.rating}</p>
                      <div className="flex text-yellow-500">
                        {Array(5).fill(0).map((_, i) => (
                          <Star key={i} className="h-4 w-4" fill={i < Math.floor(course.rating) ? "currentColor" : "none"} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{course.reviewCount} reviews</p>
                    </div>
                    
                    <div className="flex-grow space-y-2">
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <span className="text-sm w-2">{rating}</span>
                          <Star className="h-4 w-4 text-yellow-500" />
                          <Progress 
                            value={
                              rating === 5 ? 70 : 
                              rating === 4 ? 20 : 
                              rating === 3 ? 7 : 
                              rating === 2 ? 2 : 1
                            } 
                            className="h-2 flex-grow" 
                          />
                          <span className="text-sm w-8">
                            {rating === 5 ? "70%" : 
                             rating === 4 ? "20%" : 
                             rating === 3 ? "7%" : 
                             rating === 2 ? "2%" : "1%"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Sample reviews */}
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-vidya-primary text-white rounded-full flex items-center justify-center">
                              R
                            </div>
                            <span className="font-medium">Raj Kumar</span>
                          </div>
                          <div className="flex text-yellow-500">
                            {Array(5).fill(0).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">This course was exactly what I needed to start my career. The practical examples made it easy to understand complex topics.</p>
                        <p className="text-xs text-muted-foreground mt-2">Posted 2 months ago</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-vidya-primary text-white rounded-full flex items-center justify-center">
                              S
                            </div>
                            <span className="font-medium">Sunita Patel</span>
                          </div>
                          <div className="flex text-yellow-500">
                            {Array(4).fill(0).map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-current" />
                            ))}
                            <Star className="h-3 w-3" />
                          </div>
                        </div>
                        <p className="text-sm">Great course! The offline access feature was crucial for me as I often study in areas with poor connectivity.</p>
                        <p className="text-xs text-muted-foreground mt-2">Posted 1 month ago</p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-4">
          {/* Price card */}
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-4">
                {course.price === 0 
                  ? "Free Course" 
                  : course.discountPrice 
                    ? <div>
                        <span className="text-muted-foreground line-through mr-2">₹{course.price}</span>
                        <span className="text-vidya-primary">₹{course.discountPrice}</span>
                      </div>
                    : `₹${course.price}`
                }
              </h3>
              
              <div className="space-y-4">
                <Button 
                  className="w-full text-base py-6" 
                  onClick={handleEnrollClick}
                >
                  {course.progress ? "Continue Learning" : "Enroll Now"}
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Share className="h-4 w-4" />
                  Share
                </Button>
                
                {/* Offline download */}
                <OfflineContentDownloader topic={course.title} />
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-2">This course includes:</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-vidya-primary" />
                      {course.totalDuration} of content
                    </li>
                    <li className="flex items-center gap-2">
                      <Book className="h-4 w-4 text-vidya-primary" />
                      {course.totalModules} learning modules
                    </li>
                    <li className="flex items-center gap-2">
                      <Download className="h-4 w-4 text-vidya-primary" />
                      {course.availableOffline ? "Available offline" : "Online only"}
                    </li>
                    <li className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-vidya-primary" />
                      Certificate of completion
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
