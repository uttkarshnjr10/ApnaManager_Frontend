import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import PageHeader from '../../components/ui/PageHeader';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { toast } from 'react-hot-toast';
import { 
  FaFileContract, FaSearch, FaCheckCircle, 
  FaTimesCircle, FaDownload, FaSpinner, FaPlus 
} from 'react-icons/fa';

const ComplianceReportsPage = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    requestingAuthority: '',
    authorityContactName: '',
    authorityContactPhone: '',
    requestDate: new Date().toISOString().split('T')[0],
    legalBasis: 'Official Letter',
    caseReferenceNumber: '',
    dataRequested: ''
  });

  // Fulfill State
  const [expandedRowId, setExpandedRowId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedGuestIds, setSelectedGuestIds] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Reject State
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/admin/compliance?status=${filterStatus}`);
      setRequests(res.data.data.requests);
    } catch (err) {
      toast.error('Failed to fetch requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/admin/compliance/stats');
      setStats(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch stats');
    }
  };

  useEffect(() => {
    if (activeTab === 'requests') {
      fetchRequests();
    } else {
      fetchStats();
    }
  }, [activeTab, filterStatus]);

  const handleLogRequest = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/admin/compliance', formData);
      toast.success('Request logged successfully');
      setIsModalOpen(false);
      setFormData({
        requestingAuthority: '', authorityContactName: '', authorityContactPhone: '',
        requestDate: new Date().toISOString().split('T')[0], legalBasis: 'Official Letter',
        caseReferenceNumber: '', dataRequested: ''
      });
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log request');
    }
  };

  const handleSearchGuests = async () => {
    if (!searchQuery || searchQuery.length < 3) {
      return toast.error('Enter at least 3 characters to search');
    }
    try {
      setIsSearching(true);
      const res = await apiClient.get(`/admin/compliance/guests/search?searchTerm=${searchQuery}`);
      setSearchResults(res.data.data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  const toggleGuestSelection = (guestId) => {
    setSelectedGuestIds(prev => 
      prev.includes(guestId) ? prev.filter(id => id !== guestId) : [...prev, guestId]
    );
  };

  const handleExport = async (requestId) => {
    if (selectedGuestIds.length === 0) return toast.error('Select at least one guest to export');
    if (!window.confirm(`You are about to generate an official data export for ${selectedGuestIds.length} guest records. This action will be permanently logged.`)) return;

    try {
      setIsExporting(true);
      const res = await apiClient.post(`/admin/compliance/${requestId}/export`, { guestIds: selectedGuestIds });
      toast.success('Export generated successfully');
      
      // Open PDF in new tab
      if (res.data.data.signedUrl) {
        window.open(res.data.data.signedUrl, '_blank');
      }
      
      setExpandedRowId(null);
      fetchRequests();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Export failed');
    } finally {
      setIsExporting(false);
    }
  };

  const handleReject = async (requestId) => {
    if (!rejectionReason) return toast.error('Please provide a rejection reason');
    try {
      setIsRejecting(true);
      await apiClient.put(`/admin/compliance/${requestId}/reject`, { rejectionReason });
      toast.success('Request rejected');
      setRejectionReason('');
      setExpandedRowId(null);
      fetchRequests();
    } catch (err) {
      toast.error('Failed to reject request');
    } finally {
      setIsRejecting(false);
    }
  };

  const toggleRow = async (id) => {
    if (expandedRowId === id) {
      setExpandedRowId(null);
      setSearchResults([]);
      setSelectedGuestIds([]);
      setSearchQuery('');
    } else {
      setExpandedRowId(id);
      setSearchResults([]);
      setSelectedGuestIds([]);
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <PageHeader title="Compliance Reports" className="mb-0" />
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="bg-slate-900 text-white hover:bg-slate-800 flex items-center gap-2"
        >
          <FaPlus /> Log New Request
        </Button>
      </div>

      <div className="flex gap-4 border-b border-slate-200">
        <button
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'requests' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('requests')}
        >
          Requests Log
        </button>
        <button
          className={`pb-3 text-sm font-semibold transition-colors ${activeTab === 'stats' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
          onClick={() => setActiveTab('stats')}
        >
          Dashboard Stats
        </button>
      </div>

      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
            <span className="text-sm font-medium text-slate-600">Filter by Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-sm border border-slate-300 rounded-md p-1.5 focus:border-blue-500 outline-none"
            >
              <option value="All">All Requests</option>
              <option value="Logged">Logged (Pending)</option>
              <option value="Fulfilled">Fulfilled</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center p-10"><FaSpinner className="animate-spin text-2xl text-blue-600" /></div>
          ) : requests.length === 0 ? (
            <Card className="text-center py-10 text-slate-500">No requests found.</Card>
          ) : (
            <div className="grid gap-4">
              {requests.map(req => (
                <Card key={req._id} className="p-0 overflow-hidden border border-slate-200">
                  <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50" onClick={() => toggleRow(req._id)}>
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-12 rounded-full ${
                        req.status === 'Logged' ? 'bg-amber-400' : 
                        req.status === 'Fulfilled' ? 'bg-emerald-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <div className="text-sm font-bold text-slate-800">{req.requestReference}</div>
                        <div className="text-sm text-slate-500">{req.requestingAuthority} • {new Date(req.requestDate).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        req.status === 'Logged' ? 'bg-amber-100 text-amber-700' : 
                        req.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {req.status}
                      </span>
                      <Button variant="outline" size="sm" className="text-xs">
                        {expandedRowId === req._id ? 'Close' : 'View / Fulfill'}
                      </Button>
                    </div>
                  </div>

                  {expandedRowId === req._id && (
                    <div className="border-t border-slate-200 bg-slate-50 p-4 sm:p-6">
                      <div className="grid sm:grid-cols-2 gap-6 mb-6 text-sm">
                        <div>
                          <p className="text-slate-500 font-medium mb-1">Legal Basis</p>
                          <p className="font-semibold">{req.legalBasis}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 font-medium mb-1">Case / FIR Ref</p>
                          <p className="font-semibold">{req.caseReferenceNumber || 'N/A'}</p>
                        </div>
                        <div className="sm:col-span-2">
                          <p className="text-slate-500 font-medium mb-1">Data Requested</p>
                          <p className="bg-white p-3 rounded border border-slate-200">{req.dataRequested}</p>
                        </div>
                      </div>

                      {req.status === 'Logged' && (
                        <div className="space-y-6 border-t border-slate-200 pt-6">
                          <h4 className="font-bold text-slate-800">Fulfill Request (Search Guests)</h4>
                          <div className="flex gap-2">
                            <input 
                              type="text" 
                              placeholder="Search guest by name, phone, or ID number..."
                              value={searchQuery}
                              onChange={e => setSearchQuery(e.target.value)}
                              className="flex-1 p-2 border border-slate-300 rounded text-sm outline-none focus:border-blue-500"
                              onKeyDown={e => e.key === 'Enter' && handleSearchGuests()}
                            />
                            <Button onClick={handleSearchGuests} disabled={isSearching} className="bg-blue-600 text-white flex items-center gap-2">
                              {isSearching ? <FaSpinner className="animate-spin" /> : <FaSearch />} Search
                            </Button>
                          </div>

                          {searchResults.length > 0 && (
                            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden max-h-64 overflow-y-auto">
                              <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 text-slate-600 text-xs uppercase font-semibold">
                                  <tr>
                                    <th className="px-4 py-2 w-10">Sel</th>
                                    <th className="px-4 py-2">Name</th>
                                    <th className="px-4 py-2">ID / Phone</th>
                                    <th className="px-4 py-2">Hotel</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {searchResults.map(g => (
                                    <tr key={g._id} className="border-b last:border-b-0 hover:bg-slate-50">
                                      <td className="px-4 py-2">
                                        <input 
                                          type="checkbox" 
                                          checked={selectedGuestIds.includes(g._id)}
                                          onChange={() => toggleGuestSelection(g._id)}
                                          className="w-4 h-4 text-blue-600"
                                        />
                                      </td>
                                      <td className="px-4 py-2 font-medium">{g.primaryGuest?.name}</td>
                                      <td className="px-4 py-2">{g.idNumber || g.primaryGuest?.phone}</td>
                                      <td className="px-4 py-2 text-slate-500">{g.hotel?.hotelName}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-4 bg-blue-50 p-4 rounded-lg border border-blue-100">
                            <div>
                              <p className="font-semibold text-blue-900">{selectedGuestIds.length} Guests Selected</p>
                              <p className="text-xs text-blue-700">Ready to export official data PDF</p>
                            </div>
                            <Button 
                              onClick={() => handleExport(req._id)}
                              disabled={selectedGuestIds.length === 0 || isExporting}
                              className="bg-emerald-600 text-white hover:bg-emerald-700 flex items-center gap-2"
                            >
                              {isExporting ? <FaSpinner className="animate-spin" /> : <FaDownload />} Generate Export PDF
                            </Button>
                          </div>

                          <div className="border-t border-slate-200 pt-6 space-y-3">
                            <h4 className="font-bold text-slate-800 text-sm">Reject Request</h4>
                            <div className="flex gap-2 items-start">
                              <textarea 
                                placeholder="Reason for rejection..."
                                value={rejectionReason}
                                onChange={e => setRejectionReason(e.target.value)}
                                className="flex-1 p-2 border border-slate-300 rounded text-sm h-10 min-h-[40px] resize-none outline-none focus:border-red-500"
                              />
                              <Button 
                                onClick={() => handleReject(req._id)}
                                disabled={isRejecting || !rejectionReason}
                                variant="outline"
                                className="border-red-500 text-red-600 hover:bg-red-50 whitespace-nowrap"
                              >
                                {isRejecting ? <FaSpinner className="animate-spin" /> : <FaTimesCircle className="inline mr-1" />} Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {req.status === 'Fulfilled' && (
                        <div className="border-t border-slate-200 pt-6 flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-emerald-600 font-bold mb-2">
                            <FaCheckCircle /> Request Fulfilled
                          </div>
                          <p className="text-sm text-slate-600">Export PDF generated and safely stored in compliance vaults.</p>
                          {req.exportPdfUrl && (
                            <Button onClick={() => window.open(req.exportPdfUrl, '_blank')} className="self-start flex items-center gap-2 bg-slate-900 text-white">
                              <FaDownload /> Download Generated PDF
                            </Button>
                          )}
                        </div>
                      )}

                      {req.status === 'Rejected' && (
                        <div className="border-t border-slate-200 pt-6">
                          <div className="flex items-center gap-2 text-red-600 font-bold mb-2">
                            <FaTimesCircle /> Request Rejected
                          </div>
                          <p className="text-sm text-slate-600 bg-red-50 p-3 rounded border border-red-100">
                            <strong>Reason:</strong> {req.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard title="Total Requests" value={stats.total} icon={<FaFileContract className="text-blue-500" />} />
            <StatCard title="Fulfilled" value={stats.fulfilled} icon={<FaCheckCircle className="text-emerald-500" />} />
            <StatCard title="Pending Review" value={stats.logged} icon={<FaSpinner className="text-amber-500" />} />
            <StatCard title="Requests This Month" value={stats.thisMonth} icon={<FaPlus className="text-indigo-500" />} />
          </div>
        </div>
      )}

      {/* Log Request Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">Log New Official Request</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-xl">&times;</button>
            </div>
            
            <form onSubmit={handleLogRequest} className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Requesting Authority *</label>
                <input required type="text" value={formData.requestingAuthority} onChange={e => setFormData({...formData, requestingAuthority: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" placeholder="e.g. District Court, Police HQ" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Name</label>
                  <input type="text" value={formData.authorityContactName} onChange={e => setFormData({...formData, authorityContactName: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" placeholder="Officer/Judge Name" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Contact Phone</label>
                  <input type="tel" value={formData.authorityContactPhone} onChange={e => setFormData({...formData, authorityContactPhone: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" placeholder="Phone Number" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Request Date *</label>
                  <input required type="date" value={formData.requestDate} onChange={e => setFormData({...formData, requestDate: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Legal Basis *</label>
                  <select required value={formData.legalBasis} onChange={e => setFormData({...formData, legalBasis: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm">
                    <option value="Official Letter">Official Letter</option>
                    <option value="Court Order">Court Order</option>
                    <option value="FIR Reference">FIR Reference</option>
                    <option value="Search Warrant">Search Warrant</option>
                    <option value="Missing Person Report">Missing Person Report</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Case / FIR Ref Number</label>
                <input type="text" value={formData.caseReferenceNumber} onChange={e => setFormData({...formData, caseReferenceNumber: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm" placeholder="Reference No." />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Data Requested *</label>
                <textarea required value={formData.dataRequested} onChange={e => setFormData({...formData, dataRequested: e.target.value})} className="w-full p-2 border border-slate-300 rounded outline-none focus:border-blue-500 text-sm h-24 resize-none" placeholder="Describe exactly what data was requested..." />
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" className="bg-blue-600 text-white hover:bg-blue-700">Log Request</Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default ComplianceReportsPage;
