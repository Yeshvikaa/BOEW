import api from './api'

export const imageService = {
  upload: (formData) => api.post('/images/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getAll: (page = 1) => api.get(`/images?page=${page}`),
  search: (query) => api.post('/images/search', { query }),
  searchSimilar: (imageId) => api.get(`/images/similar/${imageId}`),
  getById: (id) => api.get(`/images/${id}`),
  delete: (id) => api.delete(`/images/${id}`),
  getHistory: () => api.get('/images/history'),
  getStats: () => api.get('/images/stats'),
}

export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
  getAllUsers: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.put(`/users/${id}/role`, { role }),
}
