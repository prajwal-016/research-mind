import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard, FlaskConical, Database, 
  Network, Compass, Sparkles, ChevronLeft, Building2, TestTube, ClipboardCheck
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
      { label: 'Memory Graph', href: '/graph', icon: Network },
      { label: 'Research Journey', href: '/journey', icon: Compass },
      { label: 'Insights', href: '/insights', icon: Sparkles },
    ]
  }
];

export function LeftSidebar() {
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
    <aside className="w-64 flex flex-col h-screen border-r bg-card shrink-0 shadow-sm z-10 relative">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-muted-foreground hover:text-foreground -ml-2" asChild>
            <NavLink to="/labs">
              <ChevronLeft className="h-4 w-4" />
              All Labs
            </NavLink>
          </Button>
          <NotificationDropdown />
        </div>
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5">
            <Building2 className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="font-semibold text-sm leading-tight truncate" title={labDetails.name}>
              {labDetails.name}
            </h2>
            <p className="text-xs text-muted-foreground truncate" title={labDetails.institution}>
              {labDetails.institution}
            </p>
          </div>
        </div>
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
    </aside>
  );
}
