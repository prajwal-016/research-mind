import { Outlet } from 'react-router-dom';
import { LeftSidebar } from '@/components/lab-workspace/LeftSidebar';
import { RightSidebar } from '@/components/lab-workspace/RightSidebar';

/**
 * LabLayout — Replaces the global AppLayout when viewing a specific lab workspace.
 * 3-column layout: LeftNav (256px), Center (Fluid), RightContext (320px).
 */
export function LabLayout() {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden animate-fade-in">
      {/* Left Sidebar (Navigation) */}
      <LeftSidebar />

      {/* Center Workspace (Main Content) */}
      <main className="flex-1 flex flex-col min-w-0 bg-background shadow-[0_0_40px_-15px_rgba(0,0,0,0.1)] z-20 overflow-y-auto">
        <Outlet />
      </main>

      {/* Right Sidebar (Context & AI) */}
      <RightSidebar />
    </div>
  );
}
