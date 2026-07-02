import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Hash, Flag } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig = {
  planning: { label: 'Planning', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  active: { label: 'Active', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  paused: { label: 'Paused', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  completed: { label: 'Completed', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
  archived: { label: 'Archived', color: 'bg-muted text-muted-foreground border-border' },
};

export function ProjectCard({ project, labId }) {
  const status = statusConfig[project.status] || statusConfig.planning;
  
  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4 mb-2">
          <Badge variant="outline" className={status.color}>
            <Flag className="w-3 h-3 mr-1" />
            {status.label}
          </Badge>
          {project.is_public && (
            <Badge variant="secondary" className="text-[10px]">Public</Badge>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {project.name}
        </h3>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {project.description || 'No description provided.'}
        </p>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          {project.start_date && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(project.start_date).toLocaleDateString()}</span>
              {project.end_date && <span> - {new Date(project.end_date).toLocaleDateString()}</span>}
            </div>
          )}
        </div>

        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {project.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="font-normal text-[10px] bg-secondary/60">
                <Hash className="w-3 h-3 mr-0.5 opacity-50" />
                {tag}
              </Badge>
            ))}
            {project.tags.length > 3 && (
              <Badge variant="secondary" className="font-normal text-[10px] bg-secondary/60">
                +{project.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-4 border-t bg-muted/20">
        <Button variant="ghost" className="w-full justify-between hover:bg-background" asChild>
          <Link to={`/labs/${labId}/projects/${project.id}`}>
            View Details
            <ChevronRight className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
