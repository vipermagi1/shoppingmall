import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
