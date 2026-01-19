const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: [true, '상품 SKU를 입력해주세요'],
    unique: true,
    trim: true,
    index: true
  },
  name: {
    type: String,
    required: [true, '상품명을 입력해주세요'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, '가격을 입력해주세요'],
    min: [0, '가격은 0 이상이어야 합니다']
  },
  category: {
    type: String,
    required: [true, '카테고리를 입력해주세요'],
    enum: {
      values: ['상의', '하의', '아우터', '신발', '가방', '액세서리', '모자', '시계', '주얼리'],
      message: '카테고리는 상의, 하의, 아우터, 신발, 가방, 액세서리, 모자, 시계, 주얼리 중 하나여야 합니다'
    }
  },
  image: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  stock: {
    type: Number,
    required: [true, '재고를 입력해주세요'],
    min: [0, '재고는 0 이상이어야 합니다'],
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
