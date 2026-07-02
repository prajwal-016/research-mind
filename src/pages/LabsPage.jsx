import { useState, useEffect, useMemo, useCallback } from 'react';
import { Search, Building2, FlaskConical, Loader2, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LabCard } from '@/components/labs/LabCard';
import { LabFormModal } from '@/components/labs/LabFormModal';
import { labsService } from '@/services/labs.service';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

export default function LabsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [labs, setLabs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const fetchLabs = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await labsService.getLabs();
      
      // Map Supabase data to match the expected format for LabCard
      const mappedLabs = data.map(lab => ({
        ...lab,
        pi: { 
          initials: 'PI', 
          name: lab.pi_name || 'Principal Investigator' 
        },
        stats: {
          researchers: lab.researchers_count || 0,
          projects: lab.projects_count || 0,
          papers: lab.papers_count || 0,
        },
        memoryHealth: lab.memory_health || Math.floor(Math.random() * 40) + 60,
        tags: lab.tags || [],
        isMember: false
      }));
      
      setLabs(mappedLabs);
    } catch (err) {
      console.error('Failed to fetch labs:', err);
      setError(err.message || 'Failed to load labs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLabs();
  }, [fetchLabs]);

  const handleCreateLab = async (payload) => {
    try {
      await labsService.createLab(payload);
      toast.success('Research Lab created successfully!');
      fetchLabs();
    } catch (err) {
      console.error('Failed to create lab:', err);
      toast.error(err.message || 'Failed to create laboratory environment.');
    }
  };

  const filteredLabs = useMemo(() => {
    if (!searchQuery) return labs;
    const lowerQuery = searchQuery.toLowerCase();
    return labs.filter((lab) => {
      const matchName = lab.name?.toLowerCase().includes(lowerQuery);
      const matchInst = lab.institution?.toLowerCase().includes(lowerQuery);
      const matchTag = lab.tags?.some(tag => tag.toLowerCase().includes(lowerQuery));
      const matchPi = lab.pi?.name?.toLowerCase().includes(lowerQuery);
      return matchName || matchInst || matchTag || matchPi;
    });
  }, [searchQuery, labs]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-fade-in">
      {/* Header & Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Research Labs</h1>
          <p className="text-muted-foreground mt-1">
            Discover and connect with research laboratories.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search labs, topics, or PIs..."
              className="pl-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={() => setIsCreateOpen(true)} className="shrink-0 gap-2 cursor-pointer">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Create Lab</span>
          </Button>
        </div>
      </div>

      {/* Form Modal */}
      <LabFormModal 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreateLab} 
      />

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Loading labs from database...</p>
        </div>
      ) : filteredLabs.length > 0 ? (
        /* Lab Grid */
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} />
          ))}
        </div>
      ) : !error && (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
          <FlaskConical className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No labs found</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            We couldn&apos;t find any labs matching your criteria.
          </p>
          {searchQuery && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setSearchQuery('')}
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
