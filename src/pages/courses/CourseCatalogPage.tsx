
import { useState, useEffect } from "react";
import { Search, Filter, Mic } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CourseCard from "@/components/CourseCard";
import VoiceInput from "@/components/VoiceInput";

// Mock data
const allCourses = [
  {
    id: "1",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS, and JavaScript to build responsive websites",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Technology",
    duration: "4 weeks",
    level: "Beginner",
    language: "English",
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
  },
  {
    id: "4",
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications using React Native and Flutter",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Technology",
    duration: "6 weeks",
    level: "Intermediate",
    language: "English",
  },
  {
    id: "5",
    title: "Business Communication",
    description: "Enhance your professional communication skills for workplace success",
    image: "https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Business",
    duration: "2 weeks",
    level: "Beginner",
    language: "English",
  },
  {
    id: "6",
    title: "Basic Computer Skills",
    description: "Learn essential computer skills for daily use and workplace efficiency",
    image: "https://images.unsplash.com/photo-1587614382346-4ec70e388b28?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
    category: "Technology",
    duration: "1 week",
    level: "Beginner",
    language: "Telugu",
  },
];

const CourseCatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(allCourses);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [filters, setFilters] = useState({
    category: "",
    level: "",
    language: "",
  });

  // Log when the component mounts
  useEffect(() => {
    console.log("Course Catalog Page mounted");
  }, []);

  useEffect(() => {
    // Apply filters and search
    try {
      let result = [...allCourses];
      
      if (searchTerm) {
        result = result.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      if (filters.category) {
        result = result.filter((course) => course.category === filters.category);
      }
      
      if (filters.level) {
        result = result.filter((course) => course.level === filters.level);
      }
      
      if (filters.language) {
        result = result.filter((course) => course.language === filters.language);
      }
      
      setFilteredCourses(result);
    } catch (error) {
      console.error("Error filtering courses:", error);
      setFilteredCourses(allCourses); // Fall back to all courses
    }
  }, [searchTerm, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleVoiceInput = (text: string) => {
    setSearchTerm(text);
    setIsVoiceSearch(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      level: "",
      language: "",
    });
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Course Catalog</h1>
      
      <div className="mb-6">
        {!isVoiceSearch ? (
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search courses..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVoiceSearch(true)}
              className="border border-gray-200 dark:border-gray-800"
            >
              <Mic size={18} />
            </Button>
          </div>
        ) : (
          <VoiceInput
            onTextCapture={handleVoiceInput}
            placeholder="Speak to search for courses..."
          />
        )}
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Courses</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Select 
              value={filters.category} 
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Business">Business</SelectItem>
                <SelectItem value="Marketing">Marketing</SelectItem>
                <SelectItem value="Finance">Finance</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.level} 
              onValueChange={(value) => handleFilterChange("level", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Intermediate">Intermediate</SelectItem>
                <SelectItem value="Advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filters.language} 
              onValueChange={(value) => handleFilterChange("language", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(filters.category || filters.level || filters.language || searchTerm) && (
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                Showing {filteredCourses.length} results
                {filters.category && <span> in {filters.category}</span>}
                {filters.level && <span> at {filters.level} level</span>}
                {filters.language && <span> in {filters.language}</span>}
                {searchTerm && <span> for "{searchTerm}"</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} {...course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-xl font-medium mb-2">No courses found</p>
              <p className="text-gray-500 mb-4">Try adjusting your filters or search term</p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="popular">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.slice(0, 3).map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="new">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allCourses.slice(3, 6).map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseCatalogPage;
