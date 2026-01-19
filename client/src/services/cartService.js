import api from './api';

export const cartService = {
  // 장바구니 조회
  getCart: async () => {
    const response = await api.get('/cart');
    return response.data;
  },

  // 장바구니에 상품 추가
  addToCart: async (productId, quantity = 1) => {
    const response = await api.post('/cart/items', { productId, quantity });
    return response.data;
  },

  // 장바구니에서 상품 제거
  removeFromCart: async (productId) => {
    const response = await api.delete(`/cart/items/${productId}`);
    return response.data;
  },

  // 장바구니 상품 수량 업데이트
  updateQuantity: async (productId, quantity) => {
    const response = await api.put(`/cart/items/${productId}`, { quantity });
    return response.data;
  },

  // 장바구니 비우기
  clearCart: async () => {
    const response = await api.delete('/cart');
    return response.data;
  },
};
