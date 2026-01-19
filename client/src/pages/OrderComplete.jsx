import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import './OrderComplete.css';

const OrderComplete = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      const response = await orderService.getOrderById(id);
      setOrder(response.data);
    } catch (error) {
      console.error('주문 정보를 불러오는 중 오류가 발생했습니다.', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!order) {
    return (
      <div className="order-complete">
        <div className="error">주문 정보를 찾을 수 없습니다.</div>
        <Link to="/" className="btn btn-primary">홈으로 가기</Link>
      </div>
    );
  }

  return (
    <div className="order-complete">
      <div className="complete-icon">✓</div>
      <h1>주문이 완료되었습니다!</h1>
      <p className="order-number">주문번호: {order._id}</p>
      
      <div className="order-info">
        <div className="info-section">
          <h2>주문 정보</h2>
          <div className="info-row">
            <span>주문일시</span>
            <span>{new Date(order.createdAt).toLocaleString('ko-KR')}</span>
          </div>
          <div className="info-row">
            <span>결제 방법</span>
            <span>
              {order.paymentMethod === 'card' ? '신용카드' :
               order.paymentMethod === 'bank' ? '계좌이체' : '무통장 입금'}
            </span>
          </div>
          <div className="info-row">
            <span>결제 상태</span>
            <span className={order.isPaid ? 'paid' : 'unpaid'}>
              {order.isPaid ? '결제 완료' : '결제 대기'}
            </span>
          </div>
          <div className="info-row total">
            <span>총 결제금액</span>
            <span>{order.totalPrice?.toLocaleString()}원</span>
          </div>
        </div>

        <div className="info-section">
          <h2>배송 정보</h2>
          <div className="shipping-info">
            <p><strong>받는 분:</strong> {order.shippingAddress?.name}</p>
            <p><strong>주소:</strong> {order.shippingAddress?.address}</p>
            <p><strong>상세주소:</strong> {order.shippingAddress?.city} {order.shippingAddress?.postalCode}</p>
            <p><strong>전화번호:</strong> {order.shippingAddress?.phone}</p>
          </div>
        </div>

        <div className="info-section">
          <h2>주문 상품</h2>
          <div className="order-items">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="order-item">
                <div className="order-item-image">
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="no-image">이미지 없음</div>
                  )}
                </div>
                <div className="order-item-info">
                  <h3>{item.name}</h3>
                  <p>수량: {item.quantity}개</p>
                  <p className="order-item-price">{(item.price * item.quantity).toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="complete-actions">
        <Link to="/orders" className="btn btn-primary">
          내 주문목록 보기
        </Link>
        <Link to="/products" className="btn btn-outline">
          계속 쇼핑하기
        </Link>
      </div>
    </div>
  );
};

export default OrderComplete;
