import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { userService } from '../services/userService';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        orderService.getAllOrders(),
        productService.getAllProducts(),
        userService.getAllUsers()
      ]);

      const orders = ordersRes.data || [];
      const products = productsRes.data || [];
      const users = usersRes.data || [];

      const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
      const pendingOrders = orders.filter(order => 
        order.status === 'pending' || order.status === 'processing'
      ).length;

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: users.length,
        totalRevenue,
        pendingOrders
      });

      setRecentOrders(orders.slice(0, 5));
    } catch (error) {
      console.error('대시보드 데이터 로딩 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  return (
    <div className="admin-dashboard">
      <h1>관리자 대시보드</h1>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon orders">📦</div>
          <div className="stat-info">
            <h3>총 주문</h3>
            <p className="stat-value">{stats.totalOrders}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon products">🛍️</div>
          <div className="stat-info">
            <h3>총 상품</h3>
            <p className="stat-value">{stats.totalProducts}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon users">👥</div>
          <div className="stat-info">
            <h3>총 사용자</h3>
            <p className="stat-value">{stats.totalUsers}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon revenue">💰</div>
          <div className="stat-info">
            <h3>총 매출</h3>
            <p className="stat-value">{stats.totalRevenue.toLocaleString()}원</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">⏳</div>
          <div className="stat-info">
            <h3>처리 대기</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/admin/products" className="action-card">
          <h3>상품 관리</h3>
          <p>상품을 조회, 추가, 수정, 삭제할 수 있습니다.</p>
        </Link>
        <Link to="/admin/orders" className="action-card">
          <h3>주문 관리</h3>
          <p>주문을 조회하고 상태를 변경할 수 있습니다.</p>
        </Link>
        <Link to="/admin/products/new" className="action-card">
          <h3>상품 등록</h3>
          <p>새로운 상품을 등록합니다.</p>
        </Link>
      </div>

      <div className="recent-orders">
        <h2>최근 주문</h2>
        {recentOrders.length === 0 ? (
          <p className="no-data">주문이 없습니다.</p>
        ) : (
          <div className="orders-table">
            <table>
              <thead>
                <tr>
                  <th>주문번호</th>
                  <th>주문일시</th>
                  <th>상태</th>
                  <th>금액</th>
                  <th>작업</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.slice(-8)}</td>
                    <td>{new Date(order.createdAt).toLocaleString('ko-KR')}</td>
                    <td>
                      <span className={`status-badge status-${order.status}`}>
                        {order.status === 'pending' ? '대기' :
                         order.status === 'processing' ? '처리중' :
                         order.status === 'shipped' ? '배송중' :
                         order.status === 'delivered' ? '배송완료' : '취소됨'}
                      </span>
                    </td>
                    <td>{order.totalPrice?.toLocaleString()}원</td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="btn btn-outline btn-sm">
                        상세보기
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
