import { ArrowRight, Brain, FileText, FlaskConical, Users, Lightbulb, Database, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * MemoryBreadcrumb — Renders a premium, interactive connection path representing the 
 * cognitive relationships discovered in Cognee.
 * @param {{ path: string[] }} props
 */
export function MemoryBreadcrumb({ path = [] }) {
  if (!path || path.length === 0) return null;

  // Icon selector based on words or phrases in the path step
  const getStepConfig = (step) => {
    const text = step.toLowerCase();
    if (text.includes('paper') || text.includes('preprint') || text.includes('publication')) {
      return { icon: FileText, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Paper' };
    }
    if (text.includes('experiment') || text.includes('hypothesis') || text.includes('trial')) {
      return { icon: FlaskConical, color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Experiment' };
    }
    if (text.includes('meeting') || text.includes('sync') || text.includes('discussion')) {
      return { icon: Users, color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Meeting' };
    }
    if (text.includes('decision') || text.includes('approved') || text.includes('rejected') || text.includes('strategic')) {
      return { icon: Lightbulb, color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'Decision' };
    }
    if (text.includes('dataset') || text.includes('metadata') || text.includes('repository')) {
      return { icon: Database, color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', label: 'Dataset' };
    }
    if (text.includes('award') || text.includes('grant') || text.includes('patent')) {
      return { icon: Award, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20', label: 'Publication' };
    }
    return { icon: Brain, color: 'text-muted-foreground bg-muted border-border', label: 'Memory' };
  };

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border bg-card/40 backdrop-blur-md border-purple-500/10">
      <div className="flex items-center gap-1.5 text-xs text-purple-400 font-semibold mb-1">
        <Brain className="w-3.5 h-3.5" />
        Cognitive Memory Path
      </div>
      <div className="flex flex-wrap items-center gap-y-3 gap-x-2">
        {path.map((step, idx) => {
          const config = getStepConfig(step);
          const StepIcon = config.icon;

          return (
            <div key={idx} className="flex items-center gap-2">
              {idx > 0 && <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />}
              
              <div 
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all duration-300 hover:scale-102",
                  config.color
                )}
                title={step}
              >
                <StepIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="max-w-[150px] truncate leading-none">{step}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
