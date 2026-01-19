const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
} = require('../controllers/cartController');

// 모든 라우트는 인증이 필요함
router.use(protect);

// GET /api/cart - 장바구니 조회
router.get('/', getCart);

// POST /api/cart/items - 장바구니에 상품 추가
router.post('/items', addToCart);

// PUT /api/cart/items/:productId - 장바구니 상품 수량 업데이트
router.put('/items/:productId', updateCartItemQuantity);

// DELETE /api/cart/items/:productId - 장바구니에서 상품 제거
router.delete('/items/:productId', removeFromCart);

// DELETE /api/cart - 장바구니 비우기
router.delete('/', clearCart);

module.exports = router;
