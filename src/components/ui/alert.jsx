import { cn } from '@/lib/utils';

/**
 * Alert component — used for inline error/success messages in forms.
 */
function Alert({ className, variant = 'default', ...props }) {
  return (
    <div
      role="alert"
      className={cn(
        'relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground',
        variant === 'destructive' &&
          'border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive',
        variant === 'success' &&
          'border-emerald-500/50 text-emerald-700 dark:text-emerald-400 [&>svg]:text-emerald-500',
        variant === 'default' && 'bg-background text-foreground',
        className
      )}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }) {
  return (
    <h5
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }) {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription };
