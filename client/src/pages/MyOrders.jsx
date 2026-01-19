import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { authService } from '../services/authService';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
      navigate('/login');
      return;
    }
    setUser(currentUser);
    loadOrders(currentUser);
  }, [navigate]);

  const loadOrders = async (currentUser) => {
    if (!currentUser) return;
    
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      if (err.response?.status === 401) {
        // 인증 오류 시 로그인 페이지로 리다이렉트
        navigate('/login');
      } else {
        setError(err.response?.data?.message || '주문 목록을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status, isPaid, isDelivered) => {
    if (!isPaid) return { text: '결제 대기', class: 'status-pending' };
    if (isDelivered) return { text: '배송 완료', class: 'status-delivered' };
    
    switch (status) {
      case 'processing':
        return { text: '처리 중', class: 'status-processing' };
      case 'shipped':
        return { text: '배송 중', class: 'status-shipped' };
      case 'cancelled':
        return { text: '취소됨', class: 'status-cancelled' };
      default:
        return { text: '처리 중', class: 'status-processing' };
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="my-orders">
      <h1>내 주문목록</h1>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>주문 내역이 없습니다.</p>
          <Link to="/products" className="btn btn-primary">
            쇼핑하러 가기
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => {
            const statusBadge = getStatusBadge(order.status, order.isPaid, order.isDelivered);
            return (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>주문번호: {order._id.slice(-8)}</h3>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleString('ko-KR')}
                    </p>
                  </div>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.text}
                  </span>
                </div>
                
                <div className="order-items-preview">
                  {order.orderItems?.slice(0, 3).map((item, index) => (
                    <div key={index} className="order-item-preview">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="preview-image" />
                      )}
                      <span className="preview-name">{item.name}</span>
                      <span className="preview-quantity">x{item.quantity}</span>
                    </div>
                  ))}
                  {order.orderItems?.length > 3 && (
                    <div className="more-items">+{order.orderItems.length - 3}개 더</div>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    총 결제금액: <strong>{order.totalPrice?.toLocaleString()}원</strong>
                  </div>
                  <Link to={`/order-complete/${order._id}`} className="btn btn-outline">
                    상세보기
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
