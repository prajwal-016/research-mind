import { useState, useEffect } from 'react';
import { Database, Loader2, Upload, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DatasetUploadModal } from './DatasetUploadModal';
import { datasetsService } from '@/services/datasets.service';
import { storageService } from '@/services/storage.service';
import { notificationsService } from '@/services/notifications.service';
import { useAuth } from '@/context/AuthContext';

export function DatasetsTab({ labId }) {
  const { user } = useAuth();
  const [datasets, setDatasets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    async function fetchDatasets() {
      try {
        const data = await datasetsService.getDatasetsByLabId(labId);
        setDatasets(data || []);
      } catch (error) {
        console.error('Failed to fetch datasets:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDatasets();
  }, [labId]);

  const handleUploadDataset = async (datasetData) => {
    try {
      const newDataset = await datasetsService.createDataset(datasetData);
      setDatasets([newDataset, ...datasets]);
      
      // Trigger Notification
      await notificationsService.notifyLabMembers(labId, user.id, {
        type: 'system',
        title: 'New Dataset Uploaded',
        body: `${user.user_metadata?.full_name || 'A lab member'} uploaded: ${newDataset.name}`,
        entityType: 'dataset',
        entityId: newDataset.id,
        actionUrl: `/labs/${labId}/knowledge`,
        actorId: user.id
      });

    } catch (error) {
      console.error('Error saving dataset:', error);
    }
  };

  const handleDelete = async (dataset) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this dataset?");
    if (!confirmDelete) return;

    try {
      if (dataset.storage_path) {
        await storageService.remove([dataset.storage_path]);
      }
      await datasetsService.deleteDataset(dataset.id);
      setDatasets(datasets.filter(d => d.id !== dataset.id));
    } catch (error) {
      console.error('Failed to delete dataset:', error);
    }
  };

  const handleDownload = (dataset) => {
    if (!dataset.storage_path) return;
    const url = storageService.getPublicUrl(dataset.storage_path);
    window.open(url, '_blank');
  };

  const formatBytes = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading datasets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Experimental Datasets</h2>
        <Button onClick={() => setIsUploadModalOpen(true)} className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Dataset
        </Button>
      </div>

      {datasets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
          <Database className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No datasets uploaded</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Upload raw or processed datasets (CSV, JSON, images) to your knowledge base.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {datasets.map((dataset) => (
            <Card key={dataset.id} className="flex flex-col h-full group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className="bg-primary/5 capitalize">
                    {dataset.dataset_type || 'Other'}
                  </Badge>
                  <span className="text-xs font-mono bg-muted px-2 py-1 rounded">
                    v{dataset.version}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mt-2 line-clamp-1" title={dataset.name}>
                  {dataset.name}
                </h3>
              </CardHeader>
              <CardContent className="flex-1 space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {dataset.description || 'No description provided.'}
                </p>
                {dataset.size_bytes && (
                  <p className="text-xs text-muted-foreground">
                    Size: {formatBytes(dataset.size_bytes)}
                  </p>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/20 flex gap-2">
                {dataset.storage_path ? (
                  <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleDownload(dataset)}>
                    <Download className="h-4 w-4" /> Download
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="flex-1" disabled>
                    No File
                  </Button>
                )}
                <Button variant="outline" size="icon" className="shrink-0 text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(dataset)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <DatasetUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSubmit={handleUploadDataset}
        labId={labId}
        userId={user?.id}
      />
    </div>
  );
}
