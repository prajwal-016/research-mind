import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * ResearchNode — Custom styled node for React Flow canvas.
 * Implements glassmorphism, responsive status dots, and styled icons.
 */
export const ResearchNode = memo(({ data, selected }) => {
  const IconComponent = Icons[data.icon] || Icons.Brain;
  const isPulsingStatus = ['running', 'online', 'active'].includes(data.status?.toLowerCase());

  // Status dot color mapping
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'online':
      case 'running':
      case 'active':
      case 'published':
      case 'accepted':
        return 'bg-emerald-500';
      case 'draft':
      case 'submitted':
      case 'under_review':
        return 'bg-amber-500';
      case 'cancelled':
      case 'rejected':
      case 'failed':
        return 'bg-rose-500';
      default:
        return 'bg-muted-foreground/60';
    }
  };

  return (
    <div className="relative group">
      {/* Target handle on top */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-2.5 h-2.5 !bg-primary/60 border-2 !border-background hover:scale-125 transition-transform"
      />

      {/* Main card */}
      <div
        className={cn(
          "w-60 p-4 rounded-xl border bg-card/85 backdrop-blur-md shadow-lg transition-all duration-300 flex flex-col gap-2 select-none",
          selected 
            ? "border-purple-500 ring-2 ring-purple-500/20 shadow-purple-500/10 scale-102" 
            : "border-border/40 hover:border-purple-500/40 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-0.5"
        )}
      >
        {/* Header containing icon and type badge */}
        <div className="flex items-center justify-between gap-3">
          <div className={cn(
            "p-2 rounded-lg bg-gradient-to-br border shrink-0",
            data.colorClasses
          )}>
            <IconComponent className="w-4 h-4" />
          </div>
          
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 px-2 py-0.5 rounded-full bg-muted/50 border border-border/30">
            {data.type.replace('_', ' ')}
          </span>
        </div>

        {/* Title and subtitle */}
        <div className="space-y-1 mt-1">
          <h4 className="text-xs font-bold text-foreground line-clamp-1 leading-snug" title={data.title}>
            {data.title}
          </h4>
          <p className="text-[10px] text-muted-foreground/80 line-clamp-1 truncate" title={data.subtitle}>
            {data.subtitle}
          </p>
        </div>

        {/* Bottom footer bar containing status */}
        <div className="flex items-center justify-between mt-1 pt-2 border-t border-border/30">
          <span className="text-[9px] text-muted-foreground font-medium">Status</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-semibold text-foreground/80 capitalize">
              {data.status?.replace('_', ' ') || 'Unknown'}
            </span>
            <span className="relative flex h-2 w-2">
              {isPulsingStatus && (
                <span className={cn(
                  "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
                  getStatusColor(data.status)
                )} />
              )}
              <span className={cn(
                "relative inline-flex rounded-full h-2 w-2",
                getStatusColor(data.status)
              )} />
            </span>
          </div>
        </div>
      </div>

      {/* Source handle on bottom */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-2.5 h-2.5 !bg-primary/60 border-2 !border-background hover:scale-125 transition-transform"
      />
    </div>
  );
});

ResearchNode.displayName = 'ResearchNode';
