
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import { AuthProvider } from "./contexts/AuthContext";

// Auth pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import UserProfileSetupPage from "./pages/auth/UserProfileSetupPage";

// Main pages
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import CourseCatalogPage from "./pages/courses/CourseCatalogPage";
import CourseDetailPage from "./pages/courses/CourseDetailPage";
import ModulePlayerPage from "./pages/courses/ModulePlayerPage";
import ProgressDashboardPage from "./pages/progress/ProgressDashboardPage";
import VidyaHubPage from "./pages/VidyaHubPage";

// Credential pages
import MyPortfolioPage from "./pages/credentials/MyPortfolioPage";
import CertificateViewPage from "./pages/credentials/CertificateViewPage";
import CredentialVerifyPage from "./pages/credentials/CredentialVerifyPage";

// Settings pages
import LanguageSelectorPage from "./pages/settings/LanguageSelectorPage";
import OfflineSyncPage from "./pages/settings/OfflineSyncPage";

// Other pages
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem("vidya_user");
  
  if (!storedUser) {
    return <Navigate to="/auth/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth route component (redirects if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const storedUser = localStorage.getItem("vidya_user");
  
  if (storedUser) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Landing page */}
              <Route path="/welcome" element={<Index />} />
              
              {/* Auth routes (accessible when not authenticated) */}
              <Route path="/auth/login" element={
                <AuthRoute>
                  <LoginPage />
                </AuthRoute>
              } />
              <Route path="/auth/signup" element={
                <AuthRoute>
                  <SignupPage />
                </AuthRoute>
              } />
              <Route path="/auth/profile-setup" element={
                <ProtectedRoute>
                  <UserProfileSetupPage />
                </ProtectedRoute>
              } />
              
              {/* Main app routes (with layout) */}
              <Route element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                {/* Home */}
                <Route path="/" element={<HomePage />} />
                
                {/* Profile */}
                <Route path="/profile" element={<ProfilePage />} />
                
                {/* Course routes */}
                <Route path="/courses" element={<CourseCatalogPage />} />
                <Route path="/courses/:id" element={<CourseDetailPage />} />
                <Route path="/courses/:id/module/:moduleId" element={<ModulePlayerPage />} />
                
                {/* Vidya Hub route */}
                <Route path="/hubs" element={<VidyaHubPage />} />
                
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
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
