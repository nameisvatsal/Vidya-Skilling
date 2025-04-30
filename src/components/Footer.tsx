
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4 text-vidya-primary">Vidya</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              An AI-powered skilling platform for rural and underserved youth in India.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Platform</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/courses" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Courses
                </Link>
              </li>
              <li>
                <Link to="/offline" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Offline Mode
                </Link>
              </li>
              <li>
                <Link to="/languages" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Languages
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Help</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 text-gray-800 dark:text-gray-200">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-vidya-primary dark:hover:text-vidya-secondary text-sm">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>&copy; {new Date().getFullYear()} Vidya. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
