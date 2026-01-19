# Shopping Mall Demo Client

Vite와 React를 사용한 쇼핑몰 데모 클라이언트 애플리케이션입니다.

## 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`env.example` 파일을 참고하여 `.env` 파일을 생성하고 필요한 값들을 설정하세요.

```bash
cp env.example .env
```

## 실행 방법

### 개발 모드
```bash
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### 프로덕션 빌드
```bash
npm run build
```

### 프로덕션 미리보기
```bash
npm run preview
```

## 프로젝트 구조

```
client/
├── public/              # 정적 파일
├── src/
│   ├── components/      # 재사용 가능한 컴포넌트
│   │   ├── Layout.jsx   # 레이아웃 컴포넌트
│   │   └── Layout.css
│   ├── pages/           # 페이지 컴포넌트
│   │   ├── Home.jsx     # 홈 페이지
│   │   ├── Products.jsx # 상품 목록 페이지
│   │   ├── ProductDetail.jsx # 상품 상세 페이지
│   │   └── Users.jsx    # 사용자 목록 페이지
│   ├── services/        # API 서비스
│   │   ├── api.js       # Axios 인스턴스 설정
│   │   ├── productService.js # 상품 API 서비스
│   │   └── userService.js    # 사용자 API 서비스
│   ├── utils/           # 유틸리티 함수
│   │   └── constants.js # 상수 정의
│   ├── App.jsx          # 메인 앱 컴포넌트
│   ├── main.jsx         # 진입점
│   └── index.css        # 전역 스타일
├── vite.config.js       # Vite 설정
└── package.json         # 프로젝트 설정
```

## 주요 기능

- **React Router**: 페이지 라우팅
- **Axios**: HTTP 클라이언트 (API 통신)
- **반응형 디자인**: 모바일 친화적인 UI
- **RESTful API 연동**: Express 서버와 통신

## 사용 기술

- **Vite** - 빌드 도구
- **React** - UI 라이브러리
- **React Router DOM** - 라우팅
- **Axios** - HTTP 클라이언트

## API 연동

서버가 `http://localhost:5000`에서 실행 중이어야 합니다. 
Vite의 프록시 설정을 통해 `/api` 요청이 자동으로 서버로 전달됩니다.
