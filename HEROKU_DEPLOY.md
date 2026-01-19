# 🚀 Heroku 백엔드 배포 가이드

## 📥 1단계: Heroku CLI 설치

### 방법 1: 수동 다운로드 (권장)

1. https://devcenter.heroku.com/articles/heroku-cli 접속
2. **Windows 64-bit Installer** 다운로드
3. 설치 파일 실행
4. 설치 완료 후 **새 PowerShell 창** 열기
5. 확인: `heroku --version`

### 방법 2: 명령어 설치

관리자 권한 PowerShell에서:
```bash
# Chocolatey 사용
choco install heroku-cli

# 또는 Scoop 사용
scoop install heroku-cli
```

---

## 🔐 2단계: Heroku 로그인

```bash
heroku login
```

브라우저가 열리면 로그인하세요.

---

## 📦 3단계: Heroku 앱 생성

```bash
heroku create kosinsa-api
```

또는 원하는 이름으로:
```bash
heroku create your-custom-name
```

**결과**: 
```
Creating app... done, ⬢ kosinsa-api
https://kosinsa-api.herokuapp.com/ | https://git.heroku.com/kosinsa-api.git
```

앱 URL을 저장해두세요: `https://kosinsa-api.herokuapp.com`

---

## ⚙️ 4단계: 환경변수 설정

```bash
# MongoDB Atlas 연결 (비밀번호 교체 필수!)
heroku config:set MONGODB_URI="mongodb+srv://parkis45_db_user:실제비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority"

# JWT Secret (랜덤 문자열)
heroku config:set JWT_SECRET="super-secret-random-key-change-this-12345"

# Client URL (Vercel 배포 후 업데이트)
heroku config:set CLIENT_URL="https://kosinsa.vercel.app"

# Node 환경
heroku config:set NODE_ENV="production"

# 환경변수 확인
heroku config
```

---

## 🚀 5단계: 배포

### server 폴더만 배포

```bash
# 루트 디렉토리에서 실행
git subtree push --prefix server heroku main
```

**또는** Heroku Git 원격 저장소 추가 후:

```bash
heroku git:remote -a kosinsa-api
git subtree push --prefix server heroku main
```

배포 진행 중... (2-5분 소요)

---

## ✅ 6단계: 배포 확인

### 로그 확인

```bash
heroku logs --tail
```

**정상 출력 예시**:
```
MongoDB Connected: cluster0.hmehkc4.mongodb.net
Server is running on port 5000
```

### 앱 열기

```bash
heroku open
```

또는 브라우저에서: `https://kosinsa-api.herokuapp.com`

**응답 예시**:
```json
{
  "message": "Shopping Mall Demo API Server",
  "status": "running",
  "version": "1.0.0"
}
```

---

## 🧪 7단계: API 테스트

### 상품 조회 테스트

브라우저 또는 Postman에서:
```
https://kosinsa-api.herokuapp.com/api/products
```

### 샘플 데이터 추가 (Atlas가 비어있다면)

```bash
# Heroku에서 seed 스크립트 실행
heroku run npm run seed
```

---

## 🐛 문제 해결

### "Application Error"

```bash
# 로그 확인
heroku logs --tail

# 앱 재시작
heroku restart
```

### "MongoDB connection error"

- `MONGODB_URI` 환경변수 확인: `heroku config`
- 비밀번호에 특수문자가 있으면 URL 인코딩 필요
- MongoDB Atlas에서 IP 화이트리스트 확인 (`0.0.0.0/0`)

### "Build failed"

```bash
# 빌드 로그 확인
heroku logs --tail

# package.json 확인
# Procfile 확인
```

---

## 🔧 유용한 Heroku 명령어

```bash
# 앱 목록
heroku apps

# 환경변수 보기
heroku config

# 환경변수 설정
heroku config:set KEY=VALUE

# 환경변수 삭제
heroku config:unset KEY

# 로그 보기
heroku logs --tail

# 앱 재시작
heroku restart

# 앱 상태
heroku ps

# 앱 열기
heroku open

# 앱 삭제
heroku apps:destroy kosinsa-api
```

---

## 📋 체크리스트

- [ ] Heroku CLI 설치
- [ ] Heroku 로그인
- [ ] 앱 생성
- [ ] 환경변수 설정 (MONGODB_URI, JWT_SECRET, CLIENT_URL)
- [ ] Git subtree로 배포
- [ ] 로그 확인
- [ ] API 테스트
- [ ] 샘플 데이터 추가 (필요 시)

---

## 🎯 다음 단계

Heroku 배포 완료 후:
1. ✅ 백엔드 URL 확인: `https://kosinsa-api.herokuapp.com`
2. 🎨 Vercel 프론트엔드 배포
3. 🔗 Vercel에 백엔드 URL 연결
4. 🧪 전체 테스트

---

**참고**: Heroku는 2022년 11월부터 무료 플랜이 종료되었습니다. 
대안으로 **Render.com** (무료) 또는 **Railway.app** (무료 크레딧)을 사용할 수 있습니다.

Render.com 사용을 원하시면 알려주세요! 더 쉽고 무료입니다. 🆓
