import React, { useState, useEffect } from 'react';
import { Palette, Sun, Moon, Monitor, Eye } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  // Local state for compact layout & sidebar preferences
  const [isCompact, setIsCompact] = useState(() => {
    return localStorage.getItem('rm_layout_compact') === 'true';
  });

  const [sidebarCollapse, setSidebarCollapse] = useState(() => {
    return localStorage.getItem('rm_sidebar_collapse') === 'true';
  });

  // Persist compact preference
  const handleToggleCompact = (checked) => {
    setIsCompact(checked);
    localStorage.setItem('rm_layout_compact', String(checked));
    toast.success(checked ? 'Compact layout enabled' : 'Standard spacing restored');
  };

  // Persist sidebar collapse preference
  const handleToggleSidebar = (checked) => {
    setSidebarCollapse(checked);
    localStorage.setItem('rm_sidebar_collapse', String(checked));
    toast.success(checked ? 'Sidebar collapse enabled' : 'Sidebar default size restored');
  };

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Palette className="w-4.5 h-4.5 text-purple-400" />
          Appearance Preferences
        </h3>
        <p className="text-[11px] text-muted-foreground">Adjust visual presets, contrast modes, and spacing scales.</p>
      </CardHeader>
      <CardContent className="space-y-6 text-xs">
        
        {/* Theme select */}
        <div className="space-y-2.5">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Visual Theme</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'light', label: 'Light Mode', icon: Sun },
              { value: 'dark', label: 'Dark Mode', icon: Moon },
              { value: 'system', label: 'System Theme', icon: Monitor }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = theme === item.value;

              return (
                <button
                  key={item.value}
                  onClick={() => setTheme(item.value)}
                  className={cn(
                    "p-4 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-102",
                    isActive 
                      ? "border-primary bg-primary/10 text-primary shadow-primary/5" 
                      : "border-border/40 bg-card/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Space and spacing toggles */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Layout Settings</label>
          
          <div className="space-y-2">
            {/* Compact Toggle */}
            <div className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/15 border-border/30">
              <div className="space-y-0.5 pr-6">
                <p className="font-bold text-foreground">Compact Spacing Layout</p>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Reduces padding height and card gaps across dashboard lists.
                </p>
              </div>
              <input
                type="checkbox"
                checked={isCompact}
                onChange={(e) => handleToggleCompact(e.target.checked)}
                className="w-8 h-4 rounded-full bg-muted border border-border/50 checked:bg-primary accent-primary cursor-pointer shrink-0"
              />
            </div>

            {/* Sidebar Collapse Toggle */}
            <div className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/15 border-border/30">
              <div className="space-y-0.5 pr-6">
                <p className="font-bold text-foreground">Collapse Sidebar automatically</p>
                <p className="text-[10px] text-muted-foreground leading-normal">
                  Collapses the Left Sidebar navigation into simple icons on tablet viewports.
                </p>
              </div>
              <input
                type="checkbox"
                checked={sidebarCollapse}
                onChange={(e) => handleToggleSidebar(e.target.checked)}
                className="w-8 h-4 rounded-full bg-muted border border-border/50 checked:bg-primary accent-primary cursor-pointer shrink-0"
              />
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
export default AppearanceSettings;
