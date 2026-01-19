# 🚀 Render.com 백엔드 배포 (Heroku 대안, 무료!)

## 왜 Render.com인가?

- ✅ **완전 무료** (Heroku는 유료)
- ✅ **설정 초간단** (웹 브라우저만 사용)
- ✅ **자동 배포** (GitHub 푸시 시 자동 재배포)
- ✅ **HTTPS 기본 제공**
- ✅ **Monorepo 지원** (server 폴더 쉽게 설정)

---

## 🚀 배포 단계 (5분)

### 1️⃣ Render.com 계정 생성

1. https://render.com 접속
2. **Get Started for Free** 클릭
3. **GitHub** 계정으로 로그인

### 2️⃣ 새 Web Service 생성

1. **Dashboard** → **New** → **Web Service** 클릭
2. **Connect a repository**
   - GitHub 저장소 검색: `vipermagi1/shoppingmall`
   - **Connect** 클릭

### 3️⃣ 서비스 설정

다음과 같이 입력:

| 항목 | 값 |
|------|-----|
| **Name** | `kosinsa-api` |
| **Region** | `Singapore (Southeast Asia)` |
| **Root Directory** | `server` ⭐ 중요! |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` |

### 4️⃣ 환경변수 설정

**Environment Variables** 섹션에서 **Add Environment Variable** 클릭:

```
MONGODB_URI = mongodb+srv://parkis45_db_user:비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority

JWT_SECRET = super-secret-random-key-12345

CLIENT_URL = https://kosinsa.vercel.app

NODE_ENV = production

PORT = 5000
```

### 5️⃣ 배포 시작

**Create Web Service** 버튼 클릭!

배포 진행 중... (3-5분 소요)

---

## ✅ 배포 확인

### 배포 완료 확인

**Logs** 탭에서 다음 메시지 확인:

```
MongoDB Connected: cluster0.hmehkc4.mongodb.net
Server is running on port 5000
==> Your service is live 🎉
```

### 서비스 URL

`https://kosinsa-api.onrender.com`

브라우저에서 접속해보세요:
```json
{
  "message": "Shopping Mall Demo API Server",
  "status": "running",
  "version": "1.0.0"
}
```

---

## 🧪 API 테스트

### 상품 조회
```
https://kosinsa-api.onrender.com/api/products
```

### 샘플 데이터 추가 (선택사항)

**Shell** 탭에서:
```bash
npm run seed
```

---

## 🔄 자동 배포 설정

**Settings** 탭에서:
- ✅ **Auto-Deploy**: 활성화됨 (기본값)

이제 GitHub에 푸시할 때마다 자동으로 재배포됩니다!

---

## ⚡ Heroku 문제 해결 vs Render.com으로 전환

### Heroku 계속 사용 시

**대시보드에서 설정**:
1. https://dashboard.heroku.com/apps/kosinsa-shoppingmall-845f57e794de/settings
2. **Buildpacks** 추가:
   - `https://github.com/timanovsky/subdir-heroku-buildpack`
3. **Config Vars** 추가:
   - `PROJECT_PATH = server`
4. **Deploy** 탭에서 재배포

### Render.com으로 전환 (권장! 🌟)

- 더 쉬움
- 무료
- 더 빠름
- 설정 간단

---

## 📊 비교

| 기능 | Heroku | Render.com |
|------|--------|------------|
| 무료 플랜 | ❌ 없음 | ✅ 있음 (750시간/월) |
| 설정 난이도 | ⭐⭐⭐ | ⭐ |
| Monorepo 지원 | ⭐⭐ | ⭐⭐⭐ |
| 자동 배포 | ✅ | ✅ |
| HTTPS | ✅ | ✅ |
| Cold Start | ~30초 | ~10초 |

---

## 🎯 권장 사항

**Render.com으로 전환하세요!**

1. ✅ 무료
2. ✅ 설정 5분
3. ✅ Monorepo 네이티브 지원
4. ✅ 자동 배포
5. ✅ 더 빠른 응답 시간

Render.com으로 진행하시겠습니까? 단계별로 도와드리겠습니다! 🚀
