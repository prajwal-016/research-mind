import { supabase } from '@/lib/supabase';

/**
 * Auth service — wraps Supabase Auth methods.
 * All methods return { data, error } matching the Supabase response shape.
 */
export const authService = {
  /**
   * Sign in with email and password.
   * @param {string} email
   * @param {string} password
   */
  signIn: (email, password) =>
    supabase.auth.signInWithPassword({ email, password }),

  /**
   * Register a new user with optional metadata.
   * Supabase will send a confirmation email if email confirmation is enabled.
   * @param {string} email
   * @param {string} password
   * @param {{ full_name: string, institution?: string, position?: string }} metadata
   */
  signUp: (email, password, metadata = {}) =>
    supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    }),

  /**
   * Sign out the current user (clears session from storage).
   */
  signOut: () => supabase.auth.signOut(),

  /**
   * Get the current authenticated session (reads from local storage / cookie).
   */
  getSession: () => supabase.auth.getSession(),

  /**
   * Get the current authenticated user (re-verified against the server).
   */
  getUser: () => supabase.auth.getUser(),

  /**
   * Send a password reset email with a link that redirects to the reset page.
   * @param {string} email
   */
  resetPassword: (email) =>
    supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    }),

  /**
   * Update the current user's password (called from the reset-password page
   * after the user clicks the link in the reset email — session is active).
   * @param {string} newPassword
   */
  updatePassword: (newPassword) =>
    supabase.auth.updateUser({ password: newPassword }),

  /**
   * Resend the email verification / confirmation email.
   * @param {string} email
   */
  resendVerification: (email) =>
    supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/verify-email`,
      },
    }),

  /**
   * Update user metadata (e.g. display name, avatar).
   * @param {{ full_name?: string, avatar_url?: string }} metadata
   */
  updateProfile: (metadata) =>
    supabase.auth.updateUser({ data: metadata }),

  /**
   * Subscribe to auth state changes.
   * Events: SIGNED_IN, SIGNED_OUT, TOKEN_REFRESHED, USER_UPDATED, PASSWORD_RECOVERY
   * @param {(event: string, session: object | null) => void} callback
   * @returns {{ data: { subscription: { unsubscribe: () => void } } }}
   */
  onAuthStateChange: (callback) =>
    supabase.auth.onAuthStateChange(callback),
};
