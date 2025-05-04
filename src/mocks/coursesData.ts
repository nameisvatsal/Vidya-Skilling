
import { Book, Video, Code, Calculator, Mic, Globe } from "lucide-react";

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
  videoSummary?: string;
  videoQuiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  }[];
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
    videoSummary: "This introductory video explains the core mathematical concepts with practical examples relevant to rural contexts. The instructor uses visual aids to demonstrate how mathematics applies to farming calculations, market pricing, and budget management.",
    videoQuiz: [
      {
        question: "If a farmer has 25 acres and plants 40% with wheat, how many acres are planted with wheat?",
        options: ["5 acres", "10 acres", "15 acres", "20 acres"],
        correctAnswer: 1
      },
      {
        question: "If a local shop buys products at ₹80 and sells them at ₹100, what is the percentage profit?",
        options: ["20%", "25%", "80%", "100%"],
        correctAnswer: 0
      }
    ]
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
    videoSummary: "This lesson introduces Python's basic syntax and how to install Python with minimal resources. The instructor demonstrates how to write a simple program that can calculate crop yields based on rainfall data, which can be useful for local farmers.",
    videoQuiz: [
      {
        question: "What symbol is used for comments in Python?",
        options: ["//", "/* */", "#", "<!-- -->"],
        correctAnswer: 2
      },
      {
        question: "Which of these is a correct variable assignment in Python?",
        options: ["variable = 10;", "var variable = 10;", "variable := 10", "variable = 10"],
        correctAnswer: 3
      }
    ]
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
    videoSummary: "This lesson focuses on common English phrases used in job interviews. The instructor provides clear pronunciation guides and explains the cultural context behind each phrase, which is essential for successful interviews with multinational companies.",
    videoQuiz: [
      {
        question: "What is an appropriate response to 'How are you?'",
        options: ["Yes, I am.", "I'm fine, thank you. And you?", "Thank you very much.", "You're welcome."],
        correctAnswer: 1
      },
      {
        question: "Which phrase is best to use when asking about job responsibilities?",
        options: ["What do you work?", "How is the job?", "Could you describe the day-to-day responsibilities?", "Tell me about work."],
        correctAnswer: 2
      }
    ]
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
    videoSummary: "This video demonstrates water conservation techniques for small-scale farms. The instructor shows how to set up simple irrigation systems using locally available materials that can reduce water usage by up to 60% while maintaining crop health.",
    videoQuiz: [
      {
        question: "Which irrigation technique uses the least amount of water?",
        options: ["Flood irrigation", "Drip irrigation", "Sprinkler system", "Channel irrigation"],
        correctAnswer: 1
      },
      {
        question: "What is a good companion plant for pest control in vegetable gardens?",
        options: ["More vegetables", "Marigolds", "Palm trees", "Eucalyptus"],
        correctAnswer: 1
      }
    ]
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
    videoSummary: "This lesson covers essential tools needed for mobile phone repair. The instructor explains how to safely open different phone models and identify common issues like damaged screens, battery problems, and charging port failures.",
    videoQuiz: [
      {
        question: "What tool should you use to safely open a smartphone?",
        options: ["Regular screwdriver", "Hammer", "Plastic pry tool", "Scissors"],
        correctAnswer: 2
      },
      {
        question: "What precaution should you take before opening a phone?",
        options: ["Turn up the volume", "Power off and remove the battery if possible", "Charge it fully", "Update the software"],
        correctAnswer: 1
      }
    ]
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
    videoSummary: "This video explains the basics of creating a household budget. The instructor provides simple templates that can be used with pen and paper, making it accessible for those without regular computer access. The lesson includes practical tips for reducing expenses.",
    videoQuiz: [
      {
        question: "What should you track first when creating a budget?",
        options: ["Your wishes", "Your income", "Your neighbor's income", "The national GDP"],
        correctAnswer: 1
      },
      {
        question: "Which of these is not a recommended saving method discussed in the video?",
        options: ["Post office savings", "Self-help group savings", "Keeping cash under your mattress", "Bank recurring deposits"],
        correctAnswer: 2
      }
    ]
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
    videoSummary: "This video teaches the fundamentals of HTML structure. The instructor shows how to create a basic webpage that works well on mobile devices with minimal data usage. The lesson includes practical examples of optimizing images for low bandwidth environments.",
    videoQuiz: [
      {
        question: "Which HTML tag is used for the main heading of a webpage?",
        options: ["<header>", "<h1>", "<main>", "<title>"],
        correctAnswer: 1
      },
      {
        question: "What CSS property is used to make a website responsive to different screen sizes?",
        options: ["responsive-design", "screen-fit", "media queries", "auto-adjust"],
        correctAnswer: 2
      }
    ]
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
    videoSummary: "This video shows how to set up and optimize a WhatsApp Business account. The instructor demonstrates how local businesses can create catalogs, automated responses, and business profiles to reach more customers in their area even with limited internet connectivity.",
    videoQuiz: [
      {
        question: "What feature of WhatsApp Business allows you to sort customer messages?",
        options: ["Broadcast Lists", "Labels", "Status Updates", "Group Chats"],
        correctAnswer: 1
      },
      {
        question: "What is the maximum number of contacts you can message at once with a broadcast list?",
        options: ["50", "100", "256", "Unlimited"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "organic-gardening",
    title: "Organic Home Gardening",
    description: "Learn how to grow your own vegetables and herbs using organic methods. This course covers everything from soil preparation to pest management without chemicals.",
    thumbnailUrl: "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e",
    instructorName: "Anita Reddy",
    instructorAvatar: "https://randomuser.me/api/portraits/women/28.jpg",
    rating: 4.9,
    reviewCount: 234,
    totalModules: 8,
    totalDuration: "9 hours",
    level: "beginner",
    tags: ["gardening", "organic", "sustainability", "food-production"],
    price: 399,
    discountPrice: 249,
    category: "Science",
    language: "ta",
    availableOffline: true,
    lastUpdated: "2025-04-05",
    videoSummary: "This video demonstrates how to create rich compost using kitchen waste. The instructor shows different composting methods suitable for various living situations, from small apartments to larger gardens, helping learners produce their own organic fertilizer.",
    videoQuiz: [
      {
        question: "Which of these should NOT be added to a compost pile?",
        options: ["Vegetable peels", "Eggshells", "Dairy products", "Dry leaves"],
        correctAnswer: 2
      },
      {
        question: "How often should you turn your compost pile?",
        options: ["Daily", "Weekly", "Monthly", "Never"],
        correctAnswer: 1
      }
    ]
  },
  {
    id: "basic-healthcare",
    title: "Basic Healthcare and First Aid",
    description: "Essential knowledge about preventive healthcare, first aid, and managing common illnesses. Learn when to treat at home and when to seek professional medical help.",
    thumbnailUrl: "https://images.unsplash.com/photo-1576091160550-2173dba999ef",
    instructorName: "Dr. Samantha Patel",
    instructorAvatar: "https://randomuser.me/api/portraits/women/54.jpg",
    rating: 4.8,
    reviewCount: 312,
    totalModules: 10,
    totalDuration: "12 hours",
    level: "beginner",
    tags: ["healthcare", "first-aid", "emergency-response", "well-being"],
    price: 0,
    category: "Life Skills",
    language: "hi",
    availableOffline: true,
    isPopular: true,
    lastUpdated: "2025-03-10",
    videoSummary: "This video explains the essential steps for treating common injuries like cuts, burns, and sprains. The instructor demonstrates proper wound cleaning techniques and bandaging methods using materials commonly available in rural households.",
    videoQuiz: [
      {
        question: "What is the first step when treating a minor burn?",
        options: ["Apply ice directly to the burn", "Apply butter or oil", "Run cool (not cold) water over the burn", "Cover with a tight bandage"],
        correctAnswer: 2
      },
      {
        question: "When should you seek immediate medical help for a wound?",
        options: ["If it's longer than 1 cm", "If it's on a finger", "If bleeding doesn't stop after applying pressure for 15 minutes", "All minor wounds need doctor's attention"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "local-handicrafts",
    title: "Traditional Handicrafts: Preserving Cultural Heritage",
    description: "Learn traditional crafting techniques with modern applications. This course helps preserve cultural heritage while creating income opportunities through handicraft production.",
    thumbnailUrl: "https://images.unsplash.com/photo-1606722590583-6951b5ea92ad",
    instructorName: "Kavita Sharma",
    instructorAvatar: "https://randomuser.me/api/portraits/women/75.jpg",
    rating: 4.7,
    reviewCount: 178,
    totalModules: 12,
    totalDuration: "14 hours",
    level: "intermediate",
    tags: ["handicrafts", "cultural-heritage", "entrepreneurship", "skill-development"],
    price: 499,
    discountPrice: 349,
    category: "Vocational Training",
    language: "hi",
    lastUpdated: "2025-02-22",
    videoSummary: "This lesson demonstrates traditional embroidery techniques from rural India. The instructor shows step-by-step how to create popular patterns that can be applied to products that appeal to urban markets, helping artisans earn fair income for their skills.",
    videoQuiz: [
      {
        question: "Which stitch is traditionally used in Kantha embroidery?",
        options: ["Cross stitch", "Running stitch", "Chain stitch", "Blanket stitch"],
        correctAnswer: 1
      },
      {
        question: "What natural material is commonly used to dye fabrics red?",
        options: ["Turmeric", "Indigo", "Madder root", "Lemon"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "renewable-energy-basics",
    title: "Renewable Energy Solutions for Rural Areas",
    description: "Practical guide to small-scale renewable energy implementation. Learn about solar, biogas, and other sustainable energy options suitable for rural settings.",
    thumbnailUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276",
    instructorName: "Dr. Mohan Rao",
    instructorAvatar: "https://randomuser.me/api/portraits/men/62.jpg",
    rating: 4.6,
    reviewCount: 203,
    totalModules: 9,
    totalDuration: "11 hours",
    level: "intermediate",
    tags: ["renewable-energy", "solar", "biogas", "sustainability"],
    price: 599,
    discountPrice: 399,
    category: "Science",
    language: "te",
    lastUpdated: "2025-01-30",
    videoSummary: "This video explains how to set up a small solar power system for a rural home. The instructor covers panel selection, battery storage options, and basic maintenance, with special focus on affordable solutions that can provide lighting and mobile phone charging.",
    videoQuiz: [
      {
        question: "What component stores energy in a basic solar power system?",
        options: ["Inverter", "Battery", "Solar panel", "Charge controller"],
        correctAnswer: 1
      },
      {
        question: "How should solar panels be positioned in the northern hemisphere?",
        options: ["Facing north", "Facing south", "Facing east", "Facing west"],
        correctAnswer: 1
      }
    ]
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
