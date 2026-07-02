import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Database,
  FileText,
  FlaskConical,
  Users,
  BarChart3,
  Settings,
  Brain,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { label: 'Dashboard',      href: '/dashboard',      icon: LayoutDashboard },
  { label: 'Knowledge Base', href: '/knowledge-base',  icon: Database },
  { label: 'Papers',         href: '/papers',          icon: FileText },
  { label: 'Experiments',    href: '/experiments',     icon: FlaskConical },
  { label: 'Meetings',       href: '/meetings',        icon: Users },
  { label: 'Analytics',      href: '/analytics',       icon: BarChart3 },
  { label: 'Settings',       href: '/settings',        icon: Settings },
];

/**
 * MobileNav — slide-in Sheet navigation for mobile screens.
 *
 * @param {{ open: boolean, onOpenChange: (open: boolean) => void }} props
 */
export function MobileNav({ open, onOpenChange }) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="px-6 py-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary shrink-0">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <SheetTitle className="text-left">
              <span className="font-bold text-sm leading-tight block">ResearchMind</span>
              <span className="text-[10px] text-muted-foreground font-normal leading-tight block">Institutional Memory</span>
            </SheetTitle>
          </div>
        </SheetHeader>

        <nav className="py-4 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={() => onOpenChange(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <Separator />
        <div className="px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {import.meta.env.VITE_APP_NAME} v{import.meta.env.VITE_APP_VERSION}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
