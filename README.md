# 🛍️ KOSINSA - 코신사 쇼핑몰

무신사 스타일의 패션 이커머스 플랫폼

## 🚀 기술 스택

### Frontend
- React 19
- React Router DOM
- Axios
- Vite

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Bcrypt

### 결제
- 포트원 (PortOne/아임포트)
  - 신용카드
  - 실시간 계좌이체
  - 가상계좌

### 배포
- Frontend: Vercel
- Backend: Heroku
- Database: MongoDB Atlas

## 📦 주요 기능

### 사용자 기능
- ✅ 회원가입 / 로그인
- ✅ 상품 조회 (카테고리별)
- ✅ 상품 상세보기
- ✅ 장바구니 (사용자별 분리)
- ✅ 주문/결제 (포트원 연동)
- ✅ 주문 내역 조회

### 관리자 기능
- ✅ 상품 관리 (CRUD)
- ✅ 주문 관리
- ✅ 대시보드

### 상품 카테고리
- 상의, 하의, 아우터, 신발, 가방, 액세서리, 모자, 시계, 주얼리

## 🏃 로컬 개발 환경 실행

### 1. 저장소 클론
```bash
git clone https://github.com/yourusername/kosinsa-shopping-mall.git
cd kosinsa-shopping-mall
```

### 2. 백엔드 설정
```bash
cd server
npm install

# .env 파일 생성
MONGODB_URI=mongodb://localhost:27017/shopping-mall-demo
JWT_SECRET=your-secret-key
PORT=5000

# 서버 실행
npm run dev
```

### 3. 프론트엔드 설정
```bash
cd client
npm install

# .env 파일 생성
VITE_API_URL=http://localhost:5000/api

# 개발 서버 실행
npm run dev
```

### 4. 샘플 데이터 추가
```bash
cd server
npm run seed
```

## 🌐 배포

상세한 배포 가이드는 다음 문서를 참조하세요:
- 📖 [DEPLOYMENT.md](./DEPLOYMENT.md) - 전체 배포 가이드
- ⚡ [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 빠른 배포 가이드

### 빠른 배포 순서

1. **MongoDB Atlas** 설정 → Connection String 복사
2. **Heroku** 백엔드 배포 → API URL 확인
3. **Vercel** 프론트엔드 배포 → 환경변수 설정
4. **테스트** → 모든 기능 확인

## 🔐 환경변수

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-app.vercel.app
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```env
VITE_API_URL=https://your-api.herokuapp.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 📱 API 엔드포인트

### 인증
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃
- `GET /api/auth/me` - 현재 사용자 정보

### 상품
- `GET /api/products` - 전체 상품 조회
- `GET /api/products/:id` - 상품 상세
- `POST /api/products` - 상품 생성 (관리자)
- `PUT /api/products/:id` - 상품 수정 (관리자)
- `DELETE /api/products/:id` - 상품 삭제 (관리자)

### 장바구니
- `GET /api/cart` - 장바구니 조회
- `POST /api/cart/items` - 장바구니 추가
- `PUT /api/cart/items/:id` - 수량 수정
- `DELETE /api/cart/items/:id` - 상품 제거
- `DELETE /api/cart` - 장바구니 비우기

### 주문
- `POST /api/orders` - 주문 생성
- `GET /api/orders/myorders` - 내 주문 목록
- `GET /api/orders/:id` - 주문 상세
- `GET /api/orders` - 전체 주문 (관리자)

### 사용자
- `POST /api/users` - 회원가입
- `GET /api/users` - 전체 사용자 (관리자)
- `GET /api/users/:id` - 사용자 상세
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제

## 👤 기본 관리자 계정

관리자 계정을 직접 MongoDB에 생성하거나 회원가입 후 DB에서 role을 'admin'으로 변경하세요.

## 🧪 테스트 결제

포트원 테스트 모드:
- **카드번호**: `4092-0200-1234-5678`
- **유효기간**: 아무 미래 날짜
- **CVC**: 아무 3자리

## 📄 라이선스

MIT

## 👨‍💻 개발자

KOSINSA Development Team

---

**⭐ 이 프로젝트가 도움이 되었다면 Star를 눌러주세요!**
