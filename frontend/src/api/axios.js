/**
 * axios.js — EduVNU Centralized API Client
 *
 * Tất cả request HTTP trong app đều đi qua instance này.
 * KHÔNG dùng `fetch` trực tiếp ở bất kỳ đâu.
 *
 * Features:
 *  ✅ Base URL từ env variable (VITE_API_URL) hoặc fallback localhost
 *  ✅ Auto-attach JWT Bearer token vào mọi request
 *  ✅ Auto-refresh token khi nhận 401 (silent refresh)
 *  ✅ Redirect /login nếu refresh token hết hạn
 *  ✅ Centralized network error handling (log ra console.warn)
 */

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15s timeout để tránh request treo mãi
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────────
// Tự động đính kèm JWT access token vào mọi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────────
// Xử lý token hết hạn (401) → tự động refresh và retry request gốc
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Tránh loop vô hạn: chỉ retry 1 lần duy nhất
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/accounts/token/refresh/`,
            { refresh: refreshToken }
          );
          localStorage.setItem('access_token', data.access);
          originalRequest.headers.Authorization = `Bearer ${data.access}`;
          return api(originalRequest); // Retry request gốc với token mới
        } catch {
          // Refresh token cũng hết hạn → force logout
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      } else {
        // Không có refresh token → về login
        window.location.href = '/login';
      }
    }

    // Log lỗi network/server (không log 401 vì đã xử lý ở trên)
    if (!error.response || error.response.status !== 401) {
      console.warn('[EduVNU API Error]', error.config?.url, error.response?.status, error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
