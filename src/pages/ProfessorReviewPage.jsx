import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ClipboardCheck, Loader2, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ReviewModal } from '@/components/review/ReviewModal';
import { experimentsService } from '@/services/experiments.service';
import { decisionsService } from '@/services/decisions.service';
import { notificationsService } from '@/services/notifications.service';
import { useAuth } from '@/context/AuthContext';
import { memoryService } from '@/services/memory.service';

export default function ProfessorReviewPage() {
  const { labId } = useParams();
  const { user } = useAuth();
  
  const [pendingExperiments, setPendingExperiments] = useState([]);
  const [decisions, setDecisions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allExps, allDecisions] = await Promise.all([
          experimentsService.getExperimentsByLabId(labId),
          decisionsService.getDecisionsByLabId(labId)
        ]);

        // Filter only 'draft' experiments for review
        setPendingExperiments((allExps || []).filter(e => e.status === 'draft'));
        setDecisions(allDecisions || []);
      } catch (error) {
        console.error('Failed to fetch review data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [labId]);

  const handleDecision = async (experiment, decision, comments) => {
    try {
      const newStatus = decision === 'approved' ? 'running' : 'cancelled';
      
      // 1. Update Experiment Status and append comments to notes
      const updatedNotes = experiment.notes 
        ? `${experiment.notes}\n\n--- Reviewer Feedback ---\n${comments || 'No comments provided.'}` 
        : `--- Reviewer Feedback ---\n${comments || 'No comments provided.'}`;

      await experimentsService.updateExperiment(experiment.id, {
        status: newStatus,
        notes: updatedNotes
      });

      // 2. Create Research Decision Log
      const decisionLog = await decisionsService.createDecision({
        lab_id: labId,
        project_id: experiment.project_id || null,
        title: `${decision === 'approved' ? 'Approved' : 'Rejected'} Experiment: ${experiment.title}`,
        context: experiment.hypothesis || 'Experiment proposal review',
        decision: `Experiment ${decision}`,
        rationale: comments || 'Standard review completed.',
        priority: decision === 'approved' ? 'high' : 'medium',
        created_by: user.id,
        made_by: user.id
      });

      // Update UI state optimistically
      setPendingExperiments(prev => prev.filter(e => e.id !== experiment.id));
      setDecisions([decisionLog, ...decisions]);

      // Notify the experiment creator
      if (experiment.created_by) {
        await notificationsService.notifyUser({
          userId: experiment.created_by,
          labId: labId,
          type: 'decision',
          title: `Experiment ${decision === 'approved' ? 'Approved' : 'Rejected'}`,
          body: `Professor reviewed: ${experiment.title}. ${comments ? 'Feedback provided.' : ''}`,
          entityType: 'experiment',
          entityId: experiment.id,
          actionUrl: `/labs/${labId}/experiments/${experiment.id}`,
          actorId: user.id
        });
      }

      // Fire-and-forget: Cognee Memory operations
      if (decision === 'approved') {
        // Strengthen validated knowledge
        memoryService.improve('experiment', experiment, comments || 'Approved by professor').catch(err =>
          console.warn('[Review] Memory improve failed:', err.message)
        );
      }

    } catch (error) {
      console.error('Error during decision flow:', error);
      throw error;
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Review Hub</h1>
          <p className="text-muted-foreground mt-1">
            Approve proposals, guide research direction, and log strategic decisions.
          </p>
        </div>

        {/* Pending Reviews Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <h2 className="text-xl font-semibold">Pending Proposals</h2>
            <Badge variant="secondary" className="ml-2">{pendingExperiments.length}</Badge>
          </div>

          {pendingExperiments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-card border-dashed">
              <ClipboardCheck className="h-12 w-12 text-emerald-500/50 mb-4" />
              <h3 className="text-lg font-semibold">All caught up!</h3>
              <p className="text-muted-foreground mt-1">
                There are no draft experiments pending your review.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingExperiments.map(exp => (
                <Card key={exp.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className="bg-amber-500/10 text-amber-600 border-amber-500/20">
                        Needs Review
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mt-2 line-clamp-1" title={exp.title}>{exp.title}</h3>
                  </CardHeader>
                  <CardContent className="flex-1 text-sm text-muted-foreground">
                    <p className="line-clamp-3">{exp.hypothesis || exp.description || 'No hypothesis provided.'}</p>
                  </CardContent>
                  <CardFooter className="pt-4 border-t bg-muted/20">
                    <Button className="w-full" onClick={() => setSelectedExperiment(exp)}>
                      Review & Decide
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Recent Decisions Log */}
        <div className="space-y-4 pt-8">
          <div className="flex items-center gap-2 border-b pb-2">
            <ClipboardCheck className="w-5 h-5 text-blue-500" />
            <h2 className="text-xl font-semibold">Decision History</h2>
          </div>

          {decisions.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">No strategic decisions logged yet.</p>
          ) : (
            <div className="space-y-4">
              {decisions.map(decision => {
                const isApproval = decision.title.toLowerCase().includes('approved');
                const isRejection = decision.title.toLowerCase().includes('rejected');
                
                return (
                  <div key={decision.id} className="p-4 rounded-xl border bg-card flex gap-4">
                    <div className="shrink-0 pt-1">
                      {isApproval ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                      ) : isRejection ? (
                        <XCircle className="w-6 h-6 text-destructive" />
                      ) : (
                        <ClipboardCheck className="w-6 h-6 text-blue-500" />
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold">{decision.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {new Date(decision.made_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-foreground/80">{decision.decision}</p>
                      {decision.rationale && (
                        <p className="text-sm text-muted-foreground mt-2 border-l-2 pl-3 py-1 bg-muted/30">
                          {decision.rationale}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <ReviewModal 
        isOpen={!!selectedExperiment}
        onClose={() => setSelectedExperiment(null)}
        experiment={selectedExperiment}
        onSubmitDecision={handleDecision}
      />
    </div>
  );
}
