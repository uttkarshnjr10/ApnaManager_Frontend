import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { usePoliceDashboard } from '../../features/police/usePoliceDashboard';
import { useSocket } from '../../context/SocketContext';
import StatCard from '../../components/ui/StatCard';
import Button from '../../components/ui/Button';
import { FaUsers, FaBuilding, FaExclamationTriangle, FaUser, FaRegClock } from 'react-icons/fa';
import DashboardWidget from '../../components/Dashboard/DashboardWidget';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const RecentAlertsPanel = ({ alerts, loading }) => {
  if (loading) {
    return <p className="text-gray-500">Loading alerts...</p>;
  }
  if (alerts.length === 0) {
    return <p className="text-gray-500">No active alerts.</p>;
  }
  return (
    <div className="space-y-3">
      {alerts.map(alert => (
        <div key={alert._id} className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
          <p className="font-semibold text-yellow-800 flex justify-between items-center">
            <span>{alert.guest?.primaryGuest?.name || 'Unknown Guest'}</span>
            <span className="text-xs font-normal text-yellow-700 flex items-center gap-1">
              <FaRegClock /> {new Date(alert.createdAt).toLocaleDateString()}
            </span>
          </p>
          <p className="text-sm text-yellow-700 flex items-center gap-1 mt-1">
            <FaUser className="text-xs" /> Flagged by: {alert.createdBy?.username || 'Unknown'}
          </p>
        </div>
      ))}
    </div>
  );
};

const PoliceDashboardPage = () => {
  const { stats, loading, error, setStats } = usePoliceDashboard();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleLiveAlert = (data) => {
      setStats(prevStats => ({
        ...prevStats,
        alerts: [data.alert, ...prevStats.alerts].slice(0, 5)
      }));
    };

    socket.on('NEW_ALERT', handleLiveAlert);

    return () => {
      socket.off('NEW_ALERT', handleLiveAlert);
    };
  }, [socket, setStats]);

  if (error) {
    return <p className="text-red-600 font-semibold">{error}</p>;
  }

  return (
    <div className="space-y-8">

      {/* Widget with fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <DashboardWidget />
      </motion.div>

      <h1 className="text-3xl font-bold text-gray-800">Police Dashboard</h1>

      {/* Stat Cards — Stagger animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Guests Registered Today"
            value={stats.guestsToday}
            icon={<FaUsers size={24} />}
            isLoading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Registered Hotels"
            value={stats.totalHotels}
            icon={<FaBuilding size={24} />}
            isLoading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Active Alerts"
            value={stats.alerts.length}
            icon={<FaExclamationTriangle size={24} />}
            isLoading={loading}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8"
      >
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/police/search" className="w-full">
              <Button className="w-full">Search for a Guest</Button>
            </Link>
            <Link to="/police/flags" className="w-full">
              <Button variant="secondary" className="w-full">View Flags & Alerts</Button>
            </Link>
          </div>
        </section>

        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Active Alerts</h2>
          <RecentAlertsPanel alerts={stats.alerts} loading={loading} />
        </section>
      </motion.div>
    </div>
  );
};

export default PoliceDashboardPage;