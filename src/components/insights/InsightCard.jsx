import { Sparkles, Calendar, CheckCircle2, XCircle, Brain, Eye, FileText, Network, Trash2, Heart } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORY_MAP = {
  similar_experiments: { label: 'Similar Experiment', color: 'bg-blue-500/10 text-blue-400 border-blue-500/25', icon: 'FlaskConical' },
  duplicate_research: { label: 'Duplicate Research', color: 'bg-amber-500/10 text-amber-400 border-amber-500/25', icon: 'AlertTriangle' },
  research_gaps: { label: 'Research Gap', color: 'bg-rose-500/10 text-rose-400 border-rose-500/25', icon: 'Flame' },
  recommended_papers: { label: 'Recommended Paper', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25', icon: 'FileText' },
  recommended_datasets: { label: 'Recommended Dataset', color: 'bg-teal-500/10 text-teal-400 border-teal-500/25', icon: 'Database' },
  potential_collaborators: { label: 'Potential Collaborator', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/25', icon: 'UserPlus' },
  missing_references: { label: 'Missing Reference', color: 'bg-pink-500/10 text-pink-400 border-pink-500/25', icon: 'Link' },
  research_trends: { label: 'Research Trend', color: 'bg-purple-500/10 text-purple-400 border-purple-500/25', icon: 'TrendingUp' },
};

/**
 * InsightCard — Premium card rendering proactive AI recommendations, reasoning metrics,
 * confidence scores, related entity links, and custom workflow action buttons.
 */
export function InsightCard({
  insight,
  onActionClick,
  onSave,
  onIgnore,
  isSaved = false
}) {
  const { title, summary, confidenceScore, reasoning, category, suggestedActions = [], relatedEntities = [], timestamp } = insight;

  const catConfig = CATEGORY_MAP[category] || { label: 'AI Insight', color: 'bg-purple-500/10 text-purple-400 border-purple-500/25', icon: 'Sparkles' };
  const CatIcon = Icons[catConfig.icon] || Icons.Sparkles;

  const confidencePercentage = Math.round(confidenceScore * 100);

  // Determine badge colors based on score
  const getScoreColor = (score) => {
    if (score >= 0.9) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
    if (score >= 0.75) return 'text-purple-400 border-purple-500/30 bg-purple-500/5';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/5';
  };

  // Maps action strings to specific Lucide icons
  const getActionIcon = (actionText) => {
    const text = actionText.toLowerCase();
    if (text.includes('experiment')) return Icons.FlaskConical;
    if (text.includes('paper')) return Icons.FileText;
    if (text.includes('graph')) return Icons.Network;
    if (text.includes('memory') || text.includes('ask')) return Icons.Brain;
    return Icons.ArrowUpRight;
  };

  return (
    <Card className="border border-border/40 bg-card/80 backdrop-blur-md rounded-2xl transition-all duration-300 hover:border-purple-500/40 hover:shadow-xl hover:shadow-black/5 flex flex-col h-full select-none group">
      
      {/* Header */}
      <CardHeader className="pb-3 flex flex-row items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("text-[9px] uppercase tracking-wider font-bold py-0.5 px-2.5 flex items-center gap-1.5", catConfig.color)}>
              <CatIcon className="w-3 h-3" />
              {catConfig.label}
            </Badge>
            <Badge variant="outline" className={cn("text-[9px] font-bold py-0.5 px-2", getScoreColor(confidenceScore))}>
              {confidencePercentage}% Conf
            </Badge>
          </div>
          
          <h3 className="text-sm font-bold text-foreground line-clamp-1 leading-snug" title={title}>
            {title}
          </h3>
        </div>

        {/* Save/Ignore Actions */}
        <div className="flex items-center gap-1.5 shrink-0 -mt-1 -mr-1">
          {onSave && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onSave}
              className={cn("h-8 w-8 rounded-lg cursor-pointer transition-colors", isSaved ? "text-red-400 hover:text-red-500" : "text-muted-foreground hover:text-red-400")}
              title={isSaved ? "Remove from Saved" : "Save Insight"}
            >
              <Heart className={cn("w-4 h-4", isSaved && "fill-current")} />
            </Button>
          )}
          {onIgnore && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onIgnore}
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-destructive cursor-pointer hover:bg-destructive/5"
              title="Ignore Insight"
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {/* Body Summary & Expandable Reasoning */}
      <CardContent className="pb-4 space-y-3.5 flex-1 text-xs">
        <p className="text-muted-foreground font-medium leading-relaxed">
          {summary}
        </p>

        {reasoning && (
          <div className="p-3 rounded-xl border bg-muted/15 border-border/30">
            <h5 className="text-[10px] font-bold text-foreground/80 uppercase tracking-wider mb-1 flex items-center gap-1">
              <Brain className="w-3 h-3 text-purple-400" />
              AI Reasoning
            </h5>
            <p className="text-[11px] leading-relaxed text-muted-foreground font-medium">
              {reasoning}
            </p>
          </div>
        )}

        {/* Related Entities list */}
        {relatedEntities.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <h5 className="text-[10px] font-bold text-muted-foreground/80 uppercase tracking-wider">Related Context</h5>
            <div className="flex flex-wrap gap-1">
              {relatedEntities.map((ent, idx) => (
                <Badge 
                  key={idx} 
                  variant="outline" 
                  className="text-[9px] font-medium py-0.5 px-2 bg-card/60 border-border/40 hover:border-purple-500/30 transition-colors"
                >
                  {ent.type}: {ent.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      {/* Footer Suggested Action Buttons */}
      {suggestedActions.length > 0 && (
        <CardFooter className="pt-3 border-t border-border/25 bg-muted/15 flex flex-wrap gap-1.5 rounded-b-2xl p-3">
          {suggestedActions.map((action, idx) => {
            const ActionIcon = getActionIcon(action);

            return (
              <Button
                key={idx}
                variant="ghost"
                size="xs"
                onClick={() => onActionClick(action, insight)}
                className="text-[10px] font-bold h-7.5 rounded-lg border border-border/40 bg-card hover:bg-primary/5 hover:border-primary/20 hover:text-primary transition-all cursor-pointer flex items-center gap-1.5"
              >
                <ActionIcon className="w-3 h-3 shrink-0" />
                {action}
              </Button>
            );
          })}
        </CardFooter>
      )}
    </Card>
  );
}
export default InsightCard;
