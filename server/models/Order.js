const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
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
    min: 1
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

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: {
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    phone: { type: String, required: true }
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['card', 'kakaopay', 'naverpay', 'payco', 'tosspay', 'bank', 'vbank']
  },
  paymentResult: {
    imp_uid: String,           // 포트원 거래 고유번호
    merchant_uid: String,      // 가맹점 주문번호
    pg_provider: String,       // PG사
    pg_tid: String,            // PG사 거래번호
    pay_method: String,        // 결제 수단
    status: String,            // 결제 상태
    paid_amount: Number,       // 결제 금액
    receipt_url: String,       // 영수증 URL
    card_name: String,         // 카드사명
    card_number: String,       // 카드번호 (마스킹)
    vbank_name: String,        // 가상계좌 은행명
    vbank_num: String,         // 가상계좌 번호
    vbank_holder: String,      // 가상계좌 예금주
    vbank_date: Number,        // 가상계좌 입금기한
    update_time: String
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: Boolean,
    required: true,
    default: false
  },
  deliveredAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
