import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { FaUsers, FaClock, FaGlobe, FaFileSignature } from 'react-icons/fa';
import { useHotelAnalytics } from '../../features/hotel/useHotelAnalytics';
import PageHeader from '../../components/ui/PageHeader';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

// ApnaManager Color Palette
const COLORS = {
  primary: '#2563EB',    // blue-600
  success: '#10B981',    // emerald-500
  warning: '#F59E0B',    // amber-500
  neutral: '#64748B',    // slate-500
  pieColors: ['#2563EB', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4']
};

const AnalyticsPage = () => {
  const getFirstDayOfMonth = () => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
  };

  const getToday = () => new Date().toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(getFirstDayOfMonth());
  const [endDate, setEndDate] = useState(getToday());

  const { data, loading, error, refetch } = useHotelAnalytics(startDate, endDate);

  const handleApply = () => {
    refetch(startDate, endDate);
  };

  if (loading && !data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business Analytics" />
        <div className="flex justify-center items-center h-64">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Business Analytics" />
        <Card className="text-center py-10 text-red-500">
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  const hasData = data && data.summary.totalGuests > 0;
  const isCform100 = data && data.cformCompliance.required > 0 && data.cformCompliance.required === data.cformCompliance.submitted;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <PageHeader title="Business Analytics" className="mb-0" />
        
        <div className="flex flex-col sm:flex-row gap-3 items-end sm:items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">Start Date</label>
            <input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-semibold text-slate-500 mb-1">End Date</label>
            <input 
              type="date" 
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-500"
            />
          </div>
          <Button onClick={handleApply} className="h-9 mt-5 sm:mt-0 px-5 bg-slate-900 text-white hover:bg-slate-800">
            Apply
          </Button>
        </div>
      </div>

      {!hasData ? (
        <Card className="py-20 text-center">
          <FaUsers className="mx-auto text-5xl text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No Data Available</h3>
          <p className="text-slate-500 mt-2 max-w-md mx-auto">
            No guests were registered during the selected date range. Try selecting a wider date range to see analytics.
          </p>
        </Card>
      ) : (
        <>
          {/* SECTION 1: Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Guests" 
              value={data.summary.totalGuests} 
              icon={<FaUsers className="h-5 w-5" />} 
            />
            <StatCard 
              title="Average Stay" 
              value={`${data.summary.averageStayDays} days`} 
              icon={<FaClock className="h-5 w-5" />} 
            />
            <StatCard 
              title="Foreign Guests" 
              value={data.summary.foreignGuests} 
              trend={`${((data.summary.foreignGuests / data.summary.totalGuests) * 100).toFixed(1)}%`}
              icon={<FaGlobe className="h-5 w-5" />} 
            />
            <StatCard 
              title="C-Form Submitted" 
              value={`${data.cformCompliance.submitted} / ${data.cformCompliance.required}`}
              icon={<FaFileSignature className={`h-5 w-5 ${isCform100 ? 'text-emerald-500' : 'text-slate-500'}`} />} 
            />
          </div>

          {/* SECTION 2: Layout Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Guests by Day of Week */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Guests by Day of Week</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.guestsByDayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="day" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#F1F5F9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="count" fill={COLORS.primary} radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Guest Nationality */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Guest Nationality Breakdown</h3>
              <div className="flex flex-col sm:flex-row items-center h-72">
                <div className="w-full sm:w-1/2 h-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Indian', value: data.nationalityBreakdown.indian },
                          { name: 'Foreign', value: data.nationalityBreakdown.foreign }
                        ].filter(d => d.value > 0)}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        <Cell fill={COLORS.primary} />
                        <Cell fill={COLORS.warning} />
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full sm:w-1/2 flex flex-col gap-3 px-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                      <span className="text-sm font-medium text-slate-700">Indian</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{data.nationalityBreakdown.indian}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm font-medium text-slate-700">Foreign</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{data.nationalityBreakdown.foreign}</span>
                  </div>
                  
                  {data.nationalityBreakdown.breakdown.length > 1 && (
                    <div className="mt-4 pt-4 border-t border-slate-100 max-h-32 overflow-y-auto">
                      <p className="text-xs text-slate-500 mb-2 font-semibold uppercase tracking-wider">Top Nationalities</p>
                      {data.nationalityBreakdown.breakdown.slice(0,5).map((nat, i) => (
                        <div key={i} className="flex justify-between text-sm text-slate-600 py-1">
                          <span>{nat.nationality}</span>
                          <span className="font-semibold text-slate-800">{nat.count}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>

            {/* Purpose of Visit */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Purpose of Visit</h3>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.purposeBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      dataKey="count"
                      nameKey="purpose"
                    >
                      {data.purposeBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS.pieColors[index % COLORS.pieColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="middle" align="right" layout="vertical" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Top Rooms */}
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Top Rooms by Occupancy</h3>
              <div className="flex flex-col gap-4">
                {data.topRooms.length > 0 ? (
                  data.topRooms.map((room, index) => {
                    const maxCount = data.topRooms[0].count;
                    const widthPercent = (room.count / maxCount) * 100;
                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 text-sm font-bold text-slate-700">Rm {room.roomNumber}</div>
                        <div className="flex-1 h-6 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-500 rounded-full" 
                            style={{ width: `${widthPercent}%` }}
                          />
                        </div>
                        <div className="w-8 text-right text-sm font-semibold text-slate-600">{room.count}</div>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-sm text-slate-500 text-center py-10">No room usage data in this period.</p>
                )}
              </div>
            </Card>

          </div>

          {/* SECTION 3: Monthly Trend (Only if > 30 days) */}
          {data.guestsByMonth && data.guestsByMonth.length > 0 && (
            <Card>
              <h3 className="text-lg font-bold text-slate-800 mb-4">Guest Registration Trend</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.guestsByMonth} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#64748B' }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ stroke: '#E2E8F0', strokeWidth: 2 }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="count" stroke={COLORS.primary} strokeWidth={3} dot={{ r: 4, fill: COLORS.primary }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
