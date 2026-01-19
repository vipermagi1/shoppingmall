# 🔄 MongoDB 로컬 → Atlas 마이그레이션 가이드

## 방법 1: 샘플 데이터 재생성 (가장 간단! 권장)

### 1. MongoDB Atlas URI로 변경

`server/.env` 파일 수정:

```env
# 이전 (로컬)
MONGODB_URI=mongodb://localhost:27017/shopping-mall-demo

# 변경 후 (Atlas)
MONGODB_URI=mongodb+srv://parkis45_db_user:실제비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo?retryWrites=true&w=majority
```

### 2. 서버 재시작 및 데이터 시딩

```bash
cd server

# 서버 실행 (연결 확인)
npm run dev

# 다른 터미널에서 샘플 데이터 추가
npm run seed
```

**완료!** 이제 MongoDB Atlas에 24개의 상품이 저장됩니다.

---

## 방법 2: MongoDB Compass 사용 (GUI, 쉬움)

### 1. MongoDB Compass 설치

https://www.mongodb.com/try/download/compass

### 2. 로컬 DB 연결

- Connection String: `mongodb://localhost:27017`
- Connect 클릭

### 3. Atlas DB 연결 (새 창)

- New Connection
- Connection String: `mongodb+srv://parkis45_db_user:비밀번호@cluster0.hmehkc4.mongodb.net/`
- Connect 클릭

### 4. 데이터 복사

1. **로컬 DB**에서 `shopping-mall-demo` 데이터베이스 선택
2. 각 컬렉션(products, users, orders 등) 클릭
3. **Export Collection** → JSON 저장
4. **Atlas DB**로 전환
5. `shopping-mall-demo` 데이터베이스 생성
6. **Import Data** → JSON 파일 선택

---

## 방법 3: MongoDB Tools 사용 (명령줄)

### 1. MongoDB Database Tools 설치

https://www.mongodb.com/try/download/database-tools

### 2. 로컬 데이터 백업

```bash
# 로컬 데이터베이스 백업
mongodump --db=shopping-mall-demo --out=./backup

# 결과: ./backup/shopping-mall-demo/ 폴더에 데이터 저장
```

### 3. Atlas로 복원

```bash
# MongoDB Atlas로 복원
mongorestore --uri="mongodb+srv://parkis45_db_user:비밀번호@cluster0.hmehkc4.mongodb.net/shopping-mall-demo" ./backup/shopping-mall-demo
```

**완료!** 모든 데이터가 Atlas로 이동됩니다.

---

## 방법 4: Node.js 스크립트 (프로그래밍 방식)

### 마이그레이션 스크립트 생성

`server/scripts/migrateToAtlas.js`:

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017/shopping-mall-demo';
const ATLAS_URI = process.env.MONGODB_URI;

const migrate = async () => {
  try {
    // 로컬 DB 연결
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('로컬 DB 연결 완료');

    // Atlas DB 연결
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('Atlas DB 연결 완료');

    // 컬렉션 이름들
    const collections = ['products', 'users', 'orders', 'carts'];

    for (const collectionName of collections) {
      try {
        const localCollection = localConn.collection(collectionName);
        const atlasCollection = atlasConn.collection(collectionName);

        // 로컬 데이터 가져오기
        const documents = await localCollection.find({}).toArray();
        
        if (documents.length > 0) {
          // Atlas에 데이터 삽입
          await atlasCollection.insertMany(documents);
          console.log(`✓ ${collectionName}: ${documents.length}개 문서 복사 완료`);
        } else {
          console.log(`- ${collectionName}: 데이터 없음`);
        }
      } catch (err) {
        console.log(`- ${collectionName}: 컬렉션이 존재하지 않거나 오류 (${err.message})`);
      }
    }

    console.log('\n마이그레이션 완료!');
    process.exit(0);
  } catch (error) {
    console.error('마이그레이션 오류:', error);
    process.exit(1);
  }
};

migrate();
```

### 실행

```bash
cd server
node scripts/migrateToAtlas.js
```

---

## ✅ 추천 방법

### 새 프로젝트이거나 샘플 데이터만 있는 경우
→ **방법 1** (샘플 데이터 재생성) - 1분

### 중요한 사용자 데이터가 있는 경우
→ **방법 2** (MongoDB Compass) - 5분, GUI로 쉬움
→ **방법 3** (MongoDB Tools) - 3분, 명령줄

---

## 🔍 마이그레이션 확인

### Atlas에 데이터가 잘 들어갔는지 확인

1. **MongoDB Atlas 대시보드**
2. **Database** → **Browse Collections**
3. `shopping-mall-demo` 데이터베이스 확인
4. 각 컬렉션의 문서 개수 확인

### 서버에서 확인

```bash
cd server
npm run dev
```

로그 확인:
```
MongoDB Connected: cluster0.hmehkc4.mongodb.net  ← Atlas 주소
```

---

## ⚡ 빠른 시작 (권장)

```bash
# 1. .env 파일에서 MONGODB_URI를 Atlas URI로 변경
# server/.env 파일 편집

# 2. 서버 재시작
cd server
npm run dev

# 3. 샘플 데이터 추가 (다른 터미널)
npm run seed

# 완료!
```

어떤 방법을 사용하시겠습니까? 🚀
