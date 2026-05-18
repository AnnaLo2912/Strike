import API from './api';

const classroomService = {
  getAuthUrl: async () => {
    const response = await API.get('/google/auth-url');
    return response.data;
  },

  getStatus: async () => {
    const response = await API.get('/google/status');
    return response.data;
  },

  // NEW: Get classroom deadlines and important tasks
  getDeadlines: async () => {
    const response = await API.get('/google/deadlines');
    return response.data;
  },

  sync: async () => {
    const response = await API.post('/google/sync');
    return response.data;
  },

  disconnect: async () => {
    const response = await API.post('/google/disconnect');
    return response.data;
  },
};

export default classroomService;