// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Sidebar = ({ links = [], isCollapsed, onToggle }) => {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#0c111d] text-white transition-all duration-300 ease-out z-50 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-white/[0.06]">
        {!isCollapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-500/20">
              A
            </div>
            <span className="text-sm font-semibold text-white tracking-wide">ApnaManager</span>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-white/[0.06] text-gray-500 hover:text-gray-300 transition-all duration-200"
        >
          {isCollapsed ? <FaChevronRight size={12} /> : <FaChevronLeft size={12} />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {!isCollapsed && (
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest px-3 mb-3">
            Navigation
          </p>
        )}
        <ul className="space-y-0.5">
          {(links || []).map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `group relative flex items-center rounded-xl px-3 py-2.5 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
                title={isCollapsed ? link.label : ''}
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-indigo-400 to-violet-400 rounded-r-full"></div>
                    )}
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-md shadow-indigo-500/25'
                          : 'text-gray-500 group-hover:text-gray-300'
                      } ${isCollapsed ? 'mx-auto' : ''}`}
                    >
                      <span className="text-[15px]">{link.icon}</span>
                    </div>
                    {!isCollapsed && (
                      <span className={`ml-3 text-[13px] font-medium truncate ${isActive ? 'text-white' : ''}`}>
                        {link.label}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.06]">
        {!isCollapsed && (
          <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-indigo-500/10 to-violet-500/5 border border-indigo-500/10">
            <p className="text-[11px] text-gray-400">
              <span className="text-indigo-400 font-medium">Pro Tip:</span> Use keyboard shortcuts for faster navigation
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;