import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, FaDigitalTachograph, FaUsers, 
  FaLock, FaBell, FaFileInvoice, 
  FaInstagram, FaYoutube, FaLinkedin, FaArrowRight
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar'; 

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 } 
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { type: "spring", stiffness: 50, damping: 20 } 
  }
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div 
      variants={cardVariants}
      className="bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 relative overflow-hidden group"
    >
      {/* Subtle hover gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        <div className="w-16 h-16 bg-blue-100/50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300 shadow-sm">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3 group-hover:text-blue-700 transition-colors">
          {title}
        </h3>
        <p className="text-gray-500 leading-relaxed font-medium">
          {description}
        </p>
      </div>
    </motion.div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-white border-t border-gray-100 py-12 mt-auto">
      <div className="container mx-auto px-6 flex flex-col items-center">
        <div className="mb-6 opacity-80 hover:opacity-100 transition-opacity">
           <img src="/logo.png" alt="ApnaManager" className="h-10 w-auto" />
        </div>
        <div className="flex space-x-8 mb-8">
          {[
            { icon: <FaInstagram size={24} />, href: "https://www.instagram.com/apnamanager?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" },
            { icon: <FaYoutube size={24} />, href: "https://www.youtube.com/@apnamanager" },
            { icon: <FaLinkedin size={24} />, href: "https://www.linkedin.com/company/apnamanager/" }
          ].map((social, idx) => (
            <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 hover:scale-110 transition-all duration-300">
              {social.icon}
            </a>
          ))}
        </div>
        <p className="text-sm text-gray-400 font-medium">
          &copy; {currentYear} ApnaManager. Built for Safety.
        </p>
      </div>
    </footer>
  );
};

const WhyUsPage = () => {
  const features = [
    {
      icon: <FaShieldAlt size={32} />,
      title: "Enhanced Security",
      description: "Stop unauthorized stays instantly. We verify guests against a central database in real-time."
    },
    {
      icon: <FaDigitalTachograph size={32} />,
      title: "100% Digital",
      description: "No more messy paper ledgers. Search, track, and manage guest records from any device, anywhere."
    },
    {
      icon: <FaUsers size={32} />,
      title: "Direct Police Link",
      description: "A secure, discreet channel to share critical info with law enforcement instantly."
    },
    {
      icon: <FaLock size={32} />,
      title: "Data Privacy",
      description: "Your data belongs to you. We use bank-grade encryption to keep guest info confidential."
    },
    {
      icon: <FaBell size={32} />,
      title: "Instant Alerts",
      description: "Get notified immediately about flagged individuals or suspicious activity in your area."
    },
    {
      icon: <FaFileInvoice size={32} />,
      title: "Auto-Compliance",
      description: "Stay legal effortlessly. We automate the record-keeping required by local regulations."
    }
  ];

  return (
    <div className="font-poppins bg-slate-50 min-h-screen flex flex-col">
      <Navbar isPublic={true} />

      <main className="flex-grow">
        
        {/* === HERO SECTION WITH DARK GRADIENT === */}
        <section className="relative bg-[#1e293b] text-white pt-24 pb-48 md:pb-64 overflow-hidden">
            
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-[#1e293b] to-blue-900 opacity-90 z-0"></div>
            
            {/* Animated Floating Blobs */}
            <motion.div 
              animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-30 z-0"
            ></motion.div>
            <motion.div 
              animate={{ y: [0, 30, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"
            ></motion.div>

            {/* Content */}
            <div className="container mx-auto px-6 relative z-10 text-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="max-w-4xl mx-auto"
                >
                    {/* <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 font-medium text-sm tracking-wide">
                        Trusted by 500+ Hotels in Bihar
                    </div> */}
                    
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6">
                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-300">ApnaManager</span> is <br className="hidden md:block" />
                        the Right Choice
                    </h1>
                    
                    <p className="text-lg md:text-xl text-blue-100/80 max-w-2xl mx-auto leading-relaxed mb-8">
                        We bridge the gap between modern hospitality and rigorous security. 
                        Run a safer, smarter, and fully compliant hotel operation.
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      <Link to="/hotel-registration">
                        <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full font-bold shadow-lg shadow-blue-900/50 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
                           Get Started Now <FaArrowRight size={14} />
                        </button>
                      </Link>
                    </div>
                </motion.div>
            </div>
        </section>

        {/* === OVERLAPPING CARDS SECTION === */}
        <section className="px-6 pb-20">
            {/* -mt-32 pulls this section UP into the dark hero.
                relative z-20 ensures it sits ON TOP of the hero background.
            */}
            <div className="container mx-auto -mt-32 md:-mt-48 relative z-20">
                <motion.div 
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                >
                    {features.map((feature, index) => (
                        <FeatureCard key={index} {...feature} />
                    ))}
                </motion.div>
            </div>
        </section>

        {/* === BOTTOM CTA === */}
        <section className="py-24 px-6 bg-white">
            <div className="container mx-auto max-w-5xl">
                <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-[2.5rem] p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                    
                    {/* Abstract Shapes */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to upgrade your security?</h2>
                        <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
                            Join the network of forward-thinking hotels. Registration takes less than 5 minutes and is completely free.
                        </p>
                        <Link
                            to="/hotel-registration"
                            className="inline-block bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:bg-blue-50 hover:scale-105 transition-all duration-300"
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