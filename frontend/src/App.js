import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardHome from './pages/dashboard/DashboardHome';
import MyCoursesPage from './pages/dashboard/MyCoursesPage';
import CourseUploadPage from './pages/dashboard/teacher/CourseUploadPage';
import TeacherStatsPage from './pages/dashboard/teacher/TeacherStatsPage';
import TeacherContactPage from './pages/dashboard/teacher/TeacherContactPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CoursesPage from './pages/courses/CoursesPage';
import CourseDetailPage from './pages/courses/CourseDetailPage';
import ConsultPage from './pages/consult/ConsultPage';
import ResourcesPage from './pages/resources/ResourcesPage';
import CartPage from './pages/cart/CartPage';
import LegalPage from './pages/legal/LegalPage';
import './App.css';

/**
 * 應用程式根元件
 * AuthProvider 包裹全域認證狀態
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />

            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardHome />} />
              <Route path="my-courses" element={<MyCoursesPage />} />

              {/* Teacher Routes */}
              <Route path="course-upload" element={<CourseUploadPage />} />
              <Route path="statistics" element={<TeacherStatsPage />} />
              <Route path="contact" element={<TeacherContactPage />} />

              {/* Placeholders for other routes */}
              <Route path="history" element={<div style={{ padding: 24 }}>購課記錄 (Coming Soon)</div>} />
              <Route path="consult" element={<div style={{ padding: 24 }}>一對一諮詢 (Coming Soon)</div>} />
              <Route path="profile" element={<div style={{ padding: 24 }}>個人簡介 (Coming Soon)</div>} />
              <Route path="resources" element={<div style={{ padding: 24 }}>資源分享 (Coming Soon)</div>} />
              <Route path="settings" element={<div style={{ padding: 24 }}>設定 (Coming Soon)</div>} />
            </Route>

            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/consult" element={<ConsultPage />} />
            <Route path="/resources" element={<ResourcesPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/legal/:type" element={<LegalPage />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
