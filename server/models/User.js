const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '이름을 입력해주세요'],
    trim: true
  },
  email: {
    type: String,
    required: [true, '이메일을 입력해주세요'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, '비밀번호를 입력해주세요'],
    minlength: [6, '비밀번호는 최소 6자 이상이어야 합니다']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// 비밀번호 암호화 미들웨어 (저장 전)
userSchema.pre('save', async function (next) {
  // 비밀번호가 변경되지 않았다면 다음으로 진행
  if (!this.isModified('password')) {
    next();
  }

  // 비밀번호 암호화
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('User', userSchema);
