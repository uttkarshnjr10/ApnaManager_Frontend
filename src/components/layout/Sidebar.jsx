import { NavLink } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';

const Sidebar = ({ links = [], user }) => {
  const [alertCount, setAlertCount] = useState(0);

  useEffect(() => {
    if (user?.role === 'Regional Admin') {
      const fetchAlertsCount = async () => {
        try {
          const { data } = await apiClient.get('/watchlist/alerts');
          if (data?.data) {
            setAlertCount(data.data.length);
          }
        } catch (error) {
          console.error('Failed to fetch watchlist alerts count');
        }
      };
      fetchAlertsCount();
      // Optionally poll or listen to socket here if needed, but fetch on mount is fine for Sidebar.
    }
  }, [user]);

  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-slate-100 bg-white md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
        <img src="/logo.png" alt="ApnaManager" className="h-8 w-auto object-contain" />
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-5">
        <ul className="space-y-1">
          {(links || []).map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm transition-colors duration-150 ${
                    isActive
                      ? 'bg-blue-50 font-medium text-blue-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center text-base">{link.icon}</span>
                <span className="truncate flex-1">{link.label}</span>
                {link.hasBadge && alertCount > 0 && (
                  <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white animate-pulse">
                    {alertCount}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
