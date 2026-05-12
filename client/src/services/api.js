import axios from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://event-manager-zg9y.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to inject the JWT token automatically into headers
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const { token } = JSON.parse(userInfo);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (e) {
        console.error('Failed to parse user info from local storage', e);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
