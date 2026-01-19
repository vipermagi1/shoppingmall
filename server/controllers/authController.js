const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const BlacklistedToken = require('../models/BlacklistedToken');

// JWT 토큰 생성 함수
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    로그인
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '이메일과 비밀번호를 입력해주세요'
      });
    }

    // 사용자 찾기
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다'
      });
    }

    // 비밀번호 확인
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: '이메일 또는 비밀번호가 올바르지 않습니다'
      });
    }

    // 토큰 생성
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '로그인 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    현재 로그인한 사용자 정보 조회
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '사용자 정보 조회 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

// @desc    로그아웃
// @route   POST /api/auth/logout
// @access  Private
const logout = async (req, res) => {
  try {
    // 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      try {
        // 토큰 디코딩하여 만료 시간 확인
        if (!process.env.JWT_SECRET) {
          throw new Error('JWT_SECRET 환경변수가 설정되지 않았습니다');
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 토큰을 블랙리스트에 추가
        const expiresAt = new Date(decoded.exp * 1000); // JWT exp는 초 단위이므로 밀리초로 변환
        
        await BlacklistedToken.create({
          token: token,
          userId: req.user._id,
          expiresAt: expiresAt
        });
      } catch (error) {
        // 토큰이 이미 만료되었거나 유효하지 않은 경우 무시
        console.log('토큰 블랙리스트 추가 실패 (이미 만료되었을 수 있음):', error.message);
      }
    }
    
    res.status(200).json({
      success: true,
      message: '로그아웃되었습니다'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '로그아웃 중 오류가 발생했습니다',
      error: error.message
    });
  }
};

module.exports = {
  login,
  getMe,
  logout
};
