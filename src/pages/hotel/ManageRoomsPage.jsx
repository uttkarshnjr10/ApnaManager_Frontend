import { useState } from 'react';
import { useManageRooms } from '../../features/hotel/useManageRooms';
import FormField from '../../components/ui/FormField';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import PageHeader from '../../components/ui/PageHeader';
import { FaBed, FaInbox, FaPlus, FaTimes, FaTrash } from 'react-icons/fa';

const StatusPill = ({ status }) => {
  const statusMap = {
    Vacant: 'active',
    Occupied: 'neutral',
    Maintenance: 'pending',
  };
  return <Badge status={statusMap[status] || 'neutral'}>{status || 'Unknown'}</Badge>;
};

const AddRoomForm = ({ roomNumber, handleInputChange, handleAddRoom }) => (
  <form onSubmit={handleAddRoom} className="space-y-4">
    <FormField
      label="Room Name / Number *"
      name="roomNumber"
      value={roomNumber}
      onChange={handleInputChange}
      placeholder="e.g., 101, 205-B, King Suite"
      required
    />
    <Button type="submit" className="w-full">
      <FaPlus /> Add Room
    </Button>
  </form>
);

const RoomCard = ({ room, handleDeleteRoom }) => {
  const isOccupied = room.status === 'Occupied';

  return (
    <div
      className={`group relative flex aspect-square flex-col items-center justify-center rounded-xl border p-4 text-center transition-colors ${
        isOccupied
          ? 'border-slate-200 bg-slate-100 opacity-70'
          : 'border-emerald-100 bg-emerald-50'
      }`}
    >
      <FaBed className={`mb-3 text-xl ${isOccupied ? 'text-slate-400' : 'text-emerald-600'}`} />
      <p className="break-all text-2xl font-bold text-slate-900">{room.roomNumber}</p>
      <div className="mt-3">
        <StatusPill status={room.status} />
      </div>
      <button
        type="button"
        onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
        disabled={isOccupied}
        title={isOccupied ? 'Cannot delete an occupied room' : 'Delete room'}
        className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-400 opacity-100 shadow-sm transition-all hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40 md:opacity-0 md:group-hover:opacity-100"
      >
        <FaTrash size={13} />
      </button>
    </div>
  );
};

const ManageRoomsPage = () => {
  const { rooms, loading, roomNumber, handleInputChange, handleAddRoom, handleDeleteRoom } = useManageRooms();
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Rooms"
        description="Keep room inventory clear, scannable, and ready for guest allocation."
        action={
          <Button onClick={() => setShowAddForm((open) => !open)} className="hidden md:inline-flex">
            {showAddForm ? <FaTimes /> : <FaPlus />}
            {showAddForm ? 'Close' : 'Add Room'}
          </Button>
        }
      />

      {showAddForm && (
        <div className="hidden rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:block md:max-w-md">
          <h2 className="mb-4 text-base font-semibold text-slate-800 md:text-lg">Add New Room</h2>
          <AddRoomForm roomNumber={roomNumber} handleInputChange={handleInputChange} handleAddRoom={handleAddRoom} />
        </div>
      )}

      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">Rooms</h2>
            <p className="mt-1 text-sm text-slate-500">{rooms.length} rooms in your inventory</p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className="aspect-square rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 px-5 py-12 text-center">
            <FaInbox className="mx-auto mb-3 text-3xl text-slate-300" />
            <p className="text-sm font-semibold text-slate-700">No rooms added yet</p>
            <p className="mt-1 text-sm text-slate-500">Use Add Room to create your first room.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} handleDeleteRoom={handleDeleteRoom} />
            ))}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => setShowAddForm(true)}
        className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg md:hidden"
        aria-label="Add room"
      >
        <FaPlus />
      </button>

      {showAddForm && (
        <div className="fixed inset-0 z-50 bg-slate-900/30 md:hidden" onClick={() => setShowAddForm(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-3xl bg-white p-5 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-900">Add New Room</h2>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
              >
                <FaTimes />
              </button>
            </div>
            <AddRoomForm roomNumber={roomNumber} handleInputChange={handleInputChange} handleAddRoom={handleAddRoom} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRoomsPage;
