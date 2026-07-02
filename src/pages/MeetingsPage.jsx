import { Users } from 'lucide-react';

export default function MeetingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Meetings</h1>
        <p className="text-muted-foreground mt-1">
          Store meeting notes, decisions, and action items for future retrieval.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3 text-center">
        <Users className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Meetings log coming soon</p>
      </div>
    </div>
  );
}
