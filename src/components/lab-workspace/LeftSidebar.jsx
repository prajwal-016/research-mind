import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Database, 
  Network, Compass, Sparkles, ChevronLeft, Building2, TestTube, ClipboardCheck, Brain, Search, Settings, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { NotificationDropdown } from '@/components/notifications/NotificationDropdown';
import { useEffect, useState } from 'react';
import { labsService } from '@/services/labs.service';

const NAV_GROUPS = [
  {
    title: 'Workspace',
    items: [
      { label: 'Overview', href: '', icon: LayoutDashboard },
      { label: 'Projects', href: '/research', icon: FlaskConical },
      { label: 'Experiments', href: '/experiments', icon: TestTube },
      { label: 'Knowledge Base', href: '/knowledge', icon: Database },
      { label: 'Review Hub', href: '/review', icon: ClipboardCheck },
    ]
  },
  {
    title: 'Institutional Memory',
    items: [
      { label: 'Recall Center', href: '/memory', icon: Brain },
      { label: 'Memory Graph', href: '/graph', icon: Network },
      { label: 'Research Journey', href: '/journey', icon: Compass },
      { label: 'Insights', href: '/insights', icon: Sparkles },
    ]
  }
];

export function LeftSidebar({ onSearchOpen, onCommandPaletteOpen, isMobileOpen = false, onMobileClose }) {
  const { labId } = useParams();
  const [labDetails, setLabDetails] = useState({ name: 'Loading...', institution: '' });

  useEffect(() => {
    async function fetchLab() {
      if (!labId) return;
      try {
        const lab = await labsService.getLabById(labId);
        if (lab) {
          setLabDetails(lab);
        }
      } catch (err) {
        console.error('Failed to load lab details in sidebar', err);
      }
    }
    fetchLab();
  }, [labId]);

  return (
    <>
      {/* Mobile Sidebar backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onMobileClose} 
          className="fixed inset-0 bg-black/55 backdrop-blur-xs z-30 lg:hidden cursor-pointer animate-in fade-in duration-200"
        />
      )}

      <aside className={cn(
        "w-64 flex flex-col h-screen border-r bg-card shrink-0 shadow-sm z-40 fixed lg:relative transition-transform duration-300 ease-in-out lg:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground hover:text-foreground -ml-2 cursor-pointer" asChild>
              <NavLink to="/labs" onClick={onMobileClose}>
                <ChevronLeft className="h-4 w-4" />
                All Labs
              </NavLink>
            </Button>
            
            <div className="flex items-center gap-1">
              <NotificationDropdown />
              {isMobileOpen && (
                <Button variant="ghost" size="icon" onClick={onMobileClose} className="h-8 w-8 lg:hidden cursor-pointer">
                  <X className="w-4.5 h-4.5" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold text-sm leading-tight truncate" title={labDetails.name}>
                {labDetails.name}
              </h2>
              <p className="text-xs text-muted-foreground truncate" title={labDetails.institution}>
                {labDetails.institution}
              </p>
            </div>
          </div>

          {/* Quick Search button showing Ctrl+K key indicator */}
          {onCommandPaletteOpen && (
            <button
              onClick={() => {
                onCommandPaletteOpen();
                onMobileClose?.();
              }}
              className="mt-4 w-full flex items-center justify-between px-3.5 py-2 border border-border/40 hover:border-border/80 bg-muted/40 hover:bg-muted/70 text-[11px] font-semibold text-muted-foreground hover:text-foreground rounded-xl transition-all cursor-pointer shadow-sm select-none"
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5" /> Quick search...
              </span>
              <kbd className="bg-card border border-border/50 text-[9px] px-1.5 py-0.5 rounded shadow-sm shrink-0 flex items-center gap-0.5 font-bold">
                Ctrl+K
              </kbd>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                {group.title}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.label}
                    to={`/labs/${labId}${item.href}`}
                    end={item.href === ''}
                    onClick={onMobileClose}
                    className={({ isActive }) => cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-accent hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t bg-card mt-auto space-y-2">
          <Button 
            onClick={() => {
              onSearchOpen();
              onMobileClose?.();
            }}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white gap-2 shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 transition-all duration-200 cursor-pointer"
          >
            <Brain className="h-4 w-4" />
            Recall Memory
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start gap-3 px-3 py-2 text-muted-foreground hover:text-foreground cursor-pointer text-sm font-medium"
            asChild
            onClick={onMobileClose}
          >
            <NavLink to={`/labs/${labId}/settings`}>
              <Settings className="w-4 h-4" />
              Settings
            </NavLink>
          </Button>
        </div>
      </aside>
    </>
  );
}


