// src/components/layout/AppLayout.jsx
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { navigationConfig } from '../../lib/navigation.jsx';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const links = user?.role && navigationConfig[user.role] ? navigationConfig[user.role] : [];

  if (user && links.length === 0) {
    console.warn(`No navigation links found for role: "${user.role}". Check navigationConfig keys.`);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-poppins text-slate-900">
      <Sidebar links={links} user={user} />

      <div className="min-h-screen md:pl-60">
        <Navbar username={user.username} userRole={user.role} onLogout={handleLogout} />

        <main className="min-h-[calc(100vh-4rem)] overflow-x-hidden bg-slate-50 pb-24 md:pb-8">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 md:gap-8 md:px-8 md:py-7">
            <Outlet />
          </div>
        </main>
      </div>

      <BottomNav links={links} role={user.role} />
    </div>
  );
};

export default AppLayout;
