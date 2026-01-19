import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('장바구니가 비어있습니다.');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart">
        <h1>장바구니</h1>
        <div className="empty-cart">
          <p>장바구니가 비어있습니다.</p>
          <Link to="/products" className="btn btn-primary">
            쇼핑하러 가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <h1>장바구니</h1>
      <div className="cart-content">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
              </div>
              <div className="cart-item-info">
                <Link to={`/products/${item._id}`} className="cart-item-name">
                  {item.name}
                </Link>
                <p className="cart-item-price">{item.price?.toLocaleString()}원</p>
              </div>
              <div className="cart-item-quantity">
                <button
                  onClick={() => updateQuantity(item._id, item.quantity - 1)}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-value">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, item.quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
              <div className="cart-item-total">
                {(item.price * item.quantity)?.toLocaleString()}원
              </div>
              <button
                onClick={() => removeFromCart(item._id)}
                className="remove-btn"
              >
                삭제
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <h2>주문 요약</h2>
          <div className="summary-row">
            <span>상품 금액</span>
            <span>{getCartTotal().toLocaleString()}원</span>
          </div>
          <div className="summary-row">
            <span>배송비</span>
            <span className="free">무료</span>
          </div>
          <div className="summary-row total">
            <span>총 결제금액</span>
            <span>{getCartTotal().toLocaleString()}원</span>
          </div>
          <button onClick={handleCheckout} className="btn btn-primary btn-large">
            주문하기
          </button>
          <button onClick={clearCart} className="btn btn-outline">
            장바구니 비우기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
