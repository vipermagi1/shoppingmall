import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { authService } from '../services/authService';
import { useState, useEffect } from 'react';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartItemsCount, clearCart } = useCart();
  const cartCount = getCartItemsCount();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 페이지 로드 시 사용자 정보 확인
    const checkUser = () => {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkUser();

    // 로그인/로그아웃 시 상태 업데이트를 위한 이벤트 리스너
    const handleStorageChange = () => {
      checkUser();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // location 변경 시 사용자 상태 재확인 (로그인 후 리다이렉트 대응)
    checkUser();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [location]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      // 장바구니 비우기
      await clearCart();
      setUser(null);
      // 인증 상태 변경 이벤트 발생
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
      // 페이지 새로고침하여 모든 상태 초기화
      window.location.reload();
    } catch (error) {
      console.error('로그아웃 오류:', error);
      // 오류가 발생해도 로컬 스토리지는 정리
      await clearCart();
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      window.dispatchEvent(new Event('authChange'));
      navigate('/');
    }
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-top">
          <div className="container">
            <Link to="/" className="logo">
              <h1>KOSINSA</h1>
            </Link>
            <nav className="nav">
              <Link to="/" className="nav-link">홈</Link>
              <Link to="/products" className="nav-link">전체상품</Link>
              <Link to="/cart" className="nav-link">
                장바구니
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            {user && <Link to="/orders" className="nav-link">내 주문</Link>}
            {user && user.role === 'admin' && (
              <Link to="/admin" className="nav-link">관리자</Link>
            )}
              {!loading && (
                <>
                  {user ? (
                    <>
                      <span className="nav-user">{user.name}님 환영합니다</span>
                      <button onClick={handleLogout} className="nav-link nav-logout">
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <Link to="/login" className="nav-link">로그인</Link>
                  )}
                </>
              )}
            </nav>
          </div>
        </div>
        <div className="header-categories">
          <div className="container">
            <nav className="category-nav">
              <Link to="/products?category=상의" className="category-link">상의</Link>
              <Link to="/products?category=하의" className="category-link">하의</Link>
              <Link to="/products?category=아우터" className="category-link">아우터</Link>
              <Link to="/products?category=신발" className="category-link">신발</Link>
              <Link to="/products?category=가방" className="category-link">가방</Link>
              <Link to="/products?category=액세서리" className="category-link">액세서리</Link>
              <Link to="/products?category=모자" className="category-link">모자</Link>
              <Link to="/products?category=시계" className="category-link">시계</Link>
              <Link to="/products?category=주얼리" className="category-link">주얼리</Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="main">
        <div className="container">
          <Outlet />
        </div>
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; 2026 코신사 (KOSINSA). All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
