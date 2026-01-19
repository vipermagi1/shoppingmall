import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/userService';
import './Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10,11}$/;
    return phoneRegex.test(phone.replace(/-/g, ''));
  };

  const validatePassword = (password) => {
    // 문자, 숫자, 특수문자(!@#$%^&*?) 포함 8-20자
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*?])[a-zA-Z0-9!@#$%^&*?]{8,20}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // 유효성 검사
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요';
    }

    if (!formData.email.trim()) {
      newErrors.email = '이메일을 입력해주세요';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = '비밀번호는 문자, 숫자, 특수문자(!@#$%^&*?)를 포함하여 8-20자로 입력해주세요';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호 확인을 입력해주세요';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '비밀번호가 일치하지 않습니다';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = '올바른 전화번호를 입력해주세요 (10-11자리)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const signupData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        address: formData.address || '',
        role: 'user'
      };

      await userService.createUser(signupData);
      alert('회원가입이 완료되었습니다!');
      navigate('/');
    } catch (error) {
      if (error.response?.status === 400) {
        const errorMessage = error.response.data?.error || error.response.data?.message || '회원가입에 실패했습니다';
        if (errorMessage.includes('email') || errorMessage.includes('이메일')) {
          setErrors({ email: '이미 사용 중인 이메일입니다' });
        } else {
          setErrors({ submit: errorMessage });
        }
      } else {
        setErrors({ submit: '회원가입 중 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <h1 className="signup-title">회원가입</h1>
        <p className="signup-subtitle">회원이 되어 다양한 혜택을 경험해 보세요!</p>

        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <label htmlFor="name">이름</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="이름을 입력해주세요"
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일 주소</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="이메일 주소를 입력해주세요"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="비밀번호 입력 (문자, 숫자, 특수문자(!@#$%^&*?) 포함 8~20자)"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
            <span className="form-hint">20자 이내의 비밀번호를 입력해주세요</span>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="비밀번호 재입력"
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">전화번호</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="휴대폰 번호 입력 ('-' 제외 11자리 입력)"
              className={errors.phone ? 'error' : ''}
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="address">주소</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="주소를 입력해주세요 (선택사항)"
            />
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '처리 중...' : '가입하기'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn btn-cancel"
            >
              가입취소
            </button>
          </div>
        </form>

        <div className="signup-footer">
          <p>
            이미 회원이신가요? <Link to="/">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
