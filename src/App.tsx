import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import UserProfileSetupPage from "./pages/auth/UserProfileSetupPage";

// Main pages
import HomePage from "./pages/HomePage";
import CourseCatalogPage from "./pages/courses/CourseCatalogPage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import ModulePlayerPage from "./pages/courses/ModulePlayerPage";
import ProgressDashboardPage from "./pages/progress/ProgressDashboardPage";

// Credential pages
import MyPortfolioPage from "./pages/credentials/MyPortfolioPage";
import CertificateViewPage from "./pages/credentials/CertificateViewPage";
import CredentialVerifyPage from "./pages/credentials/CredentialVerifyPage";

// Settings pages
import LanguageSelectorPage from "./pages/settings/LanguageSelectorPage";
import OfflineSyncPage from "./pages/settings/OfflineSyncPage";

// Other pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    // Check for user in localStorage (in a real app, this would be a proper auth check)
    const user = localStorage.getItem("vidya_user");
    if (user) {
      setIsAuthenticated(true);
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes (accessible when not authenticated) */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/signup" element={<SignupPage />} />
            <Route path="/auth/profile-setup" element={<UserProfileSetupPage />} />
            
            {/* Main app routes (with layout) */}
            <Route element={<Layout />}>
              {/* Home */}
              <Route path="/" element={<HomePage />} />
              
              {/* Course routes */}
              <Route path="/courses" element={<CourseCatalogPage />} />
              <Route path="/courses/:id" element={<CourseDetailPage />} />
              <Route path="/courses/:id/module/:moduleId" element={<ModulePlayerPage />} />
              
              {/* Progress routes */}
              <Route path="/progress" element={<ProgressDashboardPage />} />
              
              {/* Credential routes */}
              <Route path="/credentials" element={<MyPortfolioPage />} />
              <Route path="/credentials/certificate/:id" element={<CertificateViewPage />} />
              <Route path="/credentials/verify" element={<CredentialVerifyPage />} />
              
              {/* Settings routes */}
              <Route path="/languages" element={<LanguageSelectorPage />} />
              <Route path="/offline" element={<OfflineSyncPage />} />
              
              {/* Catch-all for 404s */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
