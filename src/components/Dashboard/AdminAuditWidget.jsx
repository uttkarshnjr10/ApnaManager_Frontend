import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { FaShieldAlt, FaExclamationTriangle, FaCheckCircle, FaHistory } from 'react-icons/fa';
import Button from '../ui/Button';
import toast from 'react-hot-toast';

const AdminAuditWidget = () => {
  const [loading, setLoading] = useState(false);
  const [auditData, setAuditData] = useState(null);

  // We can fetch initial status on load or just wait for manual run.
  // We'll let the admin run it manually to save initial load time.
  const runVerification = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/compliance/audit/verify');
      setAuditData(res.data.data);
      if (res.data.data.valid) {
        toast.success('Audit chain verified successfully');
      } else {
        toast.error('Audit chain broken! Check logs.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md h-full flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FaHistory className="text-indigo-600" />
            Audit Chain Status
          </h3>
          <FaShieldAlt className={`text-2xl ${auditData ? (auditData.valid ? 'text-green-500' : 'text-red-500') : 'text-gray-300'}`} />
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Cryptographically verify the integrity of the immutable access log chain to detect tampering.
        </p>

        {auditData && (
          <div className={`p-3 rounded-xl border ${auditData.valid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} mb-4`}>
            {auditData.valid ? (
              <div className="flex flex-col gap-1 text-sm text-green-800">
                <span className="font-bold flex items-center gap-1"><FaCheckCircle /> Chain Intact</span>
                <span>Records checked: <strong>{auditData.checkedCount}</strong></span>
                <span className="text-xs text-green-600 mt-1">Verified at: {new Date(auditData.verifiedAt).toLocaleString()}</span>
              </div>
            ) : (
              <div className="flex flex-col gap-1 text-sm text-red-800">
                <span className="font-bold flex items-center gap-1"><FaExclamationTriangle /> Integrity Warning</span>
                <span>Broken at ID: <strong>{auditData.brokenAt}</strong></span>
                <span>Records before break: <strong>{auditData.checkedCount}</strong></span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="pt-2">
        <Button onClick={runVerification} disabled={loading} variant="secondary" className="w-full justify-center text-sm">
          {loading ? 'Verifying...' : 'Run Verification Now'}
        </Button>
      </div>
    </div>
  );
};

export default AdminAuditWidget;
