// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';

const Sidebar = ({ links = [], user }) => {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-60 flex-col border-r border-slate-100 bg-white md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
        <img src="/logo.png" alt="ApnaManager" className="h-8 w-auto object-contain" />
        <span className="text-sm font-bold text-slate-900">ApnaManager</span>
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
                <span className="truncate">{link.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User info footer — logout is handled exclusively by the Navbar */}
      <div className="border-t border-slate-100 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {(user?.username || 'G').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-800">{user?.username || 'Guest'}</p>
            <p className="truncate text-xs text-slate-400">{user?.role || 'User'}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
