// src/components/layout/BottomNav.jsx
import { useMemo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FaEllipsisH } from 'react-icons/fa';

const BottomNav = ({ links = [], role }) => {
  const [moreOpen, setMoreOpen] = useState(false);
  const location = useLocation();

  const { primaryLinks, overflowLinks } = useMemo(() => {
    if (role === 'Hotel') {
      const preferred = ['/hotel/dashboard', '/hotel/register-guest', '/hotel/guests', '/hotel/manage-rooms'];
      const primary = preferred.map((path) => links.find((link) => link.to === path)).filter(Boolean);
      const overflow = links.filter((link) => !preferred.includes(link.to));
      return { primaryLinks: primary, overflowLinks: overflow };
    }

    return {
      primaryLinks: links.slice(0, 4),
      overflowLinks: links.slice(4),
    };
  }, [links, role]);

  if (location.pathname === '/hotel/register-guest') {
    return null;
  }

  const isOverflowActive = overflowLinks.some((link) => location.pathname === link.to);

  return (
    <>
      {moreOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/30 md:hidden"
          aria-label="Close more navigation"
          onClick={() => setMoreOpen(false)}
        />
      )}

      {moreOpen && overflowLinks.length > 0 && (
        <div className="fixed bottom-20 left-3 right-3 z-50 rounded-2xl border border-slate-100 bg-white p-2 shadow-lg md:hidden">
          <div className="grid grid-cols-2 gap-1">
            {overflowLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMoreOpen(false)}
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <span className="text-base">{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-100 bg-white px-2 pb-[env(safe-area-inset-bottom)] shadow-sm md:hidden">
        <div className="flex h-16 items-center justify-around">
          {primaryLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400'
                }`
              }
            >
              <span className="text-xl">{link.icon}</span>
              <span>{link.label.replace('Register Guest', 'Register').replace('Guest List', 'Guests').replace('Manage Rooms', 'Rooms')}</span>
            </NavLink>
          ))}

          {overflowLinks.length > 0 && (
            <button
              type="button"
              onClick={() => setMoreOpen((open) => !open)}
              className={`flex flex-1 flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium transition-colors ${
                isOverflowActive || moreOpen ? 'text-blue-600' : 'text-slate-400'
              }`}
            >
              <FaEllipsisH className="text-xl" />
              <span>More</span>
            </button>
          )}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
