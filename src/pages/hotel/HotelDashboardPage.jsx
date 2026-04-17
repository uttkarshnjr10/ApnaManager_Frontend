import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import { useAuth } from '../../hooks/useAuth';
import { useHotelDashboard } from '../../features/hotel/useHotelDashboard';
import { FaUserPlus, FaCreditCard, FaBed, FaDoorOpen, FaDoorClosed, FaTimes } from 'react-icons/fa';
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

const RoomsStatusModal = ({ status, rooms, onClose }) => {
  if (!status) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-slate-900/45 backdrop-blur-[2px] p-4 flex items-center justify-center"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-6 py-5">
            <div>
              <h3 className="text-xl font-semibold text-slate-900">{status} Rooms</h3>
              <p className="text-sm text-slate-500 mt-1">{rooms.length} room{rooms.length === 1 ? '' : 's'} currently marked as {status.toLowerCase()}.</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <div className="px-6 py-5">
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No {status.toLowerCase()} rooms found.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1">
                {rooms.map((roomNumber) => (
                  <span
                    key={roomNumber}
                    className={`rounded-lg border px-3 py-2 text-center text-sm font-semibold ${
                      status === 'Occupied'
                        ? 'border-amber-200 bg-amber-50 text-amber-800'
                        : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {roomNumber}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-100 px-6 py-4">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const HotelDashboardPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useHotelDashboard();
  const [activeRoomStatus, setActiveRoomStatus] = useState(null);

  const isSubscribed = user?.subscriptionStatus === 'Active';
  const isLoading = authLoading || statsLoading;

  const roomStatusMap = useMemo(
    () => ({
      Occupied: stats.occupiedRooms || [],
      Vacant: stats.vacantRooms || [],
    }),
    [stats.occupiedRooms, stats.vacantRooms]
  );

  const activeRooms = activeRoomStatus ? roomStatusMap[activeRoomStatus] || [] : [];

  return (
    <div className="space-y-6">
      <RoomsStatusModal
        status={activeRoomStatus}
        rooms={activeRooms}
        onClose={() => setActiveRoomStatus(null)}
      />

      {/* Widget with fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <DashboardWidget />
      </motion.div>

      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Hotel Dashboard</h1>
        <Link to="/hotel/register-guest">
          <Button >
            <span className="flex items-center gap-2">
              <FaUserPlus /> Register New Guest
            </span>
          </Button>
        </Link>
      </div>

      {/* Stat Cards — Stagger animation */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Total Rooms"
            value={stats.total}
            icon={<FaBed size={24} />}
            isLoading={isLoading}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <button
            type="button"
            className="w-full text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => !isLoading && setActiveRoomStatus('Occupied')}
            disabled={isLoading}
            aria-label="View occupied rooms"
          >
            <StatCard
              title="Occupied Rooms"
              value={stats.occupied}
              icon={<FaDoorClosed size={24} />}
              isLoading={isLoading}
            />
          </button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <button
            type="button"
            className="w-full text-left rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            onClick={() => !isLoading && setActiveRoomStatus('Vacant')}
            disabled={isLoading}
            aria-label="View vacant rooms"
          >
            <StatCard
              title="Vacant Rooms"
              value={stats.vacant}
              icon={<FaDoorOpen size={24} />}
              isLoading={isLoading}
            />
          </button>
        </motion.div>
        <motion.div variants={itemVariants}>
          <StatCard
            title="Subscription"
            value={isSubscribed ? 'Active' : 'Inactive'}
            icon={<FaCreditCard size={24} />}
            isLoading={isLoading}
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
        className="grid grid-cols-1 gap-6"
      >
        <Card>
          {!isSubscribed ? (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-bold text-yellow-800">Subscription Required</h3>
              <p className="text-yellow-700">
                Please activate your subscription to register guests and access all features.
              </p>
              <Link to="/hotel/subscription" className="mt-2 inline-block">
                <Button>Upgrade Now</Button>
              </Link>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Actions</h2>
              <div className="flex flex-wrap gap-3">
                <Link to="/hotel/manage-rooms">
                  <Button variant="secondary">Manage Your Rooms</Button>
                </Link>
                <Link to="/hotel/guests">
                  <Button variant="secondary">View Full Guest List</Button>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default HotelDashboardPage;