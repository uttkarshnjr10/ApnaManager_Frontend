// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './context/SocketContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import ResetPasswordPage from './pages/public/ResetPasswordPage';
import LoginPage from './pages/public/LoginPage';
import WhyUsPage from './pages/public/WhyUsPage';
import HotelRegistrationPage from './pages/public/HotelRegistrationPage';



// Layouts & Protected Routes
import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './features/auth/ProtectedRoute';

// Shared Pages
import ProfilePage from './pages/shared/ProfilePage';
import DashboardDispatcherPage from './pages/shared/DashboardDispatcherPage';

// Hotel Pages
import GuestRegistrationPage from './pages/hotel/GuestRegistrationPage';
import GuestListPage from './pages/hotel/GuestListPage';
import ReportsPage from './pages/hotel/ReportsPage';
import SubscriptionPage from './pages/hotel/SubscriptionPage';
import SubscriptionSuccessPage from './pages/hotel/SubscriptionSuccessPage';

// Police Pages
import SearchGuestPage from './pages/police/SearchGuestPage';
import FlagsReportsPage from './pages/police/FlagsReportsPage';
import CaseReportsPage from './pages/police/CaseReportsPage';
import GuestHistoryPage from './pages/police/GuestHistoryPage';
import AnalyticsPage from './pages/police/AnalyticsPage';
import PoliceVerificationGate from './features/police/PoliceVerificationGate';

// Admin Pages
import ManageHotelsPage from './pages/admin/ManageHotelsPage';
import HotelInquiriesPage from './pages/admin/HotelInquiriesPage';
import ManagePolicePage from './pages/admin/ManagePolicePage';
import ManageStationsPage from './pages/admin/ManageStationsPage';
import RegisterUserPage from './pages/admin/RegisterUserPage';
import AccessLogsPage from './pages/admin/AccessLogsPage';
import ManageRoomsPage from './pages/hotel/ManageRoomsPage';
import WatchlistPage from './pages/admin/WatchlistPage';

function App() {
  return (
    <>
    <SocketProvider>
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={10}
        containerStyle={{ top: 18 }}
        toastOptions={{
          duration: 3800,
          className: 'apna-toast',
          style: {
            maxWidth: '460px',
          },
          success: {
            className: 'apna-toast apna-toast-success',
            iconTheme: {
              primary: '#22C55E',
              secondary: '#F8FAFC',
            },
          },
          error: {
            className: 'apna-toast apna-toast-error',
            iconTheme: {
              primary: '#EF4444',
              secondary: '#F8FAFC',
            },
          },
          loading: {
            className: 'apna-toast apna-toast-loading',
            iconTheme: {
              primary: '#3B82F6',
              secondary: '#F8FAFC',
            },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/why-us" element={<WhyUsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/hotel-registration" element={<HotelRegistrationPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedRoute />}>
          {/* Hotel Routes */}
          <Route path="/hotel" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardDispatcherPage />} />
            <Route path="register-guest" element={<GuestRegistrationPage />} />
            <Route path="guests" element={<GuestListPage />} />
            <Route path="manage-rooms" element={<ManageRoomsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="subscription-success" element={<SubscriptionSuccessPage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* Police Routes */}
          <Route path="/police" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            {/* Ungated — operational pages */}
            <Route path="dashboard" element={<DashboardDispatcherPage />} />
            <Route path="flags" element={<FlagsReportsPage />} />
            <Route path="reports" element={<CaseReportsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            {/* Gated — require live photo verification */}
            <Route path="search" element={<PoliceVerificationGate><SearchGuestPage /></PoliceVerificationGate>} />
            <Route path="guest/:guestId" element={<PoliceVerificationGate><GuestHistoryPage /></PoliceVerificationGate>} />
            <Route path="analytics" element={<PoliceVerificationGate><AnalyticsPage /></PoliceVerificationGate>} />
          </Route>

          {/* Admin Routes */}
          <Route path="/regional-admin" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardDispatcherPage />} />
            <Route path="hotels" element={<ManageHotelsPage />} />
            <Route path="inquiries" element={<HotelInquiriesPage />} />
            <Route path="police" element={<ManagePolicePage />} />
            <Route path="manage-stations" element={<ManageStationsPage />} />
            <Route path="register" element={<RegisterUserPage />} />
            <Route path="access-logs" element={<AccessLogsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="watchlist" element={<WatchlistPage />} />
          </Route>
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </SocketProvider>
    </>
  );
}

export default App;