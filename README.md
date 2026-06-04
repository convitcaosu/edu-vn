# 🎓 EduVNU — E-Learning Platform for VNU Students

<div align="center">

![EduVNU](https://img.shields.io/badge/EduVNU-E--Learning%20Platform-0056d2?style=for-the-badge&logo=bookstack&logoColor=white)
![React](https://img.shields.io/badge/React_18-Vite-61DAFB?style=flat-square&logo=react)
![Django](https://img.shields.io/badge/Django_6-REST_Framework-092E20?style=flat-square&logo=django)
![MSSQL](https://img.shields.io/badge/MS_SQL_Server-CC2927?style=flat-square&logo=microsoftsqlserver&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT_+_OAuth-black?style=flat-square&logo=jsonwebtokens)

**Nền tảng học trực tuyến dành cho sinh viên Đại học Quốc gia Việt Nam (VNU)**

[🚀 Tính năng](#tính-năng) · [🏗️ Kiến trúc](#kiến-trúc) · [📦 Cài đặt](#cài-đặt) · [🌐 API](#api-endpoints) · [⚡ Flow](#luồng-nghiệp-vụ) · [💡 Roadmap](#roadmap)

</div>

---

##  Giới thiệu

**EduVNU** (hay *EduHub*) là nền tảng e-learning full-stack được xây dựng để phục vụ sinh viên và giảng viên Đại học Quốc gia Việt Nam. Hệ thống hỗ trợ toàn bộ vòng đời học tập: từ đăng ký khóa học, thanh toán qua VNPAY/Stripe, học qua video YouTube, theo dõi tiến độ real-time, đến cấp chứng chỉ tự động.

---

##  Tính năng

| Nhóm | Chi tiết |
|------|----------|
|  **Auth** | Đăng ký / Đăng nhập, Google OAuth, JWT auto-refresh, reset mật khẩu qua email |
|  **Khóa học** | Danh sách, tìm kiếm, lọc theo danh mục / trình độ / giá, xem chi tiết |
|  **Bằng cấp** | Chương trình degree multi-module có video & tài liệu |
|  **Cart & Checkout** | Giỏ hàng, thanh toán VNPAY (IPN webhook) + Stripe |
|  **Tiến độ** | Heartbeat buffer ghi thời gian học vào RAM → flush 5 phút/lần vào DB |
|  **Chứng chỉ** | Tự động tạo certificate PDF + QR code khi hoàn thành khóa học |
|  **Thông báo** | Real-time notification bell (order paid / course approved / rejected) |
|  **Giảng viên** | Dashboard, tạo/quản lý khóa học, xem học viên, analytics doanh thu, rút tiền |
|  **Admin** | Duyệt khóa học, quản lý người dùng |

---

##  Kiến trúc

### Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| **Frontend** | React 18 + Vite, Vanilla CSS, Axios |
| **Backend** | Django 6 + Django REST Framework |
| **Database** | Microsoft SQL Server (production) |
| **Cache / Buffer** | Redis + In-memory Heartbeat Buffer |
| **Background Jobs** | Celery + Celery Beat |
| **Payment** | VNPAY (IPN webhook), Stripe (optional) |
| **Auth** | JWT (SimpleJWT) + Google OAuth 2.0 |
| **PDF / QR** | ReportLab + qrcode + Pillow |
| **Deploy** | Docker Compose (Nginx + Gunicorn) |

### System Architecture

```
┌─────────────────────────────────────────────────┐
│              CLIENT LAYER (Browser)              │
│   React 18 + Vite  ·  Vanilla CSS  ·  Axios    │
│                                                 │
│   App.jsx ── Router (4 route groups)           │
│   context/  ── Auth · Cart · Notification      │
│   pages/    ── 38 page components              │
│   api/axios.js ── JWT auto-refresh interceptor │
└───────────────────┬─────────────────────────────┘
                    │  REST API (JSON + JWT Bearer)
                    │  Base URL: /api/v1/
┌───────────────────▼─────────────────────────────┐
│              SERVER LAYER                        │
│   Django REST Framework                         │
│                                                 │
│   apps/accounts/ ── Auth, User Profile         │
│   apps/courses/  ── Courses, Lessons, Progress │
│   apps/cart/     ── Shopping Cart              │
│   apps/orders/   ── Orders, Payment, Webhook   │
└──────────┬──────────────────────────┬───────────┘
           │                          │
┌──────────▼──────────┐  ┌───────────▼────────────┐
│   MS SQL Server     │  │   Redis / RAM Buffer   │
│   (Primary DB)      │  │   (Heartbeat → Celery) │
└─────────────────────┘  └────────────────────────┘
```

### Cấu trúc thư mục

```
EDU/
├── frontend/
│   └── src/
│       ├── App.jsx                # Router + Layout Shell
│       ├── api/axios.js           # HTTP client (JWT interceptor)
│       ├── context/
│       │   ├── AppProviders.jsx   # Gom Auth → Cart → Notification
│       │   ├── AuthContext.jsx
│       │   ├── CartContext.jsx
│       │   └── NotificationContext.jsx
│       ├── components/            # Header, Footer, MegaMenu, ProtectedRoute...
│       └── pages/                 # 38 trang
│
├── backend/
│   ├── apps/
│   │   ├── accounts/              # User, Auth, Profile
│   │   ├── courses/               # Course, Lesson, Progress, Review
│   │   ├── cart/                  # Cart, CartItem
│   │   └── orders/                # Order, Payment, Webhook, Certificate
│   ├── core/                      # Django settings, URLs, WSGI
│   └── scripts/                   # Seed data, migration helpers
│
├── docker-compose.yml
├── database_schema_ssms.sql       # Schema MS SQL Server
└── docs/                          # Tài liệu kỹ thuật & case study
```

---

##  Luồng nghiệp vụ

###  Authentication Flow
```
User nhập credentials
  → POST /api/v1/accounts/login/
  → Backend trả { access, refresh, user }
  → Frontend lưu localStorage
  → AuthContext.setUser()
  → Redirect về trang đã truy cập trước đó (from state)

Token hết hạn (401):
  → Axios interceptor tự gọi /accounts/token/refresh/
  → Retry request gốc tự động
  → Nếu refresh cũng hết → logout + redirect /login
```

###  Enrollment & Payment Flow
```
1. Add to Cart      → POST /api/v1/cart/items/
2. View Cart        → GET  /api/v1/cart/my_cart/
3. Checkout         → POST /api/v1/orders/   (tạo Order pending)
4. Redirect VNPAY   → User thanh toán
5. VNPAY Webhook    → POST /api/v1/orders/webhook/
6. Backend xử lý:
     - Order.status = 'paid'
     - Tạo Enrollment (cấp quyền học)
     - Xóa CartItem
     - +InstructorWallet
     - Tạo Notification
7. Frontend /payment-return → hiển thị thành công
```

###  Learning & Heartbeat Flow
```
1. User vào /learn/:courseId (YouTube iframe)
2. Mỗi 30-60s: POST /api/v1/progress/heartbeat/ { lesson_id, seconds }
3. Backend: ghi vào RAM Buffer (không ghi thẳng SQL)
4. Celery Worker (mỗi 5 phút): flush Buffer → UserProgress DB
5. Hoàn thành 100% → Certificate tự động available
```

###  Instructor Lifecycle
```
Tạo khóa học → Thêm Chapter + Lesson
  → Submit review (status: pending)
  → Admin duyệt → status: published
  → Notification gửi Instructor
  → Học viên đăng ký → InstructorWallet +revenue
  → Instructor xem Analytics → Rút tiền
```

---

##  Cài đặt

### Yêu cầu hệ thống
- Node.js 18+
- Python 3.10+
- Microsoft SQL Server 2019+
- Docker & Docker Compose (tùy chọn)
- Redis (cho Celery)

### 1. Clone & Setup Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate           # Windows
pip install -r requirements.core.txt

# Cấu hình database
copy .env.example .env          # Điền DB_HOST, DB_NAME, DB_USER, DB_PASSWORD

# Migrate & chạy server
python manage.py migrate
python manage.py runserver
```

### 2. Setup Frontend

```bash
cd frontend
npm install
cp .env.example .env            # Điền VITE_API_URL=http://localhost:8000/api/v1
npm run dev
```

### 3. Chạy bằng Docker Compose

```bash
# Tạo .env từ template
copy backend\.env.example backend\.env

# Build & chạy
docker-compose up --build

# Truy cập:
# Frontend: http://localhost
# API:      http://localhost:8000/api/v1/
```

> **Lưu ý:** SQL Server chạy trên máy host (không trong Docker). Container kết nối qua `host.docker.internal:1433`.

---

##  API Endpoints

### Accounts `/api/v1/accounts/`
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/login/` | Đăng nhập → JWT |
| POST | `/register/` | Đăng ký tài khoản |
| POST | `/google-login/` | Google OAuth |
| POST | `/token/refresh/` | Refresh access token |
| GET / PATCH | `/users/me/` | Xem / Cập nhật profile |

### Courses `/api/v1/courses/`
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/courses/` | Danh sách (filter: category, level, q, price_max) |
| GET | `/courses/:id/` | Chi tiết khóa học |
| GET | `/courses/my_courses/` | Khóa học đã đăng ký (course + degree) |
| GET | `/categories/` | Danh mục |
| GET | `/degree-programs/` | Chương trình bằng cấp |
| GET | `/notifications/` | Thông báo của user |

### Orders `/api/v1/orders/`
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/` | Tạo đơn hàng mới |
| GET | `/` | Lịch sử giao dịch |
| POST | `/webhook/` | VNPAY IPN callback |

---

##  Core Data Model

| Entity | Mô tả |
|--------|-------|
| `User` | `is_student`, `is_instructor`, `is_staff` |
| `Course` | `status`: draft → pending → published / rejected |
| `Enrollment` | User ↔ Course (hoặc DegreeProgram) |
| `UserProgress` | User ↔ Lesson, `time_spent` (seconds) |
| `Order / OrderItem` | `status`: pending / paid / failed |
| `InstructorWallet` | balance, bank_info |
| `WalletTransaction` | Ledger: earning / withdrawal / refund |
| `Notification` | user, title, message, `is_read`, link |
| `Certificate` | enrollment, uuid, issued_at |
| `DegreeProgram` | curriculum (JSON), videos (JSON) |

---

##  Điểm mạnh

- ✅ **Full-stack hoàn chỉnh** — Frontend + Backend + DB + Deploy trong 1 repo
- ✅ **JWT auto-refresh** — Người dùng không bao giờ bị kick giữa session
- ✅ **Heartbeat Buffer** — Tối ưu write performance (RAM → DB flush theo batch)
- ✅ **Role-based Access Control** — Student / Instructor / Admin route protection
- ✅ **MSSQL Optimized** — Dùng `Exists()` subquery, `select_related`, `prefetch_related` để tránh N+1 và `.distinct()` + JOIN bug
- ✅ **Webhook-first Payment** — Cart chỉ bị xóa sau khi nhận IPN từ VNPAY (an toàn)
- ✅ **Docker Compose** — Deploy dễ dàng, Nginx proxy đến Django
- ✅ **Certificate system** — PDF + QR code tự động qua ReportLab
- ✅ **Celery background jobs** — Xử lý tác vụ nặng bất đồng bộ

---

##  Roadmap — Còn thiếu để đạt cấp Production

###  Bắt buộc (Critical)

| Hạng mục | Hiện trạng | Cần làm |
|----------|-----------|---------|
| **Testing** | Chỉ có unit test cơ bản | Integration test, E2E (Playwright/Cypress), coverage > 80% |
| **CI/CD Pipeline** | Chưa có | GitHub Actions: lint → test → build → deploy |
| **Environment Security** | `.env` chứa secrets | Dùng GitHub Secrets / Vault / AWS SSM |
| **HTTPS / SSL** | Chưa có | Certbot + Let's Encrypt (Nginx) hoặc Cloudflare |
| **Rate Limiting** | Chưa có | `django-ratelimit` hoặc Nginx `limit_req` |
| **Input Validation** | Partial | Validate đầu vào ở tất cả API, Serializer `validate_*` |

###  Quan trọng (Important)

| Hạng mục | Mô tả |
|----------|-------|
| **WebSocket / SSE** | Thông báo real-time thay vì polling |
| **Search nâng cao** | Tích hợp Elasticsearch / Meilisearch cho full-text search |
| **Media Storage** | Upload ảnh/video lên S3 / Cloudflare R2 thay vì local |
| **Email Templates** | Email HTML đẹp (đặt lại mật khẩu, xác nhận đơn hàng) |
| **Logging & Monitoring** | Sentry (errors) + Prometheus/Grafana (metrics) |
| **API Docs** | Swagger / drf-spectacular tự động generate |
| **Caching** | Redis cache cho API response phổ biến (course list, categories) |
| **Pagination** | Cursor-based pagination cho bảng lớn |

###  Nâng cao (Nice to have)

| Hạng mục | Mô tả |
|----------|-------|
| **Recommendation Engine** | Gợi ý khóa học dựa trên lịch sử học |
| **Mobile App** | React Native hoặc Flutter |
| **Live Session** | Tích hợp Zoom / Google Meet API |
| **Multi-language** | i18n: Tiếng Việt + English |
| **Accessibility** | WCAG 2.1 AA compliance |
| **PWA** | Service Worker, offline support |

---

##  Tài liệu kỹ thuật

| File | Nội dung |
|------|----------|
| [`SYSTEM_FLOWS.md`](./SYSTEM_FLOWS.md) | Kiến trúc hệ thống, luồng nghiệp vụ, API reference |
| [`AGENTS.md`](./AGENTS.md) | Quy tắc phát triển, tech gotchas, nhật ký thay đổi |
| [`database_schema_ssms.sql`](./database_schema_ssms.sql) | Schema SQL Server đầy đủ |
| [`docs/`](./docs/) | Case study, SRS, figma, hệ thống tiến độ |

---

##  Đóng góp

1. Fork repo
2. Tạo branch: `git checkout -b feature/ten-tinh-nang`
3. Commit: `git commit -m "feat: mô tả ngắn gọn"`
4. Push: `git push origin feature/ten-tinh-nang`
5. Tạo Pull Request

---

##  License

MIT License — © 2026 EduVNU Team / VNU

---

<div align="center">
  <sub>Built with love for VNU students · Stack: React + Django + MSSQL + Docker</sub>
</div>
