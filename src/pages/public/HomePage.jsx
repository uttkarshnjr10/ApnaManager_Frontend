import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { FaArrowRight, FaUserPlus, FaShieldAlt, FaBolt, FaChartLine } from 'react-icons/fa';
import signupAnimation from '../Signup Flow.json';

import ModernCompliance from '../../components/layout/LandingPage/ModernCompliance';
import Footer from '../../components/layout/LandingPage/Footer';

const HomePage = () => {
  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const titleText = "Welcome to a Centralized Data Management System";

  const trustBadges = [
    { icon: <FaShieldAlt />, label: 'Bank-Grade Security' },
    { icon: <FaBolt />, label: 'Real-time Sync' },
    { icon: <FaChartLine />, label: 'Smart Analytics' },
  ];

  return (
    <div className="font-poppins bg-[#fafbff] text-gray-800 min-h-screen w-full flex flex-col relative overflow-x-hidden scroll-smooth">

      {/* ── Sticky Top Nav Bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 lg:px-10 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/70 backdrop-blur-xl rounded-2xl px-6 py-3 shadow-lg shadow-gray-200/50 border border-white/80">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="ApnaManager Logo" className="h-9 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/why-us"
              className="text-gray-600 hover:text-indigo-600 px-4 py-2 text-sm font-medium transition-colors duration-200"
            >
              Why Us
            </Link>
            <Link
              to="/login"
              className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════ HERO SECTION ══════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center pt-24">

        {/* Mesh Gradient Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8f9ff] via-[#eef1ff] to-[#f0e6ff]"></div>
          {/* Animated gradient orbs */}
          <div className="absolute w-[700px] h-[700px] bg-indigo-400/15 rounded-full top-[-10%] left-[-5%] animate-float blur-3xl"></div>
          <div className="absolute w-[500px] h-[500px] bg-violet-400/12 rounded-full bottom-[5%] right-[-5%] animate-float-slow blur-3xl [animation-delay:-7s]"></div>
          <div className="absolute w-[400px] h-[400px] bg-blue-300/10 rounded-full top-[40%] left-[50%] animate-float blur-3xl [animation-delay:-3s]"></div>
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 lg:px-10">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="grid lg:grid-cols-2 items-center gap-12 lg:gap-16"
          >
            {/* Text Content */}
            <div className="flex flex-col text-center lg:text-left items-center lg:items-start py-8 lg:py-0">
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-6"
              >
                <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-xs font-semibold tracking-wide border border-indigo-100">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></span>
                  Trusted by 500+ Hotels & Agencies
                </span>
              </motion.div>

              <motion.h1
                variants={titleContainerVariants}
                initial="hidden"
                animate="visible"
                className="text-4xl md:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.12] tracking-tight text-gray-900 mb-6"
              >
                {titleText.split(' ').map((word, index) => (
                  <motion.span variants={wordVariants} key={index} className="inline-block mr-2.5">
                    {word === 'Centralized' || word === 'Data' || word === 'Management' ? (
                      <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 bg-clip-text text-transparent">{word}</span>
                    ) : word}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.2 }}
                className="text-lg leading-relaxed text-gray-500 mb-8 max-w-lg"
              >
                A unified platform for hotels and law enforcement to ensure guest safety through seamless digital verification and real-time data sharing.
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1.5 }}
                className="flex flex-col sm:flex-row gap-4 items-center mb-10"
              >
                <Link
                  to="/login"
                  className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 via-violet-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-semibold text-base transition-all duration-300 ease-out shadow-xl shadow-indigo-500/25 hover:shadow-2xl hover:shadow-indigo-500/35 hover:-translate-y-1 active:scale-[0.98]"
                >
                  Get Started
                  <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/hotel-registration"
                  className="group inline-flex items-center justify-center gap-3 bg-white/80 backdrop-blur-sm text-gray-700 px-8 py-4 rounded-2xl font-semibold text-base border border-gray-200 transition-all duration-300 ease-out hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50 hover:-translate-y-1 hover:shadow-lg active:scale-[0.98]"
                >
                  Join Us
                  <FaUserPlus className="transition-transform duration-300 group-hover:scale-110" />
                </Link>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.8 }}
                className="flex flex-wrap justify-center lg:justify-start gap-4"
              >
                {trustBadges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-white/60 backdrop-blur-sm px-3 py-2 rounded-xl border border-gray-100">
                    <span className="text-indigo-500">{badge.icon}</span>
                    {badge.label}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Lottie Animation in glass frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
              className="hidden lg:flex items-center justify-center"
            >
              <div className="relative">
                {/* Glow behind the card */}
                <div className="absolute -inset-4 bg-gradient-to-r from-indigo-400/20 via-violet-400/20 to-blue-400/20 rounded-3xl blur-2xl pointer-events-none"></div>
                <div className="relative bg-white/40 backdrop-blur-xl rounded-3xl p-6 border border-white/60 shadow-2xl shadow-indigo-500/10">
                  <Lottie animationData={signupAnimation} loop={true} className="max-w-md w-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
        >
          <span className="text-xs font-medium text-gray-400 tracking-wider uppercase">Scroll to explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center p-1.5">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1.5 h-1.5 bg-indigo-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ══════════════════ FEATURES & FOOTER ══════════════════ */}
      <ModernCompliance />
      <Footer />
    </div>
  );
};

export default HomePage;