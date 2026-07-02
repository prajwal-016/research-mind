import { AI_INSIGHTS } from '@/data/dashboard.data';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const colorMap = {
  violet: 'bg-violet-500/10 text-violet-500 border-violet-500/20',
  amber: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
};

export function AIInsights() {
  return (
    <Card className="flex-1 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent shadow-sm relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      
      <CardHeader className="pb-3 flex flex-row items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <CardTitle className="text-lg">AI Insights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="relative z-10">
        <div className="space-y-4">
          {AI_INSIGHTS.map((insight) => {
            const Icon = Icons[insight.icon];
            const colorClasses = colorMap[insight.color] || colorMap.violet;
            const containerClass = colorClasses.split(' ').pop(); // gets border color class
            const iconClass = colorClasses.split(' ').slice(0, 2).join(' '); // gets bg and text classes

            return (
              <div key={insight.id} className={cn("p-4 rounded-xl border bg-card/60 backdrop-blur-sm shadow-sm transition-all hover:shadow-md", containerClass)}>
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg shrink-0", iconClass)}>
                    {Icon && <Icon className="h-4 w-4" />}
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-semibold">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{insight.body}</p>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-2">
                        {insight.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/80 text-secondary-foreground border">{tag}</span>
                        ))}
                      </div>
                      <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 -mr-2 text-primary hover:text-primary hover:bg-primary/10" asChild>
                        <Link to={insight.href}>
                          {insight.action} <ArrowRight className="h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
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
