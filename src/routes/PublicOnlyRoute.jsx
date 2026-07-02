import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * PublicOnlyRoute — prevents authenticated users from accessing auth pages
 * (login, register, forgot-password). Redirects them to the dashboard.
 *
 * During session loading we render nothing (the RootLayout spinner handles it).
 */
export function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth();

  // Let ProtectedRoute handle the loading state; just pass through here
  if (loading) return null;

  return isAuthenticated
    ? <Navigate to="/dashboard" replace />
    : <Outlet />;
}
