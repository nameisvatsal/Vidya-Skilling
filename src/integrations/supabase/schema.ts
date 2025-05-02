
import { Database } from './types';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type Module = Database['public']['Tables']['modules']['Row'];
export type UserCourse = Database['public']['Tables']['user_courses']['Row'];
export type Certificate = Database['public']['Tables']['certificates']['Row'];
export type VidyaHub = Database['public']['Tables']['vidya_hubs']['Row'];
export type HubSchedule = Database['public']['Tables']['hub_schedules']['Row'];
export type HubVisit = Database['public']['Tables']['hub_visits']['Row'];
export type UserProgress = Database['public']['Tables']['user_progress']['Row'];

// Helper types for joins
export type CourseWithModules = Course & {
  modules: Module[];
};

export type UserCourseWithDetails = UserCourse & {
  course: Course;
  progress: UserProgress[];
};

export type CertificateWithCourse = Certificate & {
  course: Course;
};

export type HubVisitWithHub = HubVisit & {
  hub: VidyaHub;
};

export type HubScheduleWithCourse = HubSchedule & {
  course?: Course;
};
