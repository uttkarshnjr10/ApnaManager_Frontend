// src/components/layout/AppLayout.jsx
import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { navigationConfig } from '../../lib/navigation.jsx';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const AppLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  // FIX: Robust Check
  // 1. Check if user exists
  // 2. Check if user.role exists
  // 3. Check if navigationConfig has that role
  // 4. Fallback to [] (Empty Array) instead of undefined
  const links = (user && user.role && navigationConfig[user.role]) 
    ? navigationConfig[user.role] 
    : [];

  // Debugging: If links are empty, check the console
  if (user && links.length === 0) {
    console.warn(`No navigation links found for role: "${user.role}". Check navigationConfig keys.`);
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-poppins">
      <Sidebar
        links={links}
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
      />
      
      <div 
        className="flex-1 flex flex-col overflow-hidden transition-all duration-300" 
        style={{ marginLeft: isCollapsed ? '80px' : '256px' }}
      >
        <Navbar username={user.username} onLogout={handleLogout} />

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 relative">
           {/* Added relative positioning for children */}
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;