# ⚡ 빠른 배포 가이드

## 1️⃣ MongoDB Atlas 설정 (5분)

1. https://www.mongodb.com/cloud/atlas 접속 → 회원가입
2. **Create Cluster** (FREE M0) → Region: Seoul
3. **Database Access**: 사용자 생성 (username/password 저장!)
4. **Network Access**: `0.0.0.0/0` 허용
5. **Connect** → Connection String 복사:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopping-mall-demo
   ```

---

## 2️⃣ 백엔드 Heroku 배포 (10분)

### Heroku CLI 설치
```bash
# Windows
winget install Heroku.HerokuCLI
```

### 배포 명령어
```bash
# 1. 로그인
heroku login

# 2. 앱 생성
cd server
heroku create kosinsa-api

# 3. 환경변수 설정
heroku config:set MONGODB_URI="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shopping-mall-demo"
heroku config:set JWT_SECRET="your-random-secret-key-here"
heroku config:set CLIENT_URL="https://your-app.vercel.app"

# 4. Git 배포
git init
git add .
git commit -m "Deploy backend"
git push heroku main

# 5. 확인
heroku open
```

**백엔드 URL 저장**: `https://kosinsa-api.herokuapp.com`

---

## 3️⃣ 프론트엔드 Vercel 배포 (5분)

### Vercel 웹사이트에서 배포 (가장 쉬움)

1. https://vercel.com 접속 → GitHub 연동
2. **New Project** → 저장소 Import
3. **Framework Preset**: Vite
4. **Root Directory**: `client` 
5. **Environment Variables** 추가:
   ```
   VITE_API_URL=https://kosinsa-api.herokuapp.com/api
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```
6. **Deploy** 클릭

**프론트엔드 URL 저장**: `https://kosinsa.vercel.app`

### Vercel CLI 사용 (대안)

```bash
npm install -g vercel
cd client
vercel --prod
```

---

## 4️⃣ 백엔드 환경변수 업데이트

Vercel URL을 받은 후 Heroku에 업데이트:

```bash
heroku config:set CLIENT_URL="https://kosinsa.vercel.app"
```

---

## 5️⃣ 데이터 시딩 (선택사항)

```bash
# 로컬에서 시딩 후 자동 동기화
cd server
node scripts/seedProducts.js

# 또는 Heroku에서 직접 실행
heroku run node scripts/seedProducts.js
```

---

## ✅ 배포 완료 체크

- [ ] 백엔드 API 작동: `https://your-api.herokuapp.com`
- [ ] 프론트엔드 접속: `https://your-app.vercel.app`
- [ ] 로그인/회원가입 테스트
- [ ] 상품 조회 테스트
- [ ] 장바구니 기능 테스트
- [ ] 결제 테스트 (포트원 테스트 모드)

---

## 🐛 자주 발생하는 오류

### "Application Error" (Heroku)
```bash
heroku logs --tail
```
→ 환경변수 확인, MongoDB 연결 확인

### "CORS Error"
→ `CLIENT_URL` 환경변수가 정확한 Vercel URL인지 확인

### "502 Bad Gateway"
→ Heroku 앱이 실행 중인지 확인: `heroku ps`

---

## 📱 배포 후 설정

### 커스텀 도메인 (선택사항)

**Vercel**:
- Settings → Domains → Add Domain

**Heroku**:
```bash
heroku domains:add api.yourdomain.com
```

---

## 💰 비용 (모두 무료!)

- **MongoDB Atlas**: M0 (512MB) - 무료
- **Heroku**: Hobby 플랜 - 무료 (2024년 이후 유료화, Render.com 대안 추천)
- **Vercel**: Hobby 플랜 - 무료
- **GitHub**: Public Repository - 무료

---

## 🎉 완료!

이제 전 세계 어디서나 접속 가능한 쇼핑몰이 완성되었습니다!

```
프론트엔드: https://kosinsa.vercel.app
백엔드 API: https://kosinsa-api.herokuapp.com
```
