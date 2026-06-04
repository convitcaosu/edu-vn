/**
 * CartContext.jsx — EduVNU Cart State Manager
 *
 * Quản lý số lượng item trong cart toàn ứng dụng.
 * Tách khỏi Header để:
 *  - Tránh re-fetch mỗi lần Header render
 *  - Cho phép bất kỳ component nào update cartCount (VD: sau khi thêm vào giỏ)
 *
 * Exposed:
 *  - cartCount: number
 *  - refreshCart: () => Promise<void>  — gọi sau khi add/remove item
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext({ cartCount: 0, refreshCart: () => {} });

export function CartProvider({ children }) {
  const { user }              = useAuth();
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!user) { setCartCount(0); return; }
    try {
      const r = await api.get('/cart/my_cart/');
      setCartCount(r.data.items?.length || 0);
    } catch {
      setCartCount(0);
    }
  }, [user]);

  // Fetch khi user thay đổi (login/logout)
  useEffect(() => { refreshCart(); }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
