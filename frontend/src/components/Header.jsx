/**
 * Header.jsx — EduVNU Global Navigation Header
 * Tách từ App.jsx để dễ maintain và update độc lập.
 *
 * Responsibilities:
 *  - Logo + Mega Menu (Khám phá)
 *  - Search bar (Enter để tìm kiếm)
 *  - Notification Bell (real-time unread count)
 *  - Cart badge
 *  - User Avatar Dropdown (profile, instructor portal, logout)
 *  - Login/Register buttons khi chưa đăng nhập
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useNotifications } from '../context/NotificationContext';
import MegaMenu from './MegaMenu';

export default function Header() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMega, setShowMega]         = useState(false);

  const { user, logout }                = useAuth();
  const { cartCount }                   = useCart();
  const { notifications, unreadCount, markRead } = useNotifications();

  const navigate    = useNavigate();
  const userMenuRef = useRef(null);

  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef(null);

  // Close user-menu on outside click
  useEffect(() => {
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUserMenu(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      navigate(`/?q=${encodeURIComponent(e.target.value.trim())}`);
      e.target.value = '';
    }
  };

  const handleNotifClick = async (notif) => {
    await markRead(notif.id);
    setShowNotifs(false);
    if (notif.link) navigate(notif.link);
  };

  const avatarLetter = (user?.username || 'U')[0].toUpperCase();
  const displayName  = user?.first_name
    ? `${user.first_name} ${user.last_name}`
    : user?.username;

  return (
    <header className="crs-header">
      <div className="crs-header-inner">
        {/* ── LEFT NAV ── */}
        <div className="crs-nav-left">
          <Link
            to="/"
            className="crs-logo"
            style={{ display: 'flex', alignItems: 'center', marginLeft: '30px', marginRight: '30px' }}
          >
            <img
              src="/course_images/eduvn.png"
              alt="EduVNU Logo"
              style={{ height: '90px', objectFit: 'contain', transform: 'scale(2.8)' }}
            />
          </Link>

          {/* Mega Menu Trigger */}
          <div className="mega-trigger" onMouseEnter={() => setShowMega(true)}>
            <button className="crs-explore-btn">Khám phá ▾</button>
            {showMega && <MegaMenu onClose={() => setShowMega(false)} />}
          </div>

          {/* Authenticated Nav links */}
          {user && (
            <Link to="/schedule" className="crs-nav-link">
              Việc học của tôi
            </Link>
          )}
          <Link to="/degrees" className="crs-nav-link">
            Trình độ
          </Link>

          {/* Search */}
          <div className="crs-search">
            <span className="crs-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Bạn muốn học gì?"
              onKeyDown={handleSearch}
              aria-label="Tìm kiếm khóa học"
            />
          </div>
        </div>

        {/* ── RIGHT NAV ── */}
        <nav className="crs-nav-right" aria-label="Điều hướng phụ">
          {/* Notification Bell — chỉ hiện khi đã login */}
          {user && (
            <div
              className="notif-bell-container"
              ref={notifRef}
              style={{ position: 'relative', marginRight: '15px' }}
            >
              <button
                id="notif-bell-btn"
                onClick={() => setShowNotifs((v) => !v)}
                aria-label={`Thông báo${unreadCount > 0 ? ` (${unreadCount} chưa đọc)` : ''}`}
                style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', color: '#64748b' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                  <span
                    style={{
                      position: 'absolute', top: 0, right: 0,
                      background: '#ef4444', border: '2px solid white',
                      width: 12, height: 12, borderRadius: '50%',
                    }}
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifs && (
                <div
                  className="notif-dropdown"
                  role="menu"
                  aria-label="Danh sách thông báo"
                  style={{
                    position: 'absolute', top: '100%', right: 0,
                    width: 320, background: 'white',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    borderRadius: 12, zIndex: 2000,
                    marginTop: 10, maxHeight: 400, overflowY: 'auto',
                  }}
                >
                  <div style={{ padding: '15px', borderBottom: '1px solid #f1f5f9', fontWeight: 700 }}>
                    Thông báo
                    {unreadCount > 0 && (
                      <span style={{
                        marginLeft: 8, background: '#ef4444', color: 'white',
                        borderRadius: 10, padding: '1px 7px', fontSize: '0.75rem',
                      }}>
                        {unreadCount}
                      </span>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>
                      Không có thông báo nào.
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        role="menuitem"
                        tabIndex={0}
                        onClick={() => handleNotifClick(n)}
                        onKeyDown={(e) => e.key === 'Enter' && handleNotifClick(n)}
                        style={{
                          padding: '15px',
                          borderBottom: '1px solid #f1f5f9',
                          cursor: 'pointer',
                          background: n.is_read ? 'transparent' : '#f0f9ff',
                          transition: 'background 0.2s',
                        }}
                        className="notif-item"
                      >
                        <div style={{ fontSize: '0.9rem', fontWeight: n.is_read ? 400 : 700 }}>
                          {n.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
                          {n.message}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 8 }}>
                          {new Date(n.created_at).toLocaleString('vi-VN')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          <Link
            to="/cart"
            className="crs-cart-icon-btn"
            title="Giỏ hàng"
            style={{ position: 'relative' }}
            aria-label={`Giỏ hàng${cartCount > 0 ? ` (${cartCount} sản phẩm)` : ''}`}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {/* User Menu | Login Buttons */}
          {user ? (
            <div className="crs-user-menu" ref={userMenuRef}>
              <button
                id="user-avatar-btn"
                className="crs-avatar-btn"
                onClick={() => setShowUserMenu((v) => !v)}
                aria-label="Tài khoản"
              >
                <span className="crs-avatar">{avatarLetter}</span>
              </button>

              {showUserMenu && (
                <div className="crs-dropdown" role="menu">
                  {/* Header dropdown */}
                  <div className="crs-dropdown-header">
                    <span className="crs-avatar lg">{avatarLetter}</span>
                    <div>
                      <p className="crs-dd-name">{displayName}</p>
                      <p className="crs-dd-email">{user.email}</p>
                    </div>
                  </div>
                  <div className="crs-dropdown-divider" />

                  <Link to="/profile"           className="crs-dd-item" onClick={() => setShowUserMenu(false)}>Hồ sơ</Link>
                  <Link to="/orders"            className="crs-dd-item" onClick={() => setShowUserMenu(false)}>Lịch sử giao dịch</Link>
                  <Link to="/wishlist"          className="crs-dd-item" onClick={() => setShowUserMenu(false)}>Khóa học yêu thích</Link>
                  <Link to="/accomplishments"   className="crs-dd-item" onClick={() => setShowUserMenu(false)}>Thành tích</Link>

                  {(user.is_instructor || user.is_staff) && (
                    <>
                      <div className="crs-dropdown-divider" />
                      <Link
                        to="/instructor"
                        className="crs-dd-item"
                        style={{ color: '#0056d2', fontWeight: 'bold' }}
                        onClick={() => setShowUserMenu(false)}
                      >
                        🎓 Dashboard Giảng viên
                      </Link>
                    </>
                  )}
                  {user.is_staff && (
                    <Link
                      to="/admin"
                      className="crs-dd-item"
                      style={{ color: '#dc2626', fontWeight: 'bold' }}
                      onClick={() => setShowUserMenu(false)}
                    >
                      🔧 Admin Monitoring
                    </Link>
                  )}

                  <div className="crs-dropdown-divider" />
                  <button className="crs-dd-item logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="crs-btn-outline">Đăng nhập</Link>
              <Link to="/login" className="crs-btn-solid">Tham gia miễn phí</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
