import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Plus, Loader2, AlertCircle, TestTube } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ExperimentCard } from '@/components/experiments/ExperimentCard';
import { ExperimentFormModal } from '@/components/experiments/ExperimentFormModal';
import { experimentsService } from '@/services/experiments.service';
import { notificationsService } from '@/services/notifications.service';
import { useAuth } from '@/context/AuthContext';

export default function ExperimentsPage() {
  const { labId } = useParams();
  const { user } = useAuth();
  
  const [experiments, setExperiments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchExperiments() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await experimentsService.getExperimentsByLabId(labId);
        setExperiments(data || []);
      } catch (err) {
        console.error('Failed to fetch experiments:', err);
        setError(err.message || 'Failed to load experiments.');
      } finally {
        setIsLoading(false);
      }
    }

    if (labId) {
      fetchExperiments();
    }
  }, [labId]);

  const handleCreateExperiment = async (experimentData) => {
    try {
      const payload = {
        ...experimentData,
        lab_id: labId,
        created_by: user.id,
      };
      const newExperiment = await experimentsService.createExperiment(payload);
      setExperiments([newExperiment, ...experiments]);
      setIsModalOpen(false);

      // Trigger Notification
      await notificationsService.notifyLabMembers(labId, user.id, {
        type: 'experiment_update',
        title: 'New Experiment Proposed',
        body: `${user.user_metadata?.full_name || 'A lab member'} proposed: ${newExperiment.title}`,
        entityType: 'experiment',
        entityId: newExperiment.id,
        actionUrl: `/labs/${labId}/experiments/${newExperiment.id}`
      });

    } catch (err) {
      console.error('Error creating experiment:', err);
    }
  };

  const filteredExperiments = useMemo(() => {
    return experiments.filter((exp) => {
      if (statusFilter !== 'all' && exp.status !== statusFilter) return false;
      
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchTitle = exp.title?.toLowerCase().includes(lowerQuery);
        const matchHypothesis = exp.hypothesis?.toLowerCase().includes(lowerQuery);
        const matchDesc = exp.description?.toLowerCase().includes(lowerQuery);
        const matchTag = exp.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        if (!matchTitle && !matchHypothesis && !matchDesc && !matchTag) return false;
      }
      
      return true;
    });
  }, [experiments, searchQuery, statusFilter]);

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Experiments</h1>
            <p className="text-muted-foreground mt-1">
              Design, track, and analyze your lab's experiments.
            </p>
          </div>
          <Button className="shrink-0 gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Experiment</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search experiments..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select
            className="flex h-10 w-full sm:w-[180px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading experiments...</p>
          </div>
        ) : filteredExperiments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperiments.map((exp) => (
              <ExperimentCard key={exp.id} experiment={exp} labId={labId} />
            ))}
          </div>
        ) : !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
            <TestTube className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No experiments found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              {searchQuery || statusFilter !== 'all' 
                ? "We couldn't find any experiments matching your filters." 
                : "Your lab doesn't have any experiments yet. Create one to start testing."}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>

      <ExperimentFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateExperiment} 
      />
    </div>
  );
}
