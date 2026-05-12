import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaInstagram, FaLinkedin, FaEnvelope, FaShieldAlt, FaHotel, FaChartBar, FaWhatsapp } from 'react-icons/fa';

const Motion = motion;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const platformLinks = [
    { icon: <FaHotel className="text-xs" />, text: 'Hotel Dashboard', to: '/login' },
    { icon: <FaShieldAlt className="text-xs" />, text: 'Police Console', to: '/login' },
    { icon: <FaChartBar className="text-xs" />, text: 'Admin Panel', to: '/login' },
  ];

  const companyLinks = [
    { text: 'Why Us', to: '/why-us' },
    { text: 'Register Hotel', to: '/hotel-registration' },
    { text: 'Contact Us', to: 'https://mail.google.com/mail/?view=cm&fs=1&to=apnamanager91@gmail.com' },
  ];

  const socialLinks = [
    { href: 'https://www.instagram.com/apnamanager?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==', icon: <FaInstagram size={17} />, label: 'Instagram' },
    { href: 'https://www.linkedin.com/company/apnamanager/', icon: <FaLinkedin size={17} />, label: 'LinkedIn' },
    { href: 'https://whatsapp.com/channel/0029VbBdxL26LwHpSS1XdT3J', icon: <FaWhatsapp size={17} />, label: 'WhatsApp' },
    { href: 'https://mail.google.com/mail/?view=cm&fs=1&to=apnamanager91@gmail.com', icon: <FaEnvelope size={15} />, label: 'Email' },
  ];

  return (
    <Motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="border-t border-slate-100 bg-white text-sm text-slate-500"
    >
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <div className="mb-3 flex items-center gap-3">
              <img src="/logo.png" alt="ApnaManager" className="h-8 w-auto" />
              <span className="font-bold text-slate-900">ApnaManager</span>
            </div>
            <p className="leading-relaxed">
              The bridge between Hospitality and Security. A robust platform for modern guest management, digital verification, and real-time data sharing.
            </p>
            <div className="mt-5 flex gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-100 text-slate-400 transition-colors duration-150 hover:border-blue-100 hover:bg-blue-50 hover:text-blue-600"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 md:min-w-80">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Platform</p>
              <ul className="space-y-2">
                {platformLinks.map((item) => (
                  <li key={item.text}>
                    <Link to={item.to} className="flex min-h-8 items-center gap-2.5 text-slate-500 transition-colors duration-150 hover:text-blue-600">
                      {item.icon}
                      {item.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Company</p>
              <ul className="space-y-2">
                {companyLinks.map((item) => (
                  <li key={item.text}>
                    {item.to.startsWith('http') ? (
                      <a href={item.to} target="_blank" rel="noopener noreferrer" className="flex min-h-8 items-center text-slate-500 transition-colors duration-150 hover:text-blue-600">
                        {item.text}
                      </a>
                    ) : (
                      <Link to={item.to} className="flex min-h-8 items-center text-slate-500 transition-colors duration-150 hover:text-blue-600">
                        {item.text}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 text-xs text-slate-400 md:flex-row md:items-center md:justify-between">
          <p>© {currentYear} ApnaManager. All rights reserved.</p>
          <div className="flex gap-5">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </div>
    </Motion.footer>
  );
};

export default Footer;
