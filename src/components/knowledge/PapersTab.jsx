import { useState, useEffect } from 'react';
import { FileText, Loader2, Upload, ExternalLink, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaperUploadModal } from './PaperUploadModal';
import { FilePreviewModal } from './FilePreviewModal';
import { papersService } from '@/services/papers.service';
import { storageService } from '@/services/storage.service';
import { notificationsService } from '@/services/notifications.service';
import { useAuth } from '@/context/AuthContext';

export function PapersTab({ labId }) {
  const { user } = useAuth();
  const [papers, setPapers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const [previewFile, setPreviewFile] = useState({ isOpen: false, title: '', url: '' });

  useEffect(() => {
    async function fetchPapers() {
      try {
        const data = await papersService.getPapersByLabId(labId);
        setPapers(data || []);
      } catch (error) {
        console.error('Failed to fetch papers:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPapers();
  }, [labId]);

  const handleUploadPaper = async (paperData) => {
    try {
      const newPaper = await papersService.createPaper(paperData);
      setPapers([newPaper, ...papers]);
      
      // Trigger Notification
      await notificationsService.notifyLabMembers(labId, user.id, {
        type: 'paper_update',
        title: 'New Paper Uploaded',
        body: `${user.user_metadata?.full_name || 'A lab member'} uploaded: ${newPaper.title}`,
        entityType: 'research_paper',
        entityId: newPaper.id,
        actionUrl: `/labs/${labId}/knowledge`,
        actorId: user.id
      });

    } catch (error) {
      console.error('Error saving paper:', error);
    }
  };

  const handlePreview = (paper) => {
    if (!paper.storage_path) return;
    const url = storageService.getPublicUrl(paper.storage_path);
    setPreviewFile({
      isOpen: true,
      title: paper.title,
      url: url
    });
  };

  const handleDelete = async (paper) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this paper?");
    if (!confirmDelete) return;

    try {
      if (paper.storage_path) {
        await storageService.remove([paper.storage_path]);
      }
      await papersService.deletePaper(paper.id);
      setPapers(papers.filter(p => p.id !== paper.id));
    } catch (error) {
      console.error('Failed to delete paper:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading papers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Research Papers & Publications</h2>
        <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Paper
        </Button>
      </div>

      {papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
          <FileText className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No papers uploaded</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Upload PDFs of research papers, preprints, and publications to your knowledge base.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <Card key={paper.id} className="flex flex-col h-full group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-primary/5">
                    {paper.paper_type || 'Paper'}
                  </Badge>
                  {paper.published_date && (
                    <span className="text-xs text-muted-foreground">
                      {new Date(paper.published_date).getFullYear()}
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-semibold line-clamp-2 mt-2" title={paper.title}>
                  {paper.title}
                </h3>
                {paper.venue && <p className="text-sm text-muted-foreground">{paper.venue}</p>}
              </CardHeader>
              <CardContent className="flex-1">
                {paper.authors && paper.authors.length > 0 && (
                  <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
                    {paper.authors.join(', ')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {paper.abstract || 'No abstract provided.'}
                </p>
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/20 flex gap-2">
                {paper.storage_path ? (
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handlePreview(paper)}>
                    <Eye className="h-4 w-4" /> Preview
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    No File
                  </Button>
                )}
                <Button variant="outline" size="icon" className="shrink-0 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(paper)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <PaperUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSubmit={handleUploadPaper}
        labId={labId}
        userId={user?.id}
      />

      <FilePreviewModal 
        isOpen={previewFile.isOpen}
        onClose={() => setPreviewFile({ isOpen: false, title: '', url: '' })}
        title={previewFile.title}
        url={previewFile.url}
      />
    </div>
  );
}
