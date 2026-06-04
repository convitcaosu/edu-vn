/**
 * ProtectedRoute.jsx — EduVNU Auth Guard
 *
 * Bảo vệ các route yêu cầu xác thực.
 * - Đang load → hiện spinner toàn màn hình
 * - Chưa login → redirect /login (lưu lại URL để redirect sau khi login)
 * - Đã login → render children
 *
 * Usage:
 *   <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
 *
 * Role guard (tuỳ chọn):
 *   <Route path="/instructor" element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loading } from './LoadingUI';

/**
 * @param {Object}  props
 * @param {React.ReactNode} props.children  - Nội dung cần bảo vệ
 * @param {"instructor"|"admin"|null} [props.role] - Role cần thiết (ngoài việc đã login)
 */
export default function ProtectedRoute({ children, role = null }) {
  const { user, loading } = useAuth();
  const location          = useLocation();

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loading message="Đang xác thực..." />
      </div>
    );
  }

  if (!user) {
    // Lưu lại trang người dùng muốn vào để redirect sau khi login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role === 'instructor' && !user.is_instructor && !user.is_staff) {
    return <Navigate to="/" replace />;
  }

  if (role === 'admin' && !user.is_staff) {
    return <Navigate to="/" replace />;
  }

  return children;
}
