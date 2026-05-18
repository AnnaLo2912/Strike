import API from './api';

const habitService = {
  getAll: async () => {
    const response = await API.get('/habits');
    return response;
  },

  create: async (habitData) => {
    const response = await API.post('/habits', habitData);
    return response;
  },

  markComplete: async (id) => {
    const response = await API.put(`/habits/${id}/complete`);
    return response;
  },

  delete: async (id) => {
    const response = await API.delete(`/habits/${id}`);
    return response;
  },
};

export default habitService;