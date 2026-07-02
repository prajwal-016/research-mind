import { UPCOMING_EVENTS } from '@/data/dashboard.data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  emerald: 'text-emerald-500 bg-emerald-500/10',
  violet: 'text-violet-500 bg-violet-500/10',
  amber: 'text-amber-500 bg-amber-500/10',
};

export function UpcomingEvents() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg">Upcoming</CardTitle>
        <Calendar className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {UPCOMING_EVENTS.map((event) => {
            const Icon = Icons[event.icon];
            return (
              <div key={event.id} className="flex gap-4">
                <div className={cn("mt-0.5 p-2 rounded-lg h-fit", colorMap[event.color])}>
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">{event.title}</p>
                  <p className="text-xs text-muted-foreground">{event.when}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
