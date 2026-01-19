# 🔧 Heroku "Blank App" 오류 해결

## 문제 원인

Heroku가 프로젝트 루트를 배포하려고 하는데, 실제 서버 코드는 `server/` 폴더 안에 있어서 빌드가 실패합니다.

---

## ✅ 해결 방법 1: Heroku 웹사이트에서 수정 (가장 쉬움)

### 1. Heroku 대시보드 접속
https://dashboard.heroku.com/apps/kosinsa-shoppingmall-845f57e794de

### 2. Settings 탭 클릭

### 3. Buildpacks 섹션 찾기
- **Add buildpack** 클릭
- `https://github.com/timanovsky/subdir-heroku-buildpack` 추가
- **Save changes**

### 4. Config Vars 추가
- **Reveal Config Vars** 클릭
- 새 변수 추가:
  - KEY: `PROJECT_PATH`
  - VALUE: `server`
- **Add** 클릭

### 5. 재배포
- **Deploy** 탭 클릭
- **Manual deploy** 섹션
- **Deploy Branch** 클릭 (main 브랜치)

---

## ✅ 해결 방법 2: Git Subtree 사용 (CLI)

Heroku CLI가 설치되어 있다면:

```bash
# 1. Heroku 원격 저장소 추가
heroku git:remote -a kosinsa-shoppingmall-845f57e794de

# 2. server 폴더만 배포
git subtree push --prefix server heroku main

# 또는 강제 푸시
git push heroku `git subtree split --prefix server main`:main --force
```

---

## ✅ 해결 방법 3: 새 앱으로 다시 시작 (권장)

### 현재 앱 삭제 후 새로 생성

Heroku 대시보드에서:
1. **Settings** 탭
2. 맨 아래 **Delete app** → 앱 이름 입력 → 삭제

### CLI로 새 앱 배포

```bash
# 1. 새 앱 생성
heroku create kosinsa-api

# 2. 환경변수 설정
heroku config:set MONGODB_URI="mongodb+srv://parkis45_db_user:비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority"

heroku config:set JWT_SECRET="super-secret-key-12345"

heroku config:set CLIENT_URL="https://kosinsa.vercel.app"

# 3. server 폴더만 배포
git subtree push --prefix server heroku main
```

---

## ✅ 해결 방법 4: Render.com 사용 (가장 쉬움! 무료!)

Heroku 대신 Render.com을 사용하면 이런 문제가 없습니다.

### Render.com 배포 (5분)

1. **https://render.com** 접속 → GitHub 연동
2. **New** → **Web Service**
3. GitHub 저장소 선택: `vipermagi1/shoppingmall`
4. 설정:
   - **Name**: `kosinsa-api`
   - **Root Directory**: `server`  ← 이게 핵심!
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`
5. **Environment Variables** 추가:
   ```
   MONGODB_URI = mongodb+srv://parkis45_db_user:비밀번호@cluster0...
   JWT_SECRET = super-secret-key-12345
   CLIENT_URL = https://kosinsa.vercel.app
   NODE_ENV = production
   ```
6. **Create Web Service** 클릭

**완료!** 5분 안에 배포됩니다.

---

## 🎯 권장 방법

| 방법 | 난이도 | 비용 | 시간 |
|------|--------|------|------|
| Render.com | ⭐ 쉬움 | 🆓 무료 | 5분 |
| Heroku (방법 1) | ⭐⭐ 보통 | 💰 유료 | 10분 |
| Heroku (방법 2-3) | ⭐⭐⭐ 어려움 | 💰 유료 | 15분 |

**추천**: 🌟 **Render.com** - 무료이고 설정이 훨씬 쉽습니다!

---

## 🚀 Render.com 사용하시겠습니까?

Render.com 사용 시 제공할 내용:
- ✅ 단계별 스크린샷 가이드
- ✅ 환경변수 설정 가이드
- ✅ 자동 배포 설정
- ✅ 무료!

어떤 방법을 선택하시겠습니까? 🤔
