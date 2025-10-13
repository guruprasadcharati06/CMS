import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import PublicLayout from '../components/layouts/PublicLayout.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardLayout from '../components/layouts/DashboardLayout.jsx';

const LandingPage = lazy(() => import('../features/landing/LandingPage.jsx'));
const EventsListPage = lazy(() => import('../features/events/pages/EventsListPage.jsx'));
const EventDetailPage = lazy(() => import('../features/events/pages/EventDetailPage.jsx'));
const CreateEventPage = lazy(() => import('../features/events/pages/CreateEventPage.jsx'));
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage.jsx'));
const RegisterPage = lazy(() => import('../features/auth/pages/RegisterPage.jsx'));
const OrganizerDashboardPage = lazy(() => import('../features/dashboard/pages/OrganizerDashboardPage.jsx'));
const AdminApprovalPage = lazy(() => import('../features/dashboard/pages/AdminApprovalPage.jsx'));
const MyRegistrationsPage = lazy(() => import('../features/registrations/pages/MyRegistrationsPage.jsx'));
const NotificationsPage = lazy(() => import('../features/notifications/pages/NotificationsPage.jsx'));
const NotFoundPage = lazy(() => import('../features/misc/NotFoundPage.jsx'));

const SuspenseFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center text-slate-500">
    Loading experience...
  </div>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="events" element={<EventsListPage />} />
          <Route path="events/:eventId" element={<EventDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="dashboard" element={<OrganizerDashboardPage />} />
            <Route path="events/new" element={<CreateEventPage />} />
            <Route path="my-registrations" element={<MyRegistrationsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route element={<DashboardLayout />}>
            <Route path="admin/approvals" element={<AdminApprovalPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
