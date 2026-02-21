// src/components/ui/Card.jsx
const Card = ({ children, className = '' }) => {
  return (
    <div
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-md ${className}`}
    >
      <div className="p-5">{children}</div>
    </div>
  );
};

export default Card;