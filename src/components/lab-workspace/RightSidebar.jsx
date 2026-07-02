import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkles, History, Lightbulb, Zap, Loader2 } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { labsService } from '@/services/labs.service';
import { decisionsService } from '@/services/decisions.service';

const colorMap = {
  amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  blue: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  violet: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  info: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  success: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
};

export function RightSidebar() {
  const { labId } = useParams();
  const [insights, setInsights] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!labId) return;
      try {
        const [lab, decs] = await Promise.all([
          labsService.getLabById(labId),
          decisionsService.getDecisionsByLabId(labId)
        ]);
        
        if (lab?.settings?.ai_insights) {
          setInsights(lab.settings.ai_insights);
        }
        setDecisions((decs || []).slice(0, 3)); // Get top 3 decisions
      } catch (err) {
        console.error('Failed to fetch right sidebar data', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [labId]);

  return (
    <aside className="w-80 flex flex-col h-screen border-l bg-card/50 shrink-0 overflow-y-auto">
      <div className="p-5 space-y-8">
        
        {/* AI Insights */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold tracking-tight">AI Insights</h3>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : insights.length === 0 ? (
              <p className="text-xs text-muted-foreground">No insights generated yet.</p>
            ) : (
              insights.map(insight => {
                const colorClasses = colorMap[insight.priority] || colorMap.info;
                const containerClass = colorClasses.split(' ').pop();
                const iconClass = colorClasses.split(' ').slice(0, 2).join(' ');

                return (
                  <div key={insight.id} className={cn("p-3 rounded-xl border bg-card text-sm", containerClass)}>
                    <div className="flex gap-2">
                      <Sparkles className={cn("h-4 w-4 shrink-0 mt-0.5", iconClass.split(' ')[0])} />
                      <div className="space-y-1">
                        <p className="font-semibold">{insight.title}</p>
                        <p className="text-muted-foreground text-xs leading-relaxed">{insight.content}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        <Separator />

        {/* Recent Decisions */}
        <section className="space-y-3">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
            <h3 className="text-sm font-semibold tracking-tight">Recent Decisions</h3>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <div className="flex justify-center p-4"><Loader2 className="h-4 w-4 animate-spin text-muted-foreground" /></div>
            ) : decisions.length === 0 ? (
              <p className="text-xs text-muted-foreground">No recent decisions.</p>
            ) : (
              decisions.map(decision => (
                <div key={decision.id} className="p-3 rounded-lg border bg-card hover:border-primary/30 transition-colors cursor-pointer">
                  <p className="text-sm font-medium mb-1 line-clamp-2">{decision.title}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span className="truncate max-w-[120px]">{decision.made_by_user?.full_name || 'System'}</span>
                    <span>{new Date(decision.made_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </aside>
  );
}
