import api from './api';

export const userService = {
  // 모든 사용자 조회
  getAllUsers: async () => {
    const response = await api.get('/users');
    return response.data;
  },

  // 특정 사용자 조회
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // 사용자 생성
  createUser: async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // 사용자 수정
  updateUser: async (id, userData) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  },

  // 사용자 삭제
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};
