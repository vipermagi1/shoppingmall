import { createContext, useContext, useState, useEffect } from 'react';
import { cartService } from '../services/cartService';
import { authService } from '../services/authService';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // 사용자 인증 상태 확인
  const isAuthenticated = () => {
    return authService.isAuthenticated();
  };

  // 서버에서 장바구니 로드
  const loadCartFromServer = async () => {
    if (!isAuthenticated()) {
      // 로그인하지 않은 경우 localStorage에서 로드
      const savedCart = localStorage.getItem('cartItems');
      setCartItems(savedCart ? JSON.parse(savedCart) : []);
      setLoading(false);
      return;
    }

    try {
      const response = await cartService.getCart();
      if (response.success && response.data) {
        // 서버 장바구니 데이터를 클라이언트 형식으로 변환
        const items = response.data.items.map(item => {
          // product가 populate된 경우와 그렇지 않은 경우 모두 처리
          const productId = item.product?._id || item.product || item.productId;
          return {
            _id: productId,
            name: item.name,
            price: item.price,
            image: item.image || '',
            quantity: item.quantity,
            product: item.product
          };
        });
        setCartItems(items);
      }
    } catch (error) {
      console.error('장바구니 로드 오류:', error);
      // 오류 발생 시 localStorage에서 로드 시도 (비로그인 사용자용)
      if (!isAuthenticated()) {
        const savedCart = localStorage.getItem('cartItems');
        setCartItems(savedCart ? JSON.parse(savedCart) : []);
      } else {
        // 로그인한 사용자의 경우 빈 배열로 설정
        setCartItems([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드 및 인증 상태 변경 시 장바구니 로드
  useEffect(() => {
    loadCartFromServer();

    // 로그인/로그아웃 이벤트 감지
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'user') {
        loadCartFromServer();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // 커스텀 이벤트로 같은 탭에서의 로그인/로그아웃 감지
    const handleAuthChange = () => {
      loadCartFromServer();
    };
    
    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  // 로그인하지 않은 경우 localStorage에 저장
  useEffect(() => {
    if (!isAuthenticated()) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems]);

  const addToCart = async (product, quantity = 1) => {
    if (!isAuthenticated()) {
      // 로그인하지 않은 경우 localStorage에 저장
      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item._id === product._id);
        
        if (existingItem) {
          return prevItems.map((item) =>
            item._id === product._id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        }
        
        return [...prevItems, { ...product, quantity }];
      });
      return;
    }

    // 로그인한 경우 서버에 저장
    try {
      await cartService.addToCart(product._id, quantity);
      await loadCartFromServer();
    } catch (error) {
      console.error('장바구니 추가 오류:', error);
      alert(error.response?.data?.message || '장바구니 추가 중 오류가 발생했습니다');
    }
  };

  const removeFromCart = async (productId) => {
    if (!isAuthenticated()) {
      // 로그인하지 않은 경우 localStorage에서 제거
      setCartItems((prevItems) => prevItems.filter((item) => item._id !== productId));
      return;
    }

    // 로그인한 경우 서버에서 제거
    try {
      await cartService.removeFromCart(productId);
      await loadCartFromServer();
    } catch (error) {
      console.error('장바구니 제거 오류:', error);
      alert(error.response?.data?.message || '장바구니 제거 중 오류가 발생했습니다');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    if (!isAuthenticated()) {
      // 로그인하지 않은 경우 localStorage에서 업데이트
      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item._id === productId ? { ...item, quantity } : item
        )
      );
      return;
    }

    // 로그인한 경우 서버에서 업데이트
    try {
      await cartService.updateQuantity(productId, quantity);
      await loadCartFromServer();
    } catch (error) {
      console.error('수량 업데이트 오류:', error);
      alert(error.response?.data?.message || '수량 업데이트 중 오류가 발생했습니다');
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated()) {
      // 로그인하지 않은 경우 localStorage 비우기
      setCartItems([]);
      localStorage.removeItem('cartItems');
      return;
    }

    // 로그인한 경우 서버에서 비우기
    try {
      await cartService.clearCart();
      setCartItems([]);
    } catch (error) {
      console.error('장바구니 비우기 오류:', error);
      alert(error.response?.data?.message || '장바구니 비우기 중 오류가 발생했습니다');
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    refreshCart: loadCartFromServer,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
