/**
 * App.jsx — EduVNU Application Root
 *
 * Chỉ chịu trách nhiệm:
 *  1. Routing (React Router v6)
 *  2. Layout shell (Header / main / Footer)
 *  3. Bảo vệ route bằng ProtectedRoute
 *
 * Mọi logic nghiệp vụ (Cart, Notification, Auth) đã được tách vào
 * các Context riêng biệt trong /context/.
 * Mọi UI block lớn (Header, Footer, MegaMenu) đã được tách vào /components/.
 *
 * ─── THÊM ROUTE MỚI ─────────────────────────────────────────────
 * 1. Import page mới.
 * 2. Thêm <Route> vào đúng nhóm (Public / Protected / Instructor / Admin).
 * 3. Nếu route cần login → bọc bằng <ProtectedRoute>.
 * ─────────────────────────────────────────────────────────────────
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

// ── Layout ──────────────────────────────────────────────────────
import Header        from './components/Header';
import Footer        from './components/Footer';
import ScrollToTop   from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';

// ── Context ──────────────────────────────────────────────────────
import AppProviders from './context/AppProviders';

// ── CSS ──────────────────────────────────────────────────────────
import './App.css';

// ═══════════════════════════════════════════════════════════════
// PAGES — PUBLIC
// ═══════════════════════════════════════════════════════════════
import Home           from './pages/Home';
import Auth           from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword  from './pages/ResetPassword';
import CourseDetail   from './pages/CourseDetail';
import Degrees        from './pages/Degrees';
import Contact        from './pages/Contact';
import FAQ            from './pages/FAQ';
import Policies       from './pages/Policies';
import About          from './pages/About';
import Careers        from './pages/Careers';
import EduVNUPlus     from './pages/EduVNUPlus';
import NotFound       from './pages/NotFound';

// ═══════════════════════════════════════════════════════════════
// PAGES — PROTECTED (yêu cầu đăng nhập)
// ═══════════════════════════════════════════════════════════════
import Profile        from './pages/Profile';
import Cart           from './pages/Cart';
import Checkout       from './pages/Checkout';
import PaymentReturn  from './pages/PaymentReturn';
import MockVNPay      from './pages/MockVNPay';
import StripeCheckout from './pages/StripeCheckout';
import Orders         from './pages/Orders';
import Learn          from './pages/Learn';
import Schedule       from './pages/Schedule';
import Documents      from './pages/Documents';
import Accomplishments from './pages/Accomplishments';
import Wishlist       from './pages/Wishlist';
import CertificateView from './pages/CertificateView';

// ═══════════════════════════════════════════════════════════════
// PAGES — INSTRUCTOR (yêu cầu is_instructor hoặc is_staff)
// ═══════════════════════════════════════════════════════════════
import InstructorLogin            from './pages/InstructorLogin';
import InstructorDashboard        from './pages/InstructorDashboard';
import InstructorCourseList       from './pages/InstructorCourseList';
import InstructorCreateCourse     from './pages/InstructorCreateCourse';
import InstructorCourseCurriculum from './pages/InstructorCourseCurriculum';
import InstructorStudents         from './pages/InstructorStudents';
import InstructorReviews          from './pages/InstructorReviews';
import InstructorFinance          from './pages/InstructorFinance';
import InstructorAnalytics        from './pages/InstructorAnalytics';
import InstructorSettings         from './pages/InstructorSettings';
import InstructorHelp             from './pages/InstructorHelp';

// ═══════════════════════════════════════════════════════════════
// PAGES — ADMIN (yêu cầu is_staff)
// ═══════════════════════════════════════════════════════════════
import AdminDashboard from './pages/AdminDashboard';


// ─────────────────────────────────────────────────────────────────
// AppLayout — Shell quyết định hiển thị Header/Footer hay không
// - Instructor portal (/instructor/*) + Admin (/admin): không có global Header/Footer
//   vì chúng có layout riêng của mình.
// ─────────────────────────────────────────────────────────────────
function AppLayout() {
  const location       = useLocation();
  const isInstructor   = location.pathname.startsWith('/instructor');
  const isAdmin        = location.pathname.startsWith('/admin');
  const isSpecialLayout = isInstructor || isAdmin;

  return (
    <div className="crs-app">
      {!isSpecialLayout && <Header />}

      <main className={isSpecialLayout ? '' : 'crs-main'}>
        <Routes>
          {/* ── PUBLIC ─────────────────────────────────────────── */}
          <Route path="/"                                  element={<Home />} />
          <Route path="/login"                             element={<Auth />} />
          <Route path="/forgot-password"                   element={<ForgotPassword />} />
          <Route path="/reset-password/:uidb64/:token"     element={<ResetPassword />} />
          <Route path="/course/:courseId"                  element={<CourseDetail />} />
          <Route path="/degrees"                           element={<Degrees />} />
          <Route path="/contact"                           element={<Contact />} />
          <Route path="/faq"                               element={<FAQ />} />
          <Route path="/policies"                          element={<Policies />} />
          <Route path="/about"                             element={<About />} />
          <Route path="/career"                            element={<Careers />} />
          <Route path="/plus"                              element={<EduVNUPlus />} />

          {/* ── PROTECTED — cần đăng nhập ───────────────────────── */}
          <Route path="/profile"          element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/cart"             element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout"         element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/payment-return"   element={<ProtectedRoute><PaymentReturn /></ProtectedRoute>} />
          <Route path="/mock-vnpay"       element={<ProtectedRoute><MockVNPay /></ProtectedRoute>} />
          <Route path="/stripe-checkout"  element={<ProtectedRoute><StripeCheckout /></ProtectedRoute>} />
          <Route path="/orders"           element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/learn/:courseId"  element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/schedule"         element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/documents"        element={<ProtectedRoute><Documents /></ProtectedRoute>} />
          <Route path="/accomplishments"  element={<ProtectedRoute><Accomplishments /></ProtectedRoute>} />
          <Route path="/wishlist"         element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
          <Route path="/certificate/:courseId" element={<ProtectedRoute><CertificateView /></ProtectedRoute>} />

          {/* ── INSTRUCTOR — cần is_instructor hoặc is_staff ──────── */}
          <Route path="/instructor/login"  element={<InstructorLogin />} />
          <Route path="/instructor"        element={<ProtectedRoute role="instructor"><InstructorDashboard /></ProtectedRoute>} />
          <Route path="/instructor/courses" element={<ProtectedRoute role="instructor"><InstructorCourseList /></ProtectedRoute>} />
          <Route path="/instructor/create-course" element={<ProtectedRoute role="instructor"><InstructorCreateCourse /></ProtectedRoute>} />
          <Route path="/instructor/course/:courseId/curriculum" element={<ProtectedRoute role="instructor"><InstructorCourseCurriculum /></ProtectedRoute>} />
          <Route path="/instructor/students"  element={<ProtectedRoute role="instructor"><InstructorStudents /></ProtectedRoute>} />
          <Route path="/instructor/reviews"   element={<ProtectedRoute role="instructor"><InstructorReviews /></ProtectedRoute>} />
          <Route path="/instructor/finance"   element={<ProtectedRoute role="instructor"><InstructorFinance /></ProtectedRoute>} />
          <Route path="/instructor/analytics" element={<ProtectedRoute role="instructor"><InstructorAnalytics /></ProtectedRoute>} />
          <Route path="/instructor/settings"  element={<ProtectedRoute role="instructor"><InstructorSettings /></ProtectedRoute>} />
          <Route path="/instructor/help"      element={<ProtectedRoute role="instructor"><InstructorHelp /></ProtectedRoute>} />

          {/* ── ADMIN — chỉ is_staff ──────────────────────────────── */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />

          {/* ── 404 ───────────────────────────────────────────────── */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isSpecialLayout && <Footer />}
    </div>
  );
}


// ─────────────────────────────────────────────────────────────────
// App Root
// ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppProviders>
        <AppLayout />
      </AppProviders>
    </BrowserRouter>
  );
}
