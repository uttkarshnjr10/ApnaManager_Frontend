import { useState } from 'react';
import { useGuestHistory } from '../../features/police/useGuestHistory';
import Button from '../../components/ui/Button';
import { FaMapMarkerAlt, FaPhone, FaIdCard, FaBuilding, FaExclamationTriangle, FaCommentDots, FaFilePdf, FaUserShield } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const GuestHistoryPage = () => {
  const { history, loading, error, addRemark, exportPDF } = useGuestHistory();
  const [newRemark, setNewRemark] = useState('');

  const handleAddRemark = (e) => {
    e.preventDefault();
    if (!newRemark.trim()) return;
    addRemark(newRemark);
    setNewRemark('');
  };

  if (loading) return <div className="p-6"><Skeleton count={10} /></div>;
  if (error) return <div className="p-6 text-red-600 font-bold bg-red-50 rounded-lg">{error}</div>;
  if (!history) return <div className="p-6">No history found.</div>;

  const { primaryGuest, stayHistory, alerts, remarks } = history;
  const { name, phone, address } = primaryGuest.primaryGuest;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header Profile */}
      <header className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 shadow-inner bg-gray-200">
             {primaryGuest.livePhotoURL ? (
                <img src={primaryGuest.livePhotoURL} alt="Guest" className="w-full h-full object-cover" />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-2xl">?</div>
             )}
          </div>
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <div className="flex flex-col sm:flex-row flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-600 justify-center sm:justify-start">
              <p className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"><FaIdCard className="text-indigo-500" /> {primaryGuest.idType}: <span className="font-mono font-medium">{primaryGuest.idNumber}</span></p>
              <p className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"><FaPhone className="text-green-500" /> {phone}</p>
              {address && (
                  <p className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-full"><FaMapMarkerAlt className="text-red-500" /> {address.city}, {address.state}</p>
              )}
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button onClick={exportPDF} variant="secondary" className="flex items-center gap-2 shadow-sm">
              <FaFilePdf /> Export Dossier
            </Button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stay History */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 pb-2 border-b">
            <FaBuilding className="text-gray-400" /> Stay History
          </h2>
          <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:h-full before:w-0.5 before:bg-gray-100">
            {stayHistory.map(stay => (
              <div key={stay._id} className="relative pl-8">
                <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm bg-indigo-500 z-10"></div>
                <div className="bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-colors">
                    <p className="font-bold text-gray-800 text-base">
                        {stay.hotel?.hotelName || stay.hotel?.username || <span className="text-red-400 italic">Unknown Hotel</span>}
                    </p>
                    <p className="text-sm text-gray-500 mb-1">{stay.hotel?.city || 'Unknown City'}</p>
                    <p className="text-xs font-mono text-gray-500 bg-white inline-block px-2 py-1 rounded border border-gray-200">
                        {new Date(stay.stayDetails.checkIn).toLocaleDateString()} 
                        <span className="mx-1">→</span> 
                        {stay.stayDetails.expectedCheckout ? new Date(stay.stayDetails.expectedCheckout).toLocaleDateString() : 'Active'}
                    </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Intelligence (Alerts & Remarks) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Alerts Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaExclamationTriangle className="text-yellow-500" /> Flags & Alerts
            </h2>
            {alerts.length > 0 ? (
                <div className="space-y-3">
                    {alerts.map(alert => (
                    <div key={alert._id} className={`border-l-4 p-4 rounded-r-lg ${alert.status === 'Open' ? 'bg-red-50 border-red-500' : 'bg-green-50 border-green-500'}`}>
                        <div className="flex justify-between items-start">
                            <div>
                                <p className={`font-bold ${alert.status === 'Open' ? 'text-red-800' : 'text-green-800'}`}>
                                    {alert.reason}
                                </p>
                                <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                    <FaUserShield /> Flagged by: {alert.createdBy?.username || 'System/Unknown'}
                                </p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-bold rounded uppercase ${alert.status === 'Open' ? 'bg-red-200 text-red-800' : 'bg-green-200 text-green-800'}`}>
                                {alert.status}
                            </span>
                        </div>
                    </div>
                    ))}
                </div>
            ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg border border-dashed text-gray-400">
                    No security flags raised for this profile.
                </div>
            )}
          </div>

          {/* Remarks Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaCommentDots className="text-blue-500" /> Officer Remarks
            </h2>
            
            <div className="space-y-4 mb-6 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
              {remarks.length > 0 ? remarks.map(remark => (
                <div key={remark._id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                        {remark.officer?.username?.charAt(0).toUpperCase() || 'O'}
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg rounded-tl-none flex-1">
                        <p className="text-gray-800 text-sm leading-relaxed">{remark.text}</p>
                        <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                            <span>{remark.officer?.username || 'Unknown Officer'}</span>
                            <span>{new Date(remark.createdAt).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
              )) : (
                  <p className="text-sm text-gray-400 italic ml-2">No remarks yet.</p>
              )}
            </div>

            <form onSubmit={handleAddRemark} className="flex gap-3 items-start border-t pt-4">
              <textarea
                value={newRemark}
                onChange={(e) => setNewRemark(e.target.value)}
                placeholder="Add an investigative note..."
                className="flex-1 p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none h-20 bg-gray-50 focus:bg-white"
              ></textarea>
              <Button type="submit" className="h-20 px-6">Add</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GuestHistoryPage;