import api from './api';

export const orderService = {
  // 모든 주문 조회 (어드민)
  getAllOrders: async () => {
    const response = await api.get('/orders');
    return response.data;
  },

  // 내 주문 목록 조회 (인증 토큰 사용)
  getMyOrders: async () => {
    const response = await api.get('/orders/myorders');
    return response.data;
  },

  // 특정 주문 조회
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  // 주문 생성
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  // 주문 결제 처리
  updateOrderToPaid: async (id, paymentResult) => {
    const response = await api.put(`/orders/${id}/pay`, { paymentResult });
    return response.data;
  },

  // 주문 배송 처리 (어드민)
  updateOrderToDelivered: async (id) => {
    const response = await api.put(`/orders/${id}/deliver`);
    return response.data;
  },

  // 주문 상태 변경 (어드민)
  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, { status });
    return response.data;
  },

  // 주문 삭제 (어드민)
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};
