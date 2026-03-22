import API from './api';

const taskService = {
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await API.get(`/tasks?${params}`);
    return response.data;
  },

  getOne: async (id) => {
    const response = await API.get(`/tasks/${id}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await API.post('/tasks', taskData);
    return response.data;
  },

  update: async (id, taskData) => {
    const response = await API.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/tasks/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await API.get('/tasks/stats');
    return response.data;
  },
};

export default taskService;