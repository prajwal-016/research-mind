import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authService } from '@/services/auth.service';

const AuthContext = createContext(null);

/**
 * AuthProvider — provides the current user, session, profile, and auth actions
 * to the entire application. Handles session restoration, state persistence,
 * and subscribes to Supabase Auth state changes.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);  // true until first session check resolves
  const [error, setError]     = useState(null);

  // ─── Session restoration & subscription ──────────────────────────────────────
  useEffect(() => {
    let mounted = true;

    // 1. Restore existing session on mount (reads from localStorage / cookie)
    authService.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      if (error) {
        console.error('[AuthContext] session restore error:', error.message);
        setError(error.message);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // 2. Subscribe to subsequent Supabase auth events
    //    (SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY)
    const {
      data: { subscription },
    } = authService.onAuthStateChange((event, session) => {
      if (!mounted) return;
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (event === 'SIGNED_OUT') {
        setError(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // ─── Auth actions ─────────────────────────────────────────────────────────────

  const signIn = useCallback(async (email, password) => {
    setError(null);
    const { data, error } = await authService.signIn(email, password);
    if (error) setError(error.message);
    return { data, error };
  }, []);

  const signUp = useCallback(async (email, password, metadata = {}) => {
    setError(null);
    const { data, error } = await authService.signUp(email, password, metadata);
    if (error) setError(error.message);
    return { data, error };
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    const { error } = await authService.signOut();
    if (error) setError(error.message);
    return { error };
  }, []);

  const resetPassword = useCallback(async (email) => {
    setError(null);
    const { data, error } = await authService.resetPassword(email);
    if (error) setError(error.message);
    return { data, error };
  }, []);

  const updatePassword = useCallback(async (newPassword) => {
    setError(null);
    const { data, error } = await authService.updatePassword(newPassword);
    if (error) setError(error.message);
    return { data, error };
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ─── Derived values ───────────────────────────────────────────────────────────
  const isAuthenticated   = !!user && !!session;
  const isEmailVerified   = user?.email_confirmed_at != null;
  const userMeta          = user?.user_metadata ?? {};
  const displayName       = userMeta.full_name ?? userMeta.name ?? user?.email?.split('@')[0] ?? '';
  const avatarUrl         = userMeta.avatar_url ?? null;

  const value = {
    // State
    user,
    session,
    loading,
    error,

    // Derived
    isAuthenticated,
    isEmailVerified,
    displayName,
    avatarUrl,

    // Actions
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth — consume the AuthContext.
 * @throws {Error} if used outside of an <AuthProvider>
 */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}

export { AuthContext };
