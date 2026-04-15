// src/components/ui/Button.jsx
import clsx from 'clsx';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const baseStyles =
    'px-4 py-2 rounded-md font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    secondary:
      'bg-gray-600 hover:bg-gray-700 focus:ring-gray-500 text-white',
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500 text-white',
    outline:
      'border border-blue-500 text-blue-600 bg-white hover:bg-blue-50 focus:ring-blue-500',
  };

  const disabledStyles = 'opacity-50 cursor-not-allowed';

  const buttonClasses = clsx(
    baseStyles,
    variantStyles[variant],
    disabled && disabledStyles,
    className
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={buttonClasses}
    >
      {children}
    </button>
  );
};

export default Button;