import API from './api';

const boardService = {
  getAll: async () => {
    const response = await API.get('/boards');
    return response;
  },

  getOne: async (id) => {
    const response = await API.get(`/boards/${id}`);
    return response;
  },

  create: async (boardData) => {
    const response = await API.post('/boards', boardData);
    return response;
  },

  update: async (id, boardData) => {
    const response = await API.put(`/boards/${id}`, boardData);
    return response;
  },

  delete: async (id) => {
    const response = await API.delete(`/boards/${id}`);
    return response;
  },
};

export default boardService;