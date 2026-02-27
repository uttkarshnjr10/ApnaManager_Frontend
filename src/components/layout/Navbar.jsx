import { Link } from 'react-router-dom';
import NotificationBell from '../ui/NotificationBell';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ username, onLogout, isPublic = false, userRole }) => {
  const showNotifications = userRole && userRole !== 'Hotel';

  return (
    <header className="bg-white/80 backdrop-blur-xl text-gray-800 border-b border-gray-100/80 z-10 sticky top-0">
      <div className="flex justify-between items-center px-6 h-14">
        
        <div className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="ApnaManager Logo"
            className="h-8 w-auto object-contain"
          />
        </div>

        {!isPublic && (
          <div className="flex items-center gap-4">
            {showNotifications && <NotificationBell />}

            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shadow-indigo-500/20">
                {(username || 'G').charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700">
                {username || 'Guest'}
              </span>
            </div>

            <div className="h-5 w-px bg-gray-200 hidden sm:block"></div>

            <button
              onClick={onLogout}
              className="flex items-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            >
              <FiLogOut size={15} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;