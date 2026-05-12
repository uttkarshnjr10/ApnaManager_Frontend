// src/components/ui/PageHeader.jsx

const PageHeader = ({ title, description, action }) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500 md:text-base">{description}</p>}
      </div>
      {action && <div className="flex shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
