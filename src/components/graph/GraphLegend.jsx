import { useState } from 'react';
import { HelpCircle, ChevronUp, ChevronDown } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

const LEGEND_ITEMS = [
  { value: 'researcher', label: 'Researcher', icon: 'Users', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  { value: 'project', label: 'Research Project', icon: 'FolderKanban', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { value: 'meeting', label: 'Lab Meeting', icon: 'MessageSquare', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
  { value: 'research_paper', label: 'Research Paper', icon: 'FileText', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  { value: 'experiment', label: 'Experiment', icon: 'FlaskConical', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  { value: 'dataset', label: 'Dataset', icon: 'Database', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
  { value: 'research_decision', label: 'Decision Log', icon: 'Lightbulb', color: 'bg-pink-500/20 text-pink-400 border-pink-500/30' },
  { value: 'publication', label: 'Publication', icon: 'Award', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
];

/**
 * GraphLegend — Floating legend detailing entity nodes, color keys, and icons.
 * Can be collapsed/expanded.
 */
export function GraphLegend() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="absolute bottom-4 left-4 z-10 bg-card/90 backdrop-blur-md border rounded-2xl shadow-xl w-60 select-none overflow-hidden transition-all duration-300">
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(p => !p)}
        className="flex items-center justify-between p-3.5 border-b border-border/40 cursor-pointer hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-foreground">Graph Legend</span>
        </div>
        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
      </div>

      {/* Body List */}
      {isExpanded && (
        <div className="p-3.5 space-y-2.5 max-h-72 overflow-y-auto">
          {LEGEND_ITEMS.map((item) => {
            const Icon = Icons[item.icon] || Icons.Brain;

            return (
              <div key={item.value} className="flex items-center gap-2.5">
                <div className={cn(
                  "p-1.5 rounded-lg border flex items-center justify-center shrink-0",
                  item.color
                )}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs text-foreground/80 font-medium">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default GraphLegend;
