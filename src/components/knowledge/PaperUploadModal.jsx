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

const paperSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  abstract: z.string().optional(),
  authors: z.string().optional(),
  doi: z.string().optional(),
  venue: z.string().optional(),
  published_date: z.string().optional().or(z.literal('')),
});

export function PaperUploadModal({ isOpen, onClose, onSubmit, labId, userId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const form = useForm({
    resolver: zodResolver(paperSchema),
    defaultValues: {
      title: '',
      abstract: '',
      authors: '',
      doi: '',
      venue: '',
      published_date: '',
    },
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'application/pdf') {
      setFileError('Only PDF files are supported for papers.');
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
      let storagePath = null;

      // 1. Upload File if present
      if (file) {
        storagePath = await storageService.upload(`papers/${crypto.randomUUID()}-${file.name}`, file);
        // Returns an object containing the path, e.g., { path: "papers/uuid-file.pdf" } from supabase standard api?
        // Wait, the storageService wrapper getPublicUrl expects just the path.
        // Actually, our wrapper returns standard standard supabase response:
        // supabase.storage.from(BUCKET).upload() returns { data, error }. 
        // Wait, storageService.upload returns the Promise of supabase.storage...upload. 
        // Let's resolve that safely.
      }

      // We need to properly await storageService.upload
      let uploadedData = null;
      if (file) {
        const result = await storageService.upload(`papers/${crypto.randomUUID()}-${file.name}`, file);
        if (result.error) throw result.error;
        uploadedData = result.data;
      }

      // 2. Prepare authors array
      const authorsList = values.authors
        ? values.authors.split(',').map(a => a.trim()).filter(Boolean)
        : [];

      // 3. Create DB Record
      const payload = {
        lab_id: labId,
        title: values.title,
        abstract: values.abstract,
        authors: authorsList,
        doi: values.doi || null,
        venue: values.venue,
        published_date: values.published_date || null,
        storage_path: uploadedData ? uploadedData.path : null,
        added_by: userId,
        paper_type: 'preprint'
      };

      await onSubmit(payload);
      form.reset();
      setFile(null);
      onClose();
    } catch (error) {
      console.error('Upload failed:', error);
      setFileError('Failed to upload paper. Please try again.');
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
          <DialogTitle>Upload Research Paper</DialogTitle>
          <DialogDescription>
            Add a new publication or preprint to the knowledge base.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            
            {/* File Upload Section */}
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:bg-muted/50 transition-colors">
              <input 
                type="file" 
                id="file-upload" 
                className="hidden" 
                accept="application/pdf"
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <span className="text-sm font-medium">
                  {file ? file.name : "Click to select PDF"}
                </span>
                <span className="text-xs text-muted-foreground">PDFs up to 50MB</span>
              </label>
            </div>
            {fileError && <p className="text-sm text-destructive text-center">{fileError}</p>}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Attention is All You Need" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="authors"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Authors (comma separated)</FormLabel>
                  <FormControl>
                    <Input placeholder="Vaswani, Shazeer, Parmar..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>DOI</FormLabel>
                    <FormControl>
                      <Input placeholder="10.1038/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="published_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Publication Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="venue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Venue (Journal / Conference)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. NeurIPS 2017" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief summary..." 
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
                Upload & Save
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
