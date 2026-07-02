import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search, FolderKanban, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectFormModal } from '@/components/projects/ProjectFormModal';
import { projectsService } from '@/services/projects.service';
import { useAuth } from '@/context/AuthContext';

export default function ProjectsPage() {
  const { labId } = useParams();
  const { user } = useAuth();
  
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await projectsService.getProjectsByLabId(labId);
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to fetch projects:', err);
        setError(err.message || 'Failed to load projects.');
      } finally {
        setIsLoading(false);
      }
    }

    if (labId) {
      fetchProjects();
    }
  }, [labId]);

  const handleCreateProject = async (projectData) => {
    try {
      const payload = {
        ...projectData,
        lab_id: labId,
        created_by: user.id,
      };
      const newProject = await projectsService.createProject(payload);
      // Optimistic UI update
      setProjects([newProject, ...projects]);
    } catch (err) {
      console.error('Error creating project:', err);
      // Depending on requirement, we could show a toast here.
    }
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Status filter
      if (statusFilter !== 'all' && project.status !== statusFilter) return false;
      
      // Search query
      if (searchQuery) {
        const lowerQuery = searchQuery.toLowerCase();
        const matchName = project.name?.toLowerCase().includes(lowerQuery);
        const matchDesc = project.description?.toLowerCase().includes(lowerQuery);
        const matchTag = project.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
        if (!matchName && !matchDesc && !matchTag) return false;
      }
      
      return true;
    });
  }, [projects, searchQuery, statusFilter]);

  return (
    <div className="flex-1 p-6 lg:p-10">
      <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
        
        {/* Header & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Research Projects</h1>
            <p className="text-muted-foreground mt-1">
              Manage your lab's active projects, goals, and outcomes.
            </p>
          </div>
          <Button className="shrink-0 gap-2" onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Project</span>
          </Button>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects by name or tag..."
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
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Error State */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Content Area */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p>Loading projects...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} labId={labId} />
            ))}
          </div>
        ) : !error && (
          <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
            <FolderKanban className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-semibold">No projects found</h3>
            <p className="text-muted-foreground mt-1 max-w-sm">
              {searchQuery || statusFilter !== 'all' 
                ? "We couldn't find any projects matching your filters." 
                : "Your lab doesn't have any projects yet. Create one to get started."}
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

      <ProjectFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateProject} 
      />
    </div>
  );
}
