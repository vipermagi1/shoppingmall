# 🔍 Vercel 환경변수 디버깅 가이드

## 🔴 문제
- Vercel 환경변수는 설정되어 있음 ✅
- 하지만 여전히 `localhost:5000` 호출 ❌
- 브라우저 콘솔에서 `import.meta` 사용 불가 (정상)

---

## ✅ 확인 방법

### 방법 1: 빌드된 JavaScript 파일 확인 (가장 확실함)

1. 배포된 사이트 접속
2. **F12** (개발자 도구) 열기
3. **Sources** 탭 클릭
4. 왼쪽 파일 트리에서 찾기:
   - `/_next/static/chunks/` 또는
   - `/assets/` 폴더
   - `.js` 파일들 중에서 `api` 또는 `services` 포함된 파일 찾기
5. 파일 열어서 검색: `localhost:5000` 또는 `VITE_API_URL`
6. 실제 값 확인:
   - ✅ 정상: `https://kosinsa-shoppingmall-845f57e794de.herokuapp.com/api`
   - ❌ 오류: `http://localhost:5000/api` 또는 `undefined`

---

### 방법 2: Network 탭에서 실제 요청 확인

1. **Network** 탭 열기
2. 회원가입 버튼 클릭
3. 요청 URL 확인:
   - ✅ 정상: `https://kosinsa-shoppingmall-845f57e794de.herokuapp.com/api/users`
   - ❌ 오류: `http://localhost:5000/api/users`

---

### 방법 3: 코드에 디버깅 로그 추가

`client/src/services/api.js` 파일 수정:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// 디버깅용 (배포 후 제거)
console.log('API_URL:', API_URL);
console.log('VITE_API_URL env:', import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: API_URL,
  // ...
});
```

이렇게 하면 브라우저 콘솔에서 실제 값 확인 가능!

---

## 🔧 해결 방법

### 1단계: Vercel 환경변수 재확인

1. **Vercel 대시보드** 접속:
   ```
   https://vercel.com/parkis45s-projects/shoppingmall/settings
   ```

2. **Environment Variables** 섹션 확인:
   - Key: `VITE_API_URL`
   - Value: `https://kosinsa-shoppingmall-845f57e794de.herokuapp.com/api`
   - **Environment**: ✅ Production, ✅ Preview, ✅ Development 모두 체크!

3. **없으면 추가**:
   - Add New 클릭
   - Key: `VITE_API_URL`
   - Value: `https://kosinsa-shoppingmall-845f57e794de.herokuapp.com/api`
   - Environment: **모두 체크!**
   - Save 클릭

---

### 2단계: Vercel 빌드 로그 확인

1. **Deployments** 탭 클릭
2. 최신 배포 클릭
3. **Build Logs** 확인
4. 환경변수 주입 확인:
   ```
   Environment variables:
   VITE_API_URL=https://kosinsa-shoppingmall-845f57e794de.herokuapp.com/api
   ```

---

### 3단계: 재배포 (중요!)

환경변수 변경 후 **반드시 재배포**:

1. **Deployments** 탭
2. 최신 배포 → **⋮** → **Redeploy**
3. 또는 Git에 빈 커밋 푸시:
   ```bash
   git commit --allow-empty -m "Trigger Vercel redeploy"
   git push origin main
   ```

---

### 4단계: 코드에 디버깅 로그 추가

임시로 디버깅 로그를 추가하여 확인:

`client/src/services/api.js` 파일 수정
