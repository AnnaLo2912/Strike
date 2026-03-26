import API from './api';

const eventService = {
  getAll: async (start, end) => {
    const params = new URLSearchParams();
    if (start) params.append('start', start);
    if (end) params.append('end', end);
    
    const response = await API.get(`/events?${params}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await API.post('/events', eventData);
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await API.put(`/events/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/events/${id}`);
    return response.data;
  },
};

export default eventService;