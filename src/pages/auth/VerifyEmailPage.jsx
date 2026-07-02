import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, AlertCircle, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { z } from 'zod';

import { authService } from '@/services/auth.service';
import { Button }  from '@/components/ui/button';
import { Input }   from '@/components/ui/input';
import { FormField, FormRoot } from '@/components/ui/form-field';
import { Alert, AlertDescription } from '@/components/ui/alert';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
});

export default function VerifyEmailPage() {
  const [serverError, setServerError] = useState('');
  const [resent, setResent]           = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async ({ email }) => {
    setServerError('');
    setResent(false);
    const { error } = await authService.resendVerification(email);

    if (error) {
      setServerError(error.message);
      return;
    }

    setResent(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Mail className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Verify your email</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Check your inbox for a verification link. If you didn&apos;t receive
            it, enter your email below to resend.
          </p>
        </div>
      </div>

      {/* Success banner */}
      {resent && (
        <Alert variant="success">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <AlertDescription className="text-emerald-700 dark:text-emerald-400">
            Verification email sent! Check your inbox.
          </AlertDescription>
        </Alert>
      )}

      {/* Error banner */}
      {serverError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* Resend form */}
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
          id="resend-verification-btn"
          className="w-full gap-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Mail className="h-4 w-4" />
          )}
          {isSubmitting ? 'Sending…' : 'Resend verification email'}
        </Button>
      </FormRoot>

      {/* Help text */}
      <div className="rounded-lg bg-muted/50 p-4 text-xs text-muted-foreground space-y-1">
        <p className="font-medium text-foreground">What to check:</p>
        <ul className="list-disc list-inside space-y-0.5">
          <li>Your spam or junk folder</li>
          <li>That you entered the correct email during sign-up</li>
          <li>The email may take a few minutes to arrive</li>
        </ul>
      </div>

      <Button variant="ghost" className="w-full gap-2 text-muted-foreground" asChild>
        <Link to="/auth/login" id="back-to-login-from-verify">
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </Button>
    </div>
  );
}
