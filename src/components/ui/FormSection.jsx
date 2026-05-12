// src/components/ui/FormSection.jsx

const FormSection = ({ title, children }) => {
  return (
    <fieldset className="rounded-xl border border-slate-100 bg-white p-4 md:p-6">
      <legend className="px-2 text-base font-semibold text-slate-800 md:text-lg">
        {title}
      </legend>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {children}
      </div>
    </fieldset>
  );
};

export default FormSection;
