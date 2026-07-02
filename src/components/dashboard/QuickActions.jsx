import { QUICK_ACTIONS } from '@/data/dashboard.data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  violet: 'text-violet-500 bg-violet-500/10 group-hover:bg-violet-500/20 group-hover:shadow-violet-500/10',
  blue: 'text-blue-500 bg-blue-500/10 group-hover:bg-blue-500/20 group-hover:shadow-blue-500/10',
  emerald: 'text-emerald-500 bg-emerald-500/10 group-hover:bg-emerald-500/20 group-hover:shadow-emerald-500/10',
  amber: 'text-amber-500 bg-amber-500/10 group-hover:bg-amber-500/20 group-hover:shadow-amber-500/10',
  pink: 'text-pink-500 bg-pink-500/10 group-hover:bg-pink-500/20 group-hover:shadow-pink-500/10',
  purple: 'text-purple-500 bg-purple-500/10 group-hover:bg-purple-500/20 group-hover:shadow-purple-500/10',
};

export function QuickActions() {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = Icons[action.icon];
            return (
              <Link
                key={action.id}
                to={action.href}
                className="group flex flex-col gap-3 p-4 rounded-xl border bg-card hover:border-primary/50 hover:shadow-md transition-all active:scale-95"
              >
                <div className={cn("p-2 rounded-lg w-fit transition-colors shadow-sm", colorMap[action.color])}>
                  {Icon && <Icon className="h-5 w-5" />}
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-semibold">{action.label}</p>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider bg-muted/50 w-fit px-1.5 py-0.5 rounded border">
                    {action.shortcut}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
