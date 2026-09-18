import { Navigate, Route, Routes } from 'react-router';
import type { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';
import AppLayout from '../layout/AppLayout';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import CoursesPage from '../pages/CoursesPage';
import CourseDetailPage from '../pages/CourseDetailPage';
import GradesPage from '../pages/GradesPage';
import StudentsPage from '../pages/StudentsPage';
import { Loading } from '../components/ui';

export default function AppRoutes() {
  const { user, booting } = useAuth();

  // Don't decide anything until the saved token has been checked, or a
  // refresh would bounce a logged-in user back to the login screen.
  if (booting) return <Loading label="Checking your session" />;

  if (!user) {
    return (
      <Routes>
        <Route path="*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="courses" element={<CoursesPage />} />
        <Route path="courses/:id" element={<CourseDetailPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route
          path="students"
          element={
            <AdminOnly>
              <StudentsPage />
            </AdminOnly>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

function AdminOnly({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();
  return isAdmin ? <>{children}</> : <Navigate to="/" replace />;
}
