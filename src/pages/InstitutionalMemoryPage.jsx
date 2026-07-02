import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Brain, Loader2, Sparkles, AlertCircle, Bookmark, BookmarkCheck, RefreshCw, Calendar, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { QueryHistorySidebar } from '@/components/memory/QueryHistorySidebar';
import { RelatedEntitiesSidebar } from '@/components/memory/RelatedEntitiesSidebar';
import { MemoryBreadcrumb } from '@/components/memory/MemoryBreadcrumb';
import { useMemory } from '@/hooks/useMemory';
import { toast } from 'sonner';

const SUGGESTED_QUESTIONS = [
  'Why was GraphRAG abandoned?',
  'Which experiments improved Dataset V3?',
  'Who worked on Hybrid Retrieval?',
  'Which publication resulted from Experiment #2?',
  'Have we attempted something similar before?'
];

export default function InstitutionalMemoryPage() {
  const { labId } = useParams();
  const { recall, isLoading, error } = useMemory();

  // Search state
  const [query, setQuery] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [activeResult, setActiveResult] = useState(null);

  // localStorage history states
  const [recentQueries, setRecentQueries] = useState([]);
  const [savedQueries, setSavedQueries] = useState([]);

  const inputRef = useRef(null);

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const recent = localStorage.getItem(`rm_recent_${labId}`);
      if (recent) setRecentQueries(JSON.parse(recent));

      const saved = localStorage.getItem(`rm_saved_${labId}`);
      if (saved) setSavedQueries(JSON.parse(saved));
    } catch (e) {
      console.error('Failed to load query history', e);
    }
  }, [labId]);

  // Execute query handler
  const handleSearch = useCallback(async (searchQuery) => {
    const trimmed = searchQuery?.trim() || query.trim();
    if (!trimmed || isLoading) return;

    setQuery(trimmed);
    setActiveQuery(trimmed);
    setActiveResult(null);

    try {
      const response = await recall(trimmed);
      setActiveResult(response);

      // Add to recent queries (maximum 10, no duplicates)
      setRecentQueries((prev) => {
        const filtered = prev.filter((q) => q.query.toLowerCase() !== trimmed.toLowerCase());
        const updated = [{ query: trimmed, timestamp: new Date().toISOString() }, ...filtered].slice(0, 10);
        localStorage.setItem(`rm_recent_${labId}`, JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      toast.error('Failed to recall memory');
    }
  }, [query, isLoading, recall, labId]);

  // Click handler for sidebar selections
  const handleSelectQuery = useCallback((selectedQuery) => {
    // If it's in saved queries, load it instantly
    const saved = savedQueries.find((s) => s.query.toLowerCase() === selectedQuery.toLowerCase());
    if (saved) {
      setQuery(saved.query);
      setActiveQuery(saved.query);
      setActiveResult(saved.result);
      toast.success('Loaded saved memory response');
      return;
    }

    // Otherwise trigger a live search
    setQuery(selectedQuery);
    handleSearch(selectedQuery);
  }, [savedQueries, handleSearch]);

  // Saved queries toggler (Bookmark)
  const handleToggleSave = useCallback(() => {
    if (!activeQuery || !activeResult) return;

    const isAlreadySaved = savedQueries.some((s) => s.query.toLowerCase() === activeQuery.toLowerCase());

    if (isAlreadySaved) {
      // Remove
      setSavedQueries((prev) => {
        const updated = prev.filter((s) => s.query.toLowerCase() !== activeQuery.toLowerCase());
        localStorage.setItem(`rm_saved_${labId}`, JSON.stringify(updated));
        return updated;
      });
      toast.success('Memory removed from saved items');
    } else {
      // Save
      setSavedQueries((prev) => {
        const newItem = {
          query: activeQuery,
          answer: activeResult.answer.slice(0, 150) + (activeResult.answer.length > 150 ? '...' : ''),
          result: activeResult,
          timestamp: new Date().toISOString()
        };
        const updated = [newItem, ...prev];
        localStorage.setItem(`rm_saved_${labId}`, JSON.stringify(updated));
        return updated;
      });
      toast.success('Memory bookmarked successfully');
    }
  }, [activeQuery, activeResult, savedQueries, labId]);

  // Clear history callbacks
  const handleClearRecent = useCallback(() => {
    setRecentQueries([]);
    localStorage.removeItem(`rm_recent_${labId}`);
    toast.success('Recent query history cleared');
  }, [labId]);

  const handleClearSaved = useCallback(() => {
    setSavedQueries([]);
    localStorage.removeItem(`rm_saved_${labId}`);
    toast.success('Saved memories cleared');
  }, [labId]);

  const handleRemoveRecentItem = useCallback((itemQuery) => {
    setRecentQueries((prev) => {
      const updated = prev.filter((item) => item.query !== itemQuery);
      localStorage.setItem(`rm_recent_${labId}`, JSON.stringify(updated));
      return updated;
    });
  }, [labId]);

  const handleRemoveSavedItem = useCallback((itemQuery) => {
    setSavedQueries((prev) => {
      const updated = prev.filter((item) => item.query !== itemQuery);
      localStorage.setItem(`rm_saved_${labId}`, JSON.stringify(updated));
      return updated;
    });
  }, [labId]);

  const isSaved = activeQuery && savedQueries.some((s) => s.query.toLowerCase() === activeQuery.toLowerCase());

  return (
    <div className="flex-1 flex h-full overflow-hidden select-none">
      {/* Left Sidebar — Suggested, Recent, Saved */}
      <QueryHistorySidebar
        suggestedQuestions={SUGGESTED_QUESTIONS}
        recentQueries={recentQueries}
        savedQueries={savedQueries}
        onSelectQuery={handleSelectQuery}
        onClearRecent={handleClearRecent}
        onClearSaved={handleClearSaved}
        onRemoveRecentItem={handleRemoveRecentItem}
        onRemoveSavedItem={handleRemoveSavedItem}
      />

      {/* Center Workspace — Question, Answer, Evidence, Path */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
        <div className="max-w-4xl w-full mx-auto p-6 lg:p-10 space-y-6 flex-1 flex flex-col justify-start">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
              Institutional Memory
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Recall strategic decisions, project datasets, experiment failures, and paper details from the lab graph.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/60" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Ask your laboratory anything..."
              className="w-full pl-12 pr-24 py-4 rounded-2xl bg-card border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all placeholder:text-muted-foreground/50 shadow-md shadow-black/5"
            />
            <Button
              onClick={() => handleSearch()}
              disabled={!query.trim() || isLoading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold text-xs px-4 h-10 rounded-xl shadow-lg shadow-purple-500/10 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'Query'
              )}
            </Button>
          </div>

          {/* Core States: Loading, Error, Result, Empty */}
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <div className="relative">
                <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 w-16 h-16 rounded-full bg-purple-400/25 animate-ping" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground/80 animate-pulse mt-4">
                Recalling memories and synthesizing answer...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl bg-destructive/5 border-destructive/20 gap-3">
              <AlertCircle className="w-10 h-10 text-destructive/80" />
              <h3 className="text-base font-bold text-destructive">Unable to retrieve institutional memory</h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-normal">
                {error || 'The connection to the memory node timed out or was refused.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleSearch()} className="mt-2 gap-2 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Retry Recall
              </Button>
            </div>
          )}

          {!isLoading && !error && !activeResult && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl border-border/55 bg-card/10">
              <Brain className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-base font-semibold text-muted-foreground/80">No institutional memory loaded</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-normal">
                Type a question or select a suggested prompt in the sidebar to search lab knowledge.
              </p>
            </div>
          )}

          {/* AI Response Card & Details */}
          {activeResult && !isLoading && !error && (
            <div className="space-y-6 animate-fade-in flex-1">
              <Card className="border border-purple-500/15 shadow-xl shadow-purple-500/5 bg-card/60 backdrop-blur-xl rounded-2xl">
                <CardHeader className="pb-3 flex-row items-center justify-between gap-4 border-b border-border/40">
                  <div className="space-y-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-purple-400">
                      Query Response
                    </span>
                    <h3 className="text-sm font-bold line-clamp-1 text-foreground/85">
                      "{activeQuery}"
                    </h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggleSave}
                    className="h-9 w-9 shrink-0 text-muted-foreground hover:text-purple-400 cursor-pointer"
                  >
                    {isSaved ? (
                      <BookmarkCheck className="w-5 h-5 text-purple-500" />
                    ) : (
                      <Bookmark className="w-5 h-5" />
                    )}
                  </Button>
                </CardHeader>

                <CardContent className="pt-5 space-y-4">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-foreground/90">
                    {activeResult.answer}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/75 pt-3 border-t border-border/30">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date().toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      Confidence Level: {Math.round(activeResult.confidence * 100)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Memory Breadcrumb Path */}
              {activeResult.memoryPath && activeResult.memoryPath.length > 0 && (
                <MemoryBreadcrumb path={activeResult.memoryPath} />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar — Related Entities Context Panel */}
      <RelatedEntitiesSidebar
        experiments={activeResult?.supportingExperiments || []}
        papers={activeResult?.supportingPapers || []}
        meetings={activeResult?.supportingMeetings || []}
        decisions={activeResult?.supportingDecisions || []}
        datasets={activeResult?.supportingDatasets || []}
        publications={activeResult?.supportingPublications || []}
        isLoading={isLoading}
      />
    </div>
  );
}
