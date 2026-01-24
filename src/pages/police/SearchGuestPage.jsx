import { Link } from 'react-router-dom';
import { useSearchGuest } from '../../features/police/useSearchGuest';
import FlagGuestModal from '../../features/police/FlagGuestModal';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GuestResultCard = ({ guest, onFlagClick }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex flex-col sm:flex-row gap-4 border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Guest Photo */}
      <div className="flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-lg overflow-hidden mx-auto sm:mx-0 bg-gray-100">
        {guest.livePhotoURL ? (
            <img
            src={guest.livePhotoURL}
            alt={guest.primaryGuest?.name}
            className="w-full h-full object-cover"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">No Photo</div>
        )}
      </div>

      {/* Guest Details */}
      <div className="flex-1 text-center sm:text-left space-y-1">
        <h3 className="text-xl font-bold text-gray-800">{guest.primaryGuest?.name || 'Unknown'}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600">
            <p>ID: <span className="font-medium text-gray-900">{guest.idNumber} ({guest.idType})</span></p>
            <p>Phone: <span className="font-medium text-gray-900">{guest.primaryGuest?.phone}</span></p>
            <p>Check-In: <span className="font-medium text-gray-900">{new Date(guest.registrationTimestamp).toLocaleDateString()}</span></p>
            <p>Hotel: <span className="font-medium text-indigo-600">{guest.hotel?.hotelName || 'Unknown Hotel'}</span></p>
            <p>City: <span className="font-medium text-gray-900">{guest.hotel?.city || 'N/A'}</span></p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-row sm:flex-col justify-center gap-2 pt-2 sm:pt-0 sm:border-l border-gray-100 sm:pl-4 min-w-[120px]">
        <Button 
          onClick={() => onFlagClick(guest)} 
          variant="danger" 
          className="text-sm py-2 px-3 w-full shadow-sm"
        >
          🚩 Flag
        </Button>
        <Link to={`/police/guest/${guest._id}`} className="w-full">
          <Button variant="secondary" className="text-sm py-2 px-3 w-full">
            📜 History
          </Button>
        </Link>
      </div>
    </div>
  );
};

const SearchGuestPage = () => {
  const { 
    form, results, pagination, loading, searched, 
    flaggingGuest, setFlaggingGuest, handleFormChange, 
    handleSearch, handleFlagSubmit, loadMore 
  } = useSearchGuest();

  return (
    <>
      {flaggingGuest && (
        <FlagGuestModal
          guest={flaggingGuest}
          onClose={() => setFlaggingGuest(null)}
          onSubmit={handleFlagSubmit}
        />
      )}

      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-800">Secure Guest Search</h1>
            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-500">
                Enterprise Mode
            </span>
        </div>

        <form onSubmit={handleSearch} className="bg-white p-6 rounded-xl shadow-md space-y-4 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <select 
              name="searchBy" 
              value={form.searchBy} 
              onChange={handleFormChange} 
              className="w-full sm:w-auto mt-1 block pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg bg-gray-50"
            >
              <option value="name">Name</option>
              <option value="phone">Phone</option>
              <option value="id">ID Number</option>
            </select>
            <Input 
              type="text" 
              name="query" 
              placeholder={`Enter ${form.searchBy}...`} 
              value={form.query} 
              onChange={handleFormChange} 
              className="flex-grow" 
              autoFocus 
            />
          </div>
          <textarea 
            name="reason" 
            placeholder="Reason for search (Mandatory for Audit Logs)..." 
            value={form.reason} 
            onChange={handleFormChange} 
            className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px]" 
            required 
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={loading} className="w-full sm:w-48">
                {loading && !searched ? 'Searching...' : 'Search Database'}
            </Button>
          </div>
        </form>

        {searched && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-700">
                    Results {pagination.totalDocs > 0 && <span className="text-sm font-normal text-gray-500">({pagination.totalDocs} records found)</span>}
                </h2>
            </div>
            
            {results.length === 0 && !loading ? (
               <div className="p-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-300">
                   <p className="text-gray-500">No records found matching your criteria.</p>
               </div>
            ) : (
              <div className="space-y-4">
                {results.map(guest => (
                  <GuestResultCard 
                    key={guest._id} 
                    guest={guest} 
                    onFlagClick={setFlaggingGuest} 
                  />
                ))}
              </div>
            )}

            {loading && (
                <div className="space-y-4">
                    <Skeleton height={140} className="rounded-xl" />
                    <Skeleton height={140} className="rounded-xl" />
                </div>
            )}

            {pagination.hasNextPage && !loading && (
                <div className="flex justify-center pt-4">
                    <button 
                        onClick={loadMore}
                        className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors"
                    >
                        Load More Results ↓
                    </button>
                </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchGuestPage;