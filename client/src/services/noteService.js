import API from './api';

const noteService = {
  getAllNotebooks: async () => {
    const response = await API.get('/notes');
    return response.data;
  },

  createNotebook: async (data) => {
    const response = await API.post('/notes', data);
    return response.data;
  },

  updateNotebook: async (id, data) => {
    const response = await API.put(`/notes/notebook/${id}`, data);
    return response.data;
  },

  deleteNotebook: async (id) => {
    const response = await API.delete(`/notes/notebook/${id}`);
    return response.data;
  },

  addCollaborator: async (notebookId, email) => {
    const response = await API.post(`/notes/notebook/${notebookId}/collaborators`, { email });
    return response.data;
  },

  removeCollaborator: async (notebookId, collaboratorId) => {
    const response = await API.delete(`/notes/notebook/${notebookId}/collaborators/${collaboratorId}`);
    return response.data;
  },

  addPage: async (notebookId) => {
    const response = await API.post(`/notes/notebook/${notebookId}/pages`, {});
    return response.data;
  },

  updatePage: async (id, data) => {
    const response = await API.put(`/notes/page/${id}`, data);
    return response.data;
  },

  deletePage: async (id) => {
    const response = await API.delete(`/notes/page/${id}`);
    return response.data;
  },

  getPages: async (notebookId) => {
    const response = await API.get(`/notes/notebook/${notebookId}/pages`);
    return response.data;
  },

  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await API.post('/notes/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
};

export default noteService;