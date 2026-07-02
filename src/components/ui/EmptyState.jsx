import React from 'react';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/**
 * EmptyState — Reusable empty state view featuring modern centered layout,
 * clean typography, illustrative icons, and primary call-to-action buttons.
 */
export function EmptyState({
  title = "No items found",
  description = "Get started by creating your first entry in the workspace.",
  icon = "Inbox",
  actionText,
  onActionClick,
  className
}) {
  const Icon = Icons[icon] || Icons.Inbox;

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-12 border border-dashed rounded-2xl border-border/60 bg-card/20 select-none animate-fade-in",
      className
    )}>
      {/* Icon Frame */}
      <div className="p-4 bg-muted/40 text-muted-foreground/60 rounded-full mb-4 border border-border/20 shadow-inner">
        <Icon className="h-8 w-8 stroke-[1.5]" />
      </div>

      {/* Typography */}
      <h3 className="text-sm font-bold text-foreground tracking-tight">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-relaxed">
        {description}
      </p>

      {/* Primary CTA */}
      {actionText && onActionClick && (
        <Button
          onClick={onActionClick}
          className="mt-5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold px-4.5 rounded-xl shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-200 cursor-pointer"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}
export default EmptyState;
