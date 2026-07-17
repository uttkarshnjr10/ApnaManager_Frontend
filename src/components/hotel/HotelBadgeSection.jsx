import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { FaAward, FaCheckCircle, FaTimesCircle, FaDownload, FaCopy } from 'react-icons/fa';
import Button from '../ui/Button';
import Card from '../ui/Card';

const HotelBadgeSection = () => {
  const [badgeData, setBadgeData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBadgeStatus = async () => {
      try {
        const res = await apiClient.get('/badge/status');
        setBadgeData(res.data.data);
      } catch (err) {
        toast.error('Failed to load badge status');
      } finally {
        setLoading(false);
      }
    };
    fetchBadgeStatus();
  }, []);

  const handleDownload = async () => {
    try {
      toast.loading('Generating Badge...', { id: 'badge' });
      const res = await apiClient.get('/badge/download', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'apnamanager-badge.svg');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Badge downloaded successfully', { id: 'badge' });
    } catch (err) {
      toast.error('Failed to download badge', { id: 'badge' });
    }
  };

  const copyUrl = () => {
    const url = `https://apnamanager.in/verify/${badgeData.verificationCode}`;
    navigator.clipboard.writeText(url);
    toast.success('Verification URL copied!');
  };

  if (loading) {
    return <div className="animate-pulse h-48 bg-slate-100 rounded-xl"></div>;
  }

  if (!badgeData) return null;

  const { eligible, requirements, verificationCode } = badgeData;

  return (
    <Card className="mt-8 overflow-hidden">
      <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-3">
        <FaAward className={eligible ? "text-yellow-500 text-xl" : "text-slate-400 text-xl"} />
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {eligible ? 'Your Compliance Badge' : 'Earn Your Compliance Badge'}
          </h2>
          <p className="text-sm text-slate-500">
            {eligible 
              ? 'Display this badge to show guests you use a verified, compliant registration system.' 
              : 'Meet the requirements below to unlock your DPDP Act compliant trust badge.'}
          </p>
        </div>
      </div>

      <div className="p-6">
        {eligible ? (
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 flex flex-col items-center min-w-[250px]">
              <div className="text-sm font-bold text-blue-700 tracking-wider mb-2">APNA MANAGER</div>
              <div className="text-xs text-slate-500 mb-4">Verified Digital Registration</div>
              <div className="w-32 h-32 bg-white rounded-lg border-2 border-blue-600 flex items-center justify-center mb-4">
                <span className="text-xs text-slate-400">QR Code</span>
              </div>
              <div className="text-xs text-slate-500 font-mono">{verificationCode}</div>
            </div>
            
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <FaCheckCircle className="text-green-500" /> Badge Unlocked!
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Congratulations! Your hotel is a verified partner. Display this badge at your reception desk, on your website, and on booking platforms. Guests can scan the QR code to verify your compliance in real-time.
                </p>
              </div>
              
              <div className="space-y-3">
                <Button onClick={handleDownload} className="w-full sm:w-auto">
                  <FaDownload className="mr-2" /> Download Badge (SVG)
                </Button>
                
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">
                    Verification URL
                  </label>
                  <div className="flex items-center gap-2">
                    <code className="text-sm bg-slate-100 px-3 py-2 rounded text-slate-700 flex-1 overflow-x-auto">
                      https://apnamanager.in/verify/{verificationCode}
                    </code>
                    <Button variant="secondary" onClick={copyUrl}>
                      <FaCopy />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 max-w-lg">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                {requirements.daysActive >= requirements.daysRequired 
                  ? <FaCheckCircle className="text-green-500 text-lg" />
                  : <FaTimesCircle className="text-slate-300 text-lg" />
                }
                <div>
                  <div className="font-medium text-slate-800">30+ Days Active</div>
                  <div className="text-xs text-slate-500">Currently: {requirements.daysActive} days</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                {requirements.guestCount >= requirements.guestsRequired 
                  ? <FaCheckCircle className="text-green-500 text-lg" />
                  : <FaTimesCircle className="text-slate-300 text-lg" />
                }
                <div>
                  <div className="font-medium text-slate-800">10+ Guests Registered (Last 30 Days)</div>
                  <div className="text-xs text-slate-500">Currently: {requirements.guestCount} guests</div>
                </div>
              </div>
            </div>

            <p className="text-sm text-slate-500 bg-blue-50 text-blue-800 p-4 rounded-lg">
              Once both requirements are met, your badge will be automatically granted during our daily system check.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HotelBadgeSection;
