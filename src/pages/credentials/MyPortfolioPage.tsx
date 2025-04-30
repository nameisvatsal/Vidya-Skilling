
import { useState } from "react";
import { Link } from "react-router-dom";
import { Award, FileText, ExternalLink, Star, ChevronRight, PenTool } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Mock data
const certificates = [
  {
    id: "cert1",
    title: "Web Development Fundamentals",
    issueDate: "June 15, 2023",
    credentialId: "VID-WD-2023-12345",
    issuer: "Vidya Learning",
    image: "https://placehold.co/800x600?text=Certificate",
  },
];

const skills = [
  { name: "HTML5", level: 80, projects: 3 },
  { name: "CSS3", level: 75, projects: 3 },
  { name: "JavaScript", level: 65, projects: 2 },
  { name: "React", level: 40, projects: 1 },
  { name: "Node.js", level: 30, projects: 1 },
  { name: "Web Design", level: 60, projects: 2 },
  { name: "UI/UX", level: 50, projects: 1 },
];

const projects = [
  {
    id: "p1",
    title: "Personal Portfolio Website",
    description: "A responsive personal portfolio website built with HTML, CSS and JavaScript",
    skills: ["HTML5", "CSS3", "JavaScript", "Responsive Design"],
    image: "https://placehold.co/600x400?text=Project",
    url: "#",
    courseId: "1",
  },
];

const MyPortfolioPage = () => {
  const [profileData, setProfileData] = useState({
    name: "John Doe",
    bio: "Aspiring web developer learning with Vidya",
    location: "Mumbai, India",
  });
  
  // Group skills by proficiency level
  const groupedSkills = {
    advanced: skills.filter((skill) => skill.level >= 80),
    intermediate: skills.filter((skill) => skill.level >= 60 && skill.level < 80),
    beginner: skills.filter((skill) => skill.level < 60),
  };
  
  return (
    <div className="page-container pb-12">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">My Portfolio</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Showcase your skills, certificates, and projects
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Tabs defaultValue="skills">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="skills">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-vidya-secondary" />
                    Skills & Competencies
                  </CardTitle>
                  <CardDescription>
                    Based on your courses, assessments, and project work
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-6">
                    {Object.keys(groupedSkills).map((group) => {
                      const skillsInGroup = groupedSkills[group as keyof typeof groupedSkills];
                      if (skillsInGroup.length === 0) return null;
                      
                      return (
                        <div key={group} className="space-y-4">
                          <h3 className="font-medium capitalize">
                            {group} Level Skills
                            <Badge variant="outline" className="ml-2">
                              {skillsInGroup.length}
                            </Badge>
                          </h3>
                          
                          {skillsInGroup.map((skill) => (
                            <div key={skill.name} className="space-y-1">
                              <div className="flex justify-between">
                                <span>{skill.name}</span>
                                <span className="text-sm text-gray-500">
                                  {skill.level}%
                                </span>
                              </div>
                              <Progress value={skill.level} className="h-2" />
                              <div className="text-xs text-gray-500">
                                Applied in {skill.projects} project{skill.projects !== 1 ? 's' : ''}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                    
                    {skills.length === 0 && (
                      <div className="text-center py-8">
                        <Star className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                        <p className="text-gray-500">No skills added yet</p>
                        <p className="text-sm text-gray-400 mb-4">
                          Complete courses and assessments to build your skill profile
                        </p>
                        <Link to="/courses">
                          <Button>Browse Courses</Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
                
                <CardFooter className="border-t pt-6 flex justify-between">
                  <p className="text-sm text-gray-500">
                    Skills are assessed based on your course completion and project work
                  </p>
                  <Link to="/progress">
                    <Button variant="outline">View Assessment History</Button>
                  </Link>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="certificates">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-vidya-secondary" />
                    Certificates & Credentials
                  </CardTitle>
                  <CardDescription>
                    Your earned certificates and blockchain-verified credentials
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {certificates.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {certificates.map((cert) => (
                        <Link to={`/credentials/certificate/${cert.id}`} key={cert.id}>
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <div className="aspect-[4/3] overflow-hidden">
                              <img 
                                src={cert.image} 
                                alt={cert.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-medium mb-1">{cert.title}</h3>
                              <div className="text-sm text-gray-500 space-y-1">
                                <p>Issued: {cert.issueDate}</p>
                                <p>By: {cert.issuer}</p>
                              </div>
                              <div className="mt-2 flex items-center text-vidya-primary text-sm">
                                <span>View Certificate</span>
                                <ChevronRight size={16} />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No certificates earned yet</p>
                      <p className="text-sm text-gray-400 mb-4">
                        Complete courses to earn certificates
                      </p>
                      <Link to="/courses">
                        <Button>Browse Courses</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="border-t pt-6">
                  <div className="w-full">
                    <p className="text-sm text-gray-500 mb-4">
                      All certificates are blockchain-verified and can be shared with employers
                    </p>
                    <div className="flex justify-end">
                      <Link to="/credentials/verify">
                        <Button variant="outline">Verify a Certificate</Button>
                      </Link>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="projects">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-vidya-secondary" />
                    Portfolio Projects
                  </CardTitle>
                  <CardDescription>
                    Projects you've completed through courses and personal work
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  {projects.length > 0 ? (
                    <div className="space-y-6">
                      {projects.map((project) => (
                        <div key={project.id} className="border rounded-lg overflow-hidden">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div className="p-4">
                            <h3 className="font-medium text-lg mb-2">{project.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                              {project.description}
                            </p>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              {project.skills.map((skill) => (
                                <Badge key={skill} variant="outline">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="flex gap-2">
                              {project.url && (
                                <Button size="sm" className="flex items-center gap-1">
                                  <ExternalLink size={14} />
                                  View Project
                                </Button>
                              )}
                              
                              {project.courseId && (
                                <Link to={`/courses/${project.courseId}`}>
                                  <Button size="sm" variant="outline">
                                    View Related Course
                                  </Button>
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <PenTool className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-gray-500">No projects added yet</p>
                      <p className="text-sm text-gray-400 mb-4">
                        Complete course projects to build your portfolio
                      </p>
                      <Link to="/courses">
                        <Button>Browse Courses</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="border-t pt-6 flex justify-between">
                  <p className="text-sm text-gray-500">
                    Projects showcase your practical skills to potential employers
                  </p>
                  <Button variant="outline">Add External Project</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 bg-vidya-primary text-white rounded-full flex items-center justify-center text-2xl font-semibold">
                  {profileData.name.split(" ").map(n => n[0]).join("")}
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-center mb-1">
                  {profileData.name}
                </h3>
                <p className="text-gray-500 text-center">{profileData.location}</p>
              </div>
              
              <div className="pt-4 border-t">
                <p>{profileData.bio}</p>
              </div>
              
              <div className="pt-4">
                <Link to="/profile/edit">
                  <Button variant="outline" className="w-full">
                    Edit Profile
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Share Portfolio</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Create a public link to share your skills, certificates, and projects with employers
              </p>
              
              <Button className="w-full">
                Generate Public Link
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Portfolio Export</CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText size={16} />
                <span>Export your portfolio as a PDF resume</span>
              </div>
              
              <Button variant="outline" className="w-full">
                Export as PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MyPortfolioPage;
