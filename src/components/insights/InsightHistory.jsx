import { Sparkles, Heart, History, Award, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CATEGORY_LABELS = {
  similar_experiments: 'Similar Experiments',
  duplicate_research: 'Duplicate Research',
  research_gaps: 'Research Gaps',
  recommended_papers: 'Recommended Papers',
  recommended_datasets: 'Recommended Datasets',
  potential_collaborators: 'Potential Collaborators',
  missing_references: 'Missing References',
  research_trends: 'Research Trends',
};

/**
 * InsightHistory — Left sidebar component managing Saved Insights, Recent Runs history,
 * and active category statistics.
 */
export function InsightHistory({
  categoryCounts = {},
  savedInsights = [],
  recentRuns = [],
  onSelectRun,
  onSelectSaved,
  onClearSaved,
  onRemoveSavedItem
}) {
  return (
    <div className="w-80 h-full flex flex-col border-r bg-card/45 shrink-0 select-none">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          
          {/* Active Categories Summary */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Layers className="w-3.5 h-3.5 text-primary" />
              Insight Categories
            </h4>
            <div className="space-y-1.5">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => {
                const count = categoryCounts[key] || 0;
                return (
                  <div
                    key={key}
                    className="flex items-center justify-between p-2 px-3 rounded-xl border border-border/30 bg-card/40 text-xs font-semibold text-foreground/80"
                  >
                    <span>{label}</span>
                    <Badge variant="outline" className={cn("h-5 text-[9.5px] px-1.5 font-bold border-border/30", count > 0 ? "bg-purple-500/10 text-purple-400 border-purple-500/20" : "bg-muted text-muted-foreground")}>
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Saved Insights */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-red-400 shrink-0" />
                Saved Recommendations
              </h4>
              {savedInsights.length > 0 && (
                <button
                  onClick={onClearSaved}
                  className="text-[10px] font-medium text-destructive hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {savedInsights.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 px-1 py-2 italic">
                No saved recommendations.
              </p>
            ) : (
              <div className="space-y-2">
                {savedInsights.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectSaved(item)}
                    className="w-full text-left p-3 rounded-xl border bg-card/60 hover:bg-primary/5 hover:border-primary/20 transition-all group flex flex-col gap-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-foreground/85 group-hover:text-foreground line-clamp-1">
                        {item.title}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSavedItem(item.title);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive p-1 rounded transition-opacity cursor-pointer shrink-0 -mt-1 -mr-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[10px] text-muted-foreground line-clamp-2 leading-normal">
                      {item.summary}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-border/40" />

          {/* Recent AI Analyses */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <History className="w-3.5 h-3.5 text-blue-400" />
              Recent AI Runs
            </h4>

            {recentRuns.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 px-1 py-2 italic">
                No recent analyses.
              </p>
            ) : (
              <div className="space-y-1.5">
                {recentRuns.map((run, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectRun(run.insights)}
                    className="w-full text-left p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 transition-all text-xs font-semibold text-muted-foreground hover:text-foreground flex items-center justify-between cursor-pointer"
                  >
                    <span>Run #{recentRuns.length - idx}</span>
                    <span className="text-[10px] font-medium opacity-65">
                      {new Date(run.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
export default InsightHistory;
