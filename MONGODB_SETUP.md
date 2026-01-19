# 📝 MongoDB 연결 설정 가이드

## ⚠️ 중요: 비밀번호 교체 필요!

현재 연결 문자열:
```
mongodb+srv://parkis45_db_user:<db_password>@cluster0.hmehkc4.mongodb.net/
```

**`<db_password>`를 실제 비밀번호로 바꿔야 합니다!**

---

## 🔧 로컬 개발 환경 설정

### 1. `server/.env` 파일 수정

파일이 생성되었으므로 다음을 수정하세요:

```env
MONGODB_URI=mongodb+srv://parkis45_db_user:실제비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority
```

**중요**: 
- `<db_password>` → MongoDB Atlas에서 생성한 실제 비밀번호로 교체
- 비밀번호에 특수문자가 있으면 URL 인코딩 필요
  - 예: `@` → `%40`, `#` → `%23`, `/` → `%2F`

### 2. 서버 재시작

```bash
cd server
npm run dev
```

서버가 정상적으로 시작되면:
```
MongoDB Connected: cluster0.hmehkc4.mongodb.net
Server is running on port 5000
```

---

## 🚀 Heroku 배포 시 설정

### 환경변수 설정

```bash
heroku config:set MONGODB_URI="mongodb+srv://parkis45_db_user:실제비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority"
```

---

## 🔍 비밀번호 확인 방법

MongoDB Atlas에서 비밀번호를 잊어버렸다면:

1. **MongoDB Atlas 대시보드** 접속
2. **Database Access** 메뉴
3. 사용자(`parkis45_db_user`) 찾기
4. **Edit** 클릭
5. **Edit Password** → 새 비밀번호 설정
6. **Update User**

---

## ✅ 연결 테스트

### 1. 서버 실행 후 확인

```bash
cd server
npm run dev
```

정상 연결 시 출력:
```
MongoDB Connected: cluster0.hmehkc4.mongodb.net
```

### 2. 샘플 데이터 추가

```bash
npm run seed
```

출력:
```
MongoDB Connected: cluster0.hmehkc4.mongodb.net
기존 상품 데이터 삭제 완료
24개의 상품이 등록되었습니다.
```

---

## 🐛 문제 해결

### "MongoServerError: bad auth"
→ 비밀번호가 틀렸습니다. MongoDB Atlas에서 비밀번호 재설정

### "MongoNetworkError: connection timeout"
→ Network Access에서 IP 주소 허용 확인 (`0.0.0.0/0`)

### 특수문자 문제
비밀번호에 특수문자가 있다면 URL 인코딩:
- `password@123` → `password%40123`
- `pass#word` → `pass%23word`

또는 특수문자 없는 비밀번호로 재설정

---

## 📋 체크리스트

- [ ] `<db_password>`를 실제 비밀번호로 교체
- [ ] `/shopping-mall-demo` 데이터베이스 이름 확인
- [ ] `?retryWrites=true&w=majority` 옵션 포함
- [ ] 서버 재시작
- [ ] 연결 확인 (로그 확인)
- [ ] 샘플 데이터 추가 (`npm run seed`)

---

**다음 단계**: 서버가 정상 작동하면 Heroku와 Vercel 배포를 진행하세요!
