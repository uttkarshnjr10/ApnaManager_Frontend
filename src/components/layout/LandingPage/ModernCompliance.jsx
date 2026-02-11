import { FaBolt, FaLock, FaGlobe, FaMobileAlt, FaHotel, FaShieldAlt, FaCheckCircle } from 'react-icons/fa';

const FeatureCard = ({ icon, title, description, colorClass }) => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 shadow-md ${colorClass} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 leading-relaxed text-sm">{description}</p>
  </div>
);

const PersonaCard = ({ icon, title, description, features, iconColor }) => (
  <div className="bg-gradient-to-br from-white to-blue-50/30 p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col h-full border-t-4 border-t-blue-500">
    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-6 bg-blue-100 ${iconColor}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-6 text-sm">{description}</p>
    <ul className="space-y-3 mt-auto">
      {features.map((feature, idx) => (
        <li key={idx} className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <FaCheckCircle className="text-green-500 flex-shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
  </div>
);

const ModernCompliance = () => {
  return (
    <section className="py-24 bg-gray-50 font-poppins relative z-10">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Built for <span className="text-blue-600">Modern Compliance</span>
          </h2>
          <p className="text-lg text-gray-500">
            A unified platform to manage guest records and maintain seamless communication with authorities.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Row 1 */}
          <FeatureCard 
            icon={<FaBolt />} 
            colorClass="bg-orange-500"
            title="Instant Sync" 
            description="Real-time data synchronization between hotels and police stations." 
          />
          <FeatureCard 
            icon={<FaLock />} 
            colorClass="bg-emerald-500"
            title="Advanced Security" 
            description="End-to-end encryption keeping your guest data safe and private." 
          />

          {/* Row 2 */}
          <FeatureCard 
            icon={<FaGlobe />} 
            colorClass="bg-blue-500"
            title="Cloud Connected" 
            description="Access your dashboard securely from anywhere, anytime." 
          />
          <FeatureCard 
            icon={<FaMobileAlt />} 
            colorClass="bg-indigo-500"
            title="Mobile Ready" 
            description="Fully responsive design works perfectly on any device." 
          />

          {/* Row 3 - The Persona Cards */}
          <PersonaCard 
            icon={<FaHotel size={24} />}
            iconColor="text-blue-600"
            title="For Hotels"
            description="Streamline guest registration with instant ID verification and automatic police sync."
            features={['One-click check-in', 'Smart Pre-fill', 'Real-time compliance']}
          />
          <PersonaCard 
            icon={<FaShieldAlt size={24} />}
            iconColor="text-blue-600"
            title="For Police"
            description="Powerful search console with analytics and comprehensive guest tracking."
            features={['Advanced search', 'Instant alerts', 'Analytics dashboard']}
          />
        </div>
      </div>
    </section>
  );
};

export default ModernCompliance;