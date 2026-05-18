import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('API Request - Token exists:', !!token);
    console.log('API Request - URL:', config.url);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors - DON'T redirect on 401, just reject
API.interceptors.response.use(
  (response) => {
    console.log('API Response - Status:', response.status);
    return response;
  },
  (error) => {
    console.log('API Error - Status:', error.response?.status);
    console.log('API Error - Data:', error.response?.data);
    console.log('API Error - Message:', error.message);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default API;