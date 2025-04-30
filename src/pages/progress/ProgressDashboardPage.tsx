
import { useState } from "react";
import { BarChart, PieChart, LineChart } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Import recharts components for data visualization
import {
  ResponsiveContainer,
  LineChart as RechartLine,
  Line,
  BarChart as RechartBar,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart as RechartPie,
  Pie,
  Cell,
} from "recharts";

// Mock data
const learningProgress = [
  { name: "Week 1", hours: 4 },
  { name: "Week 2", hours: 5 },
  { name: "Week 3", hours: 3 },
  { name: "Week 4", hours: 7 },
  { name: "Week 5", hours: 5 },
  { name: "Week 6", hours: 6 },
];

const skillDistribution = [
  { name: "Technology", value: 40 },
  { name: "Business", value: 25 },
  { name: "Marketing", value: 15 },
  { name: "Finance", value: 20 },
];

const COLORS = ["#1565C0", "#00796B", "#FF8F00", "#F44336"];

const activeCoursesData = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    progress: 45,
    lastAccessed: "2 days ago",
    nextModule: "JavaScript Basics",
    deadline: "10 days left",
  },
  {
    id: "2",
    title: "Digital Marketing Skills",
    progress: 20,
    lastAccessed: "1 week ago",
    nextModule: "Social Media Strategy",
    deadline: "15 days left",
  },
  {
    id: "3",
    title: "Financial Literacy",
    progress: 75,
    lastAccessed: "Yesterday",
    nextModule: "Investment Strategies",
    deadline: "5 days left",
  },
];

const completedCourses = [
  {
    id: "c1",
    title: "Computer Basics",
    completionDate: "15 May 2023",
    certificate: true,
  },
];

const ProgressDashboardPage = () => {
  const [timeFilter, setTimeFilter] = useState("all");
  
  return (
    <div className="page-container pb-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Learning Dashboard</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Track your progress and see your learning journey insights
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-full">
              <BarChart className="text-vidya-primary h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hours Learned</p>
              <p className="text-2xl font-bold">30</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
              <PieChart className="text-vidya-accent h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Courses Completed</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 flex items-center space-x-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
              <LineChart className="text-vidya-secondary h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Current Streak</p>
              <p className="text-2xl font-bold">5 days</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Learning Activity</CardTitle>
            <CardDescription>Hours spent learning per week</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartLine
                data={learningProgress}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="hours" 
                  stroke="#1565C0" 
                  strokeWidth={2} 
                  activeDot={{ r: 8 }} 
                />
              </RechartLine>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Skill Distribution</CardTitle>
            <CardDescription>Your skills by category</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartPie>
                <Pie
                  data={skillDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {skillDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </RechartPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Course Progress</h2>
        
        <Tabs defaultValue="active">
          <TabsList className="mb-4">
            <TabsTrigger value="active">Active Courses</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active">
            {activeCoursesData.map((course) => (
              <Card key={course.id} className="mb-4">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium">{course.title}</h3>
                    <Badge variant="outline">{course.deadline}</Badge>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground mb-4">
                    <span>Last accessed {course.lastAccessed}</span>
                    <span>Next: {course.nextModule}</span>
                  </div>
                  
                  <Button size="sm" variant="outline">Continue</Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedCourses.length > 0 ? (
              completedCourses.map((course) => (
                <Card key={course.id} className="mb-4">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{course.title}</h3>
                      <Badge className="bg-green-500">Completed</Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm text-muted-foreground mb-4">
                      <span>Completed on {course.completionDate}</span>
                      {course.certificate && (
                        <span className="text-vidya-primary">Certificate Available</span>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Review Course
                      </Button>
                      {course.certificate && (
                        <Button size="sm">View Certificate</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-muted-foreground mb-4">
                    You haven't completed any courses yet.
                  </p>
                  <Button>Browse Courses</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Skill Assessment</h2>
        
        <Card>
          <CardContent className="p-6">
            <p className="mb-4">
              Take assessments to measure your skills and get personalized recommendations for your learning journey.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Technology</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span>Proficiency</span>
                  <span>40%</span>
                </div>
                <Progress value={40} className="h-2" />
                <Button size="sm" className="mt-4">Take Assessment</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Business</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span>Proficiency</span>
                  <span>25%</span>
                </div>
                <Progress value={25} className="h-2" />
                <Button size="sm" className="mt-4">Take Assessment</Button>
              </div>
              
              <div className="border rounded-md p-4">
                <h4 className="font-medium mb-2">Marketing</h4>
                <div className="flex justify-between text-sm mb-1">
                  <span>Proficiency</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
                <Button size="sm" className="mt-4">Take Assessment</Button>
              </div>
            </div>
            
            <div className="text-center">
              <Button variant="outline">View All Skills</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProgressDashboardPage;
