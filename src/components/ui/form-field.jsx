/**
 * Form field primitives that integrate React Hook Form with shadcn/ui.
 *
 * Usage:
 *   <FormField
 *     id="email"
 *     label="Email"
 *     error={errors.email?.message}
 *     required
 *   >
 *     <Input {...register('email')} />
 *   </FormField>
 */

import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

/**
 * FormField — wraps a label, input, and error message in a vertical stack.
 *
 * @param {{
 *   id: string,
 *   label: string,
 *   error?: string,
 *   hint?: string,
 *   required?: boolean,
 *   children: React.ReactNode,
 *   className?: string
 * }} props
 */
export function FormField({ id, label, error, hint, required, children, className }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      <Label
        htmlFor={id}
        className={cn(error && 'text-destructive')}
      >
        {label}
        {required && (
          <span className="ml-1 text-destructive" aria-hidden="true">
            *
          </span>
        )}
      </Label>

      {children}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}

      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-destructive flex items-center gap-1">
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

/**
 * FormRoot — thin wrapper around a <form> element with vertical spacing.
 */
export function FormRoot({ className, ...props }) {
  return (
    <form className={cn('space-y-5', className)} noValidate {...props} />
  );
}
