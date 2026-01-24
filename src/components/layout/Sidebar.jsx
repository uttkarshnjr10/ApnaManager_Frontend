// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// FIX 1: Default 'links' to an empty array if it's undefined
const Sidebar = ({ links = [], isCollapsed, onToggle }) => {
  const baseLinkClasses = 'flex items-center text-gray-300 rounded-lg p-3 transition-colors duration-200';
  const activeLinkClasses = 'bg-slate-700 text-white font-semibold';
  const hoverClasses = 'hover:bg-slate-700 hover:text-white hover:font-semibold';

  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-slate-800 text-white transition-all duration-300 z-50 shadow-xl ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-700 h-16">
        {!isCollapsed && <span className="text-xl font-bold text-white">✿More</span>}
        <button
          onClick={onToggle}
          className="p-2 rounded-md hover:bg-slate-700 text-gray-400 hover:text-white transition-colors"
        >
          {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto custom-scrollbar">
        <ul>
          {/* FIX 2: Safety Check (links || []) to prevent map crash */}
          {(links || []).map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `${baseLinkClasses} ${isActive ? activeLinkClasses : hoverClasses}`
                }
                title={isCollapsed ? link.label : ''}
              >
                {({ isActive }) => (
                  <>
                    <div className={`text-lg ${isActive ? 'text-indigo-400' : 'text-gray-400 group-hover:text-indigo-400'}`}>
                      {link.icon}
                    </div>
                    {!isCollapsed && <span className="ml-4 truncate">{link.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-700">
        {/* Footer content */}
      </div>
    </aside>
  );
};

export default Sidebar;