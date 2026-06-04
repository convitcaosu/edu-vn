/**
 * NotificationContext.jsx — EduVNU Notification State Manager
 *
 * Quản lý danh sách thông báo và unread count toàn ứng dụng.
 * Tách khỏi Header để:
 *  - Cho phép polling / WebSocket ở 1 nơi duy nhất
 *  - Tránh fetch trùng lặp giữa nhiều component
 *
 * Exposed:
 *  - notifications: Notification[]
 *  - unreadCount: number
 *  - markRead: (id: number) => Promise<void>
 *  - refreshNotifications: () => Promise<void>
 */

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const NotificationContext = createContext({
  notifications: [],
  unreadCount: 0,
  markRead: async () => {},
  refreshNotifications: async () => {},
});

export function NotificationProvider({ children }) {
  const { user }                          = useAuth();
  const [notifications, setNotifications] = useState([]);

  const refreshNotifications = useCallback(async () => {
    if (!user) { setNotifications([]); return; }
    try {
      const r = await api.get('/courses/notifications/');
      setNotifications(r.data.results || r.data || []);
    } catch {
      // Không crash nếu không lấy được notifications
    }
  }, [user]);

  // Fetch khi user thay đổi
  useEffect(() => { refreshNotifications(); }, [refreshNotifications]);

  const markRead = useCallback(async (id) => {
    try {
      await api.post(`/courses/notifications/${id}/mark_as_read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch {
      // ignore
    }
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markRead, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => useContext(NotificationContext);
