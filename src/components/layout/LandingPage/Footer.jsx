import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaEnvelope, FaShieldAlt, FaHotel, FaChartBar, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="relative font-poppins overflow-hidden"
    >
      {/* Gradient top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>

      <div className="bg-[#0c111d] text-white">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">
          <div className="grid md:grid-cols-4 gap-10 mb-12">

            {/* Brand Column */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="ApnaManager" className="h-9 w-auto" />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md mb-6">
                The bridge between Hospitality and Security. A robust platform for modern guest management, digital verification, and real-time data sharing.
              </p>
              {/* Social Links */}
              <div className="flex gap-3">
                <a
                  href="https://www.instagram.com/apnamanager?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-pink-500 hover:to-rose-500 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-pink-500/20 border border-white/5 hover:border-transparent"
                >
                  <FaInstagram size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/company/apnamanager/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-blue-500 hover:to-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/20 border border-white/5 hover:border-transparent"
                >
                  <FaLinkedin size={18} />
                </a>
                <a
                  href="https://whatsapp.com/channel/0029VbBdxL26LwHpSS1XdT3J"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-green-500 hover:to-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/20 border border-white/5 hover:border-transparent"
                >
                  <FaWhatsapp size={18} />
                </a>
                <a
                  href="mailto:apnamanager91@gmail.com"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-gradient-to-br hover:from-emerald-500 hover:to-teal-500 hover:text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/20 border border-white/5 hover:border-transparent"
                >
                  <FaEnvelope size={16} />
                </a>
              </div>
            </div>

            {/* Platform Column */}
            <div>
                  { text: 'Contact Us', to: 'mailto:apnamanager91@gmail.com' },
              <ul className="space-y-3">
                {[
                  { icon: <FaHotel className="text-xs" />, text: 'Hotel Dashboard', to: '/login' },
                  { icon: <FaShieldAlt className="text-xs" />, text: 'Police Console', to: '/login' },
                  { icon: <FaChartBar className="text-xs" />, text: 'Admin Panel', to: '/login' },
                ].map((item, i) => (
                  <li key={i}>
                    <Link to={item.to} className="flex items-center gap-2.5 text-sm text-gray-400 hover:text-white transition-colors duration-200 group">
                      <span className="text-gray-500 group-hover:text-indigo-400 transition-colors">{item.icon}</span>
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-5 tracking-wide">Company</h4>
              <ul className="space-y-3">
                {[
                  { text: 'Why Us', to: '/why-us' },
                  { text: 'Register Hotel', to: '/hotel-registration' },
                  { text: 'Contact Us', to: 'mailto:contact@apnamanager.com' },
                ].map((item, i) => (
                  <li key={i}>
                    {item.to.startsWith('mailto') ? (
                      <a href={item.to} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                        {item.text}
                      </a>
                    ) : (
                      <Link to={item.to} className="text-sm text-gray-400 hover:text-white transition-colors duration-200">
                        {item.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-6"></div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
            <p>© {currentYear} ApnaManager. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
              <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;