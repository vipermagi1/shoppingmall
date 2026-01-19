const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// GET /api/users - 모든 사용자 조회
router.get('/', getUsers);

// GET /api/users/:id - 특정 사용자 조회
router.get('/:id', getUserById);

// POST /api/users - 사용자 생성
router.post('/', createUser);

// PUT /api/users/:id - 사용자 수정
router.put('/:id', updateUser);

// DELETE /api/users/:id - 사용자 삭제
router.delete('/:id', deleteUser);

module.exports = router;
