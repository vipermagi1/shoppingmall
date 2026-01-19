# 🚀 KOSINSA 쇼핑몰 배포 가이드

## 배포 아키텍처

- **프론트엔드**: Vercel
- **백엔드**: Heroku
- **데이터베이스**: MongoDB Atlas
- **소스 관리**: GitHub

---

## 📋 사전 준비

### 1. 필수 계정 생성

- [ ] GitHub 계정
- [ ] Vercel 계정 (GitHub 연동)
- [ ] Heroku 계정
- [ ] MongoDB Atlas 계정

---

## 🗄️ 1단계: MongoDB Atlas 설정

### 1.1 클러스터 생성

1. https://www.mongodb.com/cloud/atlas 접속
2. **Create a Cluster** 클릭
3. **FREE Tier** 선택 (M0 Sandbox - 512MB)
4. **Region** 선택: Seoul (ap-northeast-2) 권장
5. **Cluster Name** 입력 후 생성

### 1.2 데이터베이스 사용자 생성

1. **Database Access** 메뉴
2. **Add New Database User**
   - Username: `kosinsa-admin`
   - Password: 강력한 비밀번호 생성 (저장해두세요!)
   - Database User Privileges: `Read and write to any database`

### 1.3 네트워크 접근 허용

1. **Network Access** 메뉴
2. **Add IP Address**
   - **Allow Access from Anywhere**: `0.0.0.0/0` (또는 Heroku IP)
   - Comment: "Allow from anywhere"

### 1.4 Connection String 복사

1. **Database** → **Connect**
2. **Connect your application** 선택
3. **Connection String** 복사:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority
   ```
4. `<username>`과 `<password>`를 실제 값으로 교체

---

## 🔙 2단계: 백엔드 Heroku 배포

### 2.1 Heroku CLI 설치

```bash
# Windows
winget install Heroku.HerokuCLI

# 또는 https://devcenter.heroku.com/articles/heroku-cli에서 다운로드
```

### 2.2 Heroku 로그인

```bash
heroku login
```

### 2.3 Heroku 앱 생성

```bash
cd server
heroku create kosinsa-api

# 또는 원하는 이름으로
# heroku create your-app-name
```

### 2.4 환경변수 설정

```bash
# MongoDB 연결 문자열
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopping-mall-demo"

# JWT Secret (랜덤 문자열 생성)
heroku config:set JWT_SECRET="your-super-secret-jwt-key-change-this"

# 클라이언트 URL (나중에 Vercel URL로 변경)
heroku config:set CLIENT_URL="https://kosinsa.vercel.app"

# 포트원
heroku config:set PORTONE_IMP_CODE="imp56475867"

# Node 환경
heroku config:set NODE_ENV="production"
```

### 2.5 서버 package.json 확인

`server/package.json`에 다음이 있는지 확인:

```json
{
  "scripts": {
    "start": "node server.js"
  },
  "engines": {
    "node": "18.x"
  }
}
```

### 2.6 Procfile 생성

`server/Procfile` 파일 생성:
```
web: node server.js
```

### 2.7 배포

```bash
# Git 저장소 초기화 (server 폴더에서)
git init
git add .
git commit -m "Initial commit"

# Heroku에 배포
git push heroku main

# 로그 확인
heroku logs --tail
```

### 2.8 앱 URL 확인

```bash
heroku open
```

예시: `https://kosinsa-api.herokuapp.com`

---

## 🎨 3단계: 프론트엔드 Vercel 배포

### 3.1 환경변수 파일 준비

`client/.env.production` 생성:

```env
VITE_API_URL=https://kosinsa-api.herokuapp.com/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 3.2 package.json 확인

`client/package.json`에 빌드 스크립트 확인:

```json
{
  "scripts": {
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### 3.3 Vercel 배포

#### 방법 1: Vercel CLI

```bash
# Vercel CLI 설치
npm install -g vercel

# 클라이언트 폴더에서
cd client
vercel

# 프로덕션 배포
vercel --prod
```

#### 방법 2: Vercel 웹사이트 (권장)

1. https://vercel.com 접속
2. **Import Project**
3. GitHub 연동 후 저장소 선택
4. **Root Directory**: `client` 설정
5. **Environment Variables** 추가:
   - `VITE_API_URL`: `https://kosinsa-api.herokuapp.com/api`
   - `VITE_CLOUDINARY_CLOUD_NAME`: (Cloudinary 값)
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: (Cloudinary 값)
6. **Deploy** 클릭

### 3.4 배포 URL 확인

예시: `https://kosinsa.vercel.app`

---

## 📦 4단계: GitHub 설정

### 4.1 .gitignore 확인

루트 폴더에 `.gitignore` 파일이 있는지 확인하고 다음 포함:

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Environment variables
.env
.env.local
.env.production.local
.env.development.local

# Production
dist/
build/

# Logs
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Vercel
.vercel

# Testing
coverage/
```

### 4.2 GitHub 저장소 생성 및 푸시

```bash
# 루트 폴더에서
git init
git add .
git commit -m "Initial commit: KOSINSA Shopping Mall"

# GitHub에서 새 저장소 생성 후
git remote add origin https://github.com/yourusername/kosinsa-shopping-mall.git
git branch -M main
git push -u origin main
```

---

## 🔧 5단계: 백엔드 CORS 설정 확인

`server/server.js`에서 CORS 설정 업데이트:

```javascript
const cors = require('cors');

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
```

---

## ✅ 6단계: 배포 후 확인 사항

### 6.1 백엔드 테스트

```bash
curl https://kosinsa-api.herokuapp.com/
```

응답:
```json
{
  "message": "Shopping Mall Demo API Server",
  "status": "running",
  "version": "1.0.0"
}
```

### 6.2 프론트엔드 테스트

1. Vercel URL 접속
2. 회원가입/로그인 테스트
3. 상품 조회 테스트
4. 장바구니 추가 테스트
5. 주문 생성 테스트

### 6.3 데이터베이스 확인

1. MongoDB Atlas 대시보드
2. **Collections** → `shopping-mall-demo`
3. 데이터가 정상적으로 저장되는지 확인

---

## 🔐 7단계: 보안 설정

### 7.1 JWT_SECRET 변경

```bash
# 강력한 랜덤 문자열 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Heroku에 설정
heroku config:set JWT_SECRET="생성된-랜덤-문자열"
```

### 7.2 환경변수 이중 확인

```bash
# Heroku 환경변수 확인
heroku config

# Vercel 환경변수 확인
# Vercel 대시보드 → Settings → Environment Variables
```

---

## 🌐 8단계: 도메인 연결 (선택사항)

### Vercel 커스텀 도메인

1. Vercel 대시보드 → **Settings** → **Domains**
2. 도메인 추가 (예: `kosinsa.com`)
3. DNS 설정 업데이트

### Heroku 커스텀 도메인

```bash
heroku domains:add api.kosinsa.com
```

---

## 📊 9단계: 모니터링

### Heroku 로그 모니터링

```bash
heroku logs --tail
```

### Vercel 로그

Vercel 대시보드 → **Deployments** → 배포 선택 → **Logs**

---

## 🐛 문제 해결

### "502 Bad Gateway" 오류

- Heroku 앱이 정상 실행 중인지 확인
- 환경변수가 제대로 설정되었는지 확인
- `heroku logs --tail`로 에러 확인

### "CORS 오류"

```javascript
// server/server.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://kosinsa.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### "Database connection failed"

- MongoDB Atlas IP 화이트리스트 확인 (`0.0.0.0/0` 허용)
- Connection String 확인
- Username/Password 특수문자 URL 인코딩 확인

---

## 📝 체크리스트

배포 전:
- [ ] .gitignore 파일 확인
- [ ] 환경변수 파일(.env) Git에서 제외 확인
- [ ] 프로덕션 빌드 테스트
- [ ] 모든 API 엔드포인트 테스트

배포 후:
- [ ] 백엔드 Health Check
- [ ] 프론트엔드 접속 확인
- [ ] 회원가입/로그인 테스트
- [ ] 결제 테스트 (테스트 모드)
- [ ] MongoDB 데이터 확인

---

## 🎯 빠른 시작 명령어

```bash
# 1. MongoDB Atlas 연결 문자열 준비

# 2. Heroku 배포
cd server
git init
git add .
git commit -m "Deploy to Heroku"
heroku create kosinsa-api
heroku config:set MONGODB_URI="mongodb+srv://..."
heroku config:set JWT_SECRET="random-secret"
heroku config:set CLIENT_URL="https://kosinsa.vercel.app"
git push heroku main

# 3. Vercel 배포
cd ../client
vercel --prod
# 환경변수 입력 프롬프트에서 VITE_API_URL 설정

# 4. 백엔드 환경변수 업데이트 (Vercel URL 받은 후)
heroku config:set CLIENT_URL="https://your-app.vercel.app"
```

---

## 💡 추가 최적화

### 성능 개선

- CDN 활용 (Vercel 자동 제공)
- 이미지 최적화 (Cloudinary)
- MongoDB 인덱스 추가

### 보안 강화

- Rate Limiting 추가
- Helmet.js 사용
- HTTPS 강제 (Vercel/Heroku 기본 제공)

---

필요한 파일들을 생성하고 설정하시겠습니까?
