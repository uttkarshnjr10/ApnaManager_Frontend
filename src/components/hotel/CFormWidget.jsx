import { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { FaFileAlt, FaCheckCircle, FaDownload, FaCheck } from 'react-icons/fa';
import Button from '../ui/Button';

const CFormWidget = () => {
  const [cForms, setCForms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCForms = async () => {
    try {
      const { data } = await apiClient.get('/guests/cforms/pending');
      if (data && data.data) {
        setCForms(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch pending C-Forms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCForms();
  }, []);

  const handleDownload = async (guestId) => {
    try {
      const { data } = await apiClient.get(`/guests/${guestId}/cform`);
      if (data?.data?.signedUrl) {
        window.open(data.data.signedUrl, '_blank');
      } else {
        toast.error('C-Form PDF is not yet available or failed to generate.');
      }
    } catch (error) {
      toast.error('Failed to retrieve C-Form.');
    }
  };

  const handleMarkSubmitted = async (guestId) => {
    try {
      await apiClient.put(`/guests/${guestId}/cform/submit`);
      toast.success('C-Form marked as submitted.');
      setCForms(cForms.filter(c => c.customerId !== guestId && c._id !== guestId));
      fetchCForms();
    } catch (error) {
      toast.error('Failed to mark C-Form as submitted.');
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[150px]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md">
      <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <FaFileAlt className="text-blue-600" />
          <h2 className="text-lg font-semibold text-slate-900">C-Form Compliance</h2>
        </div>
        {cForms.length > 0 ? (
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-bold animate-pulse">
            {cForms.length} Pending
          </span>
        ) : (
          <span className="flex items-center gap-1 text-emerald-600 text-sm font-semibold">
            <FaCheckCircle /> All caught up
          </span>
        )}
      </div>

      {cForms.length === 0 ? (
        <p className="text-slate-500 text-sm text-center py-4">No pending C-Forms require submission.</p>
      ) : (
        <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
          {cForms.map((guest) => {
            const firstName = guest.primaryGuest?.name?.split(' ')[0] || 'Unknown';
            const status = guest.cForm?.status;

            return (
              <div key={guest._id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-800">
                      {firstName} • Room {guest.stayDetails?.roomNumber || 'N/A'}
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                      <span>{guest.primaryGuest?.nationality}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'generated' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {status === 'generated' ? 'Ready to Download' : 'Generating...'}
                      </span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDownload(guest._id)}
                      disabled={status !== 'generated'}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaDownload className="text-slate-400" /> Download PDF
                    </button>
                    <button
                      onClick={() => handleMarkSubmitted(guest._id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm shadow-blue-600/20"
                    >
                      <FaCheck /> Mark Submitted
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CFormWidget;
