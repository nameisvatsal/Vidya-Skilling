
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Book, Star, Zap, Medal, Mic, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import CourseCard from "@/components/CourseCard";
import VoiceInput from "@/components/VoiceInput";

// Mock data
const featuredCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Technology",
    duration: "4 weeks",
    level: "Beginner",
    language: "English",
    progress: 25,
  },
  {
    id: "2",
    title: "Digital Marketing Skills",
    description: "Master social media, SEO, and content marketing strategies for business growth",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Marketing",
    duration: "3 weeks",
    level: "Intermediate",
    language: "Hindi",
    progress: 0,
  },
  {
    id: "3",
    title: "Financial Literacy",
    description: "Understand personal finance, savings, and investment strategies for a secure future",
    image: "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Finance",
    duration: "2 weeks",
    level: "Beginner",
    language: "Tamil",
    progress: 75,
  },
];

const HomePage = () => {
  const [userName, setUserName] = useState("Student");
  const [voiceInput, setVoiceInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [overallProgress, setOverallProgress] = useState(35);
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("vidya_user_profile");
    if (userData) {
      const parsedData = JSON.parse(userData);
      if (parsedData.fullName) {
        setUserName(parsedData.fullName.split(" ")[0]);
      }
    }
  }, []);
  
  const handleVoiceInput = (text: string) => {
    setVoiceInput(text);
    // In a real app, this would be processed for commands or search
    if (text.toLowerCase().includes("search")) {
      const query = text.toLowerCase().replace("search", "").trim();
      setSearchQuery(query);
    }
  };

  return (
    <div className="page-container pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-vidya-primary to-vidya-dark text-white rounded-xl p-6 mb-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome back, {userName}!
          </h1>
          <p className="mb-6 opacity-90">
            Continue your learning journey with personalized courses and skill development
          </p>
          
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
            <Card className="bg-white/20 border-none">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Book size={20} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Active Courses</p>
                  <p className="text-xl font-semibold">3</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 border-none">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Medal size={20} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Certificates</p>
                  <p className="text-xl font-semibold">1</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 border-none">
              <CardContent className="p-4 flex items-center space-x-3">
                <div className="p-2 bg-white/20 rounded-full">
                  <Zap size={20} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Current Streak</p>
                  <p className="text-xl font-semibold">5 days</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm font-medium">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-2 bg-white/20" />
          </div>
          
          <Link to="/courses">
            <Button className="bg-white text-vidya-primary hover:bg-gray-100">
              Continue Learning
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Voice Assistant Section */}
      <section className="mb-8">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Mic className="mr-2 text-vidya-primary" size={20} />
              Voice Assistant
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Ask questions or search for courses using your voice
              </p>
              
              <VoiceInput 
                onTextCapture={handleVoiceInput} 
                placeholder="Click the microphone and say 'Search [topic]' or ask a question"
              />
              
              {voiceInput && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                  <p className="font-medium">I heard:</p>
                  <p className="text-gray-700 dark:text-gray-300">{voiceInput}</p>
                  
                  {searchQuery && (
                    <div className="mt-2">
                      <p className="font-medium">Searching for: {searchQuery}</p>
                      <Link to={`/courses?search=${encodeURIComponent(searchQuery)}`}>
                        <Button size="sm" variant="outline" className="mt-2">
                          See results
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </section>
      
      {/* Course Recommendations */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Continue Learning</h2>
          <Link to="/courses" className="text-vidya-primary hover:underline text-sm">
            View All
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </section>
      
      {/* Offline & Accessibility Features */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Learning Tools</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-vidya-light rounded-full mb-4">
                  <Globe className="text-vidya-primary" size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Offline Learning</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Download courses for offline access when you don't have internet
                </p>
                <Link to="/offline">
                  <Button variant="outline">Manage Downloads</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-vidya-light rounded-full mb-4">
                  <Star className="text-vidya-primary" size={24} />
                </div>
                <h3 className="text-lg font-medium mb-2">Skill Assessment</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Take assessments to measure your progress and get certified
                </p>
                <Link to="/assessments">
                  <Button variant="outline">Take Assessment</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
