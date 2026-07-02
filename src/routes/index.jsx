import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { RootLayout }      from '@/layouts/RootLayout';
import { AppLayout }       from '@/layouts/AppLayout';
import { AuthLayout }      from '@/layouts/AuthLayout';
import { LabLayout }       from '@/layouts/LabLayout';
import { ProtectedRoute }  from '@/routes/ProtectedRoute';
import { PublicOnlyRoute } from '@/routes/PublicOnlyRoute';

// ─── Auth pages ───────────────────────────────────────────────────────────────
const LoginPage          = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage       = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage  = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage    = lazy(() => import('@/pages/auth/VerifyEmailPage'));

// ─── App pages ────────────────────────────────────────────────────────────────
const DashboardPage     = lazy(() => import('@/pages/DashboardPage'));
const LabsPage          = lazy(() => import('@/pages/LabsPage'));
const LabOverviewPage   = lazy(() => import('@/pages/LabOverviewPage'));
const ProjectsPage      = lazy(() => import('@/pages/projects/ProjectsPage'));
const ProjectDetailsPage= lazy(() => import('@/pages/projects/ProjectDetailsPage'));
const ExperimentsPage   = lazy(() => import('@/pages/experiments/ExperimentsPage'));
const ExperimentDetailsPage = lazy(() => import('@/pages/experiments/ExperimentDetailsPage'));
const KnowledgeBasePage = lazy(() => import('@/pages/KnowledgeBasePage'));
const PapersPage        = lazy(() => import('@/pages/PapersPage'));
const MeetingsPage      = lazy(() => import('@/pages/MeetingsPage'));
const AnalyticsPage     = lazy(() => import('@/pages/AnalyticsPage'));
const SettingsPage      = lazy(() => import('@/pages/SettingsPage'));
const ProfessorReviewPage = lazy(() => import('@/pages/ProfessorReviewPage'));
const NotFoundPage      = lazy(() => import('@/pages/NotFoundPage'));

// ─── Suspense fallback ────────────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex h-full min-h-64 items-center justify-center">
      <div className="h-7 w-7 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

function withSuspense(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [

      // ── Public auth routes (redirect to /dashboard if already signed in) ──
      {
        element: <PublicOnlyRoute />,
        children: [
          {
            element: <AuthLayout />,
            children: [
              { path: '/auth/login',           element: withSuspense(LoginPage) },
              { path: '/auth/register',        element: withSuspense(RegisterPage) },
              { path: '/auth/forgot-password', element: withSuspense(ForgotPasswordPage) },
            ],
          },
        ],
      },

      // ── Auth routes accessible regardless of sign-in state ────────────────
      {
        element: <AuthLayout />,
        children: [
          // Reset password — requires a valid recovery session (from the email link)
          { path: '/auth/reset-password', element: withSuspense(ResetPasswordPage) },
          // Verify email — accessible to users who registered but haven't verified yet
          { path: '/auth/verify-email',   element: withSuspense(VerifyEmailPage) },
        ],
      },

      // ── Protected app routes ──────────────────────────────────────────────
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { index: true,            element: <Navigate to="/dashboard" replace /> },
              { path: '/dashboard',     element: withSuspense(DashboardPage) },
              { path: '/labs',          element: withSuspense(LabsPage) },
              { path: '/knowledge-base',element: withSuspense(KnowledgeBasePage) },
              { path: '/papers',        element: withSuspense(PapersPage) },
              { path: '/experiments',   element: withSuspense(ExperimentsPage) },
              { path: '/meetings',      element: withSuspense(MeetingsPage) },
              { path: '/analytics',     element: withSuspense(AnalyticsPage) },
              { path: '/settings',      element: withSuspense(SettingsPage) },
            ],
          },
          // ── Lab Workspace layout (replaces AppLayout) ─────────────────────────
          {
            element: <LabLayout />,
            children: [
              { path: '/labs/:labId', element: withSuspense(LabOverviewPage) },
              { path: '/labs/:labId/research', element: withSuspense(ProjectsPage) },
              { path: '/labs/:labId/projects/:projectId', element: withSuspense(ProjectDetailsPage) },
              { path: '/labs/:labId/experiments', element: withSuspense(ExperimentsPage) },
              { path: '/labs/:labId/experiments/:experimentId', element: withSuspense(ExperimentDetailsPage) },
              { path: '/labs/:labId/knowledge', element: withSuspense(KnowledgeBasePage) },
              { path: '/labs/:labId/review', element: withSuspense(ProfessorReviewPage) },
              { path: '/labs/:labId/*', element: withSuspense(LabOverviewPage) }, // Catch-all for undefined workspace tabs
            ],
          },
        ],
      },

      // ── 404 ───────────────────────────────────────────────────────────────
      { path: '*', element: withSuspense(NotFoundPage) },
    ],
  },
]);
