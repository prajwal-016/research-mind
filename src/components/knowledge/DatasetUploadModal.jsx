import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, UploadCloud } from 'lucide-react';
import { storageService } from '@/services/storage.service';

const datasetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  dataset_type: z.enum(['tabular', 'image', 'text', 'genomic', 'other']).default('other'),
  version: z.string().default('1.0.0'),
  tagsStr: z.string().optional(),
});

export function DatasetUploadModal({ isOpen, onClose, onSubmit, labId, userId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const form = useForm({
    resolver: zodResolver(datasetSchema),
    defaultValues: {
      name: '',
      description: '',
      dataset_type: 'other',
      version: '1.0.0',
      tagsStr: '',
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }
    setFileError(null);
    setFile(selectedFile);
  };

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    setFileError(null);
    
    try {
      let uploadedData = null;
      let fileSize = 0;

      if (file) {
        fileSize = file.size;
        const result = await storageService.upload(`datasets/${crypto.randomUUID()}-${file.name}`, file);
        if (result.error) throw result.error;
        uploadedData = result.data;
      }

      const tagsList = values.tagsStr
        ? values.tagsStr.split(',').map(a => a.trim()).filter(Boolean)
        : [];

      const payload = {
        lab_id: labId,
        name: values.name,
        description: values.description,
        dataset_type: values.dataset_type,
        version: values.version,
        tags: tagsList,
        storage_path: uploadedData ? uploadedData.path : null,
        size_bytes: fileSize,
        created_by: userId,
      };

      await onSubmit(payload);
      form.reset();
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setFileError('Failed to upload dataset. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        form.reset();
        setFile(null);
        setFileError(null);
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Dataset</DialogTitle>
          <DialogDescription>
            Add an experimental dataset to your lab's knowledge base.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors">
              <input 
                type="file" 
                id="dataset-upload" 
                className="hidden" 
                onChange={handleFileChange}
              />
              <label htmlFor="dataset-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Click to select data file (CSV, JSON, ZIP)"}
                </span>
                {file && <span className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</span>}
              </label>
            </div>
            {fileError && <p className="text-sm text-destructive text-center">{fileError}</p>}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dataset Name <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Brain scan imaging data set" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dataset_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Type</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="tabular">Tabular (CSV/TSV)</option>
                        <option value="image">Image Data</option>
                        <option value="text">Text / NLP</option>
                        <option value="genomic">Genomic</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="version"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Version</FormLabel>
                    <FormControl>
                      <Input placeholder="1.0.0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="tagsStr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Raw, Processed, In-Vivo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Context about how this data was collected..." 
                      className="resize-none h-20"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Dataset
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
