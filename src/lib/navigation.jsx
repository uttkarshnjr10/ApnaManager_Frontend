// src/lib/navigation.js
import {
  FaTachometerAlt, FaUsers, FaFileAlt, FaUserShield,
  FaBuilding, FaUserPlus, FaHistory, FaEnvelopeOpenText,
  FaCreditCard,FaDoorOpen,FaEye, FaChartBar
} from 'react-icons/fa';

export const navigationConfig = {
  Hotel: [
    { to: '/hotel/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/hotel/analytics', label: 'Analytics', icon: <FaChartBar /> },
    { to: '/hotel/register-guest', label: 'Register Guest', icon: <FaUserPlus /> },
    { to: '/hotel/guests', label: 'Guest List', icon: <FaUsers /> },
    { to: '/hotel/manage-rooms', label: 'Manage Rooms', icon: <FaDoorOpen /> },
    { to: '/hotel/reports', label: 'Reports', icon: <FaFileAlt /> },
    { to: '/hotel/subscription', label: 'Subscription', icon: <FaCreditCard /> },
    { to: '/hotel/profile', label: 'My Profile', icon: <FaUserShield /> },
  ],
  'Regional Admin': [
    { to: '/regional-admin/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
    { to: '/regional-admin/dashboard#watchlist-alerts', label: 'Watchlist Alerts', icon: <FaEye />, hasBadge: true },
    { to: '/regional-admin/hotels', label: 'Manage Hotels', icon: <FaBuilding /> },
    { to: '/regional-admin/inquiries', label: 'Hotel Inquiries', icon: <FaEnvelopeOpenText /> },
    { to: '/regional-admin/watchlist', label: 'Watchlist Config', icon: <FaEye /> },
    { to: '/regional-admin/register', label: 'Register User', icon: <FaUserPlus /> },
    { to: '/regional-admin/access-logs', label: 'Access Logs', icon: <FaHistory /> },
    { to: '/regional-admin/profile', label: 'My Profile', icon: <FaUserShield /> },
  ],
};