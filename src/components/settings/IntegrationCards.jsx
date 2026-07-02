import React from 'react';
import { Database, Brain, Sparkles, GitBranch, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function IntegrationCards() {
  const integrations = [
    {
      name: 'Supabase Server',
      icon: Database,
      status: 'Connected',
      lastSync: 'Real-time active listener',
      health: '100% SLA',
      connected: true,
      future: false
    },
    {
      name: 'Cognee Engine',
      icon: Brain,
      status: 'Connected',
      lastSync: 'Sync queue pending: 0',
      health: '98.4% uptime',
      connected: true,
      future: false
    },
    {
      name: 'Google Gemini Pro',
      icon: Sparkles,
      status: 'Connected',
      lastSync: 'Instant endpoint bindings',
      health: 'Healthy',
      connected: true,
      future: false
    },
    {
      name: 'GitHub Repository',
      icon: GitBranch,
      status: 'Future Sync',
      lastSync: 'Not synced',
      health: 'Developer integration',
      connected: false,
      future: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-in">
      {integrations.map((item, idx) => {
        const Icon = item.icon;

        return (
          <Card 
            key={idx} 
            className={cn(
              "border border-border/40 bg-card/90 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between transition-all duration-200 hover:shadow-md",
              item.future && "opacity-60 border-dashed bg-card/40"
            )}
          >
            <CardHeader className="pb-2.5 pt-4 px-4 flex flex-row items-start justify-between space-y-0">
              <div className="flex gap-3 items-center">
                <div className={cn(
                  "p-2 rounded-xl border border-border/30 bg-muted/20",
                  !item.future ? "text-purple-400" : "text-muted-foreground"
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground font-semibold">
                    {item.future ? 'Feature Roadmap' : 'Connected Sync'}
                  </p>
                </div>
              </div>

              <Badge 
                variant="outline" 
                className={cn(
                  "text-[8px] font-bold px-1.5 py-0.5 border-none",
                  item.future 
                    ? "bg-muted text-muted-foreground" 
                    : "bg-emerald-500/10 text-emerald-400"
                )}
              >
                {item.status}
              </Badge>
            </CardHeader>
            <CardContent className="pb-4 px-4 pt-0 text-[10px] text-muted-foreground space-y-2.5 font-semibold mt-1">
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                <span>Sync: {item.lastSync}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
                <span>Health: {item.health}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
export default IntegrationCards;
