import { FlaskConical } from 'lucide-react';

export default function ExperimentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Experiments</h1>
        <p className="text-muted-foreground mt-1">
          Log, track, and retrieve experimental results and protocols.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3 text-center">
        <FlaskConical className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Experiments tracker coming soon</p>
      </div>
    </div>
  );
}
