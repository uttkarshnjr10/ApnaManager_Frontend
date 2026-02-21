// src/components/ui/StatCard.jsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatCard = ({ title, value, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center">
        <Skeleton circle width={44} height={44} className="mr-3.5" />
        <div className="flex-1">
          <Skeleton width={80} height={24} />
          <Skeleton width={120} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 group">
      <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl mr-3.5 group-hover:bg-indigo-100 transition-colors duration-200">
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 font-medium mt-0.5">{title}</p>
      </div>
    </div>
  );
};

export default StatCard;