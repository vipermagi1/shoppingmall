import api from './api';

export const productService = {
  // 모든 상품 조회
  getAllProducts: async () => {
    const response = await api.get('/products');
    return response.data;
  },

  // 특정 상품 조회
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  // 상품 생성
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  },

  // 상품 수정
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response.data;
  },

  // 상품 삭제
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};
