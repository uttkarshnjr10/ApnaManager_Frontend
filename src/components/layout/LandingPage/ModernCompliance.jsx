import { motion } from 'framer-motion';
import { FaBolt, FaLock, FaGlobe, FaMobileAlt, FaHotel, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, colorClass, glowColor }) => (
  <div className="group relative bg-white p-7 rounded-2xl border border-gray-100/90 hover:border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
    {/* Subtle glow on hover */}
    <div className={`absolute -top-20 -right-20 w-36 h-36 ${glowColor} rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none`}></div>
    <div className="relative z-10">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-5 shadow-lg ${colorClass} group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
    </div>
  </div>
);

const PersonaCard = ({ icon, title, description, features, accentColor, accentBg }) => (
  <div className="group relative bg-white p-8 rounded-2xl border border-gray-100/90 hover:border-gray-200/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full overflow-hidden">
    {/* Accent top border */}
    <div className={`absolute top-0 left-0 right-0 h-1 ${accentBg} rounded-t-2xl`}></div>
    {/* Glow */}
    <div className={`absolute -top-20 -left-20 w-36 h-36 ${accentColor}/10 rounded-full blur-2xl opacity-0 group-hover:opacity-70 transition-opacity duration-300 pointer-events-none`}></div>
    <div className="relative z-10 flex flex-col h-full">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${accentBg}/10 ${accentColor}`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 mb-6 text-sm leading-relaxed">{description}</p>
      <ul className="space-y-3 mt-auto">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="text-emerald-500 text-[10px]" />
            </div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

const ModernCompliance = () => {
  return (
    <section className="py-28 font-poppins relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fafbff] via-white to-[#f5f3ff] -z-10 pointer-events-none"></div>
      <div className="absolute inset-0 opacity-[0.02] -z-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #6366f1 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-20 max-w-2xl mx-auto"
        >
          <span className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-6 border border-indigo-100">
            Platform Features
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            Built for{' '}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Modern Compliance
            </span>
          </h2>
          <p className="text-base text-gray-500 leading-relaxed">
            A unified platform to manage guest records and maintain seamless communication with authorities — designed for speed, security, and scale.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
        >
          <motion.div variants={itemVariants}>
            <FeatureCard icon={<FaBolt />} colorClass="bg-gradient-to-br from-amber-500 to-orange-500" glowColor="bg-orange-200" title="Instant Sync" description="Real-time data synchronization between hotels and police stations." />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard icon={<FaLock />} colorClass="bg-gradient-to-br from-emerald-500 to-teal-500" glowColor="bg-emerald-200" title="Advanced Security" description="End-to-end encryption keeping guest data safe and private." />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard icon={<FaGlobe />} colorClass="bg-gradient-to-br from-blue-500 to-indigo-500" glowColor="bg-blue-200" title="Cloud Connected" description="Access your dashboard securely from anywhere, anytime." />
          </motion.div>
          <motion.div variants={itemVariants}>
            <FeatureCard icon={<FaMobileAlt />} colorClass="bg-gradient-to-br from-violet-500 to-purple-500" glowColor="bg-violet-200" title="Mobile Ready" description="Fully responsive design works perfectly on any device." />
          </motion.div>
        </motion.div>

        {/* Persona Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid md:grid-cols-2 gap-6"
        >
          <motion.div variants={itemVariants}>
            <PersonaCard
              icon={<FaHotel size={24} />}
              accentColor="text-indigo-600"
              accentBg="bg-gradient-to-r from-indigo-500 to-blue-500"
              title="For Hotels"
              description="Streamline guest registration with instant ID verification and automatic police sync."
              features={['One-click check-in', 'Smart auto-fill forms', 'Real-time compliance tracking']}
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PersonaCard
              icon={<FaShieldAlt size={24} />}
              accentColor="text-violet-600"
              accentBg="bg-gradient-to-r from-violet-500 to-purple-500"
              title="For Police"
              description="Powerful search console with analytics and comprehensive guest tracking capabilities."
              features={['Advanced guest search', 'Instant alert system', 'Analytics dashboard']}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernCompliance;