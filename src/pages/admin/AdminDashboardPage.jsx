import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdminDashboard } from '../../features/admin/useAdminDashboard';
import MetricCard from '../../components/ui/MetricCard';
import Button from '../../components/ui/Button';
import { FaHotel, FaUserShield, FaUsers, FaSearch, FaHistory } from 'react-icons/fa';
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

const AdminDashboardPage = () => {
  const { data, loading, error } = useAdminDashboard();
  const navigate = useNavigate();

  // Safe access to metrics with fallback to avoid crashes if data is undefined
  const metrics = data?.metrics || {};

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">

      {/* AI & Weather Widget Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <DashboardWidget />
      </motion.section>

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Regional Admin Dashboard</h1>
      </div>

      {/* Metrics Grid — Stagger animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Registered Hotels"
            value={metrics.hotels || 0}
            icon={<FaHotel size={32} />}
            isLoading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Police Users"
            value={metrics.police || 0}
            icon={<FaUserShield size={32} />}
            isLoading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Guests Registered Today"
            value={metrics.guestsToday || 0}
            icon={<FaUsers size={32} />}
            isLoading={loading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            label="Police Searches Today"
            value={metrics.searchesToday || 0}
            icon={<FaSearch size={32} />}
            isLoading={loading}
          />
        </motion.div>
      </motion.div>

      {/* Lower Section: Actions & Feed */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start"
      >

        {/* Quick Actions Panel */}
        <section className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 transition-all duration-300 hover:shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Quick Actions</h2>
            <Button onClick={() => navigate('/regional-admin/register')}>
              + Register New User
            </Button>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Manage your users and system settings from one place. Use the sidebar to navigate to specific management pages for Hotels, Police Stations, or Reports.
          </p>
        </section>

        {/* Live Activity Feed */}
        <aside className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FaHistory className="text-indigo-600" />
            Live Activity Feed
          </h3>
          <ul className="space-y-4 text-gray-700 text-sm max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="h-10 bg-gray-100 rounded animate-pulse"></li>
              ))
            ) : Array.isArray(data?.feed) && data.feed.length > 0 ? (
              data.feed.map((event, i) => (
                <li key={i} className="border-l-4 border-blue-500 pl-3 py-1">
                  <p className="font-medium text-gray-800">{event.action}</p>
                  <span className="text-xs text-gray-500">{event.time}</span>
                </li>
              ))
            ) : (
              <li className="text-gray-500 italic">No recent activity recorded.</li>
            )}
          </ul>
        </aside>
      </motion.div>
    </div>
  );
};

export default AdminDashboardPage;