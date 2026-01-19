import { useState } from 'react';
import { orderService } from '../services/orderService';
import './OrderDetailModal.css';

const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(order._id, newStatus);
      onStatusChange(order._id, newStatus);
      onClose();
    } catch (err) {
      alert('상태 변경 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleDeliver = async () => {
    setUpdating(true);
    try {
      await orderService.updateOrderToDelivered(order._id);
      onStatusChange(order._id, 'delivered');
      onClose();
    } catch (err) {
      alert('배송 처리 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (!order) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>주문 상세 정보</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="order-section">
            <h3>주문 정보</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">주문번호:</span>
                <span className="info-value">{order._id}</span>
              </div>
              <div className="info-item">
                <span className="info-label">주문일시:</span>
                <span className="info-value">
                  {new Date(order.createdAt).toLocaleString('ko-KR')}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">결제 방법:</span>
                <span className="info-value">
                  {order.paymentMethod === 'card' ? '신용카드' :
                   order.paymentMethod === 'bank' ? '계좌이체' : '무통장 입금'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">결제 상태:</span>
                <span className={`info-value ${order.isPaid ? 'paid' : 'unpaid'}`}>
                  {order.isPaid ? '결제 완료' : '결제 대기'}
                </span>
              </div>
              <div className="info-item">
                <span className="info-label">배송 상태:</span>
                <span className={`info-value ${order.isDelivered ? 'delivered' : 'not-delivered'}`}>
                  {order.isDelivered ? '배송 완료' : '배송 대기'}
                </span>
              </div>
            </div>
          </div>

          <div className="order-section">
            <h3>배송 정보</h3>
            <div className="shipping-info">
              <p><strong>받는 분:</strong> {order.shippingAddress?.name}</p>
              <p><strong>주소:</strong> {order.shippingAddress?.address}</p>
              <p><strong>도시:</strong> {order.shippingAddress?.city}</p>
              <p><strong>우편번호:</strong> {order.shippingAddress?.postalCode}</p>
              <p><strong>국가:</strong> {order.shippingAddress?.country}</p>
              <p><strong>전화번호:</strong> {order.shippingAddress?.phone}</p>
            </div>
          </div>

          <div className="order-section">
            <h3>주문 상품</h3>
            <div className="order-items-list">
              {order.orderItems?.map((item, index) => (
                <div key={index} className="order-item-detail">
                  <div className="item-image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className="no-image">이미지 없음</div>
                    )}
                  </div>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>수량: {item.quantity}개</p>
                    <p className="item-price">{(item.price * item.quantity).toLocaleString()}원</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-section">
            <h3>결제 정보</h3>
            <div className="payment-summary">
              <div className="summary-row">
                <span>상품 금액:</span>
                <span>{order.itemsPrice?.toLocaleString()}원</span>
              </div>
              <div className="summary-row">
                <span>배송비:</span>
                <span>{order.shippingPrice?.toLocaleString()}원</span>
              </div>
              <div className="summary-row">
                <span>부가세:</span>
                <span>{order.taxPrice?.toLocaleString()}원</span>
              </div>
              <div className="summary-row total">
                <span>총 결제금액:</span>
                <span>{order.totalPrice?.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <div className="status-actions">
            <label>주문 상태 변경:</label>
            <select
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
              disabled={updating}
              className="status-select"
            >
              <option value="pending">대기</option>
              <option value="processing">처리 중</option>
              <option value="shipped">배송 중</option>
              <option value="delivered">배송 완료</option>
              <option value="cancelled">취소</option>
            </select>
          </div>
          {order.isPaid && !order.isDelivered && (
            <button
              onClick={handleDeliver}
              disabled={updating}
              className="btn btn-primary"
            >
              {updating ? '처리 중...' : '배송 완료 처리'}
            </button>
          )}
          <button onClick={onClose} className="btn btn-outline">
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
