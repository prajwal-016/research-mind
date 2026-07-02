import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import { Brain, Search, Loader2, AlertCircle, RefreshCw, Sparkles, Flame, Clock, Award, LineChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { JourneyFilters } from '@/components/journey/JourneyFilters';
import { JourneyTimeline } from '@/components/journey/JourneyTimeline';
import { JourneyDetailsPanel } from '@/components/journey/JourneyDetailsPanel';
import { journeyService } from '@/services/journey.service';
import { timelineService } from '@/services/timeline.service';
import { milestoneService } from '@/services/milestone.service';
import { toast } from 'sonner';

// Register ChartJS modules
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ResearchJourneyPage() {
  const { labId } = useParams();
  const navigate = useNavigate();

  // Primary data states
  const [events, setEvents] = useState([]);
  const [insights, setInsights] = useState(null);
  const [projects, setProjects] = useState([]);
  const [milestones, setMilestones] = useState([]);

  // UI state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState([
    'project', 'experiment', 'research_paper', 'dataset', 'meeting', 'research_decision', 'publication'
  ]);

  // Fetch journey data
  const fetchJourney = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setSelectedEvent(null);

    try {
      const { events: fetchedEvents, insights: fetchedInsights } = await journeyService.getJourneyData(labId);

      setEvents(fetchedEvents);
      setInsights(fetchedInsights);

      // Extract milestones
      const computedMilestones = milestoneService.getMilestones(fetchedEvents);
      setMilestones(computedMilestones);

      // Extract unique projects
      const projectList = fetchedEvents
        .filter(e => e.type === 'project')
        .map(e => ({ id: e.id, name: e.title }));
      setProjects(projectList);

    } catch (err) {
      setError(err.message || 'Failed to load journey data');
      toast.error('Unable to fetch Research Journey');
    } finally {
      setIsLoading(false);
    }
  }, [labId]);

  useEffect(() => {
    fetchJourney();
  }, [fetchJourney]);

  // Handle type toggling
  const handleToggleType = useCallback((type) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  }, []);

  // Filter events dynamically
  const filteredEvents = useMemo(() => {
    return timelineService.filterEvents(events, searchQuery, {
      projectId: selectedProjectId,
      dateRange,
      selectedTypes
    });
  }, [events, searchQuery, selectedProjectId, dateRange, selectedTypes]);

  // Callback to Ask Institutional Memory
  const handleAskMemory = useCallback((title) => {
    navigate(`/labs/${labId}/memory`, { state: { prefillQuery: `Detail the progress and results of "${title}"` } });
  }, [labId, navigate]);

  // Growth Chart configuration
  const chartData = useMemo(() => {
    if (!insights?.growthData) return null;
    return {
      labels: insights.growthData.labels,
      datasets: [
        {
          fill: true,
          label: 'Knowledge Nodes',
          data: insights.growthData.data,
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          pointBackgroundColor: '#6366f1',
          tension: 0.3,
          borderWidth: 2
        }
      ]
    };
  }, [insights]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(75, 85, 99, 0.1)' } }
    }
  };

  return (
    <div className="flex-1 flex h-full overflow-hidden select-none">
      {/* Left Sidebar — Project Selector, Filters, Milestones */}
      <JourneyFilters
        projects={projects}
        selectedProjectId={selectedProjectId}
        onSelectProject={setSelectedProjectId}
        dateRange={dateRange}
        onSelectDateRange={setDateRange}
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        milestones={milestones}
      />

      {/* Center Panel — Search & Vertical Connected Timeline */}
      <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto min-w-0 border-r">
        <div className="max-w-3xl w-full mx-auto p-6 lg:p-10 space-y-6 flex-1 flex flex-col justify-start">
          
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-purple-400" />
              Research Journey
            </h1>
            <p className="text-muted-foreground mt-1.5 text-sm">
              Visualize the chronological evolution of project ideas, dataset updates, experiments, and final journals.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research activity..."
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

          {/* Loading, Error, Content, Empty states */}
          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3">
              <div className="relative">
                <Brain className="w-14 h-14 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 w-14 h-14 rounded-full bg-purple-400/25 animate-ping" />
              </div>
              <p className="text-xs font-semibold text-muted-foreground/80 animate-pulse mt-3">
                Tracking journey nodes...
              </p>
            </div>
          )}

          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed rounded-2xl bg-destructive/5 border-destructive/20 gap-3">
              <AlertCircle className="w-12 h-12 text-destructive/80" />
              <h3 className="text-sm font-bold text-destructive">Unable to load Research Journey</h3>
              <p className="text-xs text-muted-foreground max-w-sm leading-normal">
                {error || 'Unable to connect to laboratory timeline history.'}
              </p>
              <Button variant="outline" size="sm" onClick={fetchJourney} className="mt-2 gap-2 cursor-pointer">
                <RefreshCw className="w-3.5 h-3.5" /> Retry Load
              </Button>
            </div>
          )}

          {!isLoading && !error && (
            <JourneyTimeline
              events={filteredEvents}
              searchQuery={searchQuery}
              onSelectEvent={setSelectedEvent}
              onAskMemory={handleAskMemory}
            />
          )}
        </div>
      </div>

      {/* Right Sidebar — AI Insights & Growth Graph */}
      <div className="w-80 h-full flex flex-col bg-card/45 shrink-0 overflow-y-auto select-none">
        <div className="p-5 space-y-6">
          <div className="px-1">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Brain className="w-4 h-4 text-purple-400" />
              AI Journey Insights
            </h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Automated telemetry summarizing velocity and bottleneck reports.
            </p>
          </div>

          <hr className="border-border/40" />

          {isLoading ? (
            <div className="space-y-4 py-4 animate-pulse">
              {[1, 2].map(n => (
                <div key={n} className="h-20 bg-muted rounded-xl" />
              ))}
            </div>
          ) : !insights ? (
            <div className="text-center py-12 text-muted-foreground/60 italic text-xs">
              No insights compiled yet.
            </div>
          ) : (
            <div className="space-y-4">
              {/* Research Bottleneck */}
              <Card className="border border-purple-500/10 shadow-sm bg-card/60 rounded-xl p-3">
                <div className="flex gap-2">
                  <Flame className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Research Bottlenecks</p>
                    <p className="text-[11px] text-foreground/80 font-medium leading-relaxed">{insights.bottleneck}</p>
                  </div>
                </div>
              </Card>

              {/* Influential Meeting */}
              <Card className="border border-purple-500/10 shadow-sm bg-card/60 rounded-xl p-3">
                <div className="flex gap-2">
                  <Award className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Most Influential Meeting</p>
                    <p className="text-[11px] text-foreground/80 font-medium leading-relaxed">{insights.influentialMeeting}</p>
                  </div>
                </div>
              </Card>

              {/* Longest Running Experiment */}
              <Card className="border border-purple-500/10 shadow-sm bg-card/60 rounded-xl p-3">
                <div className="flex gap-2">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Longest Running Experiment</p>
                    <p className="text-[11px] text-foreground/80 font-medium leading-relaxed">{insights.longestExperiment}</p>
                  </div>
                </div>
              </Card>

              <hr className="border-border/40" />

              {/* Knowledge Growth Chart */}
              <div className="space-y-2">
                <h4 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 px-1">
                  <LineChart className="w-3.5 h-3.5 text-primary" />
                  Knowledge Growth Trend
                </h4>
                {chartData && (
                  <div className="h-40 border border-border/30 bg-card rounded-xl p-3 shadow-inner">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Slide-out Event Detail Panel */}
      <JourneyDetailsPanel
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
