import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import apiClient from '../../api/apiClient';
import Button from './Button';

// Self-contained SVG icons to remove external dependency
const LockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeOffIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.11 3.522-5.44 6.697-6.16M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.93 4.93l14.14 14.14" />
    </svg>
);

const ForcePasswordResetModal = ({ userId, onSuccess }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("[ForceReset] Submit triggered", { userId });

    // Validation logs
    if (newPassword !== confirmPassword) {
      console.error("[ForceReset] Password mismatch");
      toast.error("Passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      console.error("[ForceReset] Password too short", { length: newPassword.length });
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading('Updating password...');

    try {
      console.log("[ForceReset] Sending request to /auth/change-password");

      const res = await apiClient.post('/auth/change-password', {
        userId,
        newPassword,
      });

      console.log("[ForceReset] API Success Response:", res.data);

      toast.success("Password changed successfully! Please log in.", { id: toastId });
      onSuccess();

    } catch (err) {
      console.error("❌ [ForceReset] Password change failed");

      // Axios error debugging
      if (err.response) {
        console.error("[ForceReset] Server Response:", {
          status: err.response.status,
          data: err.response.data,
          headers: err.response.headers,
        });
      } 
      else if (err.request) {
        console.error("[ForceReset] No response from server:", err.request);
      } 
      else {
        console.error("[ForceReset] Request setup error:", err.message);
      }

      toast.error(err.response?.data?.message || "Failed to change password.", { id: toastId });

    } finally {
      console.log("[ForceReset] Request finished");
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800">Create New Password</h2>
          <p className="text-gray-600 mt-2">
            For security, you must create a new password before you can proceed.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-8 pb-8 text-left">
          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400">
              <LockIcon />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />

            <div
              className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </div>
          </div>

          <div className="relative">
            <div className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400">
              <LockIcon />
            </div>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Set New Password'}
        </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ForcePasswordResetModal;

