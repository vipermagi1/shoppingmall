# 🔧 Vercel 배포 실패 최종 해결 방법

## 🔴 문제
```
Build Failed
Command "cd client && npm install && npm run build" exited with 1
```

Vercel이 계속 `cd client` 명령어를 사용하고 있습니다.

---

## ✅ 해결 방법 (2단계)

### 방법 1: Vercel 대시보드에서 Root Directory 설정 (가장 확실함) ⭐

Vercel 대시보드 설정이 `vercel.json`보다 우선순위가 높을 수 있습니다.

#### 1단계: Vercel 대시보드 접속

```
https://vercel.com/parkis45s-projects/shoppingmall/settings
```

#### 2단계: General 섹션 - Root Directory 설정

1. **Settings** 탭 클릭
2. **General** 섹션으로 스크롤
3. **Root Directory** 찾기
4. **Edit** 버튼 클릭
5. `client` 입력
6. **Save** 클릭

**이게 핵심입니다!** Root Directory를 `client`로 설정하면:
- Vercel이 자동으로 `client` 폴더로 이동
- 모든 명령어가 `client` 폴더 안에서 실행됨
- `cd client` 명령어 불필요!

#### 3단계: Build & Development Settings 확인

**Settings** 페이지에서 아래로 스크롤:

**Build Command**:
- **Override** 토글 확인
- 값: `npm run build` (cd client 없이!)
- 없으면 추가

**Output Directory**:
- **Override** 토글 확인
- 값: `dist`
- 없으면 추가

**Install Command**:
- **Override** 토글 확인
- 값: `npm install`
- 없으면 추가

**Save** 클릭!

---

### 방법 2: vercel.json 파일 수정 (이미 완료)

`vercel.json` 파일을 수정했습니다:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite"
}
```

**주의**: Root Directory는 `vercel.json`에서 설정할 수 없습니다. 
반드시 Vercel 대시보드에서 설정해야 합니다!

---

## 🚀 재배포

### 1. Git 푸시 (vercel.json 변경사항)

```bash
git add vercel.json
git commit -m "Fix Vercel build config - remove cd client"
git push origin main
```

### 2. Vercel 대시보드에서 재배포

1. **Deployments** 탭 클릭
2. 최신 배포 찾기
3. 오른쪽 **⋮** (점 3개) 클릭
4. **Redeploy** 선택
5. **Redeploy** 확인

---

## ✅ 확인 방법

### 빌드 로그 확인

**Deployments** → 최신 배포 → **Build Logs** 확인

**정상 출력**:
```
Running "npm run build"
Installing dependencies...
added 184 packages
Building...
✓ built in 10s
```

**오류 출력 예시**:
- `cd client` 명령어가 보이면 → Root Directory 설정 안 됨
- `npm: command not found` → Node.js 버전 문제
- `Cannot find module` → 의존성 문제

---

## 🔍 추가 문제 해결

### 문제 1: 여전히 "cd client" 명령어 사용

**원인**: Vercel 대시보드 설정이 `vercel.json`을 덮어쓰고 있음

**해결**:
1. Vercel 대시보드 → Settings → General
2. **Root Directory**: `client` 확인
3. Settings → Build & Development Settings
4. **Build Command Override** OFF → ON → `npm run build` 입력
5. **Save** → 재배포

---

### 문제 2: 빌드는 성공하지만 다른 오류

빌드 로그의 정확한 오류 메시지를 확인하세요:

#### "npm: command not found"
→ Node.js 버전 문제, Vercel이 자동 감지해야 함

#### "Cannot find module 'xxx'"
→ `client/package.json` 확인
→ 의존성 누락 가능성

#### "Build failed" (구체적 오류 없음)
→ 빌드 로그 전체 확인 필요
→ Vercel 대시보드에서 상세 로그 확인

---

## 📋 최종 체크리스트

- [ ] Vercel 대시보드 → Settings → General → Root Directory: `client`
- [ ] Settings → Build & Development → Build Command: `npm run build`
- [ ] Settings → Build & Development → Output Directory: `dist`
- [ ] `vercel.json` 파일이 루트에 있는지 확인
- [ ] Git에 커밋하고 푸시
- [ ] Vercel 재배포
- [ ] 빌드 로그 확인
- [ ] 배포 성공 확인

---

## 🎯 핵심 포인트

**문제**: Vercel이 `cd client` 명령어 사용
**원인**: Root Directory가 설정되지 않음
**해결**: 
1. Vercel 대시보드 → Root Directory: `client` 설정
2. Build Command: `npm run build` (cd 없이)
3. 재배포

**가장 중요한 것**: Root Directory를 `client`로 설정하는 것!

---

## 💡 왜 이 방법이 작동하는가?

Vercel의 Root Directory 기능:
- Root Directory를 `client`로 설정하면
- Vercel이 자동으로 `client` 폴더로 이동
- 모든 명령어(`npm install`, `npm run build`)가 `client` 폴더 안에서 실행됨
- 따라서 `cd client` 명령어가 필요 없음!

지금 바로 Vercel 대시보드에서 Root Directory를 설정하세요! 🚀
