import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// In src/services/api.js
const testApiConnection = async () => {
  try {
    const response = await api.get('/health');
    console.log('API Connection Test:', response.data);
    return response.data;
  } catch (error) {
    console.error('API Connection Failed:', error);
    throw error;
  }
};

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Submission related API calls
export const submissionService = {
  // Create a new submission
  createSubmission: async (formData, files) => {
    try {
      // Create FormData with all submission data
      const submissionFormData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        submissionFormData.append(key, formData[key]);
      });
      
      // Add file
      if (files.length > 0) {
        submissionFormData.append('file', files[0]); // Currently handling single file
      }

      // Submit form data and file together
      const response = await api.post('/articles', submissionFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Submission creation failed:', error);
      throw error;
    }
  },

  // Get all submissions for the current user
  getUserSubmissions: async () => {
    try {
      const response = await api.get('/articles');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user submissions:', error);
      throw error;
    }
  },

  // Get a specific submission by ID
  getSubmission: async (submissionId) => {
    try {
      const response = await api.get(`/articles/${submissionId}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch submission ${submissionId}:`, error);
      throw error;
    }
  }
};

// Auth related API calls
export const authService = {
  login: async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('authToken');
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
};

export default api;
