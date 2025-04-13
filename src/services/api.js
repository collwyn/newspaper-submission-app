import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

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
      // First, upload files if any
      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await api.post('/uploads', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          
          return response.data.fileUrl;
        })
      );

      // Then create the submission with form data and file URLs
      const submission = {
        ...formData,
        files: uploadedFiles
      };

      const response = await api.post('/submissions', submission);
      return response.data;
    } catch (error) {
      console.error('Submission creation failed:', error);
      throw error;
    }
  },

  // Get all submissions for the current user
  getUserSubmissions: async () => {
    try {
      const response = await api.get('/submissions');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user submissions:', error);
      throw error;
    }
  },

  // Get a specific submission by ID
  getSubmission: async (submissionId) => {
    try {
      const response = await api.get(`/submissions/${submissionId}`);
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
