
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Book, ChevronDown, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useOffline } from "@/contexts/OfflineContext";
import { 
  mockCourses, 
  COURSE_CATEGORIES, 
  COURSE_LEVELS, 
  LANGUAGES 
} from "@/mocks/coursesData";

const CourseCatalogPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();
  const { isOnline } = useOffline();

  useEffect(() => {
    let result = mockCourses;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        course => 
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Apply category filter
    if (selectedCategory !== "all") {
      result = result.filter(course => course.category === selectedCategory);
    }
    
    // Apply level filter
    if (selectedLevel !== "all") {
      result = result.filter(course => course.level === selectedLevel);
    }
    
    // Apply language filter
    if (selectedLanguage !== "all") {
      result = result.filter(course => course.language === selectedLanguage);
    }
    
    setFilteredCourses(result);
  }, [searchQuery, selectedCategory, selectedLevel, selectedLanguage]);

  const handleCourseClick = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl font-bold mb-2">Course Catalog</h1>
          <p className="text-muted-foreground">
            Discover learning content optimized for all connectivity levels
          </p>
        </div>

        {/* Search and filters */}
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                placeholder="Search courses, topics, skills..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              className="flex items-center gap-2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={16} />
              Filters
              <ChevronDown size={16} className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-muted/20 animate-in fade-in duration-200">
              <div>
                <label className="text-sm font-medium mb-1 block">Category</label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {COURSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Level</label>
                <Select
                  value={selectedLevel}
                  onValueChange={setSelectedLevel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {COURSE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Language</label>
                <Select
                  value={selectedLanguage}
                  onValueChange={setSelectedLanguage}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Languages</SelectItem>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>{lang.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Course tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="offline">Offline Available</TabsTrigger>
            <TabsTrigger value="free">Free Courses</TabsTrigger>
            <TabsTrigger value="popular">Popular</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <CourseGrid 
              courses={filteredCourses} 
              onCourseClick={handleCourseClick} 
            />
          </TabsContent>
          
          <TabsContent value="offline">
            <CourseGrid 
              courses={filteredCourses.filter(course => course.availableOffline === true)} 
              onCourseClick={handleCourseClick} 
            />
          </TabsContent>
          
          <TabsContent value="free">
            <CourseGrid 
              courses={filteredCourses.filter(course => course.price === 0)} 
              onCourseClick={handleCourseClick} 
            />
          </TabsContent>
          
          <TabsContent value="popular">
            <CourseGrid 
              courses={filteredCourses.filter(course => course.isPopular === true)} 
              onCourseClick={handleCourseClick} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

interface CourseGridProps {
  courses: typeof mockCourses;
  onCourseClick: (id: string) => void;
}

const CourseGrid = ({ courses, onCourseClick }: CourseGridProps) => {
  if (courses.length === 0) {
    return (
      <div className="py-12 text-center">
        <Book size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-medium">No courses found</h3>
        <p className="text-muted-foreground">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Card 
          key={course.id} 
          className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onCourseClick(course.id)}
        >
          <div className="aspect-video relative">
            <img 
              src={course.thumbnailUrl} 
              alt={course.title} 
              className="object-cover w-full h-full"
            />
            {course.availableOffline && (
              <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                <Download size={16} />
              </div>
            )}
            {course.level && (
              <div className="absolute bottom-2 left-2">
                <Badge variant={
                  course.level === "beginner" ? "outline" :
                  course.level === "intermediate" ? "secondary" : 
                  "default"
                }>
                  {course.level}
                </Badge>
              </div>
            )}
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold line-clamp-2">{course.title}</h3>
              <div className="flex items-center gap-1 bg-yellow-100 dark:bg-yellow-900/30 px-2 py-0.5 rounded text-xs">
                ★ {course.rating}
              </div>
            </div>
            <div className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {course.description}
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="flex items-center gap-1">
                <Book size={14} />
                {course.totalModules} modules • {course.totalDuration}
              </span>
              <div>
                {course.price === 0 ? (
                  <span className="text-green-600 font-semibold">Free</span>
                ) : (
                  <div>
                    {course.discountPrice ? (
                      <>
                        <span className="text-muted-foreground line-through mr-1">₹{course.price}</span>
                        <span className="font-semibold text-vidya-primary">₹{course.discountPrice}</span>
                      </>
                    ) : (
                      <span className="font-semibold">₹{course.price}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CourseCatalogPage;
