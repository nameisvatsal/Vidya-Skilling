
import { useState, useEffect } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OfflineNotification from '@/components/OfflineNotification';
import { useAuth } from '@/contexts/AuthContext';

const Layout = () => {
  const { user, isLoading } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const location = useLocation();

  // Check if user is online or offline
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOffline(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    // Initial check
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);

  // Check user preference for dark mode
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }

    // Listen for changes to color scheme preference
    const matcher = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = ({ matches }: { matches: boolean }) => setIsDarkMode(matches);
    matcher.addEventListener('change', onChange);

    return () => {
      matcher.removeEventListener('change', onChange);
    };
  }, []);

  // Apply dark mode class to body
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Show loading state
  if (isLoading) {
    console.log("Layout: Loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
            <div className="w-2 h-2 bg-gray-400 dark:bg-gray-600 rounded-full"></div>
          </div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    console.log('Layout: User not authenticated, redirecting to login', {pathname: location.pathname});
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // For profile not completed, redirect to profile setup only if not already there
  if (user && !user.profileCompleted && location.pathname !== "/auth/profile-setup") {
    console.log('Layout: Profile not complete, redirecting to profile setup');
    return <Navigate to="/auth/profile-setup" replace />;
  }

  console.log('Layout: Rendering main layout', {user});
  return (
    <div className="flex flex-col min-h-screen">
      {isOffline && <OfflineNotification />}
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
