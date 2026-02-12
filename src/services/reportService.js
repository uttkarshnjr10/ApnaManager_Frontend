import apiClient from '../api/apiClient';

export const fetchDailyAIReport = async () => {
  const response = await apiClient.get('/users/admin/ai-report');
  // Assuming your ApiResponse structure is { statusCode, data, message }
  return response.data.data;
};