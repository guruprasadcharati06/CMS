import axios from 'axios';

const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    'http://localhost:3000/api',
  withCredentials: false,
});

export const attachInterceptors = (getToken) => {
  apiClient.interceptors.request.use((config) => {
    const token = getToken?.();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || error.message || 'Request failed';
      return Promise.reject(new Error(message));
    }
  );
};

export default apiClient;
