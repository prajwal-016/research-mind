import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Topbar } from '@/components/navigation/Topbar';
import { MobileNav } from '@/components/navigation/MobileNav';

/**
 * AppLayout — authenticated application shell.
 *
 * Desktop: collapsible sidebar on the left + fixed topbar + scrollable content.
 * Mobile:  topbar with hamburger that opens the MobileNav sheet.
 */
export function AppLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile drawer */}
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setMobileNavOpen(true)} />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 sm:p-6 animate-fade-in"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
