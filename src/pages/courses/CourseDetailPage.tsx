
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Clock, BookOpen, BarChart, Download, Award, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

// Mock course data
const courses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites. This comprehensive course will take you from a beginner to being able to create your own responsive websites with modern design principles.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Technology",
    duration: "4 weeks",
    level: "Beginner",
    language: "English",
    instructor: "Priya Sharma",
    rating: 4.7,
    enrolledStudents: 1245,
    lastUpdated: "2 months ago",
    certification: true,
    progress: 25,
    modules: [
      {
        id: "m1",
        title: "Introduction to HTML",
        duration: "45 minutes",
        completed: true,
        type: "video"
      },
      {
        id: "m2",
        title: "CSS Basics",
        duration: "1 hour",
        completed: true,
        type: "video"
      },
      {
        id: "m3",
        title: "Introduction to JavaScript",
        duration: "1.5 hours",
        completed: false,
        type: "video"
      },
      {
        id: "m4",
        title: "Building Your First Web Page",
        duration: "2 hours",
        completed: false,
        type: "project"
      },
      {
        id: "q1",
        title: "HTML & CSS Quiz",
        duration: "30 minutes",
        completed: false,
        type: "quiz"
      }
    ],
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design", "Web Development"]
  },
  {
    id: "2",
    title: "Digital Marketing Skills",
    description: "Master social media, SEO, and content marketing strategies for business growth. Learn how to create effective digital marketing campaigns that drive traffic and convert leads.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80",
    category: "Marketing",
    duration: "3 weeks",
    level: "Intermediate",
    language: "Hindi",
    instructor: "Rajesh Kumar",
    rating: 4.5,
    enrolledStudents: 890,
    lastUpdated: "1 month ago",
    certification: true,
    progress: 0,
    modules: [
      {
        id: "m1",
        title: "Introduction to Digital Marketing",
        duration: "1 hour",
        completed: false,
        type: "video"
      },
      {
        id: "m2",
        title: "Social Media Marketing",
        duration: "1.5 hours",
        completed: false,
        type: "video"
      },
      {
        id: "m3",
        title: "SEO Fundamentals",
        duration: "2 hours",
        completed: false,
        type: "video"
      }
    ],
    skills: ["Social Media Marketing", "SEO", "Content Marketing", "Analytics"]
  },
];

const CourseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Find course by id
    const foundCourse = courses.find((c) => c.id === id);
    if (foundCourse) {
      setCourse(foundCourse);
      
      // Check if user is enrolled (in a real app, this would be from an API/localStorage)
      setIsEnrolled(foundCourse.progress > 0);
    }
    
    // Simulate previously downloaded course
    const downloadedCourses = localStorage.getItem("downloadedCourses");
    if (downloadedCourses) {
      const parsedDownloads = JSON.parse(downloadedCourses);
      if (parsedDownloads.includes(id)) {
        setIsDownloaded(true);
      }
    }
  }, [id]);

  const handleEnroll = () => {
    toast({
      title: "Enrolled Successfully",
      description: `You have been enrolled in ${course.title}`,
    });
    setIsEnrolled(true);
  };

  const handleDownload = () => {
    setIsDownloading(true);
    
    // Simulate download
    setTimeout(() => {
      setIsDownloading(false);
      setIsDownloaded(true);
      
      // Save to localStorage for demo
      const downloadedCourses = localStorage.getItem("downloadedCourses");
      let parsedDownloads = downloadedCourses ? JSON.parse(downloadedCourses) : [];
      parsedDownloads = [...new Set([...parsedDownloads, id])];
      localStorage.setItem("downloadedCourses", JSON.stringify(parsedDownloads));
      
      toast({
        title: "Download Complete",
        description: "This course is now available offline",
      });
    }, 2000);
  };

  if (!course) {
    return (
      <div className="page-container">
        <p>Course not found</p>
      </div>
    );
  }

  return (
    <div className="page-container pb-12">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-vidya-secondary">{course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          <Badge variant="outline">{course.language}</Badge>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{course.title}</h1>
        
        {isEnrolled && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Course Progress</span>
              <span className="text-sm">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}
        
        <div className="relative aspect-video overflow-hidden rounded-lg mb-6">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 lg:col-span-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="content">Course Content</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">About This Course</h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {course.description}
                    </p>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Skills You'll Gain</h2>
                    <div className="flex flex-wrap gap-2">
                      {course.skills.map((skill: string) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Instructor</h2>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                        {course.instructor.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{course.instructor}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Course Instructor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="content">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Course Modules</h2>
                  
                  <div className="space-y-3">
                    {course.modules.map((module: any) => (
                      <div 
                        key={module.id} 
                        className={`border p-3 rounded-md flex justify-between items-center ${
                          module.completed ? "bg-gray-50 dark:bg-gray-800" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {module.type === "video" && <BookOpen size={18} />}
                          {module.type === "quiz" && <BarChart size={18} />}
                          {module.type === "project" && <Award size={18} />}
                          <div>
                            <p className="font-medium">{module.title}</p>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock size={14} className="mr-1" />
                              <span>{module.duration}</span>
                            </div>
                          </div>
                        </div>
                        
                        {isEnrolled ? (
                          <Link to={`/courses/${id}/module/${module.id}`}>
                            <Button size="sm">
                              {module.completed ? "Review" : "Start"}
                            </Button>
                          </Link>
                        ) : (
                          <Badge variant="outline">Locked</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="discussion">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">Discussion Forum</h2>
                  
                  <p className="text-gray-600 dark:text-gray-300">
                    Join the discussion to ask questions and share insights with other learners.
                  </p>
                  
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MessageSquare size={20} className="text-vidya-primary" />
                    <p className="text-gray-600 dark:text-gray-300">
                      Enroll in this course to join the discussion.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <Card>
              <CardContent className="p-6 space-y-6">
                {!isEnrolled ? (
                  <Button className="w-full" onClick={handleEnroll}>
                    Enroll Now - Free
                  </Button>
                ) : (
                  <Link to={`/courses/${id}/module/${course.modules[0].id}`}>
                    <Button className="w-full">
                      {course.progress > 0 ? "Continue Learning" : "Start Course"}
                    </Button>
                  </Link>
                )}
                
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  disabled={isDownloading}
                  onClick={handleDownload}
                >
                  <Download size={16} />
                  {isDownloading
                    ? "Downloading..."
                    : isDownloaded
                    ? "Downloaded for Offline"
                    : "Download for Offline"}
                </Button>
                
                <div className="border-t pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium">{course.duration}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium">{course.level}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="font-medium">{course.enrolledStudents}</p>
                    </div>
                    <div className="text-center p-2">
                      <p className="text-sm text-gray-500">Language</p>
                      <p className="font-medium">{course.language}</p>
                    </div>
                  </div>
                </div>
                
                {course.certification && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg flex items-center gap-3">
                    <Award size={20} className="text-vidya-primary" />
                    <div>
                      <p className="font-medium">Includes Certificate</p>
                      <p className="text-xs text-gray-500">Upon completion</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;
