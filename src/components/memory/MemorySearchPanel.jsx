import { useState, useCallback, useRef, useEffect } from 'react';
import { Search, Brain, Loader2, X, Sparkles, ChevronRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { memoryService } from '@/services/memory.service';

/**
 * MemorySearchPanel — Premium institutional memory search interface.
 * Accepts natural language queries and returns structured answers from Cognee.
 */
export function MemorySearchPanel({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (!isOpen) {
      setQuery('');
      setResult(null);
      setError(null);
    }
  }, [isOpen]);

  const handleSearch = useCallback(async () => {
    if (!query.trim() || isSearching) return;

    setIsSearching(true);
    setError(null);
    setResult(null);

    try {
      const response = await memoryService.recall(query.trim());
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to query institutional memory');
    } finally {
      setIsSearching(false);
    }
  }, [query, isSearching]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  }, [handleSearch, onClose]);

  if (!isOpen) return null;

  const confidenceColor = result?.confidence >= 0.7 ? 'text-emerald-500' 
    : result?.confidence >= 0.4 ? 'text-amber-500' 
    : 'text-red-400';

  const confidenceLabel = result?.confidence >= 0.7 ? 'High Confidence'
    : result?.confidence >= 0.4 ? 'Medium Confidence'
    : 'Low Confidence';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[10vh] bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl mx-4 animate-in slide-in-from-top-4 duration-300">
        {/* Search Card */}
        <Card className="border-2 border-purple-500/20 shadow-2xl shadow-purple-500/10 bg-card/95 backdrop-blur-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-indigo-500/20">
                  <Brain className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">Institutional Memory</h3>
                  <p className="text-xs text-muted-foreground">Ask questions about your research history</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Search Input */}
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder='Try: "Why was GraphRAG abandoned?" or "Who worked on Hybrid Retrieval?"'
                className="w-full pl-10 pr-20 py-3 rounded-xl bg-muted/50 border border-border/50 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500/50 transition-all placeholder:text-muted-foreground/50"
              />
              <Button
                size="sm"
                onClick={handleSearch}
                disabled={!query.trim() || isSearching}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs px-3 h-8"
              >
                {isSearching ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <><Sparkles className="w-3.5 h-3.5 mr-1" /> Recall</>
                )}
              </Button>
            </div>
          </CardHeader>

          {/* Results Area */}
          {(isSearching || result || error) && (
            <CardContent className="pt-0">
              {/* Loading State */}
              {isSearching && (
                <div className="flex flex-col items-center py-8 gap-3">
                  <div className="relative">
                    <Brain className="w-10 h-10 text-purple-400 animate-pulse" />
                    <div className="absolute inset-0 w-10 h-10 rounded-full bg-purple-400/20 animate-ping" />
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Searching institutional memory...
                  </p>
                </div>
              )}

              {/* Error State */}
              {error && !isSearching && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Memory Retrieval Failed</p>
                    <p className="text-xs text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
              )}

              {/* Results */}
              {result && !isSearching && (
                <div className="space-y-4">
                  {/* Answer */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/5 to-indigo-500/5 border border-purple-500/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-xs font-medium text-purple-400">Memory Response</span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{result.answer}</p>
                  </div>

                  {/* Confidence & Meta */}
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-medium ${confidenceColor}`}>
                        {confidenceLabel}
                      </span>
                      <div className="w-20 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            result.confidence >= 0.7 ? 'bg-emerald-500' :
                            result.confidence >= 0.4 ? 'bg-amber-500' : 'bg-red-400'
                          }`}
                          style={{ width: `${Math.round(result.confidence * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(result.confidence * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Supporting Entities */}
                  {(result.supportingExperiments.length > 0 ||
                    result.supportingPapers.length > 0 ||
                    result.supportingMeetings.length > 0 ||
                    result.supportingDecisions.length > 0) && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Supporting Evidence
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.supportingExperiments.map((e, i) => (
                          <Badge key={`exp-${i}`} variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/20">
                            🧪 {e.title}
                          </Badge>
                        ))}
                        {result.supportingPapers.map((p, i) => (
                          <Badge key={`paper-${i}`} variant="outline" className="text-xs bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                            📄 {p.title}
                          </Badge>
                        ))}
                        {result.supportingMeetings.map((m, i) => (
                          <Badge key={`meet-${i}`} variant="outline" className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20">
                            📅 {m.title}
                          </Badge>
                        ))}
                        {result.supportingDecisions.map((d, i) => (
                          <Badge key={`dec-${i}`} variant="outline" className="text-xs bg-purple-500/10 text-purple-400 border-purple-500/20">
                            ⚖️ {d.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Memory Path */}
                  {result.memoryPath?.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/60 pt-2 border-t border-border/50">
                      {result.memoryPath.map((step, i) => (
                        <span key={i} className="flex items-center gap-1">
                          {i > 0 && <ChevronRight className="w-3 h-3" />}
                          {step}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Example Queries */}
        {!result && !isSearching && !error && (
          <div className="mt-3 flex flex-wrap gap-2 justify-center">
            {[
              'Why was GraphRAG abandoned?',
              'Which experiment improved Dataset V3?',
              'Who worked on Hybrid Retrieval?',
              'What publications resulted from the project?',
            ].map((example) => (
              <button
                key={example}
                onClick={() => { setQuery(example); }}
                className="text-xs px-3 py-1.5 rounded-full bg-card/80 border border-border/50 text-muted-foreground hover:text-foreground hover:border-purple-500/30 transition-all"
              >
                {example}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
