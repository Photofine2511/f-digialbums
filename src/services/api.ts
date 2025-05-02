import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'https://digialbums.onrender.com/api',
  // baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Default timeout extended for large file uploads
  timeout: 3600000, // 1 hour
  // Increase the maximum content length limit
  maxContentLength: Infinity,
  maxBodyLength: Infinity
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

    // For large file uploads, disable the transformation of request data
    if (config.data instanceof FormData) {
      config.transformRequest = [(data) => data];
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
    // Handle timeout errors specifically
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timed out. This may be due to a large file upload.'));
    }

    // Handle abort errors
    if (axios.isCancel(error)) {
      return Promise.reject(new Error('Request was cancelled'));
    }

    const message = 
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';
    
    console.error('API Error:', error);
    return Promise.reject(new Error(message));
  }
);

export default api; 