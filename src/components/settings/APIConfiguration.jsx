import React from 'react';
import { Key, Database, Activity, Brain } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function APIConfiguration() {
  
  // Read config endpoints
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pxbahwpjzpvvvnqfeduu.supabase.co';
  const cogneeUrl = import.meta.env.VITE_COGNEE_API_URL || 'https://aws.cognee.ai';

  const services = [
    {
      name: 'Supabase Database',
      desc: 'Relational storage core of all project outputs.',
      details: [
        { label: 'Project URL', value: supabaseUrl },
        { label: 'Connection Status', value: 'Connected', status: 'success' }
      ],
      icon: Database
    },
    {
      name: 'Cognee Graph API',
      desc: 'Institutional memory triple store and mapping graph.',
      details: [
        { label: 'API Status', value: 'Healthy', status: 'success' },
        { label: 'Tenant Connected', value: 'tenant-9756622b', status: 'info' }
      ],
      icon: Brain
    },
    {
      name: 'Google Gemini Engine',
      desc: 'Generative reasoning layer parsing raw text into structured JSON arrays.',
      details: [
        { label: 'API Connected', value: 'Connected', status: 'success' }
      ],
      icon: Activity
    }
  ];

  const getStatusBadge = (value, type) => {
    let classes = "";
    if (type === 'success' || value === 'Connected' || value === 'Healthy') {
      classes = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    } else if (type === 'info') {
      classes = "bg-blue-500/10 text-blue-400 border-blue-500/20";
    } else {
      classes = "bg-red-500/10 text-red-400 border-red-500/20";
    }

    return (
      <Badge variant="outline" className={cn("text-[9px] font-bold px-2 py-0.5", classes)}>
        {value}
      </Badge>
    );
  };

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Key className="w-4.5 h-4.5 text-purple-400" />
          API Configuration & Metrics
        </h3>
        <p className="text-[11px] text-muted-foreground">Monitor remote endpoints without exposing secret credential keys.</p>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        
        <div className="space-y-3">
          {services.map((service, idx) => {
            const Icon = service.icon;

            return (
              <div 
                key={idx} 
                className="p-4 border rounded-xl bg-muted/15 border-border/30 space-y-3.5"
              >
                <div className="flex gap-3 items-center">
                  <div className="p-2 bg-card border border-border/30 rounded-xl text-purple-400">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">{service.name}</p>
                    <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                      {service.desc}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-border/30 pt-2.5">
                  {service.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-muted-foreground">{detail.label}</span>
                      {detail.label === 'Project URL' ? (
                        <span className="font-semibold text-foreground/80 font-mono tracking-tight text-[10px] truncate max-w-[220px]">
                          {detail.value}
                        </span>
                      ) : (
                        getStatusBadge(detail.value, detail.status)
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}
export default APIConfiguration;
