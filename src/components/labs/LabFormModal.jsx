import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const labSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  institution: z.string().min(2, 'Institution must be at least 2 characters'),
  department: z.string().optional(),
  description: z.string().optional()
});

export function LabFormModal({ isOpen, onClose, onSubmit }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(labSchema),
    defaultValues: {
      name: '',
      institution: '',
      department: '',
      description: ''
    }
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    try {
      // Generate slug from name
      const slug = values.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const payload = {
        name: values.name,
        slug,
        institution: values.institution,
        department: values.department || '',
        description: values.description || '',
        settings: {
          memory_health: 100,
          ai_insights: []
        }
      };

      await onSubmit(payload);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Failed to create lab:', error);
      toast.error('Failed to create research lab');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card">
        <DialogHeader>
          <DialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <Building2 className="w-5 h-5 text-purple-400" />
            Create Research Lab
          </DialogTitle>
          <DialogDescription className="text-[11px] text-muted-foreground">
            Initialize a new laboratory environment card with institutional metadata.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 text-xs mt-3">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Lab Name</FormLabel>
                  <FormControl>
                    <Input placeholder="AI & NLP Research Lab" {...field} className="text-xs font-semibold bg-muted/20" />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Institution / University</FormLabel>
                  <FormControl>
                    <Input placeholder="MIT CSAIL" {...field} className="text-xs font-semibold bg-muted/20" />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="department"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Department (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Computer Science and Engineering" {...field} className="text-xs font-semibold bg-muted/20" />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Short Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Researching state of the art techniques..." {...field} className="text-xs font-medium bg-muted/20 h-24" />
                  </FormControl>
                  <FormMessage className="text-[10px] text-red-500 font-bold" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2.5 border-t border-border/30 pt-3.5 mt-5">
              <Button type="button" variant="outline" onClick={onClose} className="text-xs font-semibold rounded-xl cursor-pointer">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="bg-primary text-white text-xs font-semibold rounded-xl cursor-pointer">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                    Creating Lab...
                  </>
                ) : (
                  'Create Lab'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
export default LabFormModal;
