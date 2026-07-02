import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Hash, FlaskConical } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig = {
  draft: { label: 'Draft', color: 'bg-muted text-muted-foreground border-border' },
  running: { label: 'Running', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  completed: { label: 'Completed', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  failed: { label: 'Failed', color: 'bg-destructive/10 text-destructive border-destructive/20' },
  cancelled: { label: 'Cancelled', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

export function ExperimentCard({ experiment, labId }) {
  const status = statusConfig[experiment.status] || statusConfig.draft;

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Badge variant="outline" className={status.color}>
            <FlaskConical className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
        </div>
        <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {experiment.title}
        </h3>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {experiment.hypothesis || experiment.description || 'No hypothesis provided.'}
        </p>

        {experiment.tags && experiment.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {experiment.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="font-normal text-[10px] bg-secondary/60">
                <Hash className="w-3 h-3 mr-0.5 opacity-50" />
                {tag}
              </Badge>
            ))}
            {experiment.tags.length > 3 && (
              <Badge variant="secondary" className="font-normal text-[10px] bg-secondary/60">
                +{experiment.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t bg-muted/20">
        <Button variant="ghost" className="w-full justify-between hover:bg-background" asChild>
          <Link to={`/labs/${labId}/experiments/${experiment.id}`}>
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
