const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    사용자 장바구니 조회
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    let cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price image stock');
    
    if (!cart) {
      // 장바구니가 없으면 새로 생성
      cart = await Cart.create({ user: userId, items: [] });
    }
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '장바구니 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    장바구니에 상품 추가
// @route   POST /api/cart/items
// @access  Private
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        success: false,
        message: '상품 ID가 필요합니다'
      });
    }
    
    // 상품 정보 조회
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다'
      });
    }
    
    // 재고 확인
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `재고가 부족합니다. (현재 재고: ${product.stock})`
      });
    }
    
    // 사용자 장바구니 조회 또는 생성
    let cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      cart = await Cart.create({ user: userId, items: [] });
    }
    
    // 이미 장바구니에 있는 상품인지 확인
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // 기존 상품 수량 증가
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      // 재고 확인
      if (product.stock < newQuantity) {
        return res.status(400).json({
          success: false,
          message: `재고가 부족합니다. (현재 재고: ${product.stock})`
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // 새 상품 추가
      cart.items.push({
        product: productId,
        name: product.name,
        quantity: quantity,
        price: product.price,
        image: product.image || ''
      });
    }
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
    
    res.status(200).json({
      success: true,
      message: '장바구니에 추가되었습니다',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '장바구니 추가 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    장바구니에서 상품 제거
// @route   DELETE /api/cart/items/:productId
// @access  Private
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '장바구니를 찾을 수 없습니다'
      });
    }
    
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
    
    res.status(200).json({
      success: true,
      message: '장바구니에서 제거되었습니다',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '장바구니 제거 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    장바구니 상품 수량 업데이트
// @route   PUT /api/cart/items/:productId
// @access  Private
const updateCartItemQuantity = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: '수량은 1 이상이어야 합니다'
      });
    }
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '장바구니를 찾을 수 없습니다'
      });
    }
    
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '장바구니에 해당 상품이 없습니다'
      });
    }
    
    // 재고 확인
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: '상품을 찾을 수 없습니다'
      });
    }
    
    if (product.stock < quantity) {
      return res.status(400).json({
        success: false,
        message: `재고가 부족합니다. (현재 재고: ${product.stock})`
      });
    }
    
    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    
    const updatedCart = await Cart.findById(cart._id).populate('items.product', 'name price image stock');
    
    res.status(200).json({
      success: true,
      message: '수량이 업데이트되었습니다',
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '수량 업데이트 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    장바구니 비우기
// @route   DELETE /api/cart
// @access  Private
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const cart = await Cart.findOne({ user: userId });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: '장바구니를 찾을 수 없습니다'
      });
    }
    
    cart.items = [];
    await cart.save();
    
    res.status(200).json({
      success: true,
      message: '장바구니가 비워졌습니다',
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '장바구니 비우기 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart
};
