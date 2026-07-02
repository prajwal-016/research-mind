import { useState, useEffect } from 'react';
import { Users, Loader2, Plus, Calendar, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MeetingNoteModal } from './MeetingNoteModal';
import { meetingsService } from '@/services/meetings.service';
import { useAuth } from '@/context/AuthContext';

export function MeetingsTab({ labId }) {
  const { user } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const data = await meetingsService.getMeetingsByLabId(labId);
        setMeetings(data || []);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMeetings();
  }, [labId]);

  const handleCreateMeeting = async (meetingData) => {
    try {
      const newMeeting = await meetingsService.createMeeting(meetingData);
      setMeetings([newMeeting, ...meetings]);
    } catch (error) {
      console.error('Error saving meeting:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this meeting note?");
    if (!confirmDelete) return;

    try {
      await meetingsService.deleteMeeting(id);
      setMeetings(meetings.filter(m => m.id !== id));
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p>Loading meeting notes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Meeting Notes</h2>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Log Meeting
        </Button>
      </div>

      {meetings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border rounded-xl bg-card border-dashed">
          <Users className="h-12 w-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold">No meeting notes yet</h3>
          <p className="text-muted-foreground mt-1 max-w-sm">
            Record meeting agendas, outcomes, and decisions to track institutional memory.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="flex flex-col h-full">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <Badge variant="secondary" className="capitalize text-xs">
                    {(meeting.meeting_type || 'Meeting').replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center text-xs text-muted-foreground gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(meeting.scheduled_at).toLocaleDateString()}
                  </div>
                </div>
                <h3 className="text-lg font-semibold mt-2">{meeting.title}</h3>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                {meeting.agenda && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Agenda</h4>
                    <p className="text-sm line-clamp-2">{meeting.agenda}</p>
                  </div>
                )}
                {meeting.notes && (
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Notes</h4>
                    <p className="text-sm line-clamp-3 text-muted-foreground">{meeting.notes}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-4 border-t bg-muted/20 flex justify-end">
                <Button variant="outline" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive border-transparent" onClick={() => handleDelete(meeting.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <MeetingNoteModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleCreateMeeting}
        labId={labId}
        userId={user?.id}
      />
    </div>
  );
}
