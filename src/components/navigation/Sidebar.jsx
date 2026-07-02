import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  FileText,
  FlaskConical,
  Users,
  BarChart3,
  Settings,
  Brain,
  ChevronLeft,
  ChevronRight,
  Building2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const NAV_ITEMS = [
  { label: 'Dashboard',      href: '/dashboard',     icon: LayoutDashboard },
  { label: 'Labs',           href: '/labs',          icon: Building2 },
  { label: 'Knowledge Base', href: '/knowledge-base', icon: Database },
  { label: 'Papers',         href: '/papers',         icon: FileText },
  { label: 'Experiments',    href: '/experiments',    icon: FlaskConical },
  { label: 'Meetings',       href: '/meetings',       icon: Users },
  { label: 'Analytics',      href: '/analytics',      icon: BarChart3 },
];

const BOTTOM_ITEMS = [
  { label: 'Settings', href: '/settings', icon: Settings },
];

/**
 * Sidebar — collapsible desktop navigation sidebar.
 */
export function Sidebar() {
  const [collapsed, setCollapsed] = useLocalStorage('sidebar-collapsed', false);
  const location = useLocation();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          'relative hidden lg:flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out shrink-0',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center gap-3 px-4 py-5 border-b border-border', collapsed && 'justify-center px-0')}>
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
            <Brain className="w-5 h-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="animate-fade-in">
              <p className="font-bold text-sm leading-tight">ResearchMind</p>
              <p className="text-[10px] text-muted-foreground leading-tight">Institutional Memory</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </nav>

        <Separator />

        {/* Bottom items */}
        <div className="py-4 px-2 space-y-1">
          {BOTTOM_ITEMS.map((item) => (
            <NavItem key={item.href} item={item} collapsed={collapsed} />
          ))}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="absolute -right-3 top-20 flex items-center justify-center w-6 h-6 rounded-full bg-card border border-border shadow-sm hover:bg-accent transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-3 h-3 text-muted-foreground" />
          ) : (
            <ChevronLeft className="w-3 h-3 text-muted-foreground" />
          )}
        </button>
      </aside>
    </TooltipProvider>
  );
}

function NavItem({ item, collapsed }) {
  const { icon: Icon, label, href } = item;

  const content = (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )
      }
    >
      <Icon className="w-4 h-4 shrink-0" />
      {!collapsed && <span className="animate-fade-in truncate">{label}</span>}
    </NavLink>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  return content;
}
