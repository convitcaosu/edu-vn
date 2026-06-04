/**
 * AppProviders.jsx — EduVNU Global Provider Wrapper
 *
 * Gom tất cả Context Providers vào 1 file.
 * Thứ tự provider QUAN TRỌNG: AuthProvider phải đứng trước các provider khác
 * vì CartProvider và NotificationProvider phụ thuộc vào AuthContext.
 *
 * Khi cần thêm Provider mới (VD: ThemeProvider), chỉ cần thêm vào đây.
 */

import { AuthProvider }         from './AuthContext';
import { CartProvider }         from './CartContext';
import { NotificationProvider } from './NotificationContext';

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CartProvider>
        <NotificationProvider>
          {children}
        </NotificationProvider>
      </CartProvider>
    </AuthProvider>
  );
}
