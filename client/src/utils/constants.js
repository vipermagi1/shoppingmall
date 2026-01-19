export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  USERS: '/users',
  USER_DETAIL: '/users/:id',
};
