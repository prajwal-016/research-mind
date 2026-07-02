import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Hash, Loader2, Edit, Trash2, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExperimentFormModal } from '@/components/experiments/ExperimentFormModal';
import { DeleteExperimentDialog } from '@/components/experiments/DeleteExperimentDialog';
import { experimentsService } from '@/services/experiments.service';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground border-border' },
  running: { label: 'Running', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  failed: { label: 'Failed', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  cancelled: { label: 'Cancelled', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

export default function ExperimentDetailsPage() {
  const { labId, experimentId } = useParams();
  const navigate = useNavigate();

  const [experiment, setExperiment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchExperiment() {
      try {
        const data = await experimentsService.getExperimentById(experimentId);
        setExperiment(data);
      } catch (error) {
        console.error('Failed to fetch experiment:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (experimentId) {
      fetchExperiment();
    }
  }, [experimentId]);

  const handleUpdateExperiment = async (data) => {
    try {
      const updated = await experimentsService.updateExperiment(experimentId, data);
      setExperiment(updated);
    } catch (error) {
      console.error('Error updating experiment:', error);
    }
  };

  const handleDeleteExperiment = async () => {
    setIsDeleting(true);
    try {
      await experimentsService.deleteExperiment(experimentId);
      navigate(`/labs/${labId}/experiments`);
    } catch (error) {
      console.error('Error deleting experiment:', error);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!experiment) {
    return (
      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">Experiment not found</h2>
        <p className="text-muted-foreground mt-2">The experiment you are looking for does not exist or has been deleted.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to={`/labs/${labId}/experiments`}>Back to Experiments</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[experiment.status] || statusConfig.draft;

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground -ml-2" asChild>
          <Link to={`/labs/${labId}/experiments`}>
            <ChevronLeft className="h-4 w-4" />
            Back to Experiments
          </Link>
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <Badge variant="outline" className={status.color}>
              <FlaskConical className="w-3 h-3 mr-1" />
              {status.label}
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight">{experiment.title}</h1>
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" className="gap-2" onClick={() => setIsEditModalOpen(true)}>
              <Edit className="h-4 w-4" /> Edit
            </Button>
            <Button variant="outline" size="sm" className="gap-2 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive" onClick={() => setIsDeleteDialogOpen(true)}>
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          {experiment.description && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Description
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {experiment.description}
              </p>
            </div>
          )}

          {experiment.hypothesis && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Hypothesis
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {experiment.hypothesis}
              </p>
            </div>
          )}

          {experiment.methodology && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Methodology
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {experiment.methodology}
              </p>
            </div>
          )}

          {experiment.tags && experiment.tags.length > 0 && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {experiment.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="font-normal text-xs bg-secondary/60 px-2 py-0.5">
                    <Hash className="w-3 h-3 mr-1 opacity-50" />
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ExperimentFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSubmit={handleUpdateExperiment} 
        initialData={experiment}
      />

      <DeleteExperimentDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleDeleteExperiment}
        isDeleting={isDeleting}
        experimentTitle={experiment.title}
      />
    </div>
  );
}
