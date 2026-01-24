import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; 
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiBriefcase, FiShield, FiUser } from 'react-icons/fi';
import ForcePasswordResetModal from '../../components/ui/ForcePasswordResetModal'; 
import ForgotPasswordModal from '../../components/ui/ForgotPasswordModal';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // NEW: State for Role Hint (Default to Hotel)
  const [loginType, setLoginType] = useState('Hotel'); 
  
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
      // PASS THE ROLE HINT TO AUTH CONTEXT
      const loginResult = await login(email, password, loginType);

      if (loginResult && loginResult.needsPasswordReset === true) {
        setResetInfo({ show: true, userId: loginResult._id });
        setIsLoading(false);
        return;
      }
      if (loginResult && loginResult.role) {
         toast.success(`Welcome, ${loginResult.username}!`);
         switch (loginResult.role) {
           case 'Hotel':
             navigate('/hotel');
             break;
           case 'Police':
             navigate('/police');
             break;
           case 'Regional Admin':
             navigate('/regional-admin');
             break;
           default:
             console.error("Unknown user role:", loginResult.role);
             navigate('/'); 
         }
      } else if (!loginResult?.needsPasswordReset) {
        console.error("User data or role missing after login.");
        navigate('/'); 
      }

    } catch (error) {
      toast.error(error.message || 'Login failed.');
      setIsLoading(false);
    }
  }; 

  const handleResetSuccess = () => {
    setResetInfo({ show: false, userId: null });
    navigate('/login', { state: { message: "Password updated! Please log in with your new password." } });
  }; 

  const containerVariants = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } };

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
      <div className="font-poppins min-h-screen w-screen bg-[#F8F7FF] flex items-center justify-center relative overflow-hidden"> 

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md bg-white/60 backdrop-blur-lg rounded-2xl shadow-xl p-8 z-10"
        >
          <motion.div variants={itemVariants} className="text-center mb-6">
            <img
              src="/logo.png"
              alt="ApnaManager Logo"
              className="h-12 w-auto mx-auto mb-2"
            />
            <p className="text-gray-600">Login to your Dashboard</p>
          </motion.div>

          {/* --- NEW ROLE SELECTOR --- */}
          <motion.div variants={itemVariants} className="flex bg-gray-100 p-1 rounded-xl mb-6">
            {['Hotel', 'Police', 'Regional Admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setLoginType(role)}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                  loginType === role 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role === 'Hotel' && <FiBriefcase />}
                {role === 'Police' && <FiShield />}
                {role === 'Regional Admin' && <FiUser />}
                <span className="hidden sm:inline">{role === 'Regional Admin' ? 'Admin' : role}</span>
              </button>
            ))}
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div variants={itemVariants} className="relative">
              <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input 
                  type="email" 
                  placeholder={`${loginType} Email Address`} // Hint changes based on selection
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 transition-colors" 
              />
            </motion.div>
            <motion.div variants={itemVariants} className="relative">
              <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                  className="w-full pl-12 pr-12 py-3 bg-gray-50 rounded-lg border-2 border-transparent focus:outline-none focus:border-blue-500 transition-colors" 
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-500 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </div>
            </motion.div>
            <motion.button 
                variants={itemVariants} 
                type="submit" 
                disabled={isLoading} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-blue-500/40 transition-shadow disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : `Login as ${loginType}`}
            </motion.button>
          </form>
          
          <motion.div variants={itemVariants} className="flex justify-between items-center mt-6">
            <button
              onClick={() => setShowForgotModal(true)}
              className="text-sm text-gray-600 hover:text-blue-600">
              Forgot Password?
            </button>
            <button onClick={() => navigate('/')} className="text-sm text-gray-600 hover:text-blue-600">
              ← Back to Home
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default LoginPage;