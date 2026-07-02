import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ReviewModal({ isOpen, onClose, experiment, onSubmitDecision }) {
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!experiment) return null;

  const handleAction = async (decision) => {
    setIsSubmitting(true);
    try {
      await onSubmitDecision(experiment, decision, comments);
      setComments('');
      onClose();
    } catch (error) {
      console.error('Error submitting decision:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review Experiment Proposal</DialogTitle>
          <DialogDescription>
            Review the hypothesis and methodology, then approve or reject to guide research direction.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="space-y-4 rounded-lg border bg-muted/30 p-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">{experiment.title}</h3>
                <Badge variant="outline" className="capitalize">{experiment.status}</Badge>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {experiment.description || 'No description provided.'}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Hypothesis</h4>
              <p className="text-sm whitespace-pre-wrap">{experiment.hypothesis || 'N/A'}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Methodology</h4>
              <p className="text-sm whitespace-pre-wrap">{experiment.methodology || 'N/A'}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comments">Reviewer Feedback & Rationale (Optional)</Label>
            <Textarea
              id="comments"
              placeholder="Provide constructive feedback, modifications required, or rationale for your decision..."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="resize-none h-32"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              disabled={isSubmitting}
              onClick={() => handleAction('rejected')}
              className="gap-2 bg-destructive/90 hover:bg-destructive"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
              Reject & Cancel
            </Button>
            <Button 
              disabled={isSubmitting}
              onClick={() => handleAction('approved')}
              className="gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              Approve & Run
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
