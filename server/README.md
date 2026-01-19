# Shopping Mall Demo Server

Node.js, Express, MongoDB를 사용한 쇼핑몰 데모 서버입니다.

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.example` 파일을 복사하여 `.env` 파일을 생성하고 필요한 값들을 설정하세요.

```bash
cp .env.example .env
```

3. MongoDB 실행
로컬 MongoDB가 실행 중이어야 합니다. 또는 `.env` 파일에서 MongoDB URI를 설정하세요.

## 실행 방법

### 개발 모드 (nodemon 사용)
```bash
npm run dev
```

### 프로덕션 모드
```bash
npm start
```

서버는 기본적으로 `http://localhost:5000`에서 실행됩니다.

## API 엔드포인트

### 상품 (Products)
- `GET /api/products` - 모든 상품 조회
- `GET /api/products/:id` - 특정 상품 조회
- `POST /api/products` - 상품 생성
- `PUT /api/products/:id` - 상품 수정
- `DELETE /api/products/:id` - 상품 삭제

### 사용자 (Users)
- `GET /api/users` - 모든 사용자 조회
- `GET /api/users/:id` - 특정 사용자 조회
- `POST /api/users` - 사용자 생성
- `PUT /api/users/:id` - 사용자 수정
- `DELETE /api/users/:id` - 사용자 삭제

## 프로젝트 구조

```
server/
├── config/          # 설정 파일들
│   └── database.js  # MongoDB 연결 설정
├── controllers/     # 컨트롤러 (비즈니스 로직)
│   ├── productController.js
│   └── userController.js
├── models/          # MongoDB 모델
│   ├── Product.js
│   └── User.js
├── routes/          # 라우트 정의
│   ├── productRoutes.js
│   └── userRoutes.js
├── middleware/      # 미들웨어 (필요시 추가)
├── .env.example     # 환경 변수 예시
├── .gitignore       # Git 무시 파일
├── package.json     # 프로젝트 설정
├── server.js        # 메인 서버 파일
└── README.md        # 프로젝트 문서
```

## 사용 기술

- **Node.js** - 서버 런타임
- **Express** - 웹 프레임워크
- **MongoDB** - 데이터베이스
- **Mongoose** - MongoDB ODM
- **dotenv** - 환경 변수 관리
- **cors** - CORS 설정
- **morgan** - HTTP 요청 로거
