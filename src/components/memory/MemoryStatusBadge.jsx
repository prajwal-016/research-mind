import { Brain, Check, AlertTriangle, Clock, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * MemoryStatusBadge — Shows whether an entity is synced to institutional memory.
 * @param {{ cogneeNodeId: string|null, isProcessing?: boolean }} props
 */
export function MemoryStatusBadge({ cogneeNodeId, isProcessing = false }) {
  if (isProcessing) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1 bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs cursor-help">
              <Loader2 className="w-3 h-3 animate-spin" />
              Syncing
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Syncing to institutional memory...</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  if (cogneeNodeId) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge variant="outline" className="gap-1 bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs cursor-help">
              <Brain className="w-3 h-3" />
              In Memory
            </Badge>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Stored in institutional memory graph</p>
            <p className="text-xs text-muted-foreground">Node: {cogneeNodeId}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="outline" className="gap-1 bg-muted text-muted-foreground border-border text-xs cursor-help">
            <Clock className="w-3 h-3" />
            Pending
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Not yet synced to institutional memory</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
