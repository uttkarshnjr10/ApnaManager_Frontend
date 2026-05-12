// src/pages/hotel/ReportsPage.jsx
import { useReports } from '../../features/hotel/useReports';
import Button from '../../components/ui/Button';
import PageHeader from '../../components/ui/PageHeader';
import { FaCalendarAlt, FaChartBar, FaFileCsv, FaSpinner } from 'react-icons/fa';

const dateInputClasses = 'apna-input';

const ReportsPage = () => {
  const { dateRange, loading, handleDateChange, downloadCsvReport } = useReports();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports"
        description="Generate compliant guest records for a selected date range."
      />

      <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <FaCalendarAlt />
          </span>
          <div>
            <h2 className="text-base font-semibold text-slate-800 md:text-lg">Select Date Range</h2>
            <p className="text-sm text-slate-500">Choose the period you want to export.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">Start Date</label>
            <input type="date" name="start" value={dateRange.start} onChange={handleDateChange} className={dateInputClasses} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">End Date</label>
            <input type="date" name="end" value={dateRange.end} onChange={handleDateChange} className={dateInputClasses} />
          </div>
          <Button onClick={downloadCsvReport} disabled={loading} className="w-full md:w-auto">
            {loading ? <FaSpinner className="animate-spin" /> : <FaFileCsv />}
            {loading ? 'Generating...' : 'Download CSV'}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {['Total Guests', 'Checked In', 'Checked Out'].map((label) => (
          <div key={label} className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm md:p-5">
            <div className="mb-3 h-8 w-8 rounded-lg bg-slate-50" />
            <p className="text-2xl font-bold text-slate-300">--</p>
            <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
        <FaChartBar className="mx-auto mb-3 text-4xl text-slate-300" />
        <h3 className="text-base font-semibold text-slate-800">CSV export is available</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-500">
          Summary metrics are reserved for a future reports API. For now, download the verified CSV using the current production endpoint.
        </p>
      </div>
    </div>
  );
};
export default ReportsPage;
