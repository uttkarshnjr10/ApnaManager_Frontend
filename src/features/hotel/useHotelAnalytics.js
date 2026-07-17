import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../api/apiClient';

export const useHotelAnalytics = (initialStartDate, initialEndDate) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnalytics = useCallback(async (startDate, endDate) => {
    setLoading(true);
    setError(null);
    try {
      let url = '/hotel/analytics';
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`;
      }
      
      const response = await apiClient.get(url);
      setData(response.data.data);
    } catch (err) {
      console.error('Failed to fetch hotel analytics', err);
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(initialStartDate, initialEndDate);
  }, [fetchAnalytics, initialStartDate, initialEndDate]);

  return { data, loading, error, refetch: fetchAnalytics };
};
