import * as Icons from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const TYPE_CONFIG = {
  project: { icon: 'FolderKanban', color: 'text-purple-400 bg-purple-500/10 border-purple-500/20 shadow-purple-500/5', badge: 'Project' },
  experiment: { icon: 'FlaskConical', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20 shadow-blue-500/5', badge: 'Experiment' },
  research_paper: { icon: 'FileText', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 shadow-emerald-500/5', badge: 'Paper' },
  dataset: { icon: 'Database', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20 shadow-rose-500/5', badge: 'Dataset' },
  meeting: { icon: 'Users', color: 'text-sky-400 bg-sky-500/10 border-sky-500/20 shadow-sky-500/5', badge: 'Meeting' },
  research_decision: { icon: 'Lightbulb', color: 'text-pink-400 bg-pink-500/10 border-pink-500/20 shadow-pink-500/5', badge: 'Decision' },
  publication: { icon: 'Award', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20 shadow-violet-500/5', badge: 'Publication' },
};

/**
 * JourneyCard — Styled card representing a single event in the Research Journey timeline.
 * Supports query matching highlights, detailed meta, and action callbacks.
 */
export function JourneyCard({
  event,
  onClick,
  onAskMemory,
  isDimmed = false
}) {
  const { title, type, description, date, researcher, status, isHighlighted } = event;
  const config = TYPE_CONFIG[type] || { icon: 'Brain', color: 'text-muted-foreground bg-muted', badge: 'Memory' };
  const Icon = Icons[config.icon] || Icons.Brain;

  // Format date
  const dateFormatted = new Date(date).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Initials for avatar
  const initials = researcher
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div 
      onClick={onClick}
      className={cn(
        "relative flex gap-4 w-full text-left transition-all duration-300 select-none cursor-pointer group",
        isDimmed ? "opacity-35" : "opacity-100"
      )}
    >
      {/* Icon node positioned on the timeline line */}
      <div className={cn(
        "w-10 h-10 rounded-full border flex items-center justify-center shrink-0 z-10 transition-transform duration-300 group-hover:scale-105 shadow-md",
        config.color
      )}>
        <Icon className="w-4 h-4" />
      </div>

      {/* Main Event Card */}
      <Card className={cn(
        "flex-1 border bg-card/85 backdrop-blur-md rounded-2xl transition-all duration-300",
        isHighlighted 
          ? "border-purple-500 ring-2 ring-purple-500/10 shadow-purple-500/5 scale-101" 
          : "border-border/40 hover:border-purple-500/40 hover:shadow-lg hover:shadow-black/5"
      )}>
        <CardHeader className="pb-2.5 flex flex-row items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider font-bold py-0.5 px-2 bg-muted/60 border-border/30">
                {config.badge}
              </Badge>
              <span className="text-[10px] font-semibold text-muted-foreground">
                {dateFormatted}
              </span>
            </div>
            <h3 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug mt-1" title={title}>
              {title}
            </h3>
          </div>

          <Badge variant="outline" className="text-[9px] font-bold capitalize bg-primary/5 border-primary/10">
            {status?.replace('_', ' ') || 'Completed'}
          </Badge>
        </CardHeader>

        <CardContent className="pb-3 text-xs text-muted-foreground/85 font-medium leading-relaxed line-clamp-2" title={description}>
          {description}
        </CardContent>

        <CardFooter className="pt-2 border-t border-border/25 bg-muted/15 flex items-center justify-between rounded-b-2xl">
          {/* Researcher details */}
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6 border border-border/40">
              <AvatarFallback className="text-[9px] font-bold bg-primary/10 text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-[10px] font-semibold text-foreground/80 truncate max-w-[120px]">
              {researcher}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="xs"
              className="text-[10px] font-bold h-7 rounded-lg gap-1 hover:text-purple-400 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onAskMemory(title);
              }}
            >
              <Icons.Brain className="w-3 h-3" />
              Ask
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
