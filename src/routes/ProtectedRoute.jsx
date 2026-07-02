import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

/**
 * ProtectedRoute — route guard for authenticated sections.
 *
 * Behaviour:
 *  1. While the session is loading → show a full-screen spinner.
 *  2. Not authenticated          → redirect to /auth/login,
 *                                  preserving the intended destination in state.
 *  3. Authenticated, email not verified → redirect to /auth/verify-email.
 *  4. Authenticated + verified   → render child routes via <Outlet />.
 *
 * The destination is preserved via React Router location state so that
 * LoginPage can redirect back after a successful sign-in.
 */
export function ProtectedRoute() {
  const { isAuthenticated, isEmailVerified, loading } = useAuth();
  const location = useLocation();

  // ── 1. Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-5">
          {/* Animated logo */}
          <div className="relative flex items-center justify-center w-14 h-14">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
            <Brain className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground animate-pulse">
            Restoring session…
          </p>
        </div>
      </div>
    );
  }

  // ── 2. Not authenticated ────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/auth/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // ── 3. Email not verified ───────────────────────────────────────────────────
  // Skip this check in development if Supabase email confirmation is disabled.
  // Remove the `isEmailVerified` condition if you want to skip enforcement.
  if (!isEmailVerified) {
    return (
      <Navigate
        to="/auth/verify-email"
        state={{ from: location }}
        replace
      />
    );
  }

  // ── 4. Authenticated & verified ─────────────────────────────────────────────
  return <Outlet />;
}
