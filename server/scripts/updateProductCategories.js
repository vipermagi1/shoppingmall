const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

// 상품명 기반 카테고리 분류 로직
const categorizeProduct = (productName) => {
  const name = productName.toLowerCase();
  
  // 상의 키워드
  if (name.includes('티셔츠') || name.includes('셔츠') || name.includes('니트') || 
      name.includes('스웨터') || name.includes('후드') || name.includes('맨투맨') ||
      name.includes('블라우스') || name.includes('cardigan') || name.includes('polo')) {
    return '상의';
  }
  
  // 하의 키워드
  if (name.includes('팬츠') || name.includes('바지') || name.includes('데님') || 
      name.includes('슬랙스') || name.includes('카고') || name.includes('조거') ||
      name.includes('청바지') || name.includes('short') || name.includes('스커트')) {
    return '하의';
  }
  
  // 아우터 키워드
  if (name.includes('재킷') || name.includes('코트') || name.includes('점퍼') || 
      name.includes('패딩') || name.includes('퍼프') || name.includes('블루종') ||
      name.includes('가디건') || name.includes('트렌치') || name.includes('레더') ||
      name.includes('무스탕') || name.includes('야상')) {
    return '아우터';
  }
  
  // 신발 키워드
  if (name.includes('신발') || name.includes('스니커즈') || name.includes('부츠') || 
      name.includes('로퍼') || name.includes('슬리퍼') || name.includes('샌들') ||
      name.includes('운동화') || name.includes('구두')) {
    return '신발';
  }
  
  // 가방 키워드
  if (name.includes('가방') || name.includes('백팩') || name.includes('토트') || 
      name.includes('크로스') || name.includes('숄더') || name.includes('클러치') ||
      name.includes('백') || name.includes('bag')) {
    return '가방';
  }
  
  // 모자 키워드
  if (name.includes('모자') || name.includes('캡') || name.includes('비니') || 
      name.includes('햇') || name.includes('버킷햇') || name.includes('fedora')) {
    return '모자';
  }
  
  // 시계 키워드
  if (name.includes('시계') || name.includes('워치') || name.includes('watch') ||
      name.includes('다이얼')) {
    return '시계';
  }
  
  // 주얼리 키워드
  if (name.includes('목걸이') || name.includes('반지') || name.includes('귀걸이') || 
      name.includes('팔찌') || name.includes('체인') || name.includes('링') ||
      name.includes('necklace') || name.includes('bracelet') || name.includes('주얼리')) {
    return '주얼리';
  }
  
  // 액세서리 키워드 (나머지)
  if (name.includes('벨트') || name.includes('선글라스') || name.includes('안경') || 
      name.includes('지갑') || name.includes('머플러') || name.includes('스카프') ||
      name.includes('장갑') || name.includes('양말')) {
    return '액세서리';
  }
  
  // 기본값: 액세서리
  return '액세서리';
};

const updateProductCategories = async () => {
  try {
    // MongoDB 연결
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-mall-demo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 모든 상품 조회
    const products = await Product.find({});
    console.log(`총 ${products.length}개의 상품을 찾았습니다.`);

    let updateCount = 0;
    
    // 각 상품의 카테고리 업데이트
    for (const product of products) {
      const newCategory = categorizeProduct(product.name);
      
      if (product.category !== newCategory) {
        product.category = newCategory;
        await product.save();
        console.log(`"${product.name}" 카테고리 변경: ${product.category} → ${newCategory}`);
        updateCount++;
      } else {
        console.log(`"${product.name}" 카테고리 유지: ${product.category}`);
      }
    }

    console.log(`\n완료! ${updateCount}개 상품의 카테고리가 업데이트되었습니다.`);

    // 카테고리별 상품 수 표시
    const categoryCounts = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);

    console.log('\n카테고리별 상품 수:');
    categoryCounts.forEach(item => {
      console.log(`  ${item._id}: ${item.count}개`);
    });

    process.exit(0);
  } catch (error) {
    console.error('카테고리 업데이트 중 오류:', error);
    process.exit(1);
  }
};

updateProductCategories();
