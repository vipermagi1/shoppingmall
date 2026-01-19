import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // 이미 로그인되어 있는지 확인
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authService.getToken();
        if (token) {
          // 토큰이 있으면 서버에 유효성 검증
          try {
            const response = await authService.getMe();
            if (response.success && response.data) {
              // 유효한 토큰이 있으면 메인 페이지로 리다이렉트
              const user = response.data;
              if (user.role === 'admin') {
                navigate('/admin', { replace: true });
              } else {
                navigate('/', { replace: true });
              }
              return;
            }
          } catch (error) {
            // 토큰이 유효하지 않으면 로컬 스토리지 정리
            authService.logout();
          }
        }
      } catch (error) {
        console.error('인증 확인 오류:', error);
        authService.logout();
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // 유효성 검사
    if (!formData.email.trim()) {
      setErrors({ email: '이메일을 입력해주세요' });
      return;
    }

    if (!formData.password) {
      setErrors({ password: '비밀번호를 입력해주세요' });
      return;
    }

    setLoading(true);

    try {
      const response = await authService.login(formData.email, formData.password);
      
      // 토큰을 localStorage에 저장
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // storage 이벤트 발생시켜 Layout 컴포넌트가 상태 업데이트하도록 함
      window.dispatchEvent(new Event('storage'));
      // 인증 상태 변경 이벤트 발생시켜 CartContext가 장바구니를 다시 로드하도록 함
      window.dispatchEvent(new Event('authChange'));

      // 관리자인 경우 관리자 대시보드로, 일반 사용자는 홈으로
      if (response.data.user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      // 페이지 새로고침하여 모든 컴포넌트 상태 업데이트
      window.location.reload();
    } catch (error) {
      if (error.response?.status === 401) {
        setErrors({ submit: error.response.data?.message || '이메일 또는 비밀번호가 올바르지 않습니다' });
      } else {
        setErrors({ submit: '로그인 중 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // 인증 확인 중이면 로딩 표시
  if (checkingAuth) {
    return (
      <div className="login-container">
        <div className="login-box">
          <div className="loading">확인 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">쇼핑몰에 오신 것을 환영합니다!</p>

        <form onSubmit={handleSubmit} className="login-form">
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
              placeholder="비밀번호를 입력해주세요"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {errors.submit && <div className="submit-error">{errors.submit}</div>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="login-footer">
          <p>
            계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
