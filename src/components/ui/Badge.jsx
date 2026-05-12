// src/components/ui/Badge.jsx
import clsx from 'clsx';

const Badge = ({ children, status = 'neutral', className = '' }) => {
  const styles = {
    active: 'bg-emerald-50 text-emerald-700',
    success: 'bg-emerald-50 text-emerald-700',
    pending: 'bg-amber-50 text-amber-700',
    warning: 'bg-amber-50 text-amber-700',
    danger: 'bg-red-50 text-red-700',
    neutral: 'bg-slate-100 text-slate-600',
    primary: 'bg-blue-50 text-blue-700',
  };

  return (
    <span className={clsx('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', styles[status] || styles.neutral, className)}>
      {children}
    </span>
  );
};

export default Badge;
