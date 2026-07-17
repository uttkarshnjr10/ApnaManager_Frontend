// src/pages/hotel/GuestListPage.jsx
import { useMemo, useState } from 'react';
import { useGuestList } from '../../features/hotel/useGuestList';
import GuestDetailModal from '../../features/hotel/GuestDetailModal';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import PageHeader from '../../components/ui/PageHeader';
import { FaInbox, FaSearch, FaSort } from 'react-icons/fa';
import { FiMoreVertical } from 'react-icons/fi';

const StatusPill = ({ status, isAnonymized }) => {
  if (isAnonymized) return <Badge status="error">ANONYMIZED</Badge>;
  const badgeStatus = status === 'Checked-In' ? 'active' : 'neutral';
  return <Badge status={badgeStatus}>{status || 'Unknown'}</Badge>;
};

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  return new Date(value).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const HeaderButton = ({ children, active, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide ${
      active ? 'text-blue-700' : 'text-slate-500'
    }`}
  >
    {children}
    <FaSort className="text-[10px]" />
  </button>
);

const GuestListPage = () => {
  const { filteredGuests, loading, searchTerm, setSearchTerm, handleCheckout } = useGuestList();
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortConfig, setSortConfig] = useState({ key: 'checkIn', direction: 'desc' });

  const openDetail = (guestId) => {
    setSelectedGuestId(guestId);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setModalOpen(false);
    setSelectedGuestId(null);
  };

  const requestSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const visibleGuests = useMemo(() => {
    const source = Array.isArray(filteredGuests) ? filteredGuests : [];
    const filtered = statusFilter === 'All'
      ? source
      : source.filter((guest) => guest.status === statusFilter);

    const sorted = [...filtered].sort((a, b) => {
      const values = {
        customerId: [a.customerId || '', b.customerId || ''],
        name: [a.primaryGuest?.name || '', b.primaryGuest?.name || ''],
        room: [a.stayDetails?.roomNumber || '', b.stayDetails?.roomNumber || ''],
        checkIn: [new Date(a.stayDetails?.checkIn || 0).getTime(), new Date(b.stayDetails?.checkIn || 0).getTime()],
        checkout: [new Date(a.stayDetails?.checkOut || 0).getTime(), new Date(b.stayDetails?.checkOut || 0).getTime()],
        status: [a.status || '', b.status || ''],
      };
      const [first, second] = values[sortConfig.key] || values.checkIn;
      if (first < second) return sortConfig.direction === 'asc' ? -1 : 1;
      if (first > second) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredGuests, sortConfig, statusFilter]);

  const columns = [
    { Header: <HeaderButton active={sortConfig.key === 'customerId'} onClick={() => requestSort('customerId')}>Customer ID</HeaderButton>, accessor: 'customerId' },
    { Header: <HeaderButton active={sortConfig.key === 'name'} onClick={() => requestSort('name')}>Name</HeaderButton>, accessor: 'primaryGuest.name', Cell: (row) => row.primaryGuest?.name || 'N/A' },
    { Header: <HeaderButton active={sortConfig.key === 'room'} onClick={() => requestSort('room')}>Room</HeaderButton>, accessor: 'stayDetails.roomNumber', Cell: (row) => row.stayDetails?.roomNumber || 'N/A' },
    { Header: <HeaderButton active={sortConfig.key === 'checkIn'} onClick={() => requestSort('checkIn')}>Check-in</HeaderButton>, accessor: 'stayDetails.checkIn', Cell: (row) => formatDateTime(row.stayDetails?.checkIn) },
    { Header: <HeaderButton active={sortConfig.key === 'checkout'} onClick={() => requestSort('checkout')}>Checkout</HeaderButton>, accessor: 'stayDetails.checkOut', Cell: (row) => formatDateTime(row.stayDetails?.checkOut) },
    { Header: <HeaderButton active={sortConfig.key === 'status'} onClick={() => requestSort('status')}>Status</HeaderButton>, accessor: 'status', Cell: (row) => <StatusPill status={row.status} isAnonymized={row.isAnonymized} /> },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => { e.stopPropagation(); openDetail(row._id); }}
            variant="outline"
            className="min-h-8 px-3 py-1.5 text-xs"
          >
            Details
          </Button>
          {row.status === 'Checked-In' && (
            <Button
              onClick={(e) => { e.stopPropagation(); handleCheckout(row._id); }}
              variant="secondary"
              className="min-h-8 px-3 py-1.5 text-xs"
            >
              Checkout
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Guest List"
        description="Search, review, and checkout hotel guests."
      />

      <div className="space-y-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full pl-11"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', 'Checked-In', 'Checked-Out'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="space-y-3 animate-pulse">
                <div className="h-4 w-2/3 rounded bg-slate-100" />
                <div className="h-3 w-1/2 rounded bg-slate-100" />
                <div className="h-3 w-3/4 rounded bg-slate-100" />
              </div>
            </div>
          ))
        ) : visibleGuests.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
            <FaInbox className="mx-auto mb-3 text-3xl text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No guests found</p>
            <p className="mt-1 text-sm text-slate-500">Try changing the search or filter.</p>
          </div>
        ) : (
          visibleGuests.map((guest) => (
            <div key={guest._id} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="truncate text-base font-semibold text-slate-900">{guest.primaryGuest?.name || 'Guest'}</h3>
                  <p className="mt-1 text-xs text-slate-400">{guest.customerId || 'No customer ID'}</p>
                </div>
                <StatusPill status={guest.status} />
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  Room {guest.stayDetails?.roomNumber || 'N/A'}
                </span>
                <span>{formatDateTime(guest.stayDetails?.checkIn)}</span>
              </div>

              <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                <p className="truncate text-sm text-slate-500">{guest.primaryGuest?.phone || 'No phone'}</p>
                <div className="flex items-center gap-2">
                  {guest.status === 'Checked-In' && (
                    <button
                      type="button"
                      onClick={() => handleCheckout(guest._id)}
                      className="flex min-h-10 items-center rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-700"
                    >
                      Checkout
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openDetail(guest._id)}
                    className="text-sm font-medium text-blue-600"
                  >
                    Details
                  </button>
                  <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400">
                    <FiMoreVertical />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="hidden md:block">
        <Table
          columns={columns}
          data={visibleGuests}
          loading={loading}
          onRowClick={(row) => openDetail(row._id)}
        />
      </div>

      <GuestDetailModal
        guestId={selectedGuestId}
        isOpen={modalOpen}
        onClose={closeDetail}
      />
    </div>
  );
};

export default GuestListPage;
