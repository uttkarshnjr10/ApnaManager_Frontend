import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { FaExclamationTriangle, FaCheck, FaTimes } from 'react-icons/fa';
import Button from '../ui/Button';

const WatchlistAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [notes, setNotes] = useState({}); // { [alertId]: 'some notes' }

  const fetchAlerts = async () => {
    try {
      const { data } = await apiClient.get('/watchlist/alerts');
      if (data && data.data) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch watchlist alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleNoteChange = (id, value) => {
    setNotes((prev) => ({ ...prev, [id]: value }));
  };

  const handleActionAlert = async (id) => {
    const note = notes[id];
    if (!note || note.trim() === '') {
      toast.error('Action notes are required to mark as actioned.');
      return;
    }
    
    try {
      await apiClient.put(`/watchlist/alerts/${id}/action`, { notes: note });
      toast.success('Alert marked as actioned.');
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (error) {
      toast.error('Failed to action alert.');
    }
  };

  const handleDismissAlert = async (id) => {
    const note = notes[id];
    try {
      await apiClient.put(`/watchlist/alerts/${id}/dismiss`, { notes: note });
      toast.success('Alert dismissed.');
      setAlerts(alerts.filter(a => a._id !== id));
    } catch (error) {
      toast.error('Failed to dismiss alert.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center min-h-[150px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <FaExclamationTriangle className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">Watchlist Alerts</h2>
          </div>
          <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold">0</span>
        </div>
        <p className="text-gray-500 text-sm text-center py-4">No open watchlist alerts.</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-red-200 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-3">
        <div className="flex items-center gap-2">
          <FaExclamationTriangle className="text-red-600" />
          <h2 className="text-lg font-semibold text-gray-900">Watchlist Alerts</h2>
        </div>
        <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
          {alerts.length} Open
        </span>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
        {alerts.map((alert) => (
          <div key={alert._id} className="bg-red-50/50 rounded-lg p-4 border border-red-100">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
              <div>
                <p className="font-bold text-red-900">
                  {alert.guest?.primaryGuest?.name?.split(' ')[0] || 'Unknown Guest'} matched Watchlist!
                </p>
                <div className="text-sm text-red-700 mt-1 space-y-1">
                  <p><span className="font-semibold">Hotel:</span> {alert.hotelName}</p>
                  <p><span className="font-semibold">Room:</span> {alert.guest?.stayDetails?.roomNumber}</p>
                  <p><span className="font-semibold">Match Type:</span> {alert.matchedField} (Value: {alert.matchedValue})</p>
                  <p className="italic bg-red-100 px-2 py-1 rounded inline-block mt-1 text-xs">Reason: {alert.reason}</p>
                </div>
              </div>
              <div className="text-xs text-red-400 font-medium">
                {new Date(alert.createdAt).toLocaleString()}
              </div>
            </div>

            {/* Actions Section */}
            {actioningId === alert._id ? (
              <div className="mt-4 pt-3 border-t border-red-100 animate-in fade-in zoom-in duration-200">
                <textarea
                  className="w-full text-sm border-red-200 focus:border-red-500 focus:ring-red-500 rounded-lg p-2"
                  rows="2"
                  placeholder="Enter action notes..."
                  value={notes[alert._id] || ''}
                  onChange={(e) => handleNoteChange(alert._id, e.target.value)}
                />
                <div className="flex justify-end gap-2 mt-2">
                  <Button variant="secondary" onClick={() => setActioningId(null)} className="py-1 px-3 text-xs">
                    Cancel
                  </Button>
                  <Button onClick={() => handleActionAlert(alert._id)} className="bg-red-600 hover:bg-red-700 py-1 px-3 text-xs">
                    Confirm Action
                  </Button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex gap-2 justify-end">
                <button
                  onClick={() => handleDismissAlert(alert._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <FaTimes className="text-slate-400" /> Dismiss
                </button>
                <button
                  onClick={() => setActioningId(alert._id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm shadow-red-600/20"
                >
                  <FaCheck /> Mark Actioned
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WatchlistAlerts;
