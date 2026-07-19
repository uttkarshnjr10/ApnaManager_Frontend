import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import Lottie from 'lottie-react';
import { 
  FaArrowRight, FaUserPlus, FaShieldAlt, FaChartLine, FaHotel, FaBuilding, 
  FaCheckCircle, FaLock, FaSyncAlt, FaClipboardCheck 
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import signupAnimation from '../Signup Flow.json';
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

  const titleText = 'Centralized Guest Verification & Management Portal';

  const trustBadges = [
    { icon: <FaLock className="text-xs" />, label: 'End-to-End Encryption' },
    { icon: <FaSyncAlt className="text-xs" />, label: 'Real-time Synchronized logs' },
    { icon: <FaClipboardCheck className="text-xs" />, label: 'Regulatory Compliant (Form C)' },
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
    <div className="min-h-screen w-full overflow-x-hidden bg-[#FAF8F5] font-poppins text-[#2C2925] selection:bg-blue-600/10 scroll-smooth">
      {/* Top Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#EBE6DD]/60 bg-[#FAF8F5]/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/logo.png" alt="ApnaManager Logo" className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-bold text-blue-600 transition-colors duration-150">
              Home
            </Link>
            <Link to="/why-us" className="text-sm font-bold text-[#5C5346] hover:text-blue-600 transition-colors duration-150">
              Why Us
            </Link>
            <Link to="/hotel-registration" className="text-sm font-bold text-[#5C5346] hover:text-blue-600 transition-colors duration-150">
              Register Hotel
            </Link>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="inline-flex min-h-10 items-center justify-center rounded-xl bg-blue-600 px-5 text-sm font-bold text-white shadow-sm shadow-blue-600/15 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              Sign In
            </Link>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#EBE6DD] bg-white text-[#2C2925] hover:bg-[#F2EDE4] transition-colors md:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label="Open navigation menu"
          >
            {mobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <Motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-[#1F1C18]/30 backdrop-blur-sm md:hidden"
              aria-label="Close navigation"
              onClick={closeMenu}
            />
            <Motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="fixed left-0 right-0 top-16 z-50 border-b border-[#EBE6DD] bg-[#FAF8F5] p-5 shadow-xl rounded-b-3xl md:hidden"
            >
              <div className="mx-auto flex flex-col gap-3">
                <Link to="/" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-blue-600 bg-[#F2EDE4]/50 transition-all">
                  Home
                </Link>
                <Link to="/why-us" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-[#2C2925] hover:bg-[#F2EDE4] transition-all">
                  Why Us
                </Link>
                <Link to="/hotel-registration" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-[#2C2925] hover:bg-[#F2EDE4] transition-all">
                  Register Hotel
                </Link>
                <Link to="/login" onClick={closeMenu} className="mt-2 inline-flex min-h-12 items-center justify-center rounded-2xl bg-blue-600 px-5 text-sm font-bold text-white shadow-md shadow-blue-600/15">
                  Sign In
                </Link>
              </div>
            </Motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden pt-28 pb-12 flex items-center bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F5F2EB]">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            {/* Hero Left Column */}
            <Motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              <div className="mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#DED7CD] bg-[#F2EDE4] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#5C5346]">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Centralized Data Verification System
                </span>
              </div>

              <h1 className="mb-5 text-3xl font-black tracking-tight text-[#1F1C18] sm:text-5xl md:text-6xl leading-tight">
                Unified Portal for <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Compliance & Safety</span>
              </h1>

              <p className="mb-8 max-w-xl text-sm leading-relaxed text-[#7C756B] sm:text-base md:text-lg">
                A secure, high-grade framework for hospitality operators and platform administrators to sync logs, capture identities, and verify guests.
              </p>

              <div className="mb-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  to="/login"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/15 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Get Started
                  <FaArrowRight size={13} />
                </Link>
                <Link
                  to="/hotel-registration"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#C8BFAF] bg-white px-6 py-3 text-sm font-bold text-[#4A4238] shadow-sm hover:bg-[#FAF8F5] transition-all hover:scale-[1.02] active:scale-95"
                >
                  Join as Partner Hotel
                  <FaUserPlus size={13} />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-2.5 lg:justify-start">
                {trustBadges.map((badge) => (
                  <div key={badge.label} className="flex items-center gap-2 rounded-xl border border-[#EBE6DD] bg-white/70 px-3.5 py-2 text-xs font-semibold text-[#5C5346] shadow-sm backdrop-blur-sm">
                    <span className="text-blue-600">{badge.icon}</span>
                    {badge.label}
                  </div>
                ))}
              </div>
            </Motion.div>

            {/* Hero Right Column */}
            <Motion.div
              ref={heroVisualRef}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-5 flex items-center justify-center"
            >
              <div className="w-full max-w-md rounded-3xl border border-[#EBE6DD]/80 bg-white p-4 sm:p-5 shadow-lg">
                <div className="mb-4 flex items-center gap-2 border-b border-[#FAF8F5] pb-3 px-1">
                  <span className="h-3 w-3 rounded-full bg-red-400" />
                  <span className="h-3 w-3 rounded-full bg-amber-400" />
                  <span className="h-3 w-3 rounded-full bg-emerald-400" />
                  <span className="ml-auto text-[10px] font-bold uppercase tracking-wider text-slate-400">Live verification loop</span>
                </div>
                <Lottie
                  lottieRef={lottieRef}
                  animationData={signupAnimation}
                  autoplay={!shouldReduceMotion}
                  loop={!shouldReduceMotion}
                  className="w-full h-auto max-h-[300px] sm:max-h-[360px]"
                />
              </div>
            </Motion.div>
          </div>
        </div>
      </section>

      {/* Product Overview Section: Hotels, Admin */}
      <section className="py-20 bg-white border-t border-[#EBE6DD]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700">
              Core Ecosystem
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#1F1C18] sm:text-4xl">
              Who We Serve
            </h2>
            <p className="mt-3 text-base text-[#7C756B] sm:text-lg">
              Designed as a high-grade verification network connecting two core pillars of compliance and safety.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Card 1: For Hotels */}
            <div className="flex flex-col rounded-3xl border border-[#EBE6DD] bg-[#FAF8F5]/30 p-6 sm:p-8 transition-all hover:shadow-md hover:border-blue-200">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <FaHotel size={22} />
              </div>
              <h3 className="mb-3 text-lg font-extrabold text-[#1F1C18] sm:text-xl">For Hotels</h3>
              <p className="mb-5 text-sm leading-relaxed text-[#7C756B]">
                Streamline guest check-ins with quick digital registration, automatic photo verification, and effortless compliance tracking.
              </p>
              <ul className="mt-auto space-y-3 pt-4 border-t border-[#EBE6DD]/60">
                {['One-click Form C preparation', 'Secure data storage vault', 'Instant guest status view'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-xs font-bold text-[#5C5346]">
                    <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>


            {/* Card 3: For Admins */}
            <div className="flex flex-col rounded-3xl border border-[#EBE6DD] bg-[#FAF8F5]/30 p-6 sm:p-8 transition-all hover:shadow-md hover:border-blue-200">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <FaBuilding size={20} />
              </div>
              <h3 className="mb-3 text-lg font-extrabold text-[#1F1C18] sm:text-xl">For Platform Admins</h3>
              <p className="mb-5 text-sm leading-relaxed text-[#7C756B]">
                Monitor registration trends, audit active hotels and stations, and manage administrative settings on a secure sovereign portal.
              </p>
              <ul className="mt-auto space-y-3 pt-4 border-t border-[#EBE6DD]/60">
                {['System-wide audit logs', 'Hotel account control', 'Verification compliance charts'].map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-xs font-bold text-[#5C5346]">
                    <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section: Compliance Lifecycle */}
      <section className="py-20 bg-[#FAF8F5] border-t border-[#EBE6DD]/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center rounded-full border border-[#DED7CD] bg-[#F2EDE4] px-3.5 py-1 text-xs font-bold text-[#5C5346]">
              Process Flow
            </span>
            <h2 className="text-3xl font-black tracking-tight text-[#1F1C18] sm:text-4xl">
              Compliance Lifecycle
            </h2>
            <p className="mt-3 text-base text-[#7C756B] sm:text-lg">
              A transparent, automated registration pipeline protecting both hospitality operators and authorities.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-[#EBE6DD]/85 bg-white p-6 shadow-sm text-left">
              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-sm font-bold">
                1
              </div>
              <h3 className="mb-2 text-base font-extrabold text-[#1F1C18] pr-8">Identity Capture</h3>
              <p className="text-xs leading-relaxed text-[#7C756B]">
                Hotel staff input guest registration details, upload ID documents, and capture live webcam photos.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-[#EBE6DD]/85 bg-white p-6 shadow-sm text-left">
              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 text-sm font-bold">
                2
              </div>
              <h3 className="mb-2 text-base font-extrabold text-[#1F1C18] pr-8">Stay Association</h3>
              <p className="text-xs leading-relaxed text-[#7C756B]">
                Room number, stay dates, and purpose of visit are linked to the verified guest credentials.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-[#EBE6DD]/85 bg-white p-6 shadow-sm text-left">
              <div className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600 text-sm font-bold">
                3
              </div>
              <h3 className="mb-2 text-base font-extrabold text-[#1F1C18] pr-8">Encrypted Sync</h3>
              <p className="text-xs leading-relaxed text-[#7C756B]">
                Data is encrypted and synced immediately, allowing platform administration to audit compliant logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Section Banner */}
      <section className="py-16 bg-white border-t border-[#EBE6DD]/40">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl bg-gradient-to-br from-[#1F1C18] to-[#2C2925] p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 text-white/5 pointer-events-none">
              <FaLock size={200} />
            </div>
            
            <div className="max-w-2xl text-left space-y-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-blue-300">
                <FaLock size={10} /> Sovereign Security
              </span>
              <h3 className="text-2xl font-black sm:text-3xl leading-tight">
                High-Grade Enterprise Standard Data Protection
              </h3>
              <p className="text-sm leading-relaxed text-stone-300">
                All data is encrypted in transit and at rest using modern secure encryption standards, hosted on sovereign compliant clouds to guarantee complete safety and strict compliance with local regulations.
              </p>
              <div className="pt-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                  <FaCheckCircle className="text-blue-400" /> Authorized Roles Only
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-stone-200">
                  <FaCheckCircle className="text-blue-400" /> Full Audit Trails
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default HomePage;
