import { Sparkles, History, Bookmark, Trash2, ChevronRight, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * QueryHistorySidebar — Left sidebar component for Suggested, Recent, and Saved Queries.
 * Provides micro-animations, clean layout, and scrollable areas.
 */
export function QueryHistorySidebar({
  suggestedQuestions = [],
  recentQueries = [],
  savedQueries = [],
  onSelectQuery,
  onClearRecent,
  onClearSaved,
  onRemoveRecentItem,
  onRemoveSavedItem
}) {
  return (
    <div className="w-80 h-full flex flex-col border-r bg-card/45 shrink-0 select-none">
      <ScrollArea className="flex-1">
        <div className="p-5 space-y-6">
          {/* Suggested Questions */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5 px-1">
              <HelpCircle className="w-3.5 h-3.5 text-primary" />
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => onSelectQuery(q)}
                  className="w-full text-left p-3 rounded-xl border bg-card/60 hover:bg-primary/5 hover:border-primary/20 transition-all text-xs font-medium text-foreground/80 hover:text-foreground flex items-start gap-2 group cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                  <span className="leading-normal">{q}</span>
                </button>
              ))}
            </div>
          </div>

          <hr className="border-border/40" />

          {/* Recent Queries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-blue-400" />
                Recent Queries
              </h4>
              {recentQueries.length > 0 && (
                <button
                  onClick={onClearRecent}
                  className="text-[10px] font-medium text-destructive hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {recentQueries.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 px-1 py-2 italic">
                No recent queries.
              </p>
            ) : (
              <div className="space-y-1.5">
                {recentQueries.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-muted/30 group transition-all text-xs cursor-pointer"
                    onClick={() => onSelectQuery(item.query)}
                  >
                    <span className="truncate pr-2 font-medium text-foreground/75 group-hover:text-foreground">
                      {item.query}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveRecentItem(item.query);
                      }}
                      className="opacity-0 group-hover:opacity-100 hover:text-destructive p-1 rounded transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <hr className="border-border/40" />

          {/* Saved Queries */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                Saved Memories
              </h4>
              {savedQueries.length > 0 && (
                <button
                  onClick={onClearSaved}
                  className="text-[10px] font-medium text-destructive hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              )}
            </div>

            {savedQueries.length === 0 ? (
              <p className="text-xs text-muted-foreground/60 px-1 py-2 italic">
                No saved memories.
              </p>
            ) : (
              <div className="space-y-2">
                {savedQueries.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => onSelectQuery(item.query)}
                    className="w-full text-left p-3 rounded-xl border bg-card/60 hover:bg-primary/5 hover:border-primary/20 transition-all group flex flex-col gap-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-semibold text-foreground/85 group-hover:text-foreground line-clamp-1">
                        {item.query}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveSavedItem(item.query);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive p-1 rounded transition-opacity cursor-pointer shrink-0 -mt-1 -mr-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <span className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.answer}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
