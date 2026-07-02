import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Building2, Users, FolderKanban, FileText, BrainCircuit, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

/**
 * Memory Health visual indicator
 */
function MemoryHealthMeter({ score }) {
  // Determine color based on score
  const colorClass = 
    score >= 90 ? 'bg-emerald-500' :
    score >= 70 ? 'bg-amber-500' :
    'bg-destructive';

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className={cn("h-full rounded-full transition-all duration-500", colorClass)}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-semibold whitespace-nowrap w-10 text-right">
        {score}%
      </span>
    </div>
  );
}

export function LabCard({ lab }) {
  return (
    <Card className="flex flex-col h-full overflow-hidden hover:shadow-md transition-all group">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1.5">
            <h3 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
              {lab.name}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span>{lab.institution}</span>
            </div>
          </div>
          {lab.isMember && (
            <Badge variant="success" className="shrink-0 text-[10px] uppercase tracking-wider">
              Member
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-6">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {lab.description}
        </p>

        {/* PI & Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Principal Investigator</p>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                  {lab.pi.initials}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium truncate">{lab.pi.name}</span>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Researchers</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-blue-500" />
              <span>{lab.stats.researchers} Active</span>
            </div>
          </div>
        </div>

        {/* Project & Papers Stats */}
        <div className="flex gap-4 p-3 rounded-lg bg-muted/50 border">
          <div className="flex-1 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-background shadow-sm">
              <FolderKanban className="h-3.5 w-3.5 text-violet-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Projects</p>
              <p className="text-sm font-semibold">{lab.stats.projects}</p>
            </div>
          </div>
          <div className="w-px bg-border" />
          <div className="flex-1 flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-background shadow-sm">
              <FileText className="h-3.5 w-3.5 text-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Papers</p>
              <p className="text-sm font-semibold">{lab.stats.papers}</p>
            </div>
          </div>
        </div>

        {/* Memory Health */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <div className="flex items-center gap-1.5">
              <BrainCircuit className="h-4 w-4 text-purple-500" />
              <span className="text-sm font-medium">Memory Health</span>
            </div>
          </div>
          <MemoryHealthMeter score={lab.memoryHealth} />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {lab.tags.map(tag => (
            <Badge key={tag} variant="secondary" className="font-normal text-[10px] bg-secondary/60">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t bg-muted/20">
        <Button 
          variant={lab.isMember ? "default" : "outline"} 
          className="w-full gap-2" 
          asChild
        >
          <Link to={`/labs/${lab.id}`}>
            {lab.isMember ? 'Open Lab Workspace' : 'View Public Profile'}
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
