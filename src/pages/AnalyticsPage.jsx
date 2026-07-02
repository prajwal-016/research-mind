import { BarChart3 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Insights and trends from your lab&apos;s research activity.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3 text-center">
        <BarChart3 className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Analytics charts coming soon</p>
      </div>
    </div>
  );
}
