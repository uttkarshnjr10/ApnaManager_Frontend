// src/components/ui/FormField.jsx
import Input from './Input';

const FormField = ({ label, name, value, onChange, error, required = false, className = '', ...props }) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <Input id={name} name={name} value={value} onChange={onChange} required={required} {...props} />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default FormField;
