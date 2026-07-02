import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { forgotPasswordSchema } from '@/lib/validations/auth.schemas';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { FormField, FormRoot } from '@/components/ui/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function ForgotPasswordPage() {
  const { resetPassword } = useAuth();
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted]     = useState(false);
  const [sentTo, setSentTo]           = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async ({ email }) => {
    setServerError('');
    const { error } = await resetPassword(email);

    if (error) {
      setServerError(error.message);
      return;
    }

    setSentTo(email);
    setSubmitted(true);
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Reset link sent</h2>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to{' '}
            <span className="font-medium text-foreground">{sentTo}</span>.
            Check your inbox and follow the instructions.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          The link expires in 1 hour. Didn&apos;t receive it?{' '}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={() => {
              setSubmitted(false);
              setServerError('');
            }}
          >
            Try again
          </button>
        </p>
        <Button variant="outline" className="w-full gap-2" asChild>
          <Link to="/auth/login">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </Button>
      </div>
    );
  }

  // ── Request form ──────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Forgot password?</h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FormRoot onSubmit={handleSubmit(onSubmit)}>
        <FormField id="email" label="Email address" error={errors.email?.message} required>
          <Input
            id="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            autoFocus
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </FormField>

        <Button
          type="submit"
          id="forgot-submit-btn"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isSubmitting ? 'Sending…' : 'Send reset link'}
        </Button>
      </FormRoot>

      <Button
        variant="ghost"
        className="w-full gap-2 text-muted-foreground"
        asChild
      >
        <Link to="/auth/login" id="back-to-login-link">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </Button>
    </div>
  );
}
