import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronLeft, Calendar, Hash, Loader2, Edit, Trash2, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { DeleteProjectDialog } from '@/components/projects/DeleteProjectDialog';
import { projectsService } from '@/services/projects.service';

const statusConfig = {
  planning: { label: 'Planning', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  active: { label: 'Active', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  paused: { label: 'Paused', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  completed: { label: 'Completed', color: 'bg-violet-500/10 text-violet-500 border-violet-500/20' },
  archived: { label: 'Archived', color: 'bg-muted text-muted-foreground border-border' },
};

export default function ProjectDetailsPage() {
  const { labId, projectId } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchProject() {
      try {
        const data = await projectsService.getProjectById(projectId);
        setProject(data);
      } catch (error) {
        console.error('Failed to fetch project:', error);
      } finally {
        setIsLoading(false);
      }
    }
    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const handleUpdateProject = async (projectData) => {
    try {
      const updated = await projectsService.updateProject(projectId, projectData);
      setProject(updated);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async () => {
    setIsDeleting(true);
    try {
      await projectsService.deleteProject(projectId);
      navigate(`/labs/${labId}/research`);
    } catch (error) {
      console.error('Error deleting project:', error);
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

  if (!project) {
    return (
      <div className="flex-1 p-6 lg:p-10 flex flex-col items-center justify-center text-center">
        <h2 className="text-xl font-semibold">Project not found</h2>
        <p className="text-muted-foreground mt-2">The project you are looking for does not exist or has been deleted.</p>
        <Button variant="outline" className="mt-4" asChild>
          <Link to={`/labs/${labId}/research`}>Back to Projects</Link>
        </Button>
      </div>
    );
  }

  const status = statusConfig[project.status] || statusConfig.planning;

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        
        {/* Back Link */}
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground -ml-2" asChild>
          <Link to={`/labs/${labId}/research`}>
            <ChevronLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className={status.color}>
                <Flag className="w-3 h-3 mr-1" />
                {status.label}
              </Badge>
              {project.is_public && (
                <Badge variant="secondary">Public</Badge>
              )}
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{project.name}</h1>
            
            {project.start_date && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Started: {new Date(project.start_date).toLocaleDateString()}</span>
                {project.end_date && <span> • Target: {new Date(project.end_date).toLocaleDateString()}</span>}
              </div>
            )}
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

        {/* Body Content */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl border bg-card">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              Description
            </h3>
            <p className="text-sm leading-relaxed whitespace-pre-wrap">
              {project.description || 'No description provided.'}
            </p>
          </div>

          {project.tags && project.tags.length > 0 && (
            <div className="p-6 rounded-xl border bg-card">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map(tag => (
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

      {/* Modals */}
      <ProjectFormModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        onSubmit={handleUpdateProject} 
        initialData={project}
      />

      <DeleteProjectDialog 
        isOpen={isDeleteDialogOpen} 
        onClose={() => setIsDeleteDialogOpen(false)} 
        onConfirm={handleDeleteProject}
        isDeleting={isDeleting}
        projectName={project.name}
      />
    </div>
  );
}
