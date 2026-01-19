# 🔧 Heroku H10 App Crashed 긴급 해결

## ⚡ 빠른 해결 체크리스트

### 1️⃣ Heroku 대시보드 접속
https://dashboard.heroku.com/apps/kosinsa-shoppingmall-845f57e794de

---

## ✅ 필수 확인 사항

### 📋 Step 1: Settings → Config Vars 확인

**Reveal Config Vars** 클릭 후 다음 변수들이 **모두** 있는지 확인:

```
✅ MONGODB_URI = mongodb+srv://parkis45_db_user:비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority

✅ JWT_SECRET = (아무 랜덤 문자열)

✅ CLIENT_URL = https://kosinsa.vercel.app 또는 http://localhost:3000

✅ NODE_ENV = production

❌ PORT는 설정하지 마세요 (Heroku가 자동 설정)
```

**없으면 추가하세요!**

---

### 🔨 Step 2: Settings → Buildpacks 확인

**Buildpacks** 섹션에서 다음 **순서대로** 있어야 합니다:

1. `https://github.com/timanovsky/subdir-heroku-buildpack`
2. `heroku/nodejs`

**없으면**:
1. **Add buildpack** 클릭
2. URL 입력: `https://github.com/timanovsky/subdir-heroku-buildpack`
3. **Save changes**
4. **Add buildpack** 다시 클릭
5. `heroku/nodejs` 선택
6. **Save changes**

**순서가 중요합니다!** 위 순서대로 있어야 합니다.

---

### 📁 Step 3: Config Vars에 PROJECT_PATH 추가

**Config Vars** 섹션에서:

```
KEY: PROJECT_PATH
VALUE: server
```

**Add** 클릭!

이게 Heroku에게 `server` 폴더를 사용하라고 알려줍니다.

---

### 🚀 Step 4: 수동 재배포

**Deploy** 탭으로 이동:

1. **Deployment method**: GitHub 선택되어 있는지 확인
2. **Manual deploy** 섹션
3. Branch: `main` 선택
4. **Deploy Branch** 클릭

배포 진행 중... 로그를 확인하세요.

---

### 📊 Step 5: 빌드 로그 확인

**Activity** 탭:
1. 최신 빌드 클릭
2. **View build log** 클릭
3. 오류 메시지 확인

**예상되는 오류들**:

#### "JWT_SECRET 환경변수가 설정되지 않았습니다"
→ Config Vars에 `JWT_SECRET` 추가

#### "MongoDB connection error"
→ Config Vars의 `MONGODB_URI` 확인 (비밀번호 정확한지)

#### "Cannot find module"
→ Buildpacks 순서 확인

---

## 🔧 완전한 설정 예시

### Config Vars (Settings 탭)
```
PROJECT_PATH = server
MONGODB_URI = mongodb+srv://parkis45_db_user:실제비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority
JWT_SECRET = kosinsa-secret-key-2026-production
CLIENT_URL = https://kosinsa.vercel.app
NODE_ENV = production
```

### Buildpacks (Settings 탭)
```
1. https://github.com/timanovsky/subdir-heroku-buildpack
2. heroku/nodejs
```

---

## 📝 재배포 후 확인

### More 메뉴 → View logs

정상 로그:
```
Starting process with command `npm start`
> node server.js
MongoDB Connected: cluster0.hmehkc4.mongodb.net
Server is running on port 12345
State changed from starting to up
```

### 앱 접속
```
https://kosinsa-shoppingmall-845f57e794de.herokuapp.com
```

응답:
```json
{
  "message": "Shopping Mall Demo API Server",
  "status": "running"
}
```

---

## ⚠️ 여전히 안 된다면?

### 즉시 확인할 것:

1. **Buildpacks 순서**: subdir-buildpack이 **첫 번째**여야 함
2. **PROJECT_PATH**: 정확히 `server` (소문자, 공백 없음)
3. **MONGODB_URI**: 비밀번호에 특수문자 있으면 URL 인코딩
4. **JWT_SECRET**: 빈 값이 아닌지 확인

### 스크린샷 공유

문제가 계속되면 다음 스크린샷 공유:
1. Settings → Config Vars
2. Settings → Buildpacks
3. Activity → Build log

---

## 🎯 핵심 포인트

Heroku가 **server 폴더**를 찾도록:
1. ✅ `PROJECT_PATH = server` (Config Vars)
2. ✅ `subdir-heroku-buildpack` (Buildpacks 첫 번째)
3. ✅ 재배포

이 3가지만 확인하세요! 🚀
