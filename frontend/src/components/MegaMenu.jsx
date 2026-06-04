/**
 * MegaMenu.jsx — EduVNU Navigation Mega Menu
 * Hiển thị khi hover vào nút "Khám phá".
 *
 * - Cột 1: Danh mục khóa học từ API (tối đa 8)
 * - Cột 2: Lọc theo trình độ học vấn
 * - Cột 3: Chương trình bằng cấp (tối đa 6)
 * - Footer: Link khóa học miễn phí + EduVNU PLUS
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function MegaMenu({ onClose }) {
  const [categories, setCategories] = useState([]);
  const [degrees, setDegrees]       = useState([]);

  useEffect(() => {
    api.get('/courses/categories/')
      .then((r) => setCategories((r.data.results || r.data || []).slice(0, 8)))
      .catch(() => {});

    api.get('/courses/degree-programs/')
      .then((r) => setDegrees((r.data.results || r.data || []).slice(0, 6)))
      .catch(() => {});
  }, []);

  const levels = [
    { label: 'Người mới bắt đầu', value: 'Người mới' },
    { label: 'Trung cấp',         value: 'Trung cấp' },
    { label: 'Tất cả các cấp độ', value: 'Tất cả trình độ' },
  ];

  return (
    <div className="mega-menu" onMouseLeave={onClose} role="navigation" aria-label="Mega menu khám phá">
      <div className="mega-menu-inner">
        {/* Cột 1 — Danh mục thực từ DB */}
        <div className="mega-col">
          <h4 className="mega-col-title">Danh mục khóa học</h4>
          <ul>
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/?category=${c.id}`} className="mega-item" onClick={onClose}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/" className="mega-see-all" onClick={onClose}>
            Xem tất cả →
          </Link>
        </div>

        {/* Cột 2 — Trình độ */}
        <div className="mega-col">
          <h4 className="mega-col-title">Trình độ học vấn</h4>
          <ul>
            {levels.map((lvl) => (
              <li key={lvl.value}>
                <Link to={`/?level=${lvl.value}`} className="mega-item" onClick={onClose}>
                  {lvl.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Cột 3 — Chương trình bằng cấp */}
        <div className="mega-col">
          <h4 className="mega-col-title">Chứng chỉ chuyên môn</h4>
          <ul>
            {degrees.map((d) => (
              <li key={d.id}>
                <Link
                  to="/degrees"
                  className="mega-item"
                  onClick={onClose}
                  style={{ lineHeight: 1.4, marginBottom: 8, display: 'block' }}
                >
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mega-footer">
        <span>Không chắc bắt đầu từ đâu?</span>
        <Link
          to="/?price_max=0"
          onClick={onClose}
          style={{ color: '#0056D2', fontWeight: 600, textDecoration: 'none', margin: '0 8px' }}
        >
          Duyệt các khóa học miễn phí
        </Link>
        <span>hoặc</span>
        <Link to="/plus" onClick={onClose} className="mega-plus-link">
          Tìm hiểu thêm về EduVNU <span className="plus-badge">PLUS</span>
        </Link>
      </div>
    </div>
  );
}
