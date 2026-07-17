// src/pages/shared/DashboardDispatcherPage.jsx
import { useAuth } from '../../hooks/useAuth';
import HotelDashboardPage from '../hotel/HotelDashboardPage';
import AdminDashboardPage from '../admin/AdminDashboardPage';

const DashboardDispatcherPage = () => {
  const { user } = useAuth();

  if (!user) {
    return null; // Or a loading spinner
  }

  switch (user.role) {
    case 'Hotel':
      return <HotelDashboardPage />;
    case 'Regional Admin':
      return <AdminDashboardPage />;
    default:
      return <h1>Invalid Role</h1>;
  }
};

export default DashboardDispatcherPage;