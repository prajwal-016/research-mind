import { RECENT_ACTIVITY } from '@/data/dashboard.data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  violet: 'bg-violet-500/10 text-violet-500',
  blue: 'bg-blue-500/10 text-blue-500',
  amber: 'bg-amber-500/10 text-amber-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  pink: 'bg-pink-500/10 text-pink-500',
  indigo: 'bg-indigo-500/10 text-indigo-500',
};

export function RecentActivity() {
  return (
    <Card className="flex-1 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {RECENT_ACTIVITY.map((activity) => {
            const Icon = Icons[activity.icon];
            return (
              <div key={activity.id} className="flex items-start gap-4">
                <div className={cn("mt-0.5 p-2 rounded-full", colorMap[activity.color])}>
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1.5">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-[10px]">{activity.actor_init}</AvatarFallback>
                    </Avatar>
                    <span>{activity.actor} <span className="opacity-70">{activity.action}</span></span>
                    <span className="text-muted-foreground/30">•</span>
                    <Badge variant={activity.badgeVariant} className="text-[10px] h-5 px-1.5 font-medium">{activity.badge}</Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
