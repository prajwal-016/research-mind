import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useWatch } from 'react-hook-form';
import { Loader2, AlertCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { resetPasswordSchema } from '@/lib/validations/auth.schemas';
import { Button }        from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { FormField, FormRoot } from '@/components/ui/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthBar } from '@/components/auth/PasswordStrengthBar';

export default function ResetPasswordPage() {
  const { updatePassword, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess]         = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(resetPasswordSchema) });

  const watchedPassword = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async ({ password }) => {
    setServerError('');
    const { error } = await updatePassword(password);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/dashboard', { replace: true }), 2500);
  };

  // ── If the user is not authenticated, the reset link may be expired ───────
  if (!isAuthenticated) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10">
            <AlertCircle className="w-8 h-8 text-destructive" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Link expired</h2>
          <p className="text-sm text-muted-foreground">
            This password reset link has expired or is invalid. Please request a new one.
          </p>
        </div>
        <Button className="w-full" asChild>
          <Link to="/auth/forgot-password">Request new link</Link>
        </Button>
      </div>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Password updated!</h2>
          <p className="text-sm text-muted-foreground">
            Your password has been changed successfully. Redirecting you to the dashboard…
          </p>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-[progress_2.5s_ease-in-out_forwards]" />
        </div>
      </div>
    );
  }

  // ── Reset form ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Set new password</h2>
        <p className="text-sm text-muted-foreground">
          Choose a strong password for your account.
        </p>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FormRoot onSubmit={handleSubmit(onSubmit)}>
        <FormField
          id="password"
          label="New password"
          error={errors.password?.message}
          hint="At least 8 characters, one uppercase, one number"
          required
        >
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            autoFocus
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <PasswordStrengthBar password={watchedPassword} />
        </FormField>

        <FormField
          id="confirm_password"
          label="Confirm new password"
          error={errors.confirm_password?.message}
          required
        >
          <PasswordInput
            id="confirm_password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.confirm_password}
            {...register('confirm_password')}
          />
        </FormField>

        <Button
          type="submit"
          id="reset-password-submit-btn"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ShieldCheck className="h-4 w-4" />
          )}
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
      </FormRoot>
    </div>
  );
}
