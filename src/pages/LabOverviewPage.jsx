import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FlaskConical, Network, Users, BookOpen, Activity, Loader2 } from 'lucide-react';
import { labsService } from '@/services/labs.service';

export default function LabOverviewPage() {
  const { labId } = useParams();
  const [labDetails, setLabDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchLab() {
      if (!labId) return;
      try {
        const lab = await labsService.getLabById(labId);
        setLabDetails(lab);
      } catch (err) {
        console.error('Failed to load lab details in dashboard', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchLab();
  }, [labId]);

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!labDetails) {
    return (
      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center text-muted-foreground">
        <FlaskConical className="h-12 w-12 mb-4 opacity-50" />
        <p>Lab not found</p>
      </div>
    );
  }

  const memoryHealth = labDetails.settings?.memory_health || {
    health_score: 0,
    knowledge_nodes: 0,
    connected_relationships: 0,
    knowledge_growth_percent: 0,
    active_researchers: 0,
    research_projects: 0,
    experiments: 0,
    publications: 0
  };

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
        <header className="space-y-2 border-b pb-6">
          <h1 className="text-3xl font-bold tracking-tight">{labDetails.name} Workspace</h1>
          <p className="text-muted-foreground text-lg">
            Welcome to the command center. Review your institutional memory health below.
          </p>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border bg-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Memory Health</h3>
              <Activity className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-3xl font-bold">{memoryHealth.health_score}%</p>
            <p className="text-xs text-emerald-500 mt-1">+{memoryHealth.knowledge_growth_percent}% this month</p>
          </div>

          <div className="p-5 rounded-xl border bg-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Knowledge Nodes</h3>
              <Network className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-3xl font-bold">{memoryHealth.knowledge_nodes}</p>
            <p className="text-xs text-muted-foreground mt-1">{memoryHealth.connected_relationships} Connections</p>
          </div>

          <div className="p-5 rounded-xl border bg-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Researchers</h3>
              <Users className="h-4 w-4 text-amber-500" />
            </div>
            <p className="text-3xl font-bold">{memoryHealth.active_researchers}</p>
            <p className="text-xs text-muted-foreground mt-1">{memoryHealth.research_projects} Active Projects</p>
          </div>

          <div className="p-5 rounded-xl border bg-card">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-semibold text-muted-foreground">Outputs</h3>
              <BookOpen className="h-4 w-4 text-violet-500" />
            </div>
            <p className="text-3xl font-bold">{memoryHealth.publications}</p>
            <p className="text-xs text-muted-foreground mt-1">{memoryHealth.experiments} Experiments logged</p>
          </div>
        </div>

        <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center bg-card mt-8">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <FlaskConical className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold tracking-tight">Workspace Active</h3>
          <p className="text-muted-foreground mt-2 max-w-md leading-relaxed">
            You are now inside the isolated environment for this lab. Select a module from the left to begin working, or explore the memory graph.
          </p>
        </div>
      </div>
    </div>
  );
}
