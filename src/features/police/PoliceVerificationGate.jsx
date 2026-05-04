// src/features/police/PoliceVerificationGate.jsx
import { useState, useEffect, useCallback } from 'react';
import WebcamModal from '../../components/ui/WebcamModal';
import apiClient from '../../api/apiClient';
import toast from 'react-hot-toast';
import { FaShieldAlt, FaCamera, FaClock, FaCheckCircle } from 'react-icons/fa';

/**
 * PoliceVerificationGate
 *
 * Wraps sensitive police pages. Checks for an active verification session
 * on mount. If none exists, shows a full-screen gate requiring the officer
 * to capture a live photo before proceeding.
 *
 * Once verified, renders children normally until the session expires.
 */
const PoliceVerificationGate = ({ children }) => {
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showWebcam, setShowWebcam] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);

  // Real-time countdown timer enhancement
  useEffect(() => {
    if (!expiresAt) return;

    const calculateTimeLeft = () => {
      const diff = new Date(expiresAt).getTime() - new Date().getTime();
      if (diff <= 0) {
        setTimeLeft('00:00');
        // Auto-refresh to trigger the gate again once expired
        window.location.reload();
        return;
      }
      
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeLeft(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  // Check session status on mount
  const checkSession = useCallback(async () => {
    try {
      const res = await apiClient.get('/police/session-status');
      const data = res.data.data;
      if (data.verified) {
        setVerified(true);
        setExpiresAt(data.expiresAt);
      }
    } catch (err) {
      // If 403 or any error, treat as unverified
      console.error('Session check failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  // Convert base64 data URI to a File object for FormData upload
  const dataURItoFile = (dataURI, filename = 'verification.jpg') => {
    const arr = dataURI.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  };

  // Handle photo capture from WebcamModal
  const handleCapture = async (imageSrc) => {
    setShowWebcam(false);
    setSubmitting(true);

    const toastId = toast.loading('Verifying identity...');

    try {
      const file = dataURItoFile(imageSrc);
      const formData = new FormData();
      formData.append('verificationPhoto', file);

      const res = await apiClient.post('/police/verify-session', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data.data;
      setVerified(true);
      setExpiresAt(data.expiresAt);
      toast.success('Identity verified. Session active for 10 minutes.', { id: toastId });
    } catch (err) {
      const msg = err.response?.data?.message || 'Verification failed. Please try again.';
      toast.error(msg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 text-sm">Checking verification status...</p>
        </div>
      </div>
    );
  }

  // Verified — render children
  if (verified) {
    return (
      <>
        {/* Subtle session indicator bar */}
        <div className="mb-4 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-xs text-green-700">
          <span className="flex items-center gap-2">
            <FaCheckCircle />
            Session verified
          </span>
          {expiresAt && (
            <span className={`flex items-center gap-1 font-mono ${
              timeLeft && timeLeft.startsWith('00:') ? 'text-red-600 animate-pulse font-bold' : 'text-green-600'
            }`}>
              <FaClock />
              {timeLeft ? `Expires in ${timeLeft}` : `Expires: ${new Date(expiresAt).toLocaleTimeString()}`}
            </span>
          )}
        </div>
        {children}
      </>
    );
  }

  // Webcam modal open
  if (showWebcam) {
    return (
      <WebcamModal
        onCapture={handleCapture}
        onCancel={() => setShowWebcam(false)}
      />
    );
  }

  // Not verified — show gate
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-10 max-w-lg w-full text-center space-y-6">
        {/* Shield icon */}
        <div className="w-20 h-20 mx-auto bg-indigo-100 rounded-full flex items-center justify-center">
          <FaShieldAlt className="text-indigo-600 text-3xl" />
        </div>

        {/* Title */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Identity Verification Required</h2>
          <p className="text-gray-500 mt-2 leading-relaxed">
            For security and audit compliance, you must verify your identity with a 
            live photo before accessing sensitive guest data.
          </p>
        </div>

        {/* Info cards */}
        <div className="bg-gray-50 rounded-xl p-4 space-y-3 text-left text-sm">
          <div className="flex items-start gap-3">
            <FaCamera className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">A <strong>live camera photo</strong> will be captured and stored for audit purposes.</p>
          </div>
          <div className="flex items-start gap-3">
            <FaClock className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">Your session will remain active for <strong>10 minutes</strong> after verification.</p>
          </div>
          <div className="flex items-start gap-3">
            <FaShieldAlt className="text-indigo-500 mt-0.5 flex-shrink-0" />
            <p className="text-gray-600">This ensures <strong>accountability</strong> and prevents unauthorized access.</p>
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => setShowWebcam(true)}
          disabled={submitting}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-3 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaCamera className="text-lg" />
          {submitting ? 'Verifying...' : 'Open Camera & Verify'}
        </button>

        <p className="text-xs text-gray-400">
          By proceeding, you acknowledge that your photo and activity will be logged.
        </p>
      </div>
    </div>
  );
};

export default PoliceVerificationGate;
