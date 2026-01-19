const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('../models/Product');

// 무신사 스타일 이미지 URL (실제 패션 상품 이미지)
// 참고: 무신사 이미지는 저작권이 있으므로 실제 운영 시에는 본인 소유 이미지나 라이선스가 있는 이미지를 사용하세요
const getMusinsaStyleImageUrl = (productName, sku) => {
  // 무신사 CDN 이미지 URL 패턴 사용
  // 각 상품에 맞는 실제 패션 상품 이미지 URL
  // 실제 상품 ID는 무신사 웹사이트에서 확인 필요
  const imageMap = {
    '오버핏 그래픽 티셔츠': 'https://image.msscdn.net/images/goods_img/20240101/3000000/3000000_1_500.jpg',
    '베이직 스트라이프 셔츠': 'https://image.msscdn.net/images/goods_img/20240101/3000001/3000001_1_500.jpg',
    '울 블렌드 니트 스웨터': 'https://image.msscdn.net/images/goods_img/20240101/3000002/3000002_1_500.jpg',
    '후드 스웨트셔츠': 'https://image.msscdn.net/images/goods_img/20240101/3000003/3000003_1_500.jpg',
    '슬림핏 데님 팬츠': 'https://image.msscdn.net/images/goods_img/20240101/3000004/3000004_1_500.jpg',
    '와이드 카고 팬츠': 'https://image.msscdn.net/images/goods_img/20240101/3000005/3000005_1_500.jpg',
    '슬랙스 팬츠': 'https://image.msscdn.net/images/goods_img/20240101/3000006/3000006_1_500.jpg',
    '퍼프 재킷': 'https://image.msscdn.net/images/goods_img/20240101/3000007/3000007_1_500.jpg',
    '트렌치 코트': 'https://image.msscdn.net/images/goods_img/20240101/3000008/3000008_1_500.jpg',
    '레더 재킷': 'https://image.msscdn.net/images/goods_img/20240101/3000009/3000009_1_500.jpg',
    '블루종 점퍼': 'https://image.msscdn.net/images/goods_img/20240101/3000010/3000010_1_500.jpg',
    '스니커즈': 'https://image.msscdn.net/images/goods_img/20240101/3000011/3000011_1_500.jpg',
    '부츠': 'https://image.msscdn.net/images/goods_img/20240101/3000012/3000012_1_500.jpg',
    '로퍼': 'https://image.msscdn.net/images/goods_img/20240101/3000013/3000013_1_500.jpg',
    '백팩': 'https://image.msscdn.net/images/goods_img/20240101/3000014/3000014_1_500.jpg',
    '토트 백': 'https://image.msscdn.net/images/goods_img/20240101/3000015/3000015_1_500.jpg',
    '크로스백': 'https://image.msscdn.net/images/goods_img/20240101/3000016/3000016_1_500.jpg',
    '캡 모자': 'https://image.msscdn.net/images/goods_img/20240101/3000017/3000017_1_500.jpg',
    '레더 벨트': 'https://image.msscdn.net/images/goods_img/20240101/3000018/3000018_1_500.jpg',
    '선글라스': 'https://image.msscdn.net/images/goods_img/20240101/3000019/3000019_1_500.jpg',
    '비니': 'https://image.msscdn.net/images/goods_img/20240101/3000020/3000020_1_500.jpg',
    '다이얼 시계': 'https://image.msscdn.net/images/goods_img/20240101/3000021/3000021_1_500.jpg',
    '스포츠 워치': 'https://image.msscdn.net/images/goods_img/20240101/3000022/3000022_1_500.jpg',
    '실버 체인 목걸이': 'https://image.msscdn.net/images/goods_img/20240101/3000023/3000023_1_500.jpg'
  };

  // 매핑된 이미지가 있으면 사용, 없으면 placeholder 사용
  return imageMap[productName] || `https://via.placeholder.com/500x500?text=${encodeURIComponent(productName)}`;
};

// 샘플 상품 데이터 (무신사 스타일)
const sampleProducts = [
  // 상의
  {
    sku: 'TOP-001',
    name: '오버핏 그래픽 티셔츠',
    price: 45000,
    category: '상의',
    description: '편안한 오버핏 실루엣의 그래픽 티셔츠',
    stock: 50,
    image: getMusinsaStyleImageUrl('오버핏 그래픽 티셔츠', 'TOP-001'),
    rating: 4.5,
    numReviews: 12
  },
  {
    sku: 'TOP-002',
    name: '베이직 스트라이프 셔츠',
    price: 69000,
    category: '상의',
    description: '클래식한 스트라이프 패턴의 베이직 셔츠',
    stock: 30,
    image: getMusinsaStyleImageUrl('베이직 스트라이프 셔츠', 'TOP-002'),
    rating: 4.8,
    numReviews: 25
  },
  {
    sku: 'TOP-003',
    name: '울 블렌드 니트 스웨터',
    price: 129000,
    category: '상의',
    description: '따뜻하고 부드러운 울 블렌드 니트',
    stock: 20,
    image: getMusinsaStyleImageUrl('울 블렌드 니트 스웨터', 'TOP-003'),
    rating: 4.7,
    numReviews: 18
  },
  {
    sku: 'TOP-004',
    name: '후드 스웨트셔츠',
    price: 89000,
    category: '상의',
    description: '편안한 캐주얼 후드 스웨트셔츠',
    stock: 40,
    image: getMusinsaStyleImageUrl('후드 스웨트셔츠', 'TOP-004'),
    rating: 4.6,
    numReviews: 32
  },
  // 하의
  {
    sku: 'BOT-001',
    name: '슬림핏 데님 팬츠',
    price: 99000,
    category: '하의',
    description: '슬림핏 실루엣의 클래식 데님 팬츠',
    stock: 35,
    image: getMusinsaStyleImageUrl('슬림핏 데님 팬츠', 'BOT-001'),
    rating: 4.9,
    numReviews: 45
  },
  {
    sku: 'BOT-002',
    name: '와이드 카고 팬츠',
    price: 119000,
    category: '하의',
    description: '편안한 와이드 핏의 카고 팬츠',
    stock: 25,
    image: getMusinsaStyleImageUrl('와이드 카고 팬츠', 'BOT-002'),
    rating: 4.5,
    numReviews: 15
  },
  {
    sku: 'BOT-003',
    name: '슬랙스 팬츠',
    price: 89000,
    category: '하의',
    description: '깔끔한 오피스룩 슬랙스',
    stock: 30,
    image: getMusinsaStyleImageUrl('슬랙스 팬츠', 'BOT-003'),
    rating: 4.7,
    numReviews: 22
  },
  // 아우터
  {
    sku: 'OUT-001',
    name: '퍼프 재킷',
    price: 199000,
    category: '아우터',
    description: '따뜻한 겨울 필수 퍼프 재킷',
    stock: 15,
    image: getMusinsaStyleImageUrl('퍼프 재킷', 'OUT-001'),
    rating: 4.8,
    numReviews: 38
  },
  {
    sku: 'OUT-002',
    name: '트렌치 코트',
    price: 259000,
    category: '아우터',
    description: '클래식한 트렌치 코트',
    stock: 12,
    image: getMusinsaStyleImageUrl('트렌치 코트', 'OUT-002'),
    rating: 5.0,
    numReviews: 28
  },
  {
    sku: 'OUT-003',
    name: '레더 재킷',
    price: 329000,
    category: '아우터',
    description: '시크한 레더 재킷',
    stock: 10,
    image: getMusinsaStyleImageUrl('레더 재킷', 'OUT-003'),
    rating: 4.9,
    numReviews: 20
  },
  {
    sku: 'OUT-004',
    name: '블루종 점퍼',
    price: 149000,
    category: '아우터',
    description: '캐주얼한 블루종 점퍼',
    stock: 20,
    image: getMusinsaStyleImageUrl('블루종 점퍼', 'OUT-004'),
    rating: 4.6,
    numReviews: 16
  },
  // 신발
  {
    sku: 'SHO-001',
    name: '스니커즈',
    price: 129000,
    category: '신발',
    description: '편안한 일상 스니커즈',
    stock: 50,
    image: getMusinsaStyleImageUrl('스니커즈', 'SHO-001'),
    rating: 4.7,
    numReviews: 42
  },
  {
    sku: 'SHO-002',
    name: '부츠',
    price: 189000,
    category: '신발',
    description: '클래식한 레더 부츠',
    stock: 18,
    image: getMusinsaStyleImageUrl('부츠', 'SHO-002'),
    rating: 4.8,
    numReviews: 25
  },
  {
    sku: 'SHO-003',
    name: '로퍼',
    price: 159000,
    category: '신발',
    description: '세련된 오피스 로퍼',
    stock: 22,
    image: getMusinsaStyleImageUrl('로퍼', 'SHO-003'),
    rating: 4.9,
    numReviews: 30
  },
  // 가방
  {
    sku: 'BAG-001',
    name: '백팩',
    price: 149000,
    category: '가방',
    description: '실용적인 일상 백팩',
    stock: 30,
    image: getMusinsaStyleImageUrl('백팩', 'BAG-001'),
    rating: 4.6,
    numReviews: 35
  },
  {
    sku: 'BAG-002',
    name: '토트 백',
    price: 99000,
    category: '가방',
    description: '심플한 토트 백',
    stock: 25,
    image: getMusinsaStyleImageUrl('토트 백', 'BAG-002'),
    rating: 4.5,
    numReviews: 18
  },
  {
    sku: 'BAG-003',
    name: '크로스백',
    price: 79000,
    category: '가방',
    description: '편리한 크로스백',
    stock: 40,
    image: getMusinsaStyleImageUrl('크로스백', 'BAG-003'),
    rating: 4.7,
    numReviews: 22
  },
  // 액세서리
  {
    sku: 'ACC-001',
    name: '캡 모자',
    price: 39000,
    category: '액세서리',
    description: '베이직 캡 모자',
    stock: 60,
    image: getMusinsaStyleImageUrl('캡 모자', 'ACC-001'),
    rating: 4.4,
    numReviews: 28
  },
  {
    sku: 'ACC-002',
    name: '레더 벨트',
    price: 59000,
    category: '액세서리',
    description: '고급 레더 벨트',
    stock: 35,
    image: getMusinsaStyleImageUrl('레더 벨트', 'ACC-002'),
    rating: 4.8,
    numReviews: 15
  },
  {
    sku: 'ACC-003',
    name: '선글라스',
    price: 89000,
    category: '액세서리',
    description: '트렌디한 선글라스',
    stock: 28,
    image: getMusinsaStyleImageUrl('선글라스', 'ACC-003'),
    rating: 4.6,
    numReviews: 20
  },
  // 모자
  {
    sku: 'HAT-001',
    name: '비니',
    price: 35000,
    category: '모자',
    description: '따뜻한 비니',
    stock: 45,
    image: getMusinsaStyleImageUrl('비니', 'HAT-001'),
    rating: 4.5,
    numReviews: 32
  },
  // 시계
  {
    sku: 'WAT-001',
    name: '다이얼 시계',
    price: 199000,
    category: '시계',
    description: '클래식 다이얼 시계',
    stock: 15,
    image: getMusinsaStyleImageUrl('다이얼 시계', 'WAT-001'),
    rating: 4.9,
    numReviews: 40
  },
  {
    sku: 'WAT-002',
    name: '스포츠 워치',
    price: 149000,
    category: '시계',
    description: '기능성 스포츠 워치',
    stock: 20,
    image: getMusinsaStyleImageUrl('스포츠 워치', 'WAT-002'),
    rating: 4.7,
    numReviews: 25
  },
  // 주얼리
  {
    sku: 'JEW-001',
    name: '실버 체인 목걸이',
    price: 89000,
    category: '주얼리',
    description: '심플한 실버 체인 목걸이',
    stock: 30,
    image: getMusinsaStyleImageUrl('실버 체인 목걸이', 'JEW-001'),
    rating: 4.6,
    numReviews: 18
  }
];

const seedProducts = async () => {
  try {
    // MongoDB 연결
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping-mall-demo');
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // 기존 상품 삭제 (선택사항)
    await Product.deleteMany({});
    console.log('기존 상품 데이터 삭제 완료');

    // 상품 생성
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`${createdProducts.length}개의 상품이 등록되었습니다.`);

    process.exit(0);
  } catch (error) {
    console.error('상품 등록 중 오류:', error);
    process.exit(1);
  }
};

seedProducts();
