import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, LogIn } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { loginSchema } from '@/lib/validations/auth.schemas';
import { Button }       from '@/components/ui/button';
import { Input }        from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormField, FormRoot } from '@/components/ui/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const { signIn } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [serverError, setServerError] = useState('');

  // Redirect destination after login (defaults to dashboard)
  const from = location.state?.from?.pathname ?? '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async ({ email, password }) => {
    setServerError('');
    const { error } = await signIn(email, password);

    if (error) {
      // Map Supabase error messages to friendlier copy
      if (error.message.toLowerCase().includes('invalid login')) {
        setServerError('Incorrect email or password. Please try again.');
      } else if (error.message.toLowerCase().includes('email not confirmed')) {
        setServerError('Please verify your email address before signing in.');
      } else {
        setServerError(error.message);
      }
      return;
    }

    navigate(from, { replace: true });
  };

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Welcome back</h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your lab&apos;s knowledge base
        </p>
      </div>

      {/* Server error */}
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <FormRoot onSubmit={handleSubmit(onSubmit)}>
        <FormField id="email" label="Email address" error={errors.email?.message} required>
          <Input
            id="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            autoFocus
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            {...register('email')}
          />
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message} required>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
        </FormField>

        {/* Forgot password link */}
        <div className="flex justify-end -mt-2">
          <Link
            to="/auth/forgot-password"
            className="text-xs text-primary hover:underline"
            id="forgot-password-link"
          >
            Forgot your password?
          </Link>
        </div>

        <Button
          type="submit"
          id="login-submit-btn"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LogIn className="h-4 w-4" />
          )}
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </FormRoot>

      {/* Register link */}
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <Link
          to="/auth/register"
          className="font-medium text-primary hover:underline"
          id="go-to-register-link"
        >
          Register your lab
        </Link>
      </p>
    </div>
  );
}
