import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Loader2, AlertCircle, RefreshCw, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InsightCard } from '@/components/insights/InsightCard';
import { InsightFilters } from '@/components/insights/InsightFilters';
import { InsightHistory } from '@/components/insights/InsightHistory';
import { InsightDetailsPanel } from '@/components/insights/InsightDetailsPanel';
import { aiInsightsService } from '@/services/ai-insights.service';
import { toast } from 'sonner';

export default function AIInsightsPage() {
  const { labId } = useParams();
  const navigate = useNavigate();

  // Primary data states
  const [insights, setInsights] = useState([]);
  const [projects, setProjects] = useState([]);
  const [researchers, setResearchers] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInsight, setSelectedInsight] = useState(null);

  // History, Saved & Ignored lists (stored in localStorage)
  const [savedInsights, setSavedInsights] = useState([]);
  const [ignoredInsightTitles, setIgnoredInsightTitles] = useState([]);
  const [recentRuns, setRecentRuns] = useState([]);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([
    'similar_experiments', 'duplicate_research', 'research_gaps', 'recommended_papers', 'recommended_datasets', 'potential_collaborators', 'missing_references', 'research_trends'
  ]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [selectedResearcherName, setSelectedResearcherName] = useState('');

  // 1. Initial Load of localStorage metadata
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`rm_saved_insights_${labId}`);
      if (saved) setSavedInsights(JSON.parse(saved));

      const ignored = localStorage.getItem(`rm_ignored_insights_${labId}`);
      if (ignored) setIgnoredInsightTitles(JSON.parse(ignored));

      const runs = localStorage.getItem(`rm_recent_insights_${labId}`);
      if (runs) setRecentRuns(JSON.parse(runs));
    } catch (e) {
      console.error('Failed to load insights history', e);
    }
  }, [labId]);

  // 2. Generate/Refetch Insights from Service
  const handleGenerateInsights = useCallback(async (isRefresh = false) => {
    setIsLoading(true);
    setError(null);
    setSelectedInsight(null);

    try {
      const result = await aiInsightsService.generateInsights(labId);
      setInsights(result || []);

      // If successful, extract Projects and Researchers for filters
      const uniqueProjects = [];
      const projectMap = new Map();
      const uniqueResearchers = [];
      const researcherMap = new Map();

      result.forEach(ins => {
        (ins.relatedEntities || []).forEach(ent => {
          if (ent.type === 'project' && !projectMap.has(ent.id)) {
            projectMap.set(ent.id, ent.title);
            uniqueProjects.push({ id: ent.id, name: ent.title });
          }
          if ((ent.type === 'researcher' || ent.type === 'user') && !researcherMap.has(ent.id)) {
            researcherMap.set(ent.id, ent.title);
            uniqueResearchers.push({ id: ent.id, full_name: ent.title });
          }
        });
      });

      setProjects(uniqueProjects);
      setResearchers(uniqueResearchers);

      // Save run history (keep latest 5 runs, save to localStorage)
      setRecentRuns(prev => {
        const newRun = { timestamp: new Date().toISOString(), insights: result };
        const updated = [newRun, ...prev].slice(0, 5);
        localStorage.setItem(`rm_recent_insights_${labId}`, JSON.stringify(updated));
        return updated;
      });

      if (isRefresh) {
        toast.success('AI recommendations updated successfully');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate insights');
      toast.error('Unable to generate AI recommendations');
    } finally {
      setIsLoading(false);
    }
  }, [labId]);

  // Run on mount
  useEffect(() => {
    handleGenerateInsights();
  }, [handleGenerateInsights]);

  // Toggle category pill filters
  const handleToggleCategory = useCallback((cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }, []);

  // Reset Filters
  const handleResetFilters = useCallback(() => {
    setSelectedCategories([
      'similar_experiments', 'duplicate_research', 'research_gaps', 'recommended_papers', 'recommended_datasets', 'potential_collaborators', 'missing_references', 'research_trends'
    ]);
    setSelectedProjectId('');
    setSelectedResearcherName('');
    setSearchQuery('');
  }, []);

  // ─── WORKFLOW ACTIONS HANDLER ──────────────────────────────────────────────

  const handleActionClick = useCallback((actionText, insight) => {
    const text = actionText.toLowerCase();

    // Determine the entity ID from relatedEntities
    const primaryEntity = insight.relatedEntities?.[0] || { id: '' };

    if (text.includes('experiment')) {
      navigate(`/labs/${labId}/experiments/${primaryEntity.id}`);
    } else if (text.includes('paper') || text.includes('dataset') || text.includes('meeting')) {
      const tabMap = { paper: 'papers', dataset: 'datasets', meeting: 'meetings' };
      const activeTab = tabMap[primaryEntity.type] || 'papers';
      navigate(`/labs/${labId}/knowledge?tab=${activeTab}`);
    } else if (text.includes('graph')) {
      navigate(`/labs/${labId}/graph`);
    } else if (text.includes('memory') || text.includes('ask')) {
      navigate(`/labs/${labId}/memory`, {
        state: { prefillQuery: `Generate details about AI recommendation: "${insight.title}"` }
      });
    } else {
      toast.info(`Triggered workflow action: ${actionText}`);
    }
  }, [labId, navigate]);

  // ─── BOOKMARKS & IGNORE LOGIC ──────────────────────────────────────────────

  // Save/Heart Insight toggle
  const handleToggleSave = useCallback((insight) => {
    const titleMatch = (s) => s.title.toLowerCase() === insight.title.toLowerCase();
    const isAlreadySaved = savedInsights.some(titleMatch);

    let updated;
    if (isAlreadySaved) {
      updated = savedInsights.filter((s) => !titleMatch(s));
      toast.success('Insight removed from saved folder');
    } else {
      updated = [insight, ...savedInsights];
      toast.success('Insight recommendation bookmarked');
    }

    setSavedInsights(updated);
    localStorage.setItem(`rm_saved_insights_${labId}`, JSON.stringify(updated));
  }, [savedInsights, labId]);

  // Ignore / Archive Insight
  const handleIgnoreInsight = useCallback((insight) => {
    setIgnoredInsightTitles(prev => {
      const updated = [...prev, insight.title.toLowerCase()];
      localStorage.setItem(`rm_ignored_insights_${labId}`, JSON.stringify(updated));
      return updated;
    });
    // Deselect if active
    if (selectedInsight?.title === insight.title) {
      setSelectedInsight(null);
    }
    toast.info('Insight dismissed and hidden from dashboard');
  }, [selectedInsight, labId]);

  // Select a run from history sidebar
  const handleSelectRun = useCallback((pastInsights) => {
    setInsights(pastInsights);
    setSelectedInsight(null);
    toast.success('Restored previous AI analysis results');
  }, []);

  const handleSelectSaved = useCallback((savedItem) => {
    // Check if the saved item is ignored, un-ignore it
    setIgnoredInsightTitles(prev => {
      const updated = prev.filter(t => t !== savedItem.title.toLowerCase());
      localStorage.setItem(`rm_ignored_insights_${labId}`, JSON.stringify(updated));
      return updated;
    });

    setInsights([savedItem.result || savedItem]);
    setSelectedInsight(savedItem.result || savedItem);
  }, [labId]);

  const handleClearSaved = useCallback(() => {
    setSavedInsights([]);
    localStorage.removeItem(`rm_saved_insights_${labId}`);
    toast.success('Saved recommendations cleared');
  }, [labId]);

  const handleRemoveSavedItem = useCallback((itemTitle) => {
    setSavedInsights(prev => {
      const updated = prev.filter(item => item.title !== itemTitle);
      localStorage.setItem(`rm_saved_insights_${labId}`, JSON.stringify(updated));
      return updated;
    });
  }, [labId]);

  // ─── FILTER CALCULATIONS ──────────────────────────────────────────────────

  const filteredInsights = useMemo(() => {
    let result = [...insights];
    const q = searchQuery?.toLowerCase().trim();

    // 1. Remove Ignored insights
    result = result.filter(ins => !ignoredInsightTitles.includes(ins.title.toLowerCase()));

    // 2. Filter by selected Categories
    result = result.filter(ins => selectedCategories.includes(ins.category));

    // 3. Filter by Project ID reference
    if (selectedProjectId) {
      result = result.filter(ins => 
        (ins.relatedEntities || []).some(ent => ent.type === 'project' && ent.id === selectedProjectId)
      );
    }

    // 4. Filter by Researcher Name reference
    if (selectedResearcherName) {
      result = result.filter(ins => 
        (ins.relatedEntities || []).some(ent => 
          (ent.type === 'researcher' || ent.type === 'user') && ent.title.toLowerCase().includes(selectedResearcherName.toLowerCase())
        )
      );
    }

    // 5. Filter by search query
    if (q) {
      result = result.filter(ins => 
        ins.title.toLowerCase().includes(q) ||
        ins.summary.toLowerCase().includes(q) ||
        (ins.reasoning && ins.reasoning.toLowerCase().includes(q))
      );
    }

    return result;
  }, [insights, ignoredInsightTitles, selectedCategories, selectedProjectId, selectedResearcherName, searchQuery]);

  // Calculate category count statistics for history sidebar
  const categoryCounts = useMemo(() => {
    const counts = {};
    insights.forEach(ins => {
      if (!ignoredInsightTitles.includes(ins.title.toLowerCase())) {
        counts[ins.category] = (counts[ins.category] || 0) + 1;
      }
    });
    return counts;
  }, [insights, ignoredInsightTitles]);

  return (
    <div className="flex-1 flex h-full overflow-hidden select-none">
      {/* Left Sidebar — Categories, Saved recommendations, Recent Runs history */}
      <InsightHistory
        categoryCounts={categoryCounts}
        savedInsights={savedInsights}
        recentRuns={recentRuns}
        onSelectRun={handleSelectRun}
        onSelectSaved={handleSelectSaved}
        onClearSaved={handleClearSaved}
        onRemoveSavedItem={handleRemoveSavedItem}
      />

      {/* Center Panel — Filters & Generated Recommendations List */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto min-w-0">
        <div className="max-w-4xl w-full mx-auto p-6 lg:p-10 space-y-6 flex-1 flex flex-col justify-start">
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="w-8 h-8 text-purple-400" />
                AI Research Insights
              </h1>
              <p className="text-muted-foreground mt-1.5 text-sm">
                Proactive analysis and recommendations generated from your laboratory memory graph.
              </p>
            </div>

            <Button
              onClick={() => handleGenerateInsights(true)}
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-semibold px-4.5 h-10 rounded-xl shadow-lg shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
              ) : (
                <Sparkles className="w-4 h-4 mr-1.5" />
              )}
              Analyze Lab
            </Button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search insights using natural language..."
              className="w-full pl-11 pr-12 py-3 rounded-xl bg-card border border-border/50 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-purple-500/20 focus:border-purple-500/40 transition-all placeholder:text-muted-foreground/50 shadow-md shadow-black/5"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Filter Bar */}
          <InsightFilters
            selectedCategories={selectedCategories}
            onToggleCategory={handleToggleCategory}
            onResetFilters={handleResetFilters}
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={setSelectedProjectId}
            researchers={researchers}
            selectedResearcherName={selectedResearcherName}
            onSelectResearcher={setSelectedResearcherName}
          />

          {/* Core States: Loading, Error, Content, Empty */}
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {[1, 2, 3, 4].map(n => (
                <div key={n} className="h-56 bg-muted/40 border border-border/20 rounded-2xl animate-pulse space-y-4 p-4">
                  <div className="flex gap-2">
                    <div className="h-5 w-24 bg-muted rounded-xl" />
                    <div className="h-5 w-14 bg-muted rounded-xl" />
                  </div>
                  <div className="h-6 w-3/4 bg-muted rounded" />
                  <div className="h-16 w-full bg-muted rounded-xl" />
                </div>
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl bg-destructive/5 border-destructive/20 gap-3">
              <AlertCircle className="w-12 h-12 text-destructive/80" />
              <h3 className="text-sm font-bold text-destructive">Unable to load AI Insights</h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-normal">
                {error || 'Unable to connect to the reasoning engine node.'}
              </p>
              <Button variant="outline" size="sm" onClick={() => handleGenerateInsights()} className="mt-2 gap-2 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Retry Generate
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredInsights.length === 0 && (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl border-border/55 bg-card/10">
              <Sparkles className="h-14 w-14 text-muted-foreground/35 mb-4 animate-pulse" />
              <h3 className="text-sm font-semibold text-muted-foreground/80">No AI insights found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm leading-normal">
                Try resetting your filters or click "Analyze Lab" at the top to search for fresh recommendations.
              </p>
            </div>
          )}

          {/* Cards Grid */}
          {!isLoading && !error && filteredInsights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {filteredInsights.map((insight, idx) => {
                const isSaved = savedInsights.some(s => s.title.toLowerCase() === insight.title.toLowerCase());

                return (
                  <div key={idx} onClick={() => setSelectedInsight(insight)}>
                    <InsightCard
                      insight={insight}
                      onActionClick={handleActionClick}
                      onSave={() => handleToggleSave(insight)}
                      onIgnore={() => handleIgnoreInsight(insight)}
                      isSaved={isSaved}
                    />
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>

      {/* Right Sidebar — Related Project, Researchers, and Discoveries Details panel */}
      <InsightDetailsPanel
        insight={selectedInsight}
        onClose={() => setSelectedInsight(null)}
        isSaved={selectedInsight && savedInsights.some(s => s.title.toLowerCase() === selectedInsight.title.toLowerCase())}
      />
    </div>
  );
}
