import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderComplete from './pages/OrderComplete';
import MyOrders from './pages/MyOrders';
import AdminDashboard from './pages/AdminDashboard';
import AdminProducts from './pages/AdminProducts';
import AdminProductNew from './pages/AdminProductNew';
import AdminOrders from './pages/AdminOrders';
import Users from './pages/Users';
import Signup from './pages/Signup';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="order-complete/:id" element={<OrderComplete />} />
          <Route path="orders" element={<MyOrders />} />
          <Route path="admin" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="admin/products" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProducts />
            </ProtectedRoute>
          } />
          <Route path="admin/products/new" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProductNew />
            </ProtectedRoute>
          } />
          <Route path="admin/orders" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminOrders />
            </ProtectedRoute>
          } />
          <Route path="users" element={<Users />} />
          <Route path="signup" element={<Signup />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
