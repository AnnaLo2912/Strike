import API from './api';

const boardService = {
  getAll: async () => {
    const response = await API.get('/boards');
    return response.data;
  },

  getOne: async (id) => {
    const response = await API.get(`/boards/${id}`);
    return response.data;
  },

  create: async (boardData) => {
    const response = await API.post('/boards', boardData);
    return response.data;
  },

  update: async (id, boardData) => {
    const response = await API.put(`/boards/${id}`, boardData);
    return response.data;
  },

  delete: async (id) => {
    const response = await API.delete(`/boards/${id}`);
    return response.data;
  },
};

export default boardService;