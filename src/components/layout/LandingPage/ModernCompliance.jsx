import { motion } from 'framer-motion';
import { FaArrowRight, FaBolt, FaLock, FaGlobe, FaMobileAlt, FaHotel, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const Motion = motion;

const FeatureCard = ({ icon, title, description }) => (
  <div className="rounded-xl border border-l-4 border-slate-100 border-l-blue-600 bg-white p-5 shadow-sm md:p-6">
    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      {icon}
    </div>
    <h3 className="mb-2 text-base font-semibold text-slate-800 md:text-lg">{title}</h3>
    <p className="text-sm leading-relaxed text-slate-600">{description}</p>
  </div>
);

const PersonaCard = ({ icon, title, description, features }) => (
  <div className="flex h-full flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm md:p-6">
    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      {icon}
    </div>
    <h3 className="mb-2 text-base font-semibold text-slate-800 md:text-lg">{title}</h3>
    <p className="mb-5 text-sm leading-relaxed text-slate-600">{description}</p>
    <ul className="mt-auto space-y-3">
      {features.map((feature) => (
        <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-600">
          <FaCheckCircle className="flex-shrink-0 text-emerald-500" />
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const StepCard = ({ number, title, description, showArrow }) => (
  <div className="relative flex flex-col items-center text-center md:flex-1">
    <div className="relative z-10 mb-4 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
      {number}
    </div>
    <h3 className="mb-2 text-base font-semibold text-slate-800">{title}</h3>
    <p className="max-w-xs text-sm leading-relaxed text-slate-500">{description}</p>
    {showArrow && <FaArrowRight className="absolute right-[-10px] top-3 hidden text-slate-300 md:block" />}
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
  const features = [
    { icon: <FaBolt />, title: 'Instant Sync', description: 'Real-time data synchronization between hotels and police stations.' },
    { icon: <FaLock />, title: 'Advanced Security', description: 'End-to-end encryption keeping guest data safe and private.' },
    { icon: <FaGlobe />, title: 'Cloud Connected', description: 'Access your dashboard securely from anywhere, anytime.' },
    { icon: <FaMobileAlt />, title: 'Mobile Ready', description: 'Fully responsive design works perfectly on any device.' },
  ];

  return (
    <section className="bg-slate-50 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
        >
          <span className="mb-5 inline-flex items-center rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
            Platform Features
          </span>
          <h2 className="mb-4 text-xl font-semibold text-slate-800 md:text-2xl">
            Built for Modern Compliance
          </h2>
          <p className="text-sm leading-relaxed text-slate-600 md:text-base">
            A unified platform to manage guest records and maintain seamless communication with authorities, designed for speed, security, and scale.
          </p>
        </Motion.div>

        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="mb-16 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <Motion.div variants={itemVariants} key={feature.title}>
              <FeatureCard {...feature} />
            </Motion.div>
          ))}
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="mb-16 rounded-xl border border-slate-100 bg-white p-6 shadow-sm md:p-8"
        >
          <div className="mb-8 text-center">
            <h2 className="text-xl font-semibold text-slate-800 md:text-2xl">How It Works</h2>
            <p className="mt-2 text-sm text-slate-500 md:text-base">A clear registration flow from hotel entry to verified authority access.</p>
          </div>
          <div className="relative flex flex-col gap-8 md:flex-row md:gap-6">
            <div className="absolute left-1/2 top-4 hidden h-px w-[66%] -translate-x-1/2 bg-slate-200 md:block" />
            <div className="absolute bottom-8 left-4 top-4 w-px bg-slate-200 md:hidden" />
            <StepCard number="1" title="Register Guest" description="Hotel staff enter guest details and capture required identity photos." showArrow />
            <StepCard number="2" title="Verify Stay" description="Room and stay details are attached to the digital guest record." showArrow />
            <StepCard number="3" title="Sync Securely" description="Authorized teams can access compliant records when needed." />
          </div>
        </Motion.div>

        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid gap-5 md:grid-cols-2"
        >
          <Motion.div variants={itemVariants}>
            <PersonaCard
              icon={<FaHotel size={22} />}
              title="For Hotels"
              description="Streamline guest registration with instant ID verification and automatic police sync."
              features={['One-click check-in', 'Smart auto-fill forms', 'Real-time compliance tracking']}
            />
          </Motion.div>
          <Motion.div variants={itemVariants}>
            <PersonaCard
              icon={<FaShieldAlt size={22} />}
              title="For Police"
              description="Powerful search console with analytics and comprehensive guest tracking capabilities."
              features={['Advanced guest search', 'Instant alert system', 'Analytics dashboard']}
            />
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
};

export default ModernCompliance;
