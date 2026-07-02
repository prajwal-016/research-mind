import { WelcomeBanner } from '@/components/dashboard/WelcomeBanner';
import { MemoryHealthCards } from '@/components/dashboard/MemoryHealthCards';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { AIInsights } from '@/components/dashboard/AIInsights';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';

export default function DashboardPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 animate-fade-in">
      <WelcomeBanner />
      
      <MemoryHealthCards />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column (Main content) */}
        <div className="xl:col-span-2 space-y-6 flex flex-col">
          <AIInsights />
          <RecentActivity />
        </div>
        
        {/* Right Column (Side content) */}
        <div className="space-y-6 flex flex-col">
          <QuickActions />
          <UpcomingEvents />
        </div>
      </div>
    </div>
  );
}
