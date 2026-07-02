import React from 'react';
import { HelpCircle, Info, Cpu, Layers } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function AboutSection() {
  const stack = [
    { name: 'React', desc: 'Component core layer' },
    { name: 'Supabase', desc: 'Relational PostgreSQL engine' },
    { name: 'Cognee', desc: 'Institutional memory triple store' },
    { name: 'Gemini', desc: 'Structured synthesis layer' },
    { name: 'Tailwind CSS', desc: 'CSS Utility Framework' },
    { name: 'shadcn/ui', desc: 'UI accessibility component set' }
  ];

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm animate-fade-in">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Info className="w-4.5 h-4.5 text-purple-400" />
          About ResearchMind
        </h3>
        <p className="text-[11px] text-muted-foreground">Version control and stack disclosures.</p>
      </CardHeader>
      <CardContent className="space-y-6 text-xs leading-relaxed">
        
        {/* Profile/About Text */}
        <div className="p-4 border rounded-xl bg-muted/15 border-border/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-foreground text-sm">ResearchMind</span>
            <Badge variant="outline" className="text-[9px] font-mono font-bold border-purple-500/20 bg-purple-500/10 text-purple-400">
              v1.0.0-hackathon
            </Badge>
          </div>
          <p className="text-muted-foreground font-medium text-[10.5px] leading-relaxed">
            Institutional Memory Platform for University Research Labs powered by Cognee and Google Gemini.
          </p>
        </div>

        {/* Tech Stack List */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> Technology Stack
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {stack.map((tech, idx) => (
              <div 
                key={idx} 
                className="p-3 border rounded-xl bg-muted/5 border-border/20 flex flex-col justify-between"
              >
                <span className="font-bold text-foreground">{tech.name}</span>
                <span className="text-[9px] text-muted-foreground font-medium mt-0.5">{tech.desc}</span>
              </div>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
export default AboutSection;
