import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaShieldAlt, FaUsers, FaLock, FaBell, FaFileInvoice, 
  FaArrowRight, FaClock 
} from 'react-icons/fa';
import { FiMenu, FiX } from 'react-icons/fi';
import Footer from '../../components/layout/LandingPage/Footer';

const Motion = motion;

const FeatureCard = ({ icon, title, description, badgeBg, iconColor }) => {
  return (
    <div className="flex flex-col rounded-3xl border border-[#EBE6DD] bg-white p-6 sm:p-8 transition-all duration-300 hover:shadow-md hover:border-blue-200">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${badgeBg} ${iconColor}`}>
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-extrabold text-[#1F1C18] sm:text-xl">{title}</h3>
      <p className="text-sm leading-relaxed text-[#7C756B]">{description}</p>
    </div>
  );
};

const WhyUsPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const closeMenu = () => setMobileMenuOpen(false);

  const features = [
    {
      icon: <FaShieldAlt size={22} />,
      title: "Enhanced Security",
      description: "Stop unauthorized stays instantly. We verify guests against a central database in real-time.",
      badgeBg: "bg-blue-50",
      iconColor: "text-blue-600"
    },
    {
      icon: <FaClock size={22} />,
      title: "100% Digital Logs",
      description: "No more messy paper ledgers. Search, track, and manage guest records from any device, anywhere.",
      badgeBg: "bg-amber-50",
      iconColor: "text-amber-600"
    },
    {
      icon: <FaUsers size={22} />,
      title: "Direct Admin Link",
      description: "A secure, discreet channel to share compliance details and critical info with platform admins instantly.",
      badgeBg: "bg-emerald-50",
      iconColor: "text-emerald-600"
    },
    {
      icon: <FaLock size={22} />,
      title: "Resilient Data Privacy",
      description: "Your data belongs to you. We use modern, compliant encryption to keep guest info confidential.",
      badgeBg: "bg-indigo-50",
      iconColor: "text-indigo-600"
    },
    {
      icon: <FaBell size={22} />,
      title: "Instant Jurisdiction Alerts",
      description: "Get notified immediately about flagged individuals or suspicious safety concerns in your area.",
      badgeBg: "bg-red-50",
      iconColor: "text-red-600"
    },
    {
      icon: <FaFileInvoice size={20} />,
      title: "Auto-Compliance (Form C)",
      description: "Stay legal effortlessly. We automate and prepare regulatory documentation required by local departments.",
      badgeBg: "bg-violet-50",
      iconColor: "text-violet-600"
    }
  ];

  return (
    <div className="font-poppins bg-[#FAF8F5] min-h-screen flex flex-col text-[#2C2925] selection:bg-blue-600/10 scroll-smooth">
      {/* Top Header */}
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#EBE6DD]/60 bg-[#FAF8F5]/85 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <img src="/logo.png" alt="ApnaManager Logo" className="h-9 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-bold text-[#5C5346] hover:text-blue-600 transition-colors duration-150">
              Home
            </Link>
            <Link to="/why-us" className="text-sm font-bold text-blue-600 transition-colors duration-150">
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
                <Link to="/" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-[#2C2925] hover:bg-[#F2EDE4] transition-all">
                  Home
                </Link>
                <Link to="/why-us" onClick={closeMenu} className="flex items-center rounded-2xl px-4 py-3 text-sm font-bold text-blue-600 bg-[#F2EDE4]/50 transition-all">
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

      <main className="flex-grow">
        
        {/* === HERO SECTION === */}
        <section className="relative pt-32 pb-20 text-center overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#FAF8F5] to-[#F5F2EB]">
            <div className="container mx-auto px-4 relative z-10 text-center">
                <Motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-6 text-[#1F1C18]">
                        Why <img src="/logo.png" alt="ApnaManager Logo" className="inline-block h-9 md:h-14 lg:h-16 w-auto object-contain mx-2 align-middle" /> is <br className="hidden md:block" />
                        the Right Choice
                    </h1>
                    
                    <p className="text-base md:text-lg text-[#7C756B] max-w-2xl mx-auto leading-relaxed mb-8">
                        We bridge the gap between modern hospitality and rigorous security. 
                        Run a safer, smarter, and fully compliant hotel operation.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link to="/hotel-registration">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-blue-600/15 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 mx-auto">
                           Get Started Now <FaArrowRight size={13} />
                        </button>
                      </Link>
                    </div>
                </Motion.div>
            </div>
        </section>

        {/* === CARDS SECTION === */}
        <section className="px-4 pb-20 bg-white py-16 border-t border-[#EBE6DD]/40">
            <div className="container mx-auto max-w-7xl">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </div>
            </div>
        </section>

        {/* === BOTTOM CTA === */}
        <section className="py-20 px-4 bg-[#FAF8F5] border-t border-[#EBE6DD]/40">
            <div className="container mx-auto max-w-5xl">
                <div className="bg-gradient-to-br from-[#1F1C18] to-[#2C2925] rounded-[2rem] p-10 md:p-16 text-center text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-6">Ready to upgrade your security?</h2>
                        <p className="text-[#9E9587] mb-8 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                            Join the network of forward-thinking hotels. Registration takes less than 5 minutes and is completely free.
                        </p>
                        <Link
                            to="/hotel-registration"
                            className="inline-block bg-white text-slate-900 px-10 py-4 rounded-xl font-bold text-base shadow-lg hover:bg-slate-50 transition-all hover:scale-[1.02] active:scale-95"
                        >
                            Register Your Hotel
                        </Link>
                    </div>
                </div>
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default WhyUsPage;