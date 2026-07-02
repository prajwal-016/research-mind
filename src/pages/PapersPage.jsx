import { FileText } from 'lucide-react';

export default function PapersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Research Papers</h1>
        <p className="text-muted-foreground mt-1">
          Manage and retrieve your lab&apos;s publications and preprints.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3 text-center">
        <FileText className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Papers library coming soon</p>
      </div>
    </div>
  );
}
