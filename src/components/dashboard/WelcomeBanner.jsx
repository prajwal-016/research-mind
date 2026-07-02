import { CalendarDays } from 'lucide-react';
import { MOCK_USER } from '@/data/dashboard.data';

export function WelcomeBanner() {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="space-y-1 relative z-10">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {MOCK_USER.full_name.split(' ')[1] || MOCK_USER.full_name}!
        </h1>
        <p className="text-muted-foreground">{MOCK_USER.lab_name} Hub</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border relative z-10">
        <CalendarDays className="h-4 w-4" />
        {today}
      </div>
    </div>
  );
}
