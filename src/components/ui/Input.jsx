// src/components/ui/Input.jsx
import clsx from 'clsx';

const Input = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={clsx('apna-input', className)}
      {...props}
    />
  );
};

export default Input;
