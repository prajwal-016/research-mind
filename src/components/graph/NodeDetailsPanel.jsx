import { Link, useParams, useNavigate } from 'react-router-dom';
import { X, ExternalLink, Brain, Calendar, User, Info, AlertTriangle, FileText, FlaskConical, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * NodeDetailsPanel — Slide-out side drawer displaying selected node metadata
 * and offering quick actions (Open Page, Ask Memory).
 */
export function NodeDetailsPanel({
  node = null,
  onClose,
  onOpenMemorySearch
}) {
  const { labId } = useParams();
  const navigate = useNavigate();

  if (!node) return null;

  const { title, type, status, subtitle, raw } = node.data;

  // Format dates cleanly
  const dateValue = raw.created_at || raw.scheduled_at || raw.published_date || raw.made_at || '';
  const dateFormatted = dateValue ? new Date(dateValue).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'N/A';

  // Description selector based on type
  const description = raw.description || raw.abstract || raw.hypothesis || raw.context || raw.rationale || 'No description available.';

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
    // Redirect to the Recall Center and pass the entity title as a search query parameter
    navigate(`/labs/${labId}/memory`, { state: { prefillQuery: `Tell me about ${type} "${title}"` } });
  };

  return (
    <div className="w-80 border-l bg-card/90 backdrop-blur-xl h-full flex flex-col shrink-0 select-none animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-foreground">Node Metadata</span>
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
              {subtitle}
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
                <Calendar className="w-3.5 h-3.5" /> Date
              </span>
              <span className="font-semibold text-foreground/85">{dateFormatted}</span>
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                <Info className="w-3.5 h-3.5" /> Status
              </span>
              <span className="font-semibold text-foreground/85 capitalize">{status || 'N/A'}</span>
            </div>

            {/* Author / Creator */}
            {(raw.created_by || raw.added_by || raw.full_name) && (
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground flex items-center gap-1.5 font-medium">
                  <User className="w-3.5 h-3.5" /> Owner
                </span>
                <span className="font-semibold text-foreground/85 truncate max-w-[150px]" title={raw.full_name || 'Lab Member'}>
                  {raw.full_name || 'Lab Member'}
                </span>
              </div>
            )}
          </div>

          <hr className="border-border/40" />

          {/* Description Block */}
          <div className="space-y-2 text-xs">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider">
              Description / Context
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
          onClick={handleAskMemory}
          className="w-full justify-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold cursor-pointer shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-200"
        >
          <Brain className="w-3.5 h-3.5" /> Ask Institutional Memory
        </Button>
      </div>
    </div>
  );
}
export default NodeDetailsPanel;
