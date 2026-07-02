import { Settings } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your lab profile, integrations, and preferences.
        </p>
      </div>
      <div className="rounded-lg border border-dashed border-border p-12 flex flex-col items-center justify-center gap-3 text-center">
        <Settings className="h-10 w-10 text-muted-foreground/50" />
        <p className="text-sm text-muted-foreground">Settings panels coming soon</p>
      </div>
    </div>
  );
}
