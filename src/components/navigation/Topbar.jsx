import { Search, Bell, Sun, Moon, Menu, LogOut, User, Settings } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/hooks/useAuth';
import { getInitials } from '@/lib/utils';

/**
 * Topbar — top navigation bar with search, theme toggle, notifications,
 * and user profile dropdown.
 *
 * @param {{ onMenuClick: () => void }} props
 */
export function Topbar({ onMenuClick }) {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, signOut, displayName } = useAuth();
  const navigate = useNavigate();

  const userMeta = user?.user_metadata ?? {};
  const email    = user?.email ?? '';

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 flex items-center gap-4 h-16 px-4 sm:px-6 bg-background/80 backdrop-blur-md border-b border-border">
      {/* Mobile menu trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Open menu"
        id="mobile-menu-trigger"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input
            id="global-search"
            type="search"
            placeholder="Search knowledge base…"
            className="pl-9 bg-muted/50 border-transparent focus-visible:border-input"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          id="theme-toggle"
        >
          {resolvedTheme === 'dark' ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" aria-label="Notifications" id="notifications-btn">
          <Bell className="h-4 w-4" />
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0" id="user-menu-trigger">
              <Avatar className="h-9 w-9">
                <AvatarImage src={userMeta.avatarUrl} alt={displayName} />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                  {getInitials(displayName)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none">{displayName}</p>
                <p className="text-xs text-muted-foreground leading-none truncate">{email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem id="profile-link" asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <User className="h-3.5 w-3.5" /> Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem id="lab-settings-link" asChild>
              <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                <Settings className="h-3.5 w-3.5" /> Lab Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              id="sign-out-btn"
              className="text-destructive focus:text-destructive flex items-center gap-2 cursor-pointer"
              onClick={handleSignOut}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
