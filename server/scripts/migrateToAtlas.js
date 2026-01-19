const mongoose = require('mongoose');
require('dotenv').config();

const LOCAL_URI = 'mongodb://localhost:27017/shopping-mall-demo';
const ATLAS_URI = process.env.MONGODB_URI;

const migrate = async () => {
  try {
    console.log('🔄 MongoDB 마이그레이션 시작...\n');

    // Atlas URI 확인
    if (!ATLAS_URI || ATLAS_URI.includes('localhost')) {
      console.error('❌ 오류: .env 파일에 MongoDB Atlas URI를 설정해주세요.');
      console.error('현재 MONGODB_URI:', ATLAS_URI);
      process.exit(1);
    }

    // 로컬 DB 연결
    console.log('📦 로컬 DB 연결 중...');
    const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
    console.log('✓ 로컬 DB 연결 완료\n');

    // Atlas DB 연결
    console.log('☁️  Atlas DB 연결 중...');
    const atlasConn = await mongoose.createConnection(ATLAS_URI).asPromise();
    console.log('✓ Atlas DB 연결 완료\n');

    // 컬렉션 목록
    const collections = await localConn.db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    console.log(`발견된 컬렉션: ${collectionNames.join(', ')}\n`);

    let totalDocuments = 0;

    // 각 컬렉션 마이그레이션
    for (const collectionName of collectionNames) {
      try {
        const localCollection = localConn.collection(collectionName);
        const atlasCollection = atlasConn.collection(collectionName);

        // 로컬 데이터 가져오기
        const documents = await localCollection.find({}).toArray();
        
        if (documents.length > 0) {
          // Atlas 컬렉션 초기화 (선택사항)
          // await atlasCollection.deleteMany({});
          
          // Atlas에 데이터 삽입
          await atlasCollection.insertMany(documents);
          console.log(`✓ ${collectionName}: ${documents.length}개 문서 복사 완료`);
          totalDocuments += documents.length;
        } else {
          console.log(`- ${collectionName}: 데이터 없음 (건너뜀)`);
        }
      } catch (err) {
        if (err.code === 11000) {
          console.log(`⚠ ${collectionName}: 일부 중복 데이터 건너뜀`);
        } else {
          console.log(`⚠ ${collectionName}: 오류 - ${err.message}`);
        }
      }
    }

    console.log(`\n🎉 마이그레이션 완료!`);
    console.log(`총 ${totalDocuments}개 문서가 복사되었습니다.`);

    // 연결 종료
    await localConn.close();
    await atlasConn.close();

    process.exit(0);
  } catch (error) {
    console.error('❌ 마이그레이션 오류:', error.message);
    process.exit(1);
  }
};

migrate();
