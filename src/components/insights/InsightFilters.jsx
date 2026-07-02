import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const CATEGORY_FILTERS = [
  { value: 'similar_experiments', label: 'Similar Experiments' },
  { value: 'duplicate_research', label: 'Duplicate Research' },
  { value: 'research_gaps', label: 'Research Gaps' },
  { value: 'recommended_papers', label: 'Recommended Papers' },
  { value: 'recommended_datasets', label: 'Recommended Datasets' },
  { value: 'potential_collaborators', label: 'Potential Collaborators' },
  { value: 'missing_references', label: 'Missing References' },
  { value: 'research_trends', label: 'Research Trends' },
];

/**
 * InsightFilters — Filter toolbar for toggling categories and selecting projects/researchers.
 */
export function InsightFilters({
  selectedCategories = [],
  onToggleCategory,
  onResetFilters,
  projects = [],
  selectedProjectId = '',
  onSelectProject,
  researchers = [],
  selectedResearcherName = '',
  onSelectResearcher
}) {
  return (
    <div className="p-4 bg-card/90 backdrop-blur-md border rounded-2xl flex flex-wrap gap-4 items-center justify-between shadow-lg shadow-black/5 z-10 w-full select-none">
      
      {/* Category toggles */}
      <div className="flex flex-wrap items-center gap-1.5 flex-1 min-w-[300px]">
        <div className="flex items-center gap-1 text-xs font-semibold text-muted-foreground mr-1">
          <Filter className="w-3.5 h-3.5" />
          Filter:
        </div>
        {CATEGORY_FILTERS.map((cat) => {
          const isActive = selectedCategories.includes(cat.value);

          return (
            <button
              key={cat.value}
              onClick={() => onToggleCategory(cat.value)}
              className={cn(
                "px-2.5 py-1.5 rounded-xl border text-[10px] font-bold transition-all duration-200 cursor-pointer shadow-sm hover:scale-102",
                isActive 
                  ? "bg-primary border-primary text-primary-foreground shadow-primary/10" 
                  : "bg-muted/40 hover:bg-accent/40 border-border/40 text-muted-foreground hover:text-foreground"
              )}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Selectors */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Project Select */}
        <select
          value={selectedProjectId}
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
          value={selectedResearcherName}
          onChange={(e) => onSelectResearcher(e.target.value)}
          className="text-xs bg-muted/65 hover:bg-muted border border-border/40 rounded-xl px-3 py-1.5 font-medium outline-none focus:ring-1 focus:ring-purple-500/30 cursor-pointer transition-all"
        >
          <option value="">All Researchers</option>
          {researchers.map((r) => (
            <option key={r.id} value={r.full_name}>{r.full_name}</option>
          ))}
        </select>

        {/* Reset button */}
        {(selectedCategories.length < CATEGORY_FILTERS.length || selectedProjectId || selectedResearcherName) && (
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
export default InsightFilters;
