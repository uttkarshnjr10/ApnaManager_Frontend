// src/components/ui/Card.jsx
import clsx from 'clsx';

const Card = ({ children, className = '', bodyClassName = '' }) => {
  return (
    <div className={clsx('apna-card overflow-hidden', className)}>
      <div className={clsx('p-4 md:p-6', bodyClassName)}>{children}</div>
    </div>
  );
};

export default Card;
