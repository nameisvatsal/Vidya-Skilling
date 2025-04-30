
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Globe, Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type HeaderProps = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

const Header = ({ isDarkMode, toggleDarkMode }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-vidya-primary font-bold text-xl">Vidya</span>
        </Link>

        {!isMobile && (
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/courses" className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary transition-colors">
              Courses
            </Link>
            <Link to="/progress" className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary transition-colors">
              Progress
            </Link>
            <Link to="/credentials" className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary transition-colors">
              Credentials
            </Link>
          </nav>
        )}

        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-gray-700 dark:text-gray-200"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
            <Globe size={20} />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
            <Bell size={20} />
          </Button>
          
          <Link to="/profile">
            <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-200">
              <User size={20} />
            </Button>
          </Link>
          
          <Button
            variant="ghost" 
            size="icon"
            className="md:hidden text-gray-700 dark:text-gray-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && isMobile && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <Link 
              to="/courses" 
              className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Courses
            </Link>
            <Link 
              to="/progress" 
              className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Progress
            </Link>
            <Link 
              to="/credentials" 
              className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Credentials
            </Link>
            <Link 
              to="/settings" 
              className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Settings
            </Link>
            <Link 
              to="/help" 
              className="text-gray-700 dark:text-gray-200 hover:text-vidya-primary dark:hover:text-vidya-secondary py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>
          </div>
        </div>
      )}

      {/* Offline Indicator - Conditionally rendered when offline */}
      {/* <div className="offline-indicator">You are currently offline. Some features may be limited.</div> */}
    </header>
  );
};

export default Header;
