// src/pages/public/LoginPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import ForcePasswordResetModal from '../../components/ui/ForcePasswordResetModal'; 
import ForgotPasswordModal from '../../components/ui/ForgotPasswordModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetInfo, setResetInfo] = useState({ show: false, userId: null });
  const [showForgotModal, setShowForgotModal] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResetInfo({ show: false, userId: null });

    try {
      // SIMPLIFIED: Let backend auto-detect role (no loginType needed)
      const loginResult = await login(email, password);

      if (loginResult && loginResult.needsPasswordReset === true) {
        setResetInfo({ show: true, userId: loginResult._id });
        setIsLoading(false);
        return;
      }
      
      if (loginResult && loginResult.role) {
         toast.success(`Welcome, ${loginResult.username}!`);
         
         // Route based on role
         switch (loginResult.role) {
           case 'Hotel':
             navigate('/hotel/dashboard');
             break;
           case 'Police':
             navigate('/police/dashboard');
             break;
           case 'Regional Admin':
             navigate('/regional-admin/dashboard');
             break;
           default:
             console.error("Unknown user role:", loginResult.role);
             navigate('/'); 
         }
      } else if (!loginResult?.needsPasswordReset) {
        throw new Error('Login failed - no user data received');
      }

    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.');
      setIsLoading(false);
    }
  }; 

  const handleResetSuccess = () => {
    setResetInfo({ show: false, userId: null });
    toast.success("Password updated! Please log in with your new password.");
    navigate('/login');
  }; 

  const containerVariants = { 
    hidden: { opacity: 0, y: 30 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.15 } } 
  };
  
  const itemVariants = { 
    hidden: { opacity: 0, y: 15 }, 
    visible: { opacity: 1, y: 0 } 
  };

  return (
    <>
      <AnimatePresence>
        {resetInfo.show && (
          <ForcePasswordResetModal
            userId={resetInfo.userId}
            onSuccess={handleResetSuccess}
          />
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {showForgotModal && (
          <ForgotPasswordModal onClose={() => setShowForgotModal(false)} />
        )}
      </AnimatePresence>
      
      <div className="font-poppins min-h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden"> 
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl"></div>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 z-10 border border-white/20"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <img
              src="/logo.png"
              alt="ApnaManager Logo"
              className="h-14 w-auto mx-auto mb-3"
            />
            <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back</h1>
            <p className="text-gray-600 text-sm">Sign in to your dashboard</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                <input 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={18} />
                <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.button 
                variants={itemVariants} 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3.5 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>
          
          {/* Helper text */}
          <motion.p variants={itemVariants} className="text-center text-xs text-gray-500 mt-4">
            Your account will be automatically detected
          </motion.p>
          
          <motion.div variants={itemVariants} className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
              Forgot Password?
            </button>
            <button 
              onClick={() => navigate('/')} 
              className="text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors flex items-center gap-1">
              <span>← Back to Home</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;