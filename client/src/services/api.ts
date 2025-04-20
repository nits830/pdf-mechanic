import axios from 'axios';

const api = axios.create({
  baseURL: 'https://pdf-mechanic-1.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  signup: async (userData: { name: string; email: string; password: string }) => {
    const response = await api.post('/users/signup', userData);
    return response.data;
  },
  signin: async (credentials: { email: string; password: string }) => {
    const response = await api.post('/users/signin', credentials);
    return response.data;
  },
  validateToken: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        throw new Error('Invalid or expired token');
      }
      throw error;
    }
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData: { name: string; email: string; password: string }) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
};

export const pdfService = {
  // Upload and extract text with optional summarization
  extractAndSummarize: async (file: File, summaryType: 'concise' | 'detailed' | 'bullet' = 'concise') => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const response = await api.post(`/pdfs/extract?summary=${summaryType}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Standalone text summarization
  summarizeText: async (text: string, type: 'concise' | 'detailed' | 'bullet' = 'concise') => {
    const response = await api.post('/pdfs/summarize', { text, type });
    return response.data;
  },

  // Get user's PDFs
  getMyPdfs: async () => {
    const response = await api.get('/pdfs/my-pdfs');
    return response.data;
  },

  // Get specific PDF by ID
  getPdfById: async (id: string) => {
    const response = await api.get(`/pdfs/${id}`);
    return response.data;
  },

  // Get extracted text from PDF
  getPdfText: async (id: string) => {
    const response = await api.get(`/pdfs/${id}/text`);
    return response.data;
  },

  // Re-run text extraction
  reExtractText: async (id: string) => {
    const response = await api.post(`/pdfs/${id}/extract`);
    return response.data;
  },

  // Delete PDF
  deletePdf: async (id: string) => {
    const response = await api.delete(`/pdfs/${id}`);
    return response.data;
  }
};

export default api; 