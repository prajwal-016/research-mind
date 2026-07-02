import { Filter, Calendar, Award, CheckCircle2, Circle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

const EVENT_TYPE_FILTERS = [
  { value: 'project', label: 'Projects', color: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' },
  { value: 'experiment', label: 'Experiments', color: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' },
  { value: 'research_paper', label: 'Papers', color: 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20' },
  { value: 'dataset', label: 'Datasets', color: 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' },
  { value: 'meeting', label: 'Meetings', color: 'bg-sky-500/10 text-sky-400 hover:bg-sky-500/20' },
  { value: 'research_decision', label: 'Decisions', color: 'bg-pink-500/10 text-pink-400 hover:bg-pink-500/20' },
  { value: 'publication', label: 'Publications', color: 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20' },
];

/**
 * JourneyFilters — Sidebar filter dashboard containing Project select,
 * Date Range toggles, and Milestones accomplished overview.
 */
export function JourneyFilters({
  projects = [],
  selectedProjectId = '',
  onSelectProject,
  dateRange = 'all',
  onSelectDateRange,
  selectedTypes = [],
  onToggleType,
  milestones = []
}) {
  return (
    <div className="w-80 h-full flex flex-col border-r bg-card/45 shrink-0 select-none">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          
          {/* Projects Select */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Filter className="w-3.5 h-3.5 text-primary" />
              Focus Project
            </h4>
            <select
              value={selectedProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className="text-xs bg-muted/65 hover:bg-muted border border-border/40 rounded-xl px-3.5 py-2 font-semibold outline-none focus:ring-1 focus:ring-purple-500/30 w-full cursor-pointer transition-all"
            >
              <option value="">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <hr className="border-border/40" />

          {/* Date Range Select */}
          <div className="space-y-2">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              Date Window
            </h4>
            <div className="grid grid-cols-3 gap-1 bg-muted/50 p-1 border rounded-xl">
              {['all', 'quarter', 'month'].map((r) => (
                <button
                  key={r}
                  onClick={() => onSelectDateRange(r)}
                  className={cn(
                    "text-[10px] py-1.5 px-2 rounded-lg font-bold capitalize transition-all cursor-pointer",
                    dateRange === r 
                      ? "bg-card shadow-sm text-foreground" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {r === 'all' ? 'All time' : r === 'quarter' ? 'Last 3m' : 'Last 1m'}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Entity Type Filter Pills */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider px-1">
              Entity Timeline Types
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_TYPE_FILTERS.map((t) => {
                const isActive = selectedTypes.includes(t.value);

                return (
                  <button
                    key={t.value}
                    onClick={() => onToggleType(t.value)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all cursor-pointer shadow-sm",
                      isActive 
                        ? "bg-primary border-primary text-primary-foreground shadow-primary/10" 
                        : cn("border-border/30", t.color)
                    )}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Milestones achieved */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold text-muted-foreground/80 uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Award className="w-3.5 h-3.5 text-primary" />
              Journey Milestones
            </h4>
            <div className="space-y-2">
              {milestones.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-2.5 p-3 rounded-xl border bg-card/50 border-border/30"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <Circle className="w-4 h-4 text-muted-foreground/40 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <p className={cn(
                      "text-xs font-semibold leading-tight",
                      item.completed ? "text-foreground" : "text-muted-foreground/70"
                    )}>
                      {item.label}
                    </p>
                    {item.completed && item.date && (
                      <p className="text-[9px] text-muted-foreground font-semibold">
                        Completed: {new Date(item.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </ScrollArea>
    </div>
  );
}
export default JourneyFilters;
