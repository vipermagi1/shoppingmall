const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    default: ''
  }
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  items: [cartItemSchema]
}, {
  timestamps: true
});

// 사용자별 장바구니 총액 계산 메서드
cartSchema.methods.calculateTotal = function() {
  return this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
};

// 사용자별 장바구니 아이템 수 계산 메서드
cartSchema.methods.getItemCount = function() {
  return this.items.reduce((total, item) => {
    return total + item.quantity;
  }, 0);
};

module.exports = mongoose.model('Cart', cartSchema);
