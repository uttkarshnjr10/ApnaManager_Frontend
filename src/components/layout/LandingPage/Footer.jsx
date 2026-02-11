import { FaInstagram, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    // 1. CONTROL HEIGHT HERE: 'py-8' means padding-top and padding-bottom are 2rem.
    // To make it taller, change to py-12 or py-16. To make it shorter, change to py-6.
    <footer className="bg-[#0f172a] text-white py-8 font-poppins relative z-10 border-t border-gray-800">
      <div className="container mx-auto px-6 max-w-6xl">
        
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          
          {/* Left Side: Brand & Mission */}
          <div className="text-center md:text-left max-w-md">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-3">
                 <img src="/logo.png" alt="ApnaManager" className="h-8 w-auto" />
                 {/* <span className="text-xl font-bold tracking-tight">Apna<span className="text-blue-400">Manager</span></span> */}
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The bridge between Hospitality and Security. We provide a robust platform for modern guest management.
            </p>
          </div>

          {/* Right Side: Contact & Socials */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h4 className="text-sm font-semibold text-gray-200">Connect With Us</h4>
            
            <div className="flex gap-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/apnamanager?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <FaInstagram size={20} />
              </a>

              {/* LinkedIn */}
              <a 
                href="https://www.linkedin.com/company/apnamanager/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <FaLinkedin size={20} />
              </a>

              {/* Email */}
              <a 
                href="mailto:contact@apnamanager.com" 
                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 hover:-translate-y-1"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Divider - Reduced margin (my-6 instead of my-10) */}
        <div className="w-full h-px bg-gray-800 my-6"></div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>
            © {currentYear} ApnaManager. All rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-gray-300 cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;