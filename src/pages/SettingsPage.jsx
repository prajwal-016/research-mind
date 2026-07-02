import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  User, 
  UserCheck, 
  Palette, 
  Bell, 
  Shield, 
  Key, 
  Workflow, 
  Eye, 
  Info, 
  AlertCircle,
  Menu,
  ChevronRight
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { demoModeUtil } from '@/utils/demo';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Import sub-sections
import { ProfileSettings } from '@/components/settings/ProfileSettings';
import { AccountSettings } from '@/components/settings/AccountSettings';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { APIConfiguration } from '@/components/settings/APIConfiguration';
import { IntegrationCards } from '@/components/settings/IntegrationCards';
import { DemoModeSettings } from '@/components/settings/DemoModeSettings';
import { AboutSection } from '@/components/settings/AboutSection';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [demoMode, setDemoMode] = useState(() => demoModeUtil.isActive());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Listen to storage events to update demo mode badge in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setDemoMode(demoModeUtil.isActive());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const TABS = [
    { id: 'profile', label: 'Profile', icon: User, component: ProfileSettings },
    { id: 'account', label: 'Account', icon: UserCheck, component: AccountSettings },
    { id: 'appearance', label: 'Appearance', icon: Palette, component: AppearanceSettings },
    { id: 'notifications', label: 'Notifications', icon: Bell, component: NotificationSettings },
    { id: 'security', label: 'Security', icon: Shield, component: SecuritySettings },
    { id: 'api', label: 'API Configuration', icon: Key, component: APIConfiguration },
    { id: 'integrations', label: 'Integrations', icon: Workflow, component: IntegrationCards },
    { id: 'demo', label: 'Demo Mode', icon: Eye, component: DemoModeSettings },
    { id: 'about', label: 'About', icon: Info, component: AboutSection }
  ];

  const activeInfo = TABS.find(t => t.id === activeTab) || TABS[0];
  const ActiveComponent = activeInfo.component;

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 md:p-8 pb-16 animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-2xl border border-primary/20 text-primary">
            <Settings className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Settings Page
            </h1>
            <p className="text-muted-foreground mt-0.5 text-[11px] font-semibold">
              Manage your profile preferences, custom reasoning endpoints, and sandboxing filters.
            </p>
          </div>
        </div>

        {demoMode && (
          <Badge variant="outline" className="text-[10px] border-amber-500/35 bg-amber-500/10 text-amber-400 font-bold px-3 py-1 flex items-center gap-1.5 animate-pulse shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            DEMO MODE ACTIVE
          </Badge>
        )}
      </div>

      <hr className="border-border/40" />

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Left column navigation (Desktop) */}
        <div className="hidden md:block md:col-span-1 space-y-2">
          <div className="p-3 bg-card/60 backdrop-blur-md rounded-2xl border border-border/40 space-y-1">
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all duration-200 cursor-pointer",
                    isActive 
                      ? "bg-primary/10 text-primary border-l-2 border-primary" 
                      : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"
                  )}
                >
                  <span className="flex items-center gap-2">
                    <TabIcon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Dropdown selection */}
        <div className="md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full p-3 bg-card border border-border/40 rounded-xl flex items-center justify-between text-xs font-bold text-foreground cursor-pointer"
          >
            <span className="flex items-center gap-2">
              {React.createElement(activeInfo.icon, { className: "w-4.5 h-4.5 text-primary shrink-0" })}
              {activeInfo.label}
            </span>
            <Menu className="w-4.5 h-4.5 text-muted-foreground" />
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 p-2 bg-card border border-border/40 rounded-xl shadow-lg space-y-1 absolute z-50 left-4 right-4 animate-in fade-in slide-in-from-top-2 duration-150">
              {TABS.map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 cursor-pointer",
                      isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                    )}
                  >
                    <TabIcon className="w-4 h-4 shrink-0" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column settings panels */}
        <div className="md:col-span-3">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
