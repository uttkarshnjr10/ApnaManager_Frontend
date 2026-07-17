import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { FaShieldAlt, FaPhoneAlt, FaLock, FaDownload, FaTrash, FaCheckCircle, FaInfoCircle, FaFileDownload } from 'react-icons/fa';

const STAGES = { PHONE_ENTRY: 1, OTP_ENTRY: 2, RECORDS_VIEW: 3 };

const GuestDataPortal = () => {
  const [stage, setStage] = useState(STAGES.PHONE_ENTRY);
  const [phone, setPhone] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [portalToken, setPortalToken] = useState(null);
  
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown(c => c - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (phone.length < 10) return toast.error('Enter a valid phone number');
    
    setLoading(true);
    try {
      const res = await apiClient.post('/portal/verify', { phone });
      if (res.data.data?.maskedEmail) {
        setMaskedEmail(res.data.data.maskedEmail);
      }
      setStage(STAGES.OTP_ENTRY);
      setCooldown(60);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (idx, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value !== '' && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (idx, e) => {
    if (e.key === 'Backspace' && otp[idx] === '' && idx > 0) {
      const prevInput = document.getElementById(`otp-${idx - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length !== 6) return toast.error('Enter a 6-digit code');

    setLoading(true);
    try {
      const res = await apiClient.post('/portal/confirm', { phone, otp: otpString });
      const token = res.data.data.portalToken;
      setPortalToken(token);
      
      // Fetch records immediately
      const recordsRes = await apiClient.get('/portal/records', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRecords(recordsRes.data.data.records);
      setStage(STAGES.RECORDS_VIEW);
      toast.success('Identity verified');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid or expired code');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestDeletion = async (recordId) => {
    if (!window.confirm('Are you sure you want to request deletion of this record?')) return;
    try {
      const res = await apiClient.post('/portal/delete-request', { recordId }, {
        headers: { Authorization: `Bearer ${portalToken}` }
      });
      toast.success(res.data.message);
      
      // Update local state
      setRecords(records.map(r => 
        r.id === recordId 
          ? { ...r, deletionScheduledFor: res.data.data?.scheduledFor || r.retentionExpiresAt } 
          : r
      ));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Deletion request failed');
    }
  };

  const handleDownload = async (recordId) => {
    try {
      toast.loading('Generating PDF...', { id: 'pdf' });
      const res = await apiClient.get(`/portal/download/${recordId}`, {
        headers: { Authorization: `Bearer ${portalToken}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `my-data-${recordId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Download complete', { id: 'pdf' });
    } catch (err) {
      toast.error('Failed to download data', { id: 'pdf' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <FaShieldAlt className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900">Guest Data Portal</h1>
          <p className="mt-3 text-lg text-gray-500">
            Securely access, review, and manage your hotel stay records under the DPDP Act.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {stage === STAGES.PHONE_ENTRY && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FaPhoneAlt className="text-slate-400" /> Verify Identity
              </h2>
              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g., 9876543210"
                    required
                    maxLength={15}
                  />
                </div>
                <Button type="submit" className="w-full" isLoading={loading}>
                  Send Verification Code
                </Button>
                <div className="text-xs text-gray-500 bg-slate-50 p-3 rounded text-center">
                  Your phone number is used only to locate your records. We will send a secure OTP to the email address on file.
                </div>
              </form>
            </motion.div>
          )}

          {stage === STAGES.OTP_ENTRY && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md mx-auto"
            >
              <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <FaLock className="text-slate-400" /> Enter Secure Code
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                We sent a 6-digit code to {maskedEmail ? <strong className="text-gray-800">{maskedEmail}</strong> : 'your email address'}.
              </p>
              
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-slate-50"
                    />
                  ))}
                </div>
                
                <Button type="submit" className="w-full" isLoading={loading}>
                  Verify & Access Records
                </Button>
                
                <div className="flex flex-col items-center gap-3 text-sm">
                  <button 
                    type="button" 
                    disabled={cooldown > 0 || loading}
                    onClick={() => handlePhoneSubmit(new Event('submit'))}
                    className={`font-medium ${cooldown > 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-500'}`}
                  >
                    {cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}
                  </button>
                  <button 
                    type="button" 
                    onClick={() => { setStage(STAGES.PHONE_ENTRY); setOtp(['','','','','','']); }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    Use different phone number
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {stage === STAGES.RECORDS_VIEW && (
            <motion.div
              key="records"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-full text-green-600">
                    <FaCheckCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Verified</h3>
                    <p className="text-xs text-gray-500">{phone}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { setStage(STAGES.PHONE_ENTRY); setPortalToken(null); }}>
                  Exit Portal
                </Button>
              </div>

              {records.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-2xl shadow-sm border border-slate-100">
                  <FaInfoCircle className="mx-auto text-4xl text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">No Records Found</h3>
                  <p className="mt-2 text-gray-500">We could not find any hotel stays associated with this phone number.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {records.map(record => (
                    <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                      <div className="p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{record.hotelName || 'Unknown Hotel'}</h3>
                            <p className="text-gray-500">{record.hotelCity || 'Unknown Location'}</p>
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            {record.isAnonymized ? (
                              <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold rounded-full border border-red-100">
                                Anonymized {new Date(record.anonymizedAt).toLocaleDateString()}
                              </span>
                            ) : (
                              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${record.status === 'Checked-In' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                                {record.status}
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase">Check-in</span>
                            {record.checkIn ? new Date(record.checkIn).toLocaleDateString() : 'N/A'}
                          </div>
                          <div>
                            <span className="block text-xs font-medium text-gray-400 uppercase">Checkout</span>
                            {record.checkOut ? new Date(record.checkOut).toLocaleDateString() : 'Ongoing'}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-3 items-center justify-between">
                          <Button 
                            variant="secondary" 
                            className="text-sm"
                            disabled={record.isAnonymized}
                            onClick={() => handleDownload(record.id)}
                          >
                            <FaFileDownload className="mr-2" /> Download Data
                          </Button>

                          {!record.isAnonymized && (
                            <div>
                              {record.deletionScheduledFor ? (
                                <span className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-2 rounded-lg flex items-center gap-2">
                                  <FaInfoCircle /> Deletion Scheduled: {new Date(record.deletionScheduledFor).toLocaleDateString()}
                                </span>
                              ) : record.canRequestDeletion ? (
                                <Button 
                                  variant="danger" 
                                  className="text-sm"
                                  onClick={() => handleRequestDeletion(record.id)}
                                >
                                  <FaTrash className="mr-2" /> Request Deletion
                                </Button>
                              ) : (
                                <span className="text-sm text-gray-500 bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2" title="We are legally required to retain records for 3 years from checkout date.">
                                  <FaInfoCircle className="text-blue-500" /> Retention until {record.retentionExpiresAt ? new Date(record.retentionExpiresAt).toLocaleDateString() : 'N/A'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Questions about your data? Contact the platform administrator.</p>
          <p className="mt-2 text-xs">Protected under the DPDP Act 2023</p>
        </div>
      </div>
    </div>
  );
};

export default GuestDataPortal;
