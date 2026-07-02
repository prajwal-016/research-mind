import React from 'react';
import { AlertTriangle, RefreshCw, ServerCrash, WifiOff, ShieldAlert, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * ErrorBoundaryPanel — Reusable interface wrapper for handling service errors,
 * server crashes, or API connectivity failures with retry triggers.
 */
export function ErrorBoundaryPanel({
  errorType = 'system', // 'network' | 'supabase' | 'cognee' | 'gemini' | 'system' | '404' | '403'
  title,
  message,
  onRetry,
  className
}) {
  
  // Resolve icon and display title based on error type
  const getErrorConfig = () => {
    switch (errorType) {
      case 'network':
        return {
          icon: WifiOff,
          title: title || 'Network Disconnected',
          message: message || 'Unable to reach laboratory database services. Please check your internet connection.',
          color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
        };
      case 'supabase':
        return {
          icon: ServerCrash,
          title: title || 'Supabase Query Error',
          message: message || 'Failed to fetch relational database tables. Relational schema check failed.',
          color: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
        };
      case 'cognee':
        return {
          icon: ShieldAlert,
          title: title || 'Cognee Memory Refusal',
          message: message || 'The Institutional Memory graph is unreachable. Semantic indexing operation timed out.',
          color: 'text-purple-500 bg-purple-500/10 border-purple-500/20'
        };
      case 'gemini':
        return {
          icon: Cpu,
          title: title || 'Gemini LLM Disconnect',
          message: message || 'Reasoning engine failed to synthesize results. Model generation parameters invalid.',
          color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20'
        };
      case '403':
        return {
          icon: ShieldAlert,
          title: title || '403 Forbidden Access',
          message: message || 'You do not have administrative clearance to access this lab workspace.',
          color: 'text-red-500 bg-red-500/10 border-red-500/20'
        };
      case '404':
        return {
          icon: AlertTriangle,
          title: title || '404 Not Found',
          message: message || 'The requested research node does not exist or has been pruned.',
          color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20'
        };
      default:
        return {
          icon: AlertTriangle,
          title: title || 'An unexpected error occurred',
          message: message || 'Something went wrong while executing this workflow command.',
          color: 'text-destructive bg-destructive/5 border-destructive/20'
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 border rounded-2xl bg-card/50 backdrop-blur-md max-w-md mx-auto select-none border-border/40 animate-fade-in",
      className
    )}>
      {/* Icon Frame */}
      <div className={cn("p-4.5 rounded-full mb-4 border flex items-center justify-center shadow-sm", config.color)}>
        <Icon className="h-7 w-7" />
      </div>

      {/* Typography */}
      <h3 className="text-sm font-bold text-foreground tracking-tight">{config.title}</h3>
      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
        {config.message}
      </p>

      {/* Action Retry button */}
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="mt-6 gap-2 text-xs font-semibold hover:bg-muted cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Retry Connection
        </Button>
      )}
    </div>
  );
}
export default ErrorBoundaryPanel;
