import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import Lottie from 'lottie-react';
import { FaArrowRight, FaUserPlus, FaShieldAlt, FaBolt, FaChartLine } from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import signupAnimation from '../Signup Flow.json';

import ModernCompliance from '../../components/layout/LandingPage/ModernCompliance';
import Footer from '../../components/layout/LandingPage/Footer';

const Motion = motion;

const HomePage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lottieRef = useRef(null);
  const heroVisualRef = useRef(null);
  const isHeroVisualInView = useInView(heroVisualRef, {
    amount: 0.35,
    margin: '-10% 0px -20% 0px',
  });
  const shouldReduceMotion = useReducedMotion();

  const titleContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  };

  const titleText = 'Welcome to a Centralized Data Management System';

  const trustBadges = [
    { icon: <FaShieldAlt />, label: 'Bank-Grade Security' },
    { icon: <FaBolt />, label: 'Real-time Sync' },
    { icon: <FaChartLine />, label: 'Smart Analytics' },
  ];

  useEffect(() => {
    if (!lottieRef.current) return;

    if (shouldReduceMotion) {
      lottieRef.current.stop();
      return;
    }

    if (isHeroVisualInView) {
      lottieRef.current.play();
    } else {
      lottieRef.current.pause();
    }
  }, [isHeroVisualInView, shouldReduceMotion]);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-slate-50 font-poppins text-slate-900">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-slate-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3" onClick={closeMenu}>
            <img src="/logo.png" alt="ApnaManager Logo" className="h-8 w-auto" />
            <span className="text-sm font-bold text-slate-900 sm:text-base">ApnaManager</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/why-us" className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900">
              Why Us
            </Link>
            <Link to="/hotel-registration" className="text-sm font-medium text-slate-600 transition-colors duration-150 hover:text-slate-900">
              Register Hotel
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 transition-colors duration-150 hover:bg-slate-100 md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <Motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/35 md:hidden"
              aria-label="Close navigation"
              onClick={closeMenu}
            />
            <Motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed left-0 right-0 top-16 z-50 border-b border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden"
            >
              <div className="mx-auto flex max-w-7xl flex-col gap-2">
                <Link to="/why-us" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Why Us
                </Link>
                <Link to="/hotel-registration" onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Register Hotel
                </Link>
                <Link to="/login" onClick={closeMenu} className="mt-2 inline-flex min-h-11 items-center justify-center rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-medium text-white">
                  Sign In
                </Link>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="relative min-h-[92vh] overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50 pt-24">
        <div className="mx-auto grid min-h-[calc(92vh-6rem)] max-w-7xl items-center gap-10 px-4 pb-16 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          >
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-semibold tracking-wide text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Trusted by 500+ Hotels & Agencies
              </span>
            </Motion.div>

            <Motion.h1
              variants={titleContainerVariants}
              initial="hidden"
              animate="visible"
              className="mb-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-slate-900 md:text-5xl"
            >
              {titleText.split(' ').map((word, index) => (
                <Motion.span variants={wordVariants} key={index} className="mr-2 inline-block">
                  {word}
                </Motion.span>
              ))}
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.2 }}
              className="mb-8 max-w-xl text-base leading-relaxed text-slate-500 md:text-lg"
            >
              A unified platform for hotels and law enforcement to ensure guest safety through seamless digital verification and real-time data sharing.
            </Motion.p>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 1.5 }}
              className="mb-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row"
            >
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white transition-colors duration-150 hover:bg-blue-700"
              >
                Get Started
                <FaArrowRight />
              </Link>
              <Link
                to="/hotel-registration"
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 transition-colors duration-150 hover:bg-slate-50"
              >
                Join Us
                <FaUserPlus />
              </Link>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
              className="flex flex-wrap justify-center gap-3 lg:justify-start"
            >
              {trustBadges.map((badge) => (
                <div key={badge.label} className="flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-3 py-2 text-xs font-medium text-slate-500 shadow-sm">
                  <span className="text-blue-600">{badge.icon}</span>
                  {badge.label}
                </div>
              ))}
            </Motion.div>
          </Motion.div>

          <Motion.div
            ref={heroVisualRef}
            initial={{ opacity: 0, scale: 0.96, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="hidden items-center justify-center lg:flex"
          >
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-3">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="ml-auto text-xs font-medium text-slate-400">Live verification flow</span>
              </div>
              <Lottie
                lottieRef={lottieRef}
                animationData={signupAnimation}
                autoplay={!shouldReduceMotion}
                loop={!shouldReduceMotion}
                className="w-full"
              />
            </div>
          </Motion.div>
        </div>

        <Motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-slate-400 md:flex"
        >
          <span className="text-xs font-medium uppercase tracking-wide">Scroll to explore</span>
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-slate-300 p-1.5">
            <Motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="h-1.5 w-1.5 rounded-full bg-blue-600"
            />
          </div>
        </Motion.div>
      </section>

      <ModernCompliance />
      <Footer />
    </div>
  );
};

export default HomePage;
