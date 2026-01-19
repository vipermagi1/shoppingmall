# 🎯 Render.com 배포 - 단계별 가이드 (5분)

Heroku 오류가 계속 발생하므로 **Render.com**으로 전환하세요!
- ✅ 완전 무료
- ✅ 설정 초간단
- ✅ 오류 거의 없음

---

## 📝 Step 1: Render.com 가입 (1분)

1. **https://render.com** 접속
2. **Get Started** 클릭
3. **Sign in with GitHub** 클릭
4. GitHub 계정 인증

✅ 가입 완료!

---

## 🔗 Step 2: 저장소 연결 (1분)

1. Render 대시보드에서 **New** 버튼 클릭
2. **Web Service** 선택
3. **Connect a repository** 섹션에서:
   - **Configure account** 클릭 (처음이라면)
   - GitHub에서 `vipermagi1/shoppingmall` 저장소 선택
   - **Install** 클릭
4. 저장소 목록에서 **Connect** 클릭

✅ 저장소 연결 완료!

---

## ⚙️ Step 3: 서비스 설정 (2분)

### 기본 설정

| 필드 | 입력 값 |
|------|---------|
| **Name** | `kosinsa-api` |
| **Region** | `Singapore (Southeast Asia)` |
| **Branch** | `main` |
| **Root Directory** | `server` ⭐ |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |

### 인스턴스 타입
- **Free** 선택 ✅

---

## 🔐 Step 4: 환경변수 설정 (1분)

**Environment** 섹션에서 **Add Environment Variable** 클릭:

### 필수 환경변수

```
Name: MONGODB_URI
Value: mongodb+srv://parkis45_db_user:실제비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority
```

```
Name: JWT_SECRET
Value: super-secret-random-key-12345678
```

```
Name: CLIENT_URL
Value: https://kosinsa.vercel.app
```

```
Name: NODE_ENV
Value: production
```

```
Name: PORT
Value: 5000
```

**Add** 클릭하여 각 변수 추가!

---

## 🚀 Step 5: 배포 시작!

**Create Web Service** 버튼 클릭!

배포 시작... 진행 상황은 로그에서 실시간으로 확인 가능합니다.

### 배포 로그 예시:
```
==> Cloning from https://github.com/vipermagi1/shoppingmall...
==> Checking out commit bbfbdef in branch main
==> Running build command 'npm install'...
    added 142 packages
==> Build successful 🎉
==> Deploying...
==> Starting service with 'npm start'
    MongoDB Connected: cluster0.hmehkc4.mongodb.net
    Server is running on port 5000
==> Your service is live 🎉
```

**예상 시간**: 3-5분

---

## ✅ Step 6: 배포 확인

### 서비스 URL 확인

배포 완료 후 상단에 URL이 표시됩니다:

```
https://kosinsa-api.onrender.com
```

### API 테스트

브라우저에서 접속:
```
https://kosinsa-api.onrender.com
```

**응답**:
```json
{
  "message": "Shopping Mall Demo API Server",
  "status": "running",
  "version": "1.0.0"
}
```

### 상품 API 테스트

```
https://kosinsa-api.onrender.com/api/products
```

---

## 🎨 Step 7: 샘플 데이터 추가 (선택사항)

### Shell 탭에서

1. **Shell** 탭 클릭
2. 명령어 입력:
   ```bash
   npm run seed
   ```
3. Enter!

**결과**:
```
MongoDB Connected: cluster0.hmehkc4.mongodb.net
24개의 상품이 등록되었습니다.
```

---

## 🔗 Step 8: Heroku 앱 삭제 (선택사항)

더 이상 Heroku를 사용하지 않는다면:

1. https://dashboard.heroku.com 접속
2. `kosinsa-shoppingmall-845f57e794de` 앱 선택
3. **Settings** → 맨 아래 **Delete app**
4. 앱 이름 입력 후 삭제

---

## 📋 체크리스트

- [ ] Render.com 가입 (GitHub 연동)
- [ ] Web Service 생성
- [ ] Root Directory를 `server`로 설정
- [ ] 환경변수 5개 추가 (MONGODB_URI, JWT_SECRET 등)
- [ ] 배포 시작
- [ ] 로그에서 "Your service is live" 확인
- [ ] API URL 접속 테스트
- [ ] 샘플 데이터 추가

---

## 🎉 완료!

**백엔드 URL**: `https://kosinsa-api.onrender.com`

이 URL을 Vercel 프론트엔드 배포 시 사용하세요!

---

## 🔄 자동 배포

Render는 **자동 배포**가 기본 활성화되어 있습니다:
- GitHub에 푸시하면 → 자동으로 재배포
- 설정: **Settings** → **Auto-Deploy** 

---

## 💡 Render.com 장점 요약

1. ✅ **완전 무료** (Heroku는 월 $7)
2. ✅ **설정 5분** (Heroku는 복잡)
3. ✅ **오류 거의 없음** (Monorepo 네이티브 지원)
4. ✅ **자동 HTTPS** 
5. ✅ **빠른 Cold Start** (10초 vs Heroku 30초)
6. ✅ **750시간/월 무료**

---

## 🚀 시작하세요!

https://render.com → **Get Started** 

5분 후면 백엔드가 배포됩니다! 🎉
