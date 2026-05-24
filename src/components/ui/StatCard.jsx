import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const StatCard = ({ title, value, icon, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm sm:flex-row sm:items-center sm:gap-3 sm:p-4 md:p-5">
        <Skeleton circle width={32} height={32} className="sm:h-10 sm:w-10" />
        <div className="flex-1 min-w-0">
          <Skeleton width={60} height={20} />
          <Skeleton width={90} height={12} className="mt-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition-colors duration-150 hover:border-slate-200 sm:flex-row sm:items-center sm:gap-3 sm:p-4 md:p-5 h-full">
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 sm:h-10 sm:w-10">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-lg font-bold text-slate-900 sm:text-xl md:text-2xl" title={value}>{value}</p>
        <p className="mt-0.5 truncate text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs" title={title}>{title}</p>
      </div>
    </div>
  );
};

export default StatCard;
