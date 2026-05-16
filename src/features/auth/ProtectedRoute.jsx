// src/features/auth/ProtectedRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { FaSpinner } from 'react-icons/fa';

/**
 * Role-based route guard.
 * - If no user → redirect to /login
 * - If user exists but role not in allowedRoles → redirect to their own dashboard
 * - Otherwise → render child routes
 */
const ROLE_HOME = {
  Hotel: '/hotel/dashboard',
  Police: '/police/dashboard',
  'Regional Admin': '/regional-admin/dashboard',
};

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
        <FaSpinner className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If allowedRoles is specified, enforce role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const home = ROLE_HOME[user.role] || '/';
    return <Navigate to={home} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;