import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    postalCode: '',
    country: '대한민국',
    phone: '',
    paymentMethod: 'card',
    pgProvider: 'html5_inicis.INIpayTest' // 테스트용 기본 PG사
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    if (!currentUser) {
      navigate('/login');
    }

    // 포트원(PortOne) 초기화
    if (window.IMP) {
      window.IMP.init('imp56475867');
      console.log('포트원 결제 모듈이 초기화되었습니다.');
    } else {
      console.error('포트원 SDK가 로드되지 않았습니다.');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // 결제 방법에 따라 PG사 자동 설정
    if (name === 'paymentMethod') {
      let pgProvider = 'html5_inicis.INIpayTest'; // 테스트용 기본값
      
      switch(value) {
        case 'kakaopay':
          pgProvider = 'kakaopay.TC0ONETIME';
          break;
        case 'naverpay':
          pgProvider = 'naverpay';
          break;
        case 'payco':
          pgProvider = 'payco';
          break;
        case 'tosspay':
          pgProvider = 'tosspay';
          break;
        case 'bank':
          pgProvider = 'html5_inicis.INIpayTest';
          break;
        case 'vbank':
          pgProvider = 'html5_inicis.INIpayTest';
          break;
        default:
          pgProvider = 'html5_inicis.INIpayTest';
      }
      
      setFormData({
        ...formData,
        [name]: value,
        pgProvider: pgProvider
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // 포트원 결제 요청
  const requestPortOnePayment = (orderData, orderId) => {
    return new Promise((resolve, reject) => {
      if (!window.IMP) {
        reject(new Error('포트원 SDK가 로드되지 않았습니다.'));
        return;
      }

      const merchantUid = `order_${orderId}_${Date.now()}`;
      const totalAmount = orderData.totalPrice;
      const productName = cartItems.length > 1 
        ? `${cartItems[0].name} 외 ${cartItems.length - 1}건`
        : cartItems[0].name;

      // 결제 방법에 따른 pay_method 설정
      let payMethod = 'card';
      
      switch(formData.paymentMethod) {
        case 'bank':
          payMethod = 'trans'; // 실시간 계좌이체
          break;
        case 'vbank':
          payMethod = 'vbank'; // 가상계좌
          break;
        case 'kakaopay':
        case 'naverpay':
        case 'payco':
        case 'tosspay':
          payMethod = 'card'; // 간편결제도 card로 설정
          break;
        default:
          payMethod = 'card';
      }

      const paymentParams = {
        pg: formData.pgProvider,
        pay_method: payMethod,
        merchant_uid: merchantUid,
        name: productName,
        amount: totalAmount,
        buyer_email: user.email || 'test@test.com',
        buyer_name: formData.name,
        buyer_tel: formData.phone,
        buyer_addr: `${formData.address} ${formData.city}`,
        buyer_postcode: formData.postalCode,
        // 가상계좌 설정 (가상계좌 결제 시)
        ...(formData.paymentMethod === 'vbank' && {
          vbank_due: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0].replace(/-/g, '')
        }),
        // 테스트 모드 명시
        debug: true,
        // 모바일 환경 대응
        m_redirect_url: window.location.origin + '/order-complete/' + orderId
      };

      console.log('포트원 결제 요청:', paymentParams);

      window.IMP.request_pay(paymentParams, (rsp) => {
        console.log('포트원 결제 응답:', rsp);
        
        if (rsp.success) {
          resolve({
            imp_uid: rsp.imp_uid,
            merchant_uid: rsp.merchant_uid,
            pg_provider: rsp.pg_provider,
            pg_tid: rsp.pg_tid,
            pay_method: rsp.pay_method,
            status: 'completed',
            paid_amount: rsp.paid_amount,
            receipt_url: rsp.receipt_url,
            card_name: rsp.card_name,
            card_number: rsp.card_number,
            vbank_name: rsp.vbank_name,
            vbank_num: rsp.vbank_num,
            vbank_holder: rsp.vbank_holder,
            vbank_date: rsp.vbank_date,
            update_time: new Date().toISOString()
          });
        } else {
          reject(new Error(rsp.error_msg || '결제에 실패했습니다.'));
        }
      });
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 배송 정보 유효성 검사
    if (!formData.name || !formData.address || !formData.city || !formData.postalCode || !formData.phone) {
      setError('모든 배송 정보를 입력해주세요.');
      return;
    }

    if (!user) {
      setError('로그인이 필요합니다.');
      navigate('/login');
      return;
    }

    setLoading(true);

    try {
      // 1. 주문 생성
      const orderData = {
        orderItems: cartItems.map(item => ({
          product: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image || ''
        })),
        shippingAddress: {
          name: formData.name,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: getCartTotal(),
        shippingPrice: 0,
        taxPrice: 0,
        totalPrice: getCartTotal()
      };

      const response = await orderService.createOrder(orderData);
      const orderId = response.data._id;

      // 2. 포트원 결제 요청
      try {
        const paymentResult = await requestPortOnePayment(orderData, orderId);
        
        // 3. 결제 완료 처리
        await orderService.updateOrderToPaid(orderId, { paymentResult });
        
        // 4. 장바구니 비우기 및 주문 완료 페이지로 이동
        clearCart();
        navigate(`/order-complete/${orderId}`);
      } catch (paymentError) {
        // 결제 실패 시 에러 표시
        setError(paymentError.message || '결제 처리 중 오류가 발생했습니다.');
        console.error('결제 오류:', paymentError);
      }
    } catch (err) {
      setError(err.response?.data?.message || '주문 생성 중 오류가 발생했습니다.');
      console.error('주문 생성 오류:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="checkout">
        <h1>주문하기</h1>
        <div className="empty-cart">
          <p>로그인이 필요합니다.</p>
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            로그인하러 가기
          </button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="checkout">
        <h1>주문하기</h1>
        <div className="empty-cart">
          <p>장바구니가 비어있습니다.</p>
          <button onClick={() => navigate('/products')} className="btn btn-primary">
            쇼핑하러 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout">
      <h1>주문하기</h1>
      <div className="checkout-content">
        <form onSubmit={handleSubmit} className="checkout-form">
          <div className="form-section">
            <h2>배송 정보</h2>
            <div className="form-group">
              <label>이름 *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>주소 *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>도시 *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>우편번호 *</label>
                <input
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>국가</label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>전화번호 *</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h2>결제 방법</h2>
            <div className="payment-methods">
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={formData.paymentMethod === 'card'}
                  onChange={handleChange}
                />
                <span>💳 신용카드</span>
              </label>
              <label className="payment-method payment-method-disabled" title="간편결제는 실제 계약 후 사용 가능합니다">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="kakaopay"
                  checked={formData.paymentMethod === 'kakaopay'}
                  onChange={handleChange}
                  disabled
                />
                <span>카카오페이 <small>(준비중)</small></span>
              </label>
              <label className="payment-method payment-method-disabled" title="간편결제는 실제 계약 후 사용 가능합니다">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="naverpay"
                  checked={formData.paymentMethod === 'naverpay'}
                  onChange={handleChange}
                  disabled
                />
                <span>네이버페이 <small>(준비중)</small></span>
              </label>
              <label className="payment-method payment-method-disabled" title="간편결제는 실제 계약 후 사용 가능합니다">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="payco"
                  checked={formData.paymentMethod === 'payco'}
                  onChange={handleChange}
                  disabled
                />
                <span>페이코 <small>(준비중)</small></span>
              </label>
              <label className="payment-method payment-method-disabled" title="간편결제는 실제 계약 후 사용 가능합니다">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="tosspay"
                  checked={formData.paymentMethod === 'tosspay'}
                  onChange={handleChange}
                  disabled
                />
                <span>토스페이 <small>(준비중)</small></span>
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="bank"
                  checked={formData.paymentMethod === 'bank'}
                  onChange={handleChange}
                />
                <span>🏦 실시간 계좌이체</span>
              </label>
              <label className="payment-method">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="vbank"
                  checked={formData.paymentMethod === 'vbank'}
                  onChange={handleChange}
                />
                <span>🏛️ 가상계좌</span>
              </label>
            </div>

            {/* 결제 방법 안내 */}
            <div className="payment-notice">
              {formData.paymentMethod === 'card' && (
                <p>💳 포트원 안전결제 창에서 카드 정보를 입력하시면 됩니다.</p>
              )}
              {formData.paymentMethod === 'bank' && (
                <p>🏦 실시간 계좌이체는 즉시 결제가 완료됩니다.</p>
              )}
              {formData.paymentMethod === 'vbank' && (
                <p>🏛️ 가상계좌 발급 후 입금하시면 주문이 확정됩니다.</p>
              )}
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn btn-primary btn-large" disabled={loading}>
            {loading ? '처리 중...' : '주문 완료'}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>주문 요약</h2>
          <div className="summary-items">
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity).toLocaleString()}원</span>
              </div>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default Checkout;
