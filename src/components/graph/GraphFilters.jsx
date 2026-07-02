import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const NODE_TYPES = [
  { value: 'researcher', label: 'Researchers', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5' },
  { value: 'project', label: 'Projects', color: 'border-purple-500/20 text-purple-400 bg-purple-500/5' },
  { value: 'meeting', label: 'Meetings', color: 'border-sky-500/20 text-sky-400 bg-sky-500/5' },
  { value: 'research_paper', label: 'Papers', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' },
  { value: 'experiment', label: 'Experiments', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5' },
  { value: 'dataset', label: 'Datasets', color: 'border-rose-500/20 text-rose-400 bg-rose-500/5' },
  { value: 'research_decision', label: 'Decisions', color: 'border-pink-500/20 text-pink-400 bg-pink-500/5' },
  { value: 'publication', label: 'Publications', color: 'border-violet-500/20 text-violet-400 bg-violet-500/5' },
];

/**
 * GraphFilters — Filter controls toolbar for toggling node types and resetting filters.
 */
export function GraphFilters({
  selectedTypes = [],
  onToggleType,
  onResetFilters,
  projects = [],
  selectedProject = '',
  onSelectProject,
  researchers = [],
  selectedResearcher = '',
  onSelectResearcher
}) {
  return (
    <div className="p-4 bg-card/90 backdrop-blur-md border rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-lg shadow-black/5 z-10 w-full select-none">
      
      {/* Node Type Toggles */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </div>
        {NODE_TYPES.map((t) => {
          const isActive = selectedTypes.includes(t.value);

          return (
            <button
              key={t.value}
              onClick={() => onToggleType(t.value)}
              className={cn(
                "px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-102",
                isActive 
                  ? "bg-primary border-primary text-primary-foreground shadow-primary/20" 
                  : cn("hover:bg-accent/40", t.color)
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Relational selectors */}
      <div className="flex items-center gap-3">
        {/* Project Select */}
        <select
          value={selectedProject}
          onChange={(e) => onSelectProject(e.target.value)}
          className="text-xs bg-muted/65 hover:bg-muted border border-border/40 rounded-xl px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-purple-500/30 cursor-pointer transition-all"
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Researcher Select */}
        <select
          value={selectedResearcher}
          onChange={(e) => onSelectResearcher(e.target.value)}
          className="text-xs bg-muted/65 hover:bg-muted border border-border/40 rounded-xl px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-purple-500/30 cursor-pointer transition-all"
        >
          <option value="">All Researchers</option>
          {researchers.map((r) => (
            <option key={r.id} value={r.id}>{r.full_name}</option>
          ))}
        </select>

        {/* Reset Filters button */}
        {(selectedTypes.length < NODE_TYPES.length || selectedProject || selectedResearcher) && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onResetFilters}
            className="h-8 w-8 text-muted-foreground hover:text-destructive rounded-xl cursor-pointer hover:bg-destructive/10 transition-colors"
            title="Reset Filters"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
export default GraphFilters;
