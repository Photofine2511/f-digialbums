import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'https://digialbums.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - intentionally not adding auth token 
// as this application doesn't require authentication
api.interceptors.request.use(
  (config) => {
    // No authentication token is added to requests
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = 
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    return Promise.reject(new Error(message));
  }
);

export default api; 