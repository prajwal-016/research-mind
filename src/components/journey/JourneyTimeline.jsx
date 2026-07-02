import { JourneyCard } from './JourneyCard';
import { Brain, Sparkles } from 'lucide-react';

/**
 * JourneyTimeline — Renders the timeline container mapping journey cards along 
 * a vertical connecting vector path. Handles search highlights and dimming states.
 */
export function JourneyTimeline({
  events = [],
  searchQuery = '',
  onSelectEvent,
  onAskMemory
}) {
  if (!events || events.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-20 text-center border border-dashed rounded-2xl border-border/55 bg-card/10">
        <Sparkles className="h-12 w-12 text-muted-foreground/35 mb-4 animate-pulse" />
        <h3 className="text-base font-semibold text-muted-foreground/80">No research events found</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-normal">
          No activities match your filters. Try toggling other node types or checking another project timeline.
        </p>
      </div>
    );
  }

  const hasSearch = Boolean(searchQuery?.trim());

  return (
    <div className="relative pl-5 py-2 pr-1 select-none">
      {/* Vertical line connection */}
      <div className="absolute left-[24px] top-4 bottom-4 w-0.5 bg-gradient-to-b from-purple-500/30 via-indigo-500/20 to-purple-500/5 pointer-events-none" />

      {/* Cards list */}
      <div className="space-y-6">
        {events.map((event) => {
          const isDimmed = hasSearch && !event.isHighlighted;

          return (
            <JourneyCard
              key={event.id + '-' + event.type}
              event={event}
              onClick={() => onSelectEvent(event)}
              onAskMemory={onAskMemory}
              isDimmed={isDimmed}
            />
          );
        })}
      </div>
    </div>
  );
}
