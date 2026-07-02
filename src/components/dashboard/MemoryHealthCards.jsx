import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { MEMORY_HEALTH_CARDS } from '@/data/dashboard.data';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import * as Icons from 'lucide-react';

const colorMap = {
  violet: 'bg-violet-500/10 text-violet-500',
  blue: 'bg-blue-500/10 text-blue-500',
  amber: 'bg-amber-500/10 text-amber-500',
  emerald: 'bg-emerald-500/10 text-emerald-500',
  pink: 'bg-pink-500/10 text-pink-500',
  purple: 'bg-purple-500/10 text-purple-500',
};

export function MemoryHealthCards() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {MEMORY_HEALTH_CARDS.map((item) => {
        const Icon = Icons[item.icon];
        const isUp = item.trend === 'up';

        return (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                <div className={cn('p-2 rounded-lg', colorMap[item.color])}>
                  {Icon && <Icon className="h-4 w-4" />}
                </div>
              </div>
              <div className="mt-4 flex items-baseline gap-2">
                <h2 className="text-3xl font-bold tracking-tight">{item.value}</h2>
                <div className={cn("flex items-center text-xs font-medium", isUp ? "text-emerald-500" : "text-destructive")}>
                  {isUp ? <ArrowUpRight className="h-3 w-3 mr-0.5" /> : <ArrowDownRight className="h-3 w-3 mr-0.5" />}
                  {Math.abs(item.change)}%
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{item.subtext}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
