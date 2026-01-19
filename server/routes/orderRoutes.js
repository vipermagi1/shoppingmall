const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');

// GET /api/orders - 모든 주문 조회 (어드민)
router.get('/', protect, admin, getOrders);

// GET /api/orders/myorders - 내 주문 목록 (인증 필요)
router.get('/myorders', protect, getMyOrders);

// GET /api/orders/:id - 특정 주문 조회 (인증 필요)
router.get('/:id', protect, getOrderById);

// POST /api/orders - 주문 생성 (인증 필요)
router.post('/', protect, createOrder);

// PUT /api/orders/:id/pay - 주문 결제 처리 (인증 필요)
router.put('/:id/pay', protect, updateOrderToPaid);

// PUT /api/orders/:id/deliver - 주문 배송 처리 (어드민)
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// PUT /api/orders/:id/status - 주문 상태 변경 (어드민)
router.put('/:id/status', protect, admin, updateOrderStatus);

// DELETE /api/orders/:id - 주문 삭제 (어드민)
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
