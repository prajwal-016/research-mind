import { Link, useParams, useNavigate } from 'react-router-dom';
import { X, ExternalLink, Brain, User, Sparkles, FolderKanban, Network, HelpCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

/**
 * InsightDetailsPanel — Renders the Right Sidebar content for the selected AI recommendation,
 * listing related projects, researchers, similar discoveries, and actions.
 */
export function InsightDetailsPanel({
  insight = null,
  onClose,
  onActionClick,
  onSave,
  isSaved = false
}) {
  const { labId } = useParams();
  const navigate = useNavigate();

  if (!insight) {
    return (
      <div className="w-72 h-full flex flex-col border-l bg-card/45 shrink-0 select-none">
        <div className="p-5 flex-1 flex flex-col items-center justify-center text-center text-muted-foreground/60">
          <Sparkles className="w-10 h-10 mx-auto text-muted-foreground/35 mb-2.5 animate-pulse" />
          <p className="text-xs font-semibold">No Recommendation Selected</p>
          <p className="text-[10px] mt-1">Select an AI Insight card to inspect related laboratory context.</p>
        </div>
      </div>
    );
  }

  const { title, summary, category, relatedEntities = [], reasoning } = insight;

  // Split related entities by type
  const projects = relatedEntities.filter(e => e.type === 'project');
  const researchers = relatedEntities.filter(e => e.type === 'researcher' || e.type === 'user');
  const others = relatedEntities.filter(e => e.type !== 'project' && e.type !== 'researcher' && e.type !== 'user');

  // Navigate to graph view
  const handleViewInGraph = () => {
    navigate(`/labs/${labId}/graph`);
  };

  // Pre-fill query in AI Search
  const handleAskMemory = () => {
    navigate(`/labs/${labId}/memory`, { state: { prefillQuery: `What is the laboratory context behind the AI insight: "${title}"?` } });
  };

  return (
    <div className="w-72 h-full flex flex-col border-l bg-card/45 shrink-0 select-none animate-in slide-in-from-right duration-200">
      
      {/* Header */}
      <div className="p-4 border-b border-border/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-foreground">Recommendation Context</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-7 w-7 rounded-lg">
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          
          {/* Selected Title */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider block">Active Selection</span>
            <h4 className="text-xs font-bold text-foreground leading-snug">{title}</h4>
          </div>

          <hr className="border-border/40" />

          {/* Related Projects */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <FolderKanban className="w-3.5 h-3.5 text-purple-400" />
              Related Projects
            </h5>
            {projects.length === 0 ? (
              <p className="text-[10px] text-muted-foreground/60 italic px-1">No directly connected projects.</p>
            ) : (
              <div className="space-y-1.5">
                {projects.map((p, idx) => (
                  <Link
                    key={idx}
                    to={`/labs/${labId}/projects/${p.id}`}
                    className="block p-2.5 rounded-xl border bg-card/50 hover:bg-primary/5 hover:border-primary/20 transition-all text-[11px] font-semibold text-foreground/80 hover:text-foreground line-clamp-1 truncate"
                  >
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <hr className="border-border/40" />

          {/* Related Researchers */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" />
              Related Researchers
            </h5>
            {researchers.length === 0 ? (
              <p className="text-[10px] text-muted-foreground/60 italic px-1">No specific researchers flagged.</p>
            ) : (
              <div className="space-y-1.5">
                {researchers.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border bg-card/50 border-border/30 text-[11px] font-semibold text-foreground/80 flex items-center justify-between"
                  >
                    <span>{r.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-border/40" />

          {/* Similar Discoveries / Other connections */}
          <div className="space-y-2.5">
            <h5 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Similar Discoveries
            </h5>
            {others.length === 0 ? (
              <p className="text-[10px] text-muted-foreground/60 italic px-1">No additional nodes linked.</p>
            ) : (
              <div className="space-y-1.5">
                {others.map((o, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border bg-card/50 border-border/30 text-[11px] font-semibold text-foreground/80 flex flex-col gap-0.5"
                  >
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground font-bold">{o.type}</span>
                    <span className="line-clamp-1 truncate" title={o.title}>{o.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </ScrollArea>

      {/* Slide-out Panel footer actions */}
      <div className="p-4 border-t border-border/40 bg-card flex flex-col gap-2">
        <Button
          variant="outline"
          size="sm"
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
export default InsightDetailsPanel;
