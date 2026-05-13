import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import PageHeader from '../../components/ui/PageHeader';
import { useAuth } from '../../hooks/useAuth';
import { useHotelDashboard } from '../../features/hotel/useHotelDashboard';
import { FaBed, FaClipboardList, FaCreditCard, FaDoorClosed, FaDoorOpen, FaFileAlt, FaInbox, FaTimes, FaUserPlus, FaUsers } from 'react-icons/fa';
import DashboardWidget from '../../components/Dashboard/DashboardWidget';

const Motion = motion;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
};

const RoomsStatusModal = ({ status, rooms, onClose }) => {
  if (!status) return null;

  return (
    <AnimatePresence>
      <Motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[2px]"
        onClick={onClose}
      >
        <Motion.div
          initial={{ opacity: 0, y: 20, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full max-w-xl rounded-2xl border border-slate-100 bg-white shadow-lg"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 md:px-6 md:py-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{status} Rooms</h3>
              <p className="mt-1 text-sm text-slate-500">
                {rooms.length} room{rooms.length === 1 ? '' : 's'} currently marked as {status.toLowerCase()}.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Close modal"
            >
              <FaTimes />
            </button>
          </div>

          <div className="px-5 py-5 md:px-6">
            {rooms.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No {status.toLowerCase()} rooms found.
              </div>
            ) : (
              <div className="grid max-h-72 grid-cols-2 gap-3 overflow-y-auto pr-1 sm:grid-cols-3 md:grid-cols-4">
                {rooms.map((roomNumber) => (
                  <span
                    key={roomNumber}
                    className={`rounded-lg border px-3 py-2 text-center text-sm font-semibold ${
                      status === 'Occupied'
                        ? 'border-amber-100 bg-amber-50 text-amber-700'
                        : 'border-emerald-100 bg-emerald-50 text-emerald-700'
                    }`}
                  >
                    {roomNumber}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end border-t border-slate-100 px-5 py-4 md:px-6">
            <Button variant="secondary" onClick={onClose}>Close</Button>
          </div>
        </Motion.div>
      </Motion.div>
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
    <div className="space-y-6 md:space-y-8">
      <RoomsStatusModal
        status={activeRoomStatus}
        rooms={activeRooms}
        onClose={() => setActiveRoomStatus(null)}
      />

      <PageHeader
        title="Hotel Dashboard"
        description="Monitor rooms, guest activity, and daily operations from one calm workspace."
        action={
          <Link to="/hotel/register-guest" className="hidden md:block">
            <Button>
              <FaUserPlus /> Register Guest
            </Button>
          </Link>
        }
      />

      <Motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        <DashboardWidget />
      </Motion.div>

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5"
      >
        <Motion.div variants={itemVariants}>
          <StatCard title="Total Rooms" value={stats.total} icon={<FaBed className="h-5 w-5" />} isLoading={isLoading} />
        </Motion.div>
        <Motion.div variants={itemVariants}>
          <button
            type="button"
            className="h-full w-full rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={() => !isLoading && setActiveRoomStatus('Occupied')}
            disabled={isLoading}
            aria-label="View occupied rooms"
          >
            <StatCard title="Occupied" value={stats.occupied} icon={<FaDoorClosed className="h-5 w-5" />} isLoading={isLoading} />
          </button>
        </Motion.div>
        <Motion.div variants={itemVariants}>
          <button
            type="button"
            className="h-full w-full rounded-xl text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
            onClick={() => !isLoading && setActiveRoomStatus('Vacant')}
            disabled={isLoading}
            aria-label="View vacant rooms"
          >
            <StatCard title="Vacant" value={stats.vacant} icon={<FaDoorOpen className="h-5 w-5" />} isLoading={isLoading} />
          </button>
        </Motion.div>
        <Motion.div variants={itemVariants}>
          <StatCard title="Subscription" value={isSubscribed ? 'Active' : 'Inactive'} icon={<FaCreditCard className="h-5 w-5" />} isLoading={isLoading} />
        </Motion.div>
      </Motion.div>

      <div className="flex gap-3 overflow-x-auto pb-2 md:hidden scrollbar-hide">
        <Link to="/hotel/register-guest" className="flex-shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Register Guest
        </Link>
        <Link to="/hotel/guests" className="flex-shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          View Guests
        </Link>
        <Link to="/hotel/manage-rooms" className="flex-shrink-0 rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white">
          Manage Rooms
        </Link>
      </div>

      {!isSubscribed && (
        <Card className="border-amber-100 bg-amber-50">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base font-semibold text-amber-800">Subscription Required</h3>
              <p className="mt-1 text-sm text-amber-700">Activate your subscription to register guests and access hotel operations.</p>
            </div>
            <Link to="/hotel/subscription">
              <Button className="w-full md:w-auto">Upgrade Now</Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">Today's Guests</h2>
              <p className="mt-1 text-sm text-slate-500">Guest feed is not connected to this dashboard view yet.</p>
            </div>
            <Badge status="pending">Unavailable</Badge>
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-10 text-center">
            <FaInbox className="mx-auto mb-3 text-3xl text-slate-300" />
            <h3 className="text-sm font-semibold text-slate-700">No live guest feed here yet</h3>
            <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
              Use the guest list to view check-ins and checkout actions while this dashboard keeps the current API surface unchanged.
            </p>
            <Link to="/hotel/guests" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <FaUsers /> View Guest List
            </Link>
          </div>
        </Card>

        <Card>
          <h2 className="mb-4 text-xl font-semibold text-slate-800 md:text-2xl">Quick Actions</h2>
          <div className="grid gap-3">
            <Link to="/hotel/register-guest" className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <FaUserPlus className="text-blue-600" /> Register New Guest
            </Link>
            <Link to="/hotel/manage-rooms" className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <FaClipboardList className="text-blue-600" /> Manage Your Rooms
            </Link>
            <Link to="/hotel/reports" className="flex min-h-12 items-center gap-3 rounded-xl border border-slate-100 px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50">
              <FaFileAlt className="text-blue-600" /> Download Reports
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HotelDashboardPage;
