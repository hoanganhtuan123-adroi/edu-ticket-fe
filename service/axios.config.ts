import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor - return response.data for consistent API responses
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Don't handle 401 redirects here - let individual services handle token management
    return Promise.reject(error);
  }
);

export default api;