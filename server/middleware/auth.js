const jwt = require('jsonwebtoken');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

// JWT 토큰 검증 미들웨어
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 토큰 추출
      token = req.headers.authorization.split(' ')[1];

      // 토큰이 블랙리스트에 있는지 확인
      const blacklistedToken = await BlacklistedToken.findOne({ token: token });
      if (blacklistedToken) {
        return res.status(401).json({
          success: false,
          message: '이미 로그아웃된 토큰입니다'
        });
      }

      // 토큰 검증
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({
          success: false,
          message: '서버 설정 오류: JWT_SECRET 환경변수가 설정되지 않았습니다'
        });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 사용자 정보 가져오기 (비밀번호 제외)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: '인증된 사용자를 찾을 수 없습니다'
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: '인증에 실패했습니다. 토큰이 유효하지 않습니다'
      });
    }
  } else {
    return res.status(401).json({
      success: false,
      message: '인증 토큰이 제공되지 않았습니다'
    });
  }
};

// 관리자 권한 체크 미들웨어
const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      message: '관리자 권한이 필요합니다'
    });
  }
};

module.exports = { protect, admin };
