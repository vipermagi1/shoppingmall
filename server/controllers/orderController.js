const Order = require('../models/Order');

// @desc    모든 주문 조회 (어드민)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '주문 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    내 주문 목록 조회
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    // 인증된 사용자 ID 사용
    const userId = req.user.id;
    
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: '사용자 ID가 필요합니다'
      });
    }

    const orders = await Order.find({ user: userId })
      .populate('orderItems.product', 'name image')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '주문 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    특정 주문 조회
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name image description');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다'
      });
    }
    
    // 관리자가 아니면 자신의 주문만 조회 가능
    const orderUserId = order.user._id ? order.user._id.toString() : order.user.toString();
    if (req.user.role !== 'admin' && orderUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: '이 주문에 대한 접근 권한이 없습니다'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '주문 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    주문 생성
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: '주문 항목이 없습니다'
      });
    }

    // 인증된 사용자 ID 사용
    const userId = req.user.id;

    const order = await Order.create({
      user: userId,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice
    });

    const createdOrder = await Order.findById(order._id)
      .populate('orderItems.product', 'name image');

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '주문 생성 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    주문 결제 처리
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = req.body.paymentResult || {};
    order.status = 'processing';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '주문 결제 처리 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    주문 배송 처리 (어드민)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다'
      });
    }

    order.isDelivered = true;
    order.deliveredAt = Date.now();
    order.status = 'delivered';

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '주문 배송 처리 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    주문 상태 변경 (어드민)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다'
      });
    }

    order.status = status;
    
    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '주문 상태 변경 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    주문 삭제 (어드민)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: '주문을 찾을 수 없습니다'
      });
    }
    
    res.status(200).json({
      success: true,
      message: '주문이 삭제되었습니다',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '주문 삭제 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

module.exports = {
  getOrders,
  getOrderById,
  getMyOrders,
  createOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  deleteOrder
};
