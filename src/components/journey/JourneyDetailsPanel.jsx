import { Link, useParams, useNavigate } from 'react-router-dom';
import { X, ExternalLink, Brain, Calendar, User, Info, Network, MessageSquare, ClipboardCheck, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * JourneyDetailsPanel — Slide-out side drawer displaying full details of clicked timeline events,
 * listing related nodes, parent project, and options to search in AI chat or view in the Memory Graph.
 */
export function JourneyDetailsPanel({
  event = null,
  onClose
}) {
  const { labId } = useParams();
  const navigate = useNavigate();

  if (!event) return null;

  const { title, type, description, date, researcher, status, raw } = event;

  // Format dates cleanly
  const dateFormatted = new Date(date).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Build the direct page path for the entity
  const getDetailPath = () => {
    switch (type) {
      case 'project':
        return `/labs/${labId}/projects/${raw.id}`;
      case 'experiment':
        return `/labs/${labId}/experiments/${raw.id}`;
      case 'research_paper':
        return `/labs/${labId}/knowledge?tab=papers`;
      case 'dataset':
        return `/labs/${labId}/knowledge?tab=datasets`;
      case 'meeting':
        return `/labs/${labId}/knowledge?tab=meetings`;
      case 'research_decision':
        return `/labs/${labId}/review`;
      case 'publication':
        return `/labs/${labId}/knowledge?tab=papers`;
      default:
        return null;
    }
  };

  const detailPath = getDetailPath();

  // Ask Institutional Memory pre-fill action
  const handleAskMemory = () => {
    navigate(`/labs/${labId}/memory`, { state: { prefillQuery: `What is the significance of the ${type} "${title}"?` } });
  };

  // View in Memory Graph action
  const handleViewInGraph = () => {
    navigate(`/labs/${labId}/graph`);
  };

  return (
    <div className="w-80 border-l bg-card/95 backdrop-blur-xl h-full flex flex-col shrink-0 select-none animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-foreground">Event Details</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 rounded-lg">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          
          {/* Main Info */}
          <div className="space-y-3">
            <Badge variant="outline" className="uppercase tracking-wider text-[9px] font-bold px-2.5 py-0.5 bg-primary/5 border-primary/15">
              {type.replace('_', ' ')}
            </Badge>

            <h3 className="text-sm font-bold text-foreground leading-tight" title={title}>
              {title}
            </h3>

            <p className="text-[11px] text-muted-foreground/80 leading-normal">
              {dateFormatted}
            </p>
          </div>

          <hr className="border-border/40" />

          {/* Details Grid */}
          <div className="space-y-3.5 text-xs">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
              Properties
            </h4>

            {/* Created At */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Calendar className="w-3.5 h-3.5" /> Date Logged
              </span>
              <span className="font-semibold text-foreground/85">{dateFormatted}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5" /> Event Status
              </span>
              <span className="font-semibold text-foreground/85 capitalize">{status || 'Completed'}</span>
            </div>

            {/* Author / Creator */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <User className="w-3.5 h-3.5" /> Logged By
              </span>
              <span className="font-semibold text-foreground/85 truncate max-w-[150px]" title={researcher}>
                {researcher}
              </span>
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Description Block */}
          <div className="space-y-2 text-xs">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
              Description / Notes
            </h4>
            <div className="p-3.5 rounded-xl border bg-muted/20 border-border/30">
              <p className="text-[11px] leading-relaxed text-muted-foreground font-medium whitespace-pre-wrap">
                {description}
              </p>
            </div>
          </div>
        </div>
      </ScrollArea>

      {/* Footer Quick Actions */}
      <div className="p-4 border-t border-border/40 bg-card flex flex-col gap-2">
        {detailPath && (
          <Button variant="outline" size="sm" className="w-full justify-center gap-1.5 text-xs font-semibold cursor-pointer" asChild>
            <Link to={detailPath}>
              <ExternalLink className="w-3.5 h-3.5" /> View Node Page
            </Link>
          </Button>
        )}

        <Button 
          variant="outline"
          onClick={handleViewInGraph}
          className="w-full justify-center gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <Network className="w-3.5 h-3.5" /> View Memory Graph
        </Button>

        <Button 
          onClick={handleAskMemory}
          className="w-full justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-200"
        >
          <Brain className="w-3.5 h-3.5" /> Ask Institutional Memory
        </Button>
      </div>
    </div>
  );
}
export default JourneyDetailsPanel;
