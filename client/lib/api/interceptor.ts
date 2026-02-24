import axios from 'axios';
import { redirect } from 'next/navigation';
import { BASE_URL_API } from '@/configs/server.config';

const axiosInstance = axios.create({
  baseURL: BASE_URL_API,
  withCredentials: true,
});

// Response interceptor for auto-refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        await axios.post(`${BASE_URL_API}/auth/refresh`, {}, { withCredentials: true });

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed → redirect to login
        if (typeof window !== 'undefined') {
          redirect('/login');
          //   window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
