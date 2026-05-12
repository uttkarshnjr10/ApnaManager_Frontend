// src/components/layout/Navbar.jsx
import NotificationBell from '../ui/NotificationBell';
import { FiLogOut } from 'react-icons/fi';

const Navbar = ({ username, onLogout, isPublic = false, userRole }) => {
  const showNotifications = userRole && userRole !== 'Hotel';

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-3 md:hidden">
          <img src="/logo.png" alt="ApnaManager Logo" className="h-8 w-auto object-contain" />
          <span className="text-sm font-bold text-slate-900">ApnaManager</span>
        </div>

        <div className="hidden md:block">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{userRole || 'Workspace'}</p>
          <p className="text-sm font-semibold text-slate-700">Operations Console</p>
        </div>

        {!isPublic && (
          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            {showNotifications && <NotificationBell />}

            <div className="hidden items-center gap-2 rounded-full border border-slate-100 bg-white px-2.5 py-1.5 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                {(username || 'G').charAt(0).toUpperCase()}
              </div>
              <span className="max-w-32 truncate text-sm font-medium text-slate-700">
                {username || 'Guest'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium text-slate-500 transition-colors duration-150 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
