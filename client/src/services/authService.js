import api from './api';

export const authService = {
  // 로그인
  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  // 현재 사용자 정보 조회
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // 로그아웃 (서버에 요청 후 클라이언트 측 토큰 제거)
  logout: async () => {
    try {
      // 서버에 로그아웃 요청 (선택사항)
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await api.post('/auth/logout');
        } catch (error) {
          // 서버 요청 실패해도 클라이언트 측 토큰은 제거
          console.error('로그아웃 서버 요청 실패:', error);
        }
      }
    } catch (error) {
      console.error('로그아웃 오류:', error);
    } finally {
      // 항상 클라이언트 측 토큰 제거
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // 현재 사용자 정보 가져오기 (localStorage에서)
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // 토큰 가져오기
  getToken: () => {
    return localStorage.getItem('token');
  },

  // 로그인 여부 확인
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};
