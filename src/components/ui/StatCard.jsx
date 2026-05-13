// src/components/ui/StatCard.jsx
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatCard = ({ title, value, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
        <Skeleton circle width={40} height={40} className="mr-3.5" />
        <div className="flex-1">
          <Skeleton width={80} height={24} />
          <Skeleton width={120} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-sm transition-colors duration-150 hover:border-slate-200 md:p-5">
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-2xl font-bold text-slate-900 md:text-3xl" title={value}>{value}</p>
        <p className="mt-0.5 truncate text-xs font-medium uppercase tracking-wide text-slate-500" title={title}>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
