import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/apiClient';
import { FaCheckCircle, FaTimesCircle, FaShieldAlt } from 'react-icons/fa';
import Button from '../../components/ui/Button';

const VerifyHotelPage = () => {
  const { code } = useParams();
  const [status, setStatus] = useState('loading'); // 'loading', 'valid', 'invalid'
  const [data, setData] = useState(null);

  useEffect(() => {
    const verifyBadge = async () => {
      try {
        const res = await apiClient.get(`/public/verify/${code}`);
        if (res.data.valid) {
          setData(res.data);
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      } catch (err) {
        setStatus('invalid');
      }
    };
    verifyBadge();
  }, [code]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden text-center p-8">
        
        {status === 'loading' && (
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-20 h-20 bg-slate-200 rounded-full mb-6"></div>
            <div className="h-6 bg-slate-200 w-3/4 mb-4 rounded"></div>
            <div className="h-4 bg-slate-200 w-1/2 rounded"></div>
          </div>
        )}

        {status === 'invalid' && (
          <div className="flex flex-col items-center">
            <FaTimesCircle className="text-red-500 text-6xl mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Verification Failed</h1>
            <p className="text-slate-600 mb-6 leading-relaxed">
              This badge may be invalid or the hotel may have been removed from our platform.
            </p>
            <Link to="/">
              <Button>Return Home</Button>
            </Link>
          </div>
        )}

        {status === 'valid' && data && (
          <div className="flex flex-col items-center">
            <FaCheckCircle className="text-green-500 text-6xl mb-4" />
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Verified Hotel Partner</h1>
            
            <div className="my-6 p-4 bg-slate-50 border border-slate-100 rounded-xl w-full">
              <h2 className="text-xl font-bold text-blue-700">{data.hotelName}</h2>
              <p className="text-slate-600">{data.city}, {data.state}</p>
              <p className="text-xs text-slate-400 mt-2 font-medium">
                Member since {new Date(data.verifiedSince).getFullYear()}
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-semibold mb-6 border border-green-100">
              <FaShieldAlt /> {data.compliance}
            </div>

            <div className="text-left w-full border-t border-slate-100 pt-6">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-3">
                What this means for you:
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1"><FaCheckCircle className="text-blue-500 text-xs" /></div>
                  Your data is collected only for legal compliance purposes
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1"><FaCheckCircle className="text-blue-500 text-xs" /></div>
                  Your information is encrypted and securely stored
                </li>
                <li className="flex items-start gap-2">
                  <div className="min-w-4 mt-1"><FaCheckCircle className="text-blue-500 text-xs" /></div>
                  You have the right to access and delete your data at our <Link to="/my-data" className="text-blue-600 hover:underline">Self-Service Portal</Link>
                </li>
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 w-full">
              <p className="text-xs text-slate-400 font-medium">Powered by {data.platformName}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default VerifyHotelPage;
