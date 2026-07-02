import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';

const meetingSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  meeting_type: z.enum(['lab_meeting', 'journal_club', 'project_sync', '1on1', 'other']).default('lab_meeting'),
  scheduled_at: z.string().min(1, 'Date is required'),
  duration_mins: z.string().optional(),
  agenda: z.string().optional(),
  notes: z.string().optional(),
});

export function MeetingNoteModal({ isOpen, onClose, onSubmit, labId, userId }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(meetingSchema),
    defaultValues: {
      title: '',
      meeting_type: 'lab_meeting',
      scheduled_at: new Date().toISOString().split('T')[0],
      duration_mins: '60',
      agenda: '',
      notes: '',
    },
  });

  const handleSubmit = async (values) => {
    setIsSubmitting(true);
    
    try {
      const payload = {
        lab_id: labId,
        title: values.title,
        meeting_type: values.meeting_type,
        scheduled_at: new Date(values.scheduled_at).toISOString(),
        duration_mins: parseInt(values.duration_mins, 10) || null,
        agenda: values.agenda,
        notes: values.notes,
        created_by: userId,
      };

      await onSubmit(payload);
      form.reset();
      onClose();
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Meeting Notes</DialogTitle>
          <DialogDescription>
            Record meeting agendas, outcomes, and decisions.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-2">
            
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Title <span className="text-destructive">*</span></FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Weekly Lab Sync" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="meeting_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <select 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="lab_meeting">Lab Meeting</option>
                        <option value="journal_club">Journal Club</option>
                        <option value="project_sync">Project Sync</option>
                        <option value="1on1">1 on 1</option>
                        <option value="other">Other</option>
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduled_at"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
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
              name="agenda"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Agenda</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Topics to discuss..." 
                      className="resize-none h-16"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Meeting Notes / Outcomes</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Detailed notes from the meeting..." 
                      className="resize-none h-32"
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
                Save Notes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
