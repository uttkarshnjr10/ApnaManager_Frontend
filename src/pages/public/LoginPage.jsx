// src/pages/public/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowLeft } from 'react-icons/fi';
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
      const loginResult = await login(email, password);

      if (loginResult && loginResult.needsPasswordReset === true) {
        setResetInfo({ show: true, userId: loginResult._id });
        setIsLoading(false);
        return;
      }
      
      if (loginResult && loginResult.role) {
         toast.success(`Welcome, ${loginResult.username}!`);
         
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
    hidden: { opacity: 0, y: 24 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.1 } } 
  };
  
  const itemVariants = { 
    hidden: { opacity: 0, y: 12 }, 
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } 
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
      
      <div className="font-poppins min-h-screen w-screen flex relative overflow-hidden">
        {/* ── Left Panel: Brand / Illustration ── */}
        <div className="hidden lg:flex lg:w-[45%] relative bg-gradient-to-br from-[#1e1b4b] via-[#1e1b4b] to-[#312e81] items-center justify-center p-12 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute w-[500px] h-[500px] bg-indigo-500/25 rounded-full -top-32 -left-32 blur-3xl pointer-events-none"></div>
          <div className="absolute w-[400px] h-[400px] bg-violet-500/20 rounded-full -bottom-20 -right-20 blur-3xl pointer-events-none"></div>
          <div className="absolute w-[300px] h-[300px] bg-indigo-400/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 blur-3xl pointer-events-none"></div>
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #818cf8 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

          <div className="relative z-10 max-w-md text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img src="/logo.png" alt="ApnaManager Logo" className="h-14 w-auto mx-auto mb-8" />
              <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                Manage your guests{' '}
                <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">smarter</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                Join 500+ hotels and law enforcement agencies using ApnaManager for seamless guest verification and real-time compliance.
              </p>

              {/* Stats */}
              <div className="flex items-center justify-center gap-8 mt-10">
                {[
                  { num: '500+', label: 'Hotels' },
                  { num: '99.9%', label: 'Uptime' },
                  { num: '24/7', label: 'Support' },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-2xl font-bold text-white">{stat.num}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Right Panel: Login Form ── */}
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-[#fafbff] via-white to-[#f5f3ff] p-6 sm:p-10 relative">
          {/* Subtle background decoration */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-violet-400/5 rounded-full blur-3xl pointer-events-none"></div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-[420px] relative z-10"
          >
            {/* Back button */}
            <motion.div variants={itemVariants} className="mb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition-colors duration-200 font-medium"
              >
                <FiArrowLeft size={16} />
                Back to Home
              </Link>
            </motion.div>

            {/* Logo for mobile */}
            <motion.div variants={itemVariants} className="lg:hidden mb-6">
              <img src="/logo.png" alt="ApnaManager Logo" className="h-10 w-auto" />
            </motion.div>

            <motion.div variants={itemVariants} className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-1.5">Welcome back</h1>
              <p className="text-gray-500 text-sm">Sign in to your dashboard to continue</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={17} />
                  <input 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="w-full pl-11 pr-4 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200 placeholder:text-gray-400" 
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" size={17} />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter your password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                    className="w-full pl-11 pr-12 py-3 bg-white rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all duration-200 placeholder:text-gray-400" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </motion.div>

              {/* Forgot password link */}
              <motion.div variants={itemVariants} className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                >
                  Forgot Password?
                </button>
              </motion.div>

              <motion.button 
                variants={itemVariants} 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold py-3 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg text-sm"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
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
            
            <motion.p variants={itemVariants} className="text-center text-xs text-gray-400 mt-6">
              Your account type will be automatically detected
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;