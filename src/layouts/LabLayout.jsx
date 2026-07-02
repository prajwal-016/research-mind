import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { LeftSidebar } from '@/components/lab-workspace/LeftSidebar';
import { RightSidebar } from '@/components/lab-workspace/RightSidebar';
import { MemorySearchPanel } from '@/components/memory/MemorySearchPanel';
import { CommandPalette } from '@/components/dashboard/CommandPalette';
import { Menu, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * LabLayout — Replaces the global AppLayout when viewing a specific lab workspace.
 * 3-column layout: LeftNav (256px), Center (Fluid), RightContext (320px).
 * Supports mobile hamburger collapses, Ctrl+K command palette, and Ctrl+M memory recalls.
 */
export function LabLayout() {
  const [isMemorySearchOpen, setIsMemorySearchOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle search on Ctrl+M or Cmd+M
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        setIsMemorySearchOpen((prev) => !prev);
      }
      
      // Toggle command palette on Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden animate-fade-in relative">
      
      {/* Left Sidebar (Navigation) */}
      <LeftSidebar 
        onSearchOpen={() => setIsMemorySearchOpen(true)} 
        onCommandPaletteOpen={() => setIsCommandPaletteOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onMobileClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Center Workspace (Main Content) */}
      <div className="flex-1 flex flex-col min-w-0 bg-background shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] z-20 overflow-hidden">
        
        {/* Mobile Header Bar */}
        <header className="h-14 border-b border-border/40 bg-card/65 backdrop-blur-md px-4 flex items-center justify-between shrink-0 lg:hidden z-30">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileSidebarOpen(true)}
              className="h-9 w-9 rounded-xl cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <span className="text-xs font-bold text-foreground">ResearchMind</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="h-8 gap-1.5 text-[10px] font-bold border border-border/30 rounded-xl bg-card cursor-pointer"
          >
            <Menu className="w-3.5 h-3.5 rotate-90" />
            Search (Ctrl+K)
          </Button>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Right Sidebar (Context & AI) — Collapsed on mobile, visible on desktop xl screens */}
      <div className="hidden xl:block">
        <RightSidebar />
      </div>

      {/* Institutional Memory Search Overlay */}
      <MemorySearchPanel isOpen={isMemorySearchOpen} onClose={() => setIsMemorySearchOpen(false)} />

      {/* Command Palette search dialog */}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} />
    </div>
  );
}


