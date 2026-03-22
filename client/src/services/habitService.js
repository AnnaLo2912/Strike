import API from './api';

const habitService = {
  getAll: async () => {
    const response = await API.get('/habits');
    return response.data;
  },

  create: async (habitData) => {
    const response = await API.post('/habits', habitData);
    return response.data;
  },

  markComplete: async (id) => {
    const response = await API.put(`/habits/${id}/complete`);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/habits/${id}`);
    return response.data;
  },
};

export default habitService;