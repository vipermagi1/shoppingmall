const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

const deleteProductsWithoutImages = async () => {
  try {
    // MongoDB 연결
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-mall-demo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 이미지가 없거나 빈 문자열인 상품 찾기
    const productsWithoutImages = await Product.find({
      $or: [
        { image: { $exists: false } },
        { image: '' },
        { image: null }
      ]
    });

    console.log(`이미지가 없는 상품 ${productsWithoutImages.length}개 발견`);

    if (productsWithoutImages.length > 0) {
      // 이미지가 없는 상품 삭제
      const result = await Product.deleteMany({
        $or: [
          { image: { $exists: false } },
          { image: '' },
          { image: null }
        ]
      });

      console.log(`${result.deletedCount}개의 상품이 삭제되었습니다.`);
      
      // 삭제된 상품 목록 출력
      productsWithoutImages.forEach(product => {
        console.log(`- 삭제됨: ${product.name} (SKU: ${product.sku})`);
      });
    } else {
      console.log('이미지가 없는 상품이 없습니다.');
    }

    process.exit(0);
  } catch (error) {
    console.error('상품 삭제 중 오류:', error);
    process.exit(1);
  }
};

deleteProductsWithoutImages();
