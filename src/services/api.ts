import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'https://digialbums.onrender.com/api',
  // baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - intentionally not adding auth token 
// as this application doesn't require authentication
api.interceptors.request.use(
  (config) => {
    // Don't override Content-Type if it's already set for multipart/form-data
    if (config.headers && 
        typeof config.headers['Content-Type'] === 'string' && 
        config.headers['Content-Type'].indexOf('multipart/form-data') !== -1) {
      // For multipart/form-data, let Axios set the content type with boundary
      delete config.headers['Content-Type'];
    }
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
    
    console.error('API Error:', error);
    return Promise.reject(new Error(message));
  }
);

export default api; 