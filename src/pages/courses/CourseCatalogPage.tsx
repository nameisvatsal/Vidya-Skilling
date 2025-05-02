
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
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const CourseCatalogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);
  const [newCourses, setNewCourses] = useState<any[]>([]);
  const [isVoiceSearch, setIsVoiceSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  const [filters, setFilters] = useState({
    category: "all",
    level: "all",
    language: "all",
  });

  // Fetch courses from Supabase
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('courses')
          .select('*');
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setAllCourses(data);
          setFilteredCourses(data);
          
          // Set popular courses (could be based on enrollment count in a real app)
          const popular = [...data].sort(() => 0.5 - Math.random()).slice(0, 3);
          setPopularCourses(popular);
          
          // Set new courses (based on created_at)
          const newest = [...data].sort((a, b) => 
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          ).slice(0, 3);
          setNewCourses(newest);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({
          title: "Error",
          description: "Failed to load courses",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCourses();
  }, [toast]);

  useEffect(() => {
    // Apply filters and search
    try {
      console.log("Applying filters:", filters);
      let result = [...allCourses];
      
      if (searchTerm) {
        result = result.filter(
          (course) =>
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (course.category && course.category.toLowerCase().includes(searchTerm.toLowerCase()))
        );
      }
      
      if (filters.category && filters.category !== "all") {
        result = result.filter((course) => course.category === filters.category);
      }
      
      if (filters.level && filters.level !== "all") {
        result = result.filter((course) => course.level === filters.level);
      }
      
      console.log("Filtered courses count:", result.length);
      setFilteredCourses(result);
    } catch (error) {
      console.error("Error filtering courses:", error);
      setFilteredCourses(allCourses); // Fall back to all courses
    }
  }, [searchTerm, filters, allCourses]);

  const handleFilterChange = (key: string, value: string) => {
    console.log(`Changing filter ${key} to ${value}`);
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleVoiceInput = (text: string) => {
    setSearchTerm(text);
    setIsVoiceSearch(false);
  };

  const clearFilters = () => {
    setFilters({
      category: "all",
      level: "all",
      language: "all",
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
                <SelectItem value="all">All Categories</SelectItem>
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
                <SelectItem value="all">All Levels</SelectItem>
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
                <SelectItem value="all">All Languages</SelectItem>
                <SelectItem value="English">English</SelectItem>
                <SelectItem value="Hindi">Hindi</SelectItem>
                <SelectItem value="Tamil">Tamil</SelectItem>
                <SelectItem value="Telugu">Telugu</SelectItem>
                <SelectItem value="Kannada">Kannada</SelectItem>
                <SelectItem value="Malayalam">Malayalam</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {((filters.category !== "all") || (filters.level !== "all") || (filters.language !== "all") || searchTerm) && (
            <div className="flex justify-between items-center mb-4">
              <div className="text-sm">
                Showing {filteredCourses.length} results
                {filters.category !== "all" && <span> in {filters.category}</span>}
                {filters.level !== "all" && <span> at {filters.level} level</span>}
                {filters.language !== "all" && <span> in {filters.language}</span>}
                {searchTerm && <span> for "{searchTerm}"</span>}
              </div>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div key={item} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-64 rounded-lg"></div>
              ))}
            </div>
          ) : filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id}
                  title={course.title}
                  description={course.description || ""}
                  image={course.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                  category={course.category || "Uncategorized"}
                  duration={course.duration ? `${course.duration} weeks` : "Self-paced"}
                  level={course.level}
                  language={"English"} // Default since we don't have this field yet
                />
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
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-64 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id}
                  title={course.title}
                  description={course.description || ""}
                  image={course.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                  category={course.category || "Uncategorized"}
                  duration={course.duration ? `${course.duration} weeks` : "Self-paced"}
                  level={course.level}
                  language={"English"}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="new">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <div key={item} className="bg-gray-100 dark:bg-gray-800 animate-pulse h-64 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {newCourses.map((course) => (
                <CourseCard 
                  key={course.id} 
                  id={course.id}
                  title={course.title}
                  description={course.description || ""}
                  image={course.thumbnail_url || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                  category={course.category || "Uncategorized"}
                  duration={course.duration ? `${course.duration} weeks` : "Self-paced"}
                  level={course.level}
                  language={"English"}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CourseCatalogPage;
