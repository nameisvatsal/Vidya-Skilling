
import { book, video, code, calculator, mic, globe } from "lucide-react";

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructorName: string;
  instructorAvatar: string;
  rating: number;
  reviewCount: number;
  totalModules: number;
  totalDuration: string;
  level: "beginner" | "intermediate" | "advanced";
  tags: string[];
  price: number;
  discountPrice?: number;
  isPopular?: boolean;
  progress?: number;
  category: string;
  language: string;
  availableOffline?: boolean;
  lastUpdated: string;
}

export const COURSE_CATEGORIES = [
  "Mathematics",
  "Programming",
  "Language Learning",
  "Science",
  "Life Skills",
  "Vocational Training"
];

export const COURSE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" }
];

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "ta", label: "Tamil" },
  { value: "te", label: "Telugu" }
];

export const mockCourses: Course[] = [
  {
    id: "math-fundamentals",
    title: "Mathematics Fundamentals for Rural Students",
    description: "Learn basic mathematics concepts with practical examples from farming, local businesses, and daily life. This course is designed to be accessible with minimal data requirements and includes offline resources.",
    thumbnailUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    instructorName: "Dr. Priya Sharma",
    instructorAvatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4.8,
    reviewCount: 358,
    totalModules: 12,
    totalDuration: "15 hours",
    level: "beginner",
    tags: ["mathematics", "arithmetic", "algebra", "offline-friendly"],
    price: 0,
    category: "Mathematics",
    language: "hi",
    availableOffline: true,
    lastUpdated: "2025-03-15",
  },
  {
    id: "python-basics",
    title: "Python Programming Basics",
    description: "Introduction to Python programming with focus on practical applications. Learn to write simple programs that can help in data analysis for agriculture, small businesses, and local projects.",
    thumbnailUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935",
    instructorName: "Rajesh Kumar",
    instructorAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.6,
    reviewCount: 215,
    totalModules: 8,
    totalDuration: "10 hours",
    level: "beginner",
    tags: ["programming", "python", "data-analysis", "low-bandwidth"],
    price: 499,
    discountPrice: 299,
    category: "Programming",
    language: "en",
    lastUpdated: "2025-04-01",
  },
  {
    id: "english-conversation",
    title: "Practical English Conversation Skills",
    description: "Build your English conversation skills with audio lessons that can be downloaded for offline practice. Focus on practical scenarios like job interviews, customer service, and daily interactions.",
    thumbnailUrl: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d",
    instructorName: "Sarah Johnson",
    instructorAvatar: "https://randomuser.me/api/portraits/women/22.jpg",
    rating: 4.9,
    reviewCount: 412,
    totalModules: 15,
    totalDuration: "20 hours",
    level: "intermediate",
    tags: ["language", "english", "conversation", "job-skills", "offline-audio"],
    price: 599,
    discountPrice: 399,
    isPopular: true,
    category: "Language Learning",
    language: "en",
    availableOffline: true,
    lastUpdated: "2025-04-10",
  },
  {
    id: "sustainable-farming",
    title: "Sustainable Farming Techniques",
    description: "Learn modern sustainable farming techniques that improve crop yield while preserving resources. Includes downloadable guides and video demonstrations that work even with limited connectivity.",
    thumbnailUrl: "https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad",
    instructorName: "Dr. Arjun Patel",
    instructorAvatar: "https://randomuser.me/api/portraits/men/67.jpg",
    rating: 4.7,
    reviewCount: 189,
    totalModules: 10,
    totalDuration: "12 hours",
    level: "intermediate",
    tags: ["agriculture", "sustainability", "farming", "offline-content"],
    price: 0,
    category: "Science",
    language: "hi",
    availableOffline: true,
    lastUpdated: "2025-02-20",
  },
  {
    id: "mobile-repair",
    title: "Mobile Phone Repair Basics",
    description: "Learn to diagnose and repair common mobile phone issues. This course provides practical skills that can help create job opportunities in rural areas with growing technology adoption.",
    thumbnailUrl: "https://images.unsplash.com/photo-1563884072191-9e658b11c407",
    instructorName: "Vikram Singh",
    instructorAvatar: "https://randomuser.me/api/portraits/men/55.jpg",
    rating: 4.5,
    reviewCount: 276,
    totalModules: 8,
    totalDuration: "9 hours",
    level: "beginner",
    tags: ["vocational", "electronics", "repair", "skill-development"],
    price: 699,
    discountPrice: 499,
    category: "Vocational Training",
    language: "hi",
    lastUpdated: "2025-03-05",
  },
  {
    id: "financial-literacy",
    title: "Financial Literacy for Everyone",
    description: "Essential financial knowledge for managing personal and small business finances. Learn budgeting, savings, basic accounting, and how to access government financial schemes.",
    thumbnailUrl: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e",
    instructorName: "Lakshmi Narayan",
    instructorAvatar: "https://randomuser.me/api/portraits/women/65.jpg",
    rating: 4.8,
    reviewCount: 342,
    totalModules: 7,
    totalDuration: "8 hours",
    level: "beginner",
    tags: ["finance", "budgeting", "accounting", "government-schemes"],
    price: 399,
    isPopular: true,
    category: "Life Skills",
    language: "ta",
    availableOffline: true,
    lastUpdated: "2025-01-15",
  },
  {
    id: "web-development-basics",
    title: "Web Development Fundamentals",
    description: "Learn the basics of HTML, CSS and JavaScript to build simple websites. Special focus on developing for low-bandwidth environments and mobile-first design.",
    thumbnailUrl: "https://images.unsplash.com/photo-1587620962725-abab7fe55159",
    instructorName: "Anil Gupta",
    instructorAvatar: "https://randomuser.me/api/portraits/men/28.jpg",
    rating: 4.6,
    reviewCount: 230,
    totalModules: 12,
    totalDuration: "15 hours",
    level: "intermediate",
    tags: ["web-development", "HTML", "CSS", "JavaScript", "mobile-first"],
    price: 799,
    discountPrice: 599,
    category: "Programming",
    language: "en",
    lastUpdated: "2025-04-18",
  },
  {
    id: "digital-marketing-rural",
    title: "Digital Marketing for Rural Businesses",
    description: "Practical digital marketing strategies tailored for rural businesses with limited resources. Learn to use WhatsApp Business, Facebook, and basic SEO to grow your local business.",
    thumbnailUrl: "https://images.unsplash.com/photo-1557838923-2985c318be48",
    instructorName: "Meera Desai",
    instructorAvatar: "https://randomuser.me/api/portraits/women/33.jpg",
    rating: 4.7,
    reviewCount: 185,
    totalModules: 9,
    totalDuration: "11 hours",
    level: "beginner",
    tags: ["marketing", "digital", "social-media", "local-business"],
    price: 599,
    category: "Life Skills",
    language: "hi",
    lastUpdated: "2025-03-22",
  }
];

// Function to get courses by category
export const getCoursesByCategory = (category: string) => {
  return mockCourses.filter(course => course.category === category);
};

// Function to get popular courses
export const getPopularCourses = () => {
  return mockCourses.filter(course => course.isPopular === true);
};

// Function to get free courses
export const getFreeCourses = () => {
  return mockCourses.filter(course => course.price === 0);
};

// Function to get a course by ID
export const getCourseById = (id: string) => {
  return mockCourses.find(course => course.id === id);
};

// Function to search courses
export const searchCourses = (query: string) => {
  const lowercasedQuery = query.toLowerCase();
  return mockCourses.filter(
    course => 
      course.title.toLowerCase().includes(lowercasedQuery) ||
      course.description.toLowerCase().includes(lowercasedQuery) ||
      course.tags.some(tag => tag.toLowerCase().includes(lowercasedQuery))
  );
};
