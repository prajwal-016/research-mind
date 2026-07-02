import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';
import { useWatch } from 'react-hook-form';

import { useAuth } from '@/hooks/useAuth';
import { registerSchema } from '@/lib/validations/auth.schemas';
import { Button }          from '@/components/ui/button';
import { Input }           from '@/components/ui/input';
import { PasswordInput }   from '@/components/ui/password-input';
import { FormField, FormRoot } from '@/components/ui/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PasswordStrengthBar } from '@/components/auth/PasswordStrengthBar';

export default function RegisterPage() {
  const { signUp } = useAuth();
  const navigate   = useNavigate();
  const [serverError, setServerError] = useState('');
  const [registered, setRegistered]   = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  // Watch password to drive strength meter
  const watchedPassword = useWatch({ control, name: 'password', defaultValue: '' });

  const onSubmit = async ({ email, password, full_name, institution, position }) => {
    setServerError('');
    const { data, error } = await signUp(email, password, {
      full_name,
      institution,
      position,
    });

    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        setServerError('An account with this email already exists. Try signing in.');
      } else {
        setServerError(error.message);
      }
      return;
    }

    // Supabase returns a user even when email confirmation is required;
    // identities will be empty if email confirmation is pending.
    const needsVerification =
      data?.user && data.user.identities && data.user.identities.length === 0;

    if (needsVerification || !data?.session) {
      // Email confirmation is enabled — show success message
      setRegistered(true);
    } else {
      // Email confirmation is disabled — redirect directly
      navigate('/dashboard', { replace: true });
    }
  };

  // ── Success state (email confirmation pending) ────────────────────────────
  if (registered) {
    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10">
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Check your email</h2>
          <p className="text-sm text-muted-foreground">
            We&apos;ve sent a verification link to your inbox. Click the link to
            activate your account and get started.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Didn&apos;t receive an email?{' '}
          <Link
            to="/auth/verify-email"
            className="text-primary hover:underline font-medium"
          >
            Resend verification
          </Link>
        </p>
        <Button variant="outline" className="w-full" asChild>
          <Link to="/auth/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  // ── Registration form ─────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Create your lab</h2>
        <p className="text-sm text-muted-foreground">
          Set up your research lab&apos;s institutional memory
        </p>
      </div>

      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <FormRoot onSubmit={handleSubmit(onSubmit)}>
        {/* Full name */}
        <FormField id="full_name" label="Full name" error={errors.full_name?.message} required>
          <Input
            id="full_name"
            placeholder="Dr. Jane Smith"
            autoComplete="name"
            autoFocus
            aria-invalid={!!errors.full_name}
            {...register('full_name')}
          />
        </FormField>

        {/* Email */}
        <FormField id="email" label="Email address" error={errors.email?.message} required>
          <Input
            id="email"
            type="email"
            placeholder="you@university.edu"
            autoComplete="email"
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </FormField>

        {/* Institution + Position in a 2-col row */}
        <div className="grid grid-cols-2 gap-3">
          <FormField id="institution" label="Institution" error={errors.institution?.message}>
            <Input
              id="institution"
              placeholder="MIT"
              autoComplete="organization"
              {...register('institution')}
            />
          </FormField>
          <FormField id="position" label="Position" error={errors.position?.message}>
            <select
              id="position"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('position')}
            >
              <option value="">Select Position...</option>
              <option value="Professor">Professor</option>
              <option value="Associate Professor">Associate Professor</option>
              <option value="Assistant Professor">Assistant Professor</option>
              <option value="PI">Principal Investigator (PI)</option>
              <option value="Postdoctoral Researcher">Postdoctoral Researcher</option>
              <option value="PhD Student">PhD Student</option>
              <option value="PhD Research Scholar">PhD Research Scholar</option>
              <option value="Master's Student">Master's Student</option>
              <option value="Research Assistant">Research Assistant</option>
              <option value="Undergraduate Student">Undergraduate Student</option>
            </select>
          </FormField>
        </div>

        {/* Password */}
        <FormField
          id="password"
          label="Password"
          error={errors.password?.message}
          hint="At least 8 characters, one uppercase, one number"
          required
        >
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <PasswordStrengthBar password={watchedPassword} />
        </FormField>

        {/* Confirm password */}
        <FormField
          id="confirm_password"
          label="Confirm password"
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
          id="register-submit-btn"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <UserPlus className="h-4 w-4" />
          )}
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </FormRoot>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          to="/auth/login"
          className="font-medium text-primary hover:underline"
          id="go-to-login-link"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
