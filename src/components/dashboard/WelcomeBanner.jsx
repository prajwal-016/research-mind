import { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

export function WelcomeBanner() {
  const { user, displayName } = useAuth();
  const [labName, setLabName] = useState('Research Lab');

  useEffect(() => {
    async function fetchUserLab() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('lab_members')
          .select('labs (name)')
          .eq('user_id', user.id)
          .limit(1)
          .single();

        if (!error && data?.labs?.name) {
          setLabName(data.labs.name);
        }
      } catch (err) {
        console.warn('[WelcomeBanner] Failed to fetch lab:', err);
      }
    }
    fetchUserLab();
  }, [user]);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const getFirstName = (name) => {
    if (!name) return 'Researcher';
    const parts = name.split(' ');
    if (parts[0] === 'Dr.' || parts[0] === 'Prof.' || parts[0] === 'Professor') {
      return parts[1] || name;
    }
    return parts[0];
  };

  const firstName = getFirstName(displayName);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-xl border bg-card p-6 shadow-sm relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="space-y-1 relative z-10">
        <h1 className="text-2xl font-bold tracking-tight">
          Welcome back, {firstName}!
        </h1>
        <p className="text-muted-foreground">{labName} Hub</p>
      </div>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border relative z-10">
        <CalendarDays className="h-4 w-4" />
        {today}
      </div>
    </div>
  );
}
