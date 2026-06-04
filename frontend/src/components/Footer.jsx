/**
 * Footer.jsx — EduVNU Global Footer
 * Tách từ App.jsx để dễ maintain và update độc lập.
 *
 * Sections: Brand + Social | Học viên | Chăm sóc | Về chúng tôi
 * Copyright bar ở cuối.
 */

import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="crs-footer">
      <div className="crs-footer-inner">
        {/* Brand */}
        <div className="crs-footer-brand">
          <span
            className="crs-logo white"
            style={{ display: 'inline-flex', alignItems: 'center', marginLeft: '50px', marginBottom: '20px' }}
          >
            <img
              src="/course_images/eduvn.png"
              alt="EduVNU Logo"
              style={{ height: '120px', objectFit: 'contain', transform: 'scale(3.6)' }}
            />
          </span>
          <p>Nền tảng học trực tuyến hàng đầu Việt Nam</p>
          <div className="crs-footer-socials">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-icon facebook" aria-label="Facebook">f</a>
            <a href="https://youtube.com"  target="_blank" rel="noreferrer" className="social-icon youtube"   aria-label="YouTube">▶</a>
            <a href="https://twitter.com"  target="_blank" rel="noreferrer" className="social-icon twitter"   aria-label="Twitter/X">𝕏</a>
            <a href="#"                                                      className="social-icon instagram"  aria-label="Instagram">📷</a>
          </div>
        </div>

        {/* Học viên */}
        <div className="crs-footer-col">
          <h4>Học viên</h4>
          <Link to="/schedule">Việc học của tôi</Link>
          <Link to="/documents">Giáo trình</Link>
          <Link to="/orders">Lịch sử giao dịch</Link>
          <Link to="/cart">Giỏ hàng</Link>
        </div>

        {/* Chăm sóc khách hàng */}
        <div className="crs-footer-col">
          <h4>Chăm sóc khách hàng</h4>
          <Link to="/faq">Câu hỏi thường gặp (FAQ)</Link>
          <Link to="/policies">Chính sách hoàn trả</Link>
          <Link to="/policies">Chính sách bảo mật</Link>
          <Link to="/policies">Điều khoản sử dụng</Link>
        </div>

        {/* Về chúng tôi */}
        <div className="crs-footer-col">
          <h4>Về chúng tôi</h4>
          <Link to="/about">Giới thiệu</Link>
          <Link to="/career">Tuyển dụng</Link>
          <Link to="/contact">Trợ giúp &amp; Liên hệ</Link>
        </div>
      </div>

      <div className="crs-footer-bottom">
        <span>© {new Date().getFullYear()} EduVNU. All rights reserved.</span>
      </div>
    </footer>
  );
}
