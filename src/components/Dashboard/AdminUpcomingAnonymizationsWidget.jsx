import React, { useState, useEffect } from 'react';
import apiClient from '../../api/apiClient';
import { FaUserShield, FaSpinner } from 'react-icons/fa';

const AdminUpcomingAnonymizationsWidget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/admin/retention/upcoming')
      .then(res => {
        setData(res.data.data);
      })
      .catch(err => console.error('Failed to load anonymizations:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <FaUserShield className="text-blue-600" />
        Upcoming Anonymizations (Next 60 Days)
      </h3>
      <p className="text-xs text-gray-500 mb-4">
        As per DPDP Act, guest records expire after 3 years. These hotels have records scheduled for automatic anonymization soon.
      </p>

      {loading ? (
        <div className="flex justify-center p-4">
          <FaSpinner className="animate-spin text-blue-500 text-xl" />
        </div>
      ) : data.length === 0 ? (
        <p className="text-sm text-gray-500 italic p-2 bg-gray-50 rounded text-center">
          No records scheduled for anonymization in the next 60 days.
        </p>
      ) : (
        <div className="max-h-60 overflow-y-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold">
              <tr>
                <th className="px-3 py-2">Hotel</th>
                <th className="px-3 py-2">Records</th>
                <th className="px-3 py-2">Nearest Expiry</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, idx) => (
                <tr key={idx} className="border-b last:border-b-0 hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium text-gray-800">{item.hotelName}</td>
                  <td className="px-3 py-2 text-blue-600 font-bold">{item.count}</td>
                  <td className="px-3 py-2 text-gray-500">
                    {new Date(item.nearestExpiry).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUpcomingAnonymizationsWidget;
