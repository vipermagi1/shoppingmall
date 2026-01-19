const express = require('express');
const router = express.Router();
const { login, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// POST /api/auth/login - 로그인
router.post('/login', login);

// POST /api/auth/logout - 로그아웃
router.post('/logout', protect, logout);

// GET /api/auth/me - 현재 사용자 정보 조회
router.get('/me', protect, getMe);

module.exports = router;
