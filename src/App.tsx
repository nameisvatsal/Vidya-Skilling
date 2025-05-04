
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { OfflineProvider } from "@/contexts/OfflineContext";
import { Toaster } from "@/components/ui/sonner";
import Layout from "@/components/Layout";

// Pages
import HomePage from "@/pages/HomePage";
import ProfilePage from "@/pages/ProfilePage";
import VidyaHubPage from "@/pages/VidyaHubPage";
import NotFoundPage from "@/pages/NotFound";
import LoginPage from "@/pages/auth/LoginPage";
import SignupPage from "@/pages/auth/SignupPage";
import UserProfileSetupPage from "@/pages/auth/UserProfileSetupPage";
import CourseCatalogPage from "@/pages/courses/CourseCatalogPage";
import CourseDetailPage from "@/pages/courses/CourseDetailPage";
import ModulePlayerPage from "@/pages/courses/ModulePlayerPage";
import CertificateViewPage from "@/pages/credentials/CertificateViewPage";
import CredentialVerifyPage from "@/pages/credentials/CredentialVerifyPage";
import MyPortfolioPage from "@/pages/credentials/MyPortfolioPage";
import ProgressDashboardPage from "@/pages/progress/ProgressDashboardPage";
import LanguageSelectorPage from "@/pages/settings/LanguageSelectorPage";
import OfflineSyncPage from "@/pages/settings/OfflineSyncPage";
import AIVideoLearningPage from "@/pages/learning/AIVideoLearningPage";
import OfflineAdvancedSettingsPage from "@/pages/settings/OfflineAdvancedSettingsPage";

function App() {
  return (
    <Router>
      <OfflineProvider>
        <AuthProvider>
          <Routes>
            {/* Auth Routes - redirect to home */}
            <Route path="/auth/*" element={<Navigate to="/" replace />} />
            
            {/* App Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="vidya-hub" element={<VidyaHubPage />} />
              {/* Add redirect from /hubs to /vidya-hub */}
              <Route path="hubs" element={<Navigate to="/vidya-hub" replace />} />
              
              {/* Course Routes */}
              <Route path="courses" element={<CourseCatalogPage />} />
              <Route path="courses/:id" element={<CourseDetailPage />} />
              <Route path="courses/:id/module/:moduleId" element={<ModulePlayerPage />} />
              
              {/* AI Video Learning Routes */}
              <Route path="ai-video-learning" element={<AIVideoLearningPage />} />
              
              {/* Credential Routes */}
              <Route path="credentials" element={<MyPortfolioPage />} />
              <Route path="credentials/verify" element={<CredentialVerifyPage />} />
              <Route path="credentials/:id" element={<CertificateViewPage />} />
              
              {/* Progress Routes */}
              <Route path="progress" element={<ProgressDashboardPage />} />
              
              {/* Settings Routes */}
              <Route path="settings/language" element={<LanguageSelectorPage />} />
              <Route path="settings/offline" element={<OfflineSyncPage />} />
              <Route path="settings/offline/advanced" element={<OfflineAdvancedSettingsPage />} />
              
              {/* Not Found */}
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
          
          <Toaster />
        </AuthProvider>
      </OfflineProvider>
    </Router>
  );
}

export default App;
