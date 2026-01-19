import { useState, useEffect } from 'react';
import { orderService } from '../services/orderService';
import OrderDetailModal from '../components/OrderDetailModal';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllOrders();
      setOrders(response.data || []);
      setError(null);
    } catch (err) {
      setError('주문 목록을 불러오는 중 오류가 발생했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      loadOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        const updatedOrder = await orderService.getOrderById(orderId);
        setSelectedOrder(updatedOrder.data);
      }
    } catch (err) {
      alert('상태 변경 중 오류가 발생했습니다.');
      console.error(err);
    }
  };

  const handleViewDetail = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
      setSelectedOrder(response.data);
      setShowModal(true);
    } catch (err) {
      alert('주문 정보를 불러오는 중 오류가 발생했습니다.');
      console.error(err);
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
        return { text: '대기', class: 'status-pending' };
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="admin-orders">
      <h1>주문 관리</h1>
      
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>주문이 없습니다.</p>
        </div>
      ) : (
        <div className="orders-table">
          <table>
            <thead>
              <tr>
                <th>주문번호</th>
                <th>주문일시</th>
                <th>고객명</th>
                <th>상태</th>
                <th>금액</th>
                <th>작업</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusBadge = getStatusBadge(order.status, order.isPaid, order.isDelivered);
                return (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>{new Date(order.createdAt).toLocaleString('ko-KR')}</td>
                    <td>
                      {order.user?.name || order.shippingAddress?.name || '-'}
                    </td>
                    <td>
                      <span className={`status-badge ${statusBadge.class}`}>
                        {statusBadge.text}
                      </span>
                    </td>
                    <td>{order.totalPrice?.toLocaleString()}원</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleViewDetail(order._id)}
                          className="btn btn-outline btn-sm"
                        >
                          상세보기
                        </button>
                        {order.status !== 'delivered' && order.status !== 'cancelled' && (
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="status-select"
                          >
                            <option value="pending">대기</option>
                            <option value="processing">처리 중</option>
                            <option value="shipped">배송 중</option>
                            <option value="delivered">배송 완료</option>
                            <option value="cancelled">취소</option>
                          </select>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showModal && selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => {
            setShowModal(false);
            setSelectedOrder(null);
          }}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default AdminOrders;
