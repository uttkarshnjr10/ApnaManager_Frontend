import { Link } from 'react-router-dom';
import NotificationBell from '../ui/NotificationBell'; // Import

const Navbar = ({ username, onLogout, isPublic = false }) => {
  return (
    <header className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 text-gray-800 shadow-sm border-b border-gray-200 z-10 sticky top-0">
      <div className="container mx-auto flex justify-between items-center p-4 h-16">
        
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="ApnaManager Logo"
            className="h-9 w-auto max-h-full object-contain"
          />
        </div>

        {!isPublic && (
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* NEW: Notification Bell */}
            <NotificationBell />

            <span className="font-medium text-gray-600 hidden sm:block">
              Welcome, {username || 'Guest'}
            </span>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200"
            >
              {/* SVG Icon... */}
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;