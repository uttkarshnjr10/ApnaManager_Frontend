// src/pages/hotel/GuestListPage.jsx
import { useState } from 'react';
import { useGuestList } from '../../features/hotel/useGuestList';
import GuestDetailModal from '../../features/hotel/GuestDetailModal';
import Table from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

const StatusPill = ({ status }) => {
  const baseClasses = 'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full';
  const statusClasses = {
    'Checked-In': 'bg-green-100 text-green-800',
    'Checked-Out': 'bg-gray-100 text-gray-800',
  };
  return <span className={`${baseClasses} ${statusClasses[status]}`}>{status}</span>;
};

const GuestListPage = () => {
  const { filteredGuests, loading, searchTerm, setSearchTerm, handleCheckout } = useGuestList();
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openDetail = (guestId) => {
    setSelectedGuestId(guestId);
    setModalOpen(true);
  };

  const closeDetail = () => {
    setModalOpen(false);
    setSelectedGuestId(null);
  };

  const columns = [
    { Header: 'Customer ID', accessor: 'customerId' },
    { Header: 'Name', accessor: 'primaryGuest.name', Cell: (row) => row.primaryGuest.name },
    { Header: 'Phone', accessor: 'primaryGuest.phone', Cell: (row) => row.primaryGuest.phone },
    { Header: 'Room', accessor: 'stayDetails.roomNumber', Cell: (row) => row.stayDetails.roomNumber },
    { Header: 'Check-In', accessor: 'stayDetails.checkIn', Cell: (row) => new Date(row.stayDetails.checkIn).toLocaleString() },
    { Header: 'Status', accessor: 'status', Cell: (row) => <StatusPill status={row.status} /> },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: (row) => (
        <div className="flex items-center gap-2">
          <Button
            onClick={(e) => { e.stopPropagation(); openDetail(row._id); }}
            variant="outline"
            className="text-sm py-1 px-2"
          >
            View
          </Button>
          {row.status === "Checked-In" && (
            <Button
              onClick={(e) => { e.stopPropagation(); handleCheckout(row._id); }}
              variant="secondary"
              className="text-sm py-1 px-2"
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
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Guest List</h1>
        <Input
          type="text"
          placeholder="Search by name or customer ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-72"
        />
      </div>
      <Table
        columns={columns}
        data={filteredGuests}
        loading={loading}
        onRowClick={(row) => openDetail(row._id)}
      />

      <GuestDetailModal
        guestId={selectedGuestId}
        isOpen={modalOpen}
        onClose={closeDetail}
      />
    </div>
  );
};

export default GuestListPage;