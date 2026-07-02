import React, { useState, useEffect } from 'react';
import { Settings, User, Bell, Shield, Key, Eye, HelpCircle, Save, Sparkles, AlertCircle, Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { demoModeUtil } from '@/utils/demo';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Settings states
  const [profile, setProfile] = useState({
    name: 'Dr. Alice Chen',
    email: 'alice.chen@mit.edu',
    title: 'Associate Professor',
    lab: 'AI & NLP Research Lab'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    realtimeSync: true,
    weeklyDigest: false,
    pruneWarnings: true
  });

  const [apiKeys, setApiKeys] = useState({
    cogneeUrl: 'http://localhost:8000',
    cogneeKey: '••••••••••••••••••••',
    geminiKey: '••••••••••••••••••••'
  });

  const [demoMode, setDemoMode] = useState(() => demoModeUtil.isActive());

  // Handle Demo Mode switch
  const handleToggleDemoMode = (checked) => {
    demoModeUtil.setActive(checked);
    setDemoMode(checked);
    if (checked) {
      toast.warning('Demo Mode Activated', {
        description: 'All destructive write and delete operations are now blocked for safety.'
      });
    } else {
      toast.success('Demo Mode Deactivated', {
        description: 'Database mutator writes have been restored.'
      });
    }
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (demoMode) {
      toast.warning('Cannot save settings in Demo Mode.');
      return;
    }
    toast.success('Profile settings updated successfully');
  };

  const handleSaveApiKeys = (e) => {
    e.preventDefault();
    if (demoMode) {
      toast.warning('Cannot save API Keys in Demo Mode.');
      return;
    }
    toast.success('API Keys credentials updated');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6 lg:p-10 pb-16 animate-fade-in select-none">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent flex items-center gap-2">
            <Settings className="w-8 h-8 text-purple-400" />
            Settings
          </h1>
          <p className="text-muted-foreground mt-1.5 text-sm">
            Manage your lab profile, theme preferences, integrations, and demo configurations.
          </p>
        </div>

        {demoMode && (
          <Badge variant="outline" className="text-xs border-amber-500/35 bg-amber-500/10 text-amber-400 font-bold px-3 py-1 flex items-center gap-1.5 animate-pulse shadow-sm">
            <AlertCircle className="w-3.5 h-3.5" />
            DEMO MODE ACTIVE
          </Badge>
        )}
      </div>

      <hr className="border-border/40" />

      {/* Grid panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column navigation */}
        <div className="md:col-span-1 space-y-2">
          <div className="p-3 bg-card/60 backdrop-blur-md rounded-2xl border border-border/40 space-y-1">
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold bg-primary/10 text-primary flex items-center gap-2">
              <User className="w-4 h-4" /> Account & Profile
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted flex items-center gap-2 cursor-pointer">
              <Bell className="w-4 h-4" /> Preferences
            </button>
            <button className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted flex items-center gap-2 cursor-pointer">
              <Key className="w-4 h-4" /> Integrations & Keys
            </button>
          </div>

          {/* Quick info block */}
          <div className="p-4 bg-muted/20 rounded-2xl border border-border/20 text-[10px] text-muted-foreground font-semibold leading-relaxed">
            <HelpCircle className="w-4 h-4 text-purple-400 mb-1.5" />
            Changing API keys credentials only impacts your local browser instance session.
          </div>
        </div>

        {/* Right column settings panels */}
        <div className="md:col-span-2 space-y-6">

          {/* 1. Theme Configuration */}
          <Card className="border border-border/40 bg-card/90 rounded-2xl">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4.5 h-4.5 text-purple-400" />
                Interface Customization
              </h3>
              <p className="text-[11px] text-muted-foreground">Choose your visual appearance preference.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light', label: 'Light Theme', icon: Sun },
                  { value: 'dark', label: 'Dark Theme', icon: Moon },
                  { value: 'system', label: 'System OS', icon: Monitor }
                ].map((item) => {
                  const ThemeIcon = item.icon;
                  const isActive = theme === item.value;

                  return (
                    <button
                      key={item.value}
                      onClick={() => setTheme(item.value)}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center justify-center gap-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm hover:scale-102",
                        isActive 
                          ? "border-primary bg-primary/10 text-primary shadow-primary/5" 
                          : "border-border/40 bg-card/50 hover:bg-muted text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <ThemeIcon className="w-5 h-5 shrink-0" />
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 2. Demo Mode Configuration */}
          <Card className="border border-border/40 bg-card/90 rounded-2xl">
            <CardHeader className="pb-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <Eye className="w-4.5 h-4.5 text-amber-500" />
                Hackathon Demo settings
              </h3>
              <p className="text-[11px] text-muted-foreground">Setup sandbox environment parameters for pitch presentations.</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/15 border-border/30">
                <div className="space-y-1 pr-6">
                  <p className="text-xs font-bold text-foreground">Demo Mode Sandbox</p>
                  <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                    When enabled, relational database updates and deletes are blocked locally to prevent presentation data corruption.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={demoMode}
                  onChange={(e) => handleToggleDemoMode(e.target.checked)}
                  className="w-8 h-4 rounded-full bg-muted border border-border/50 checked:bg-primary accent-primary cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* 3. Account Profile */}
          <Card className="border border-border/40 bg-card/90 rounded-2xl">
            <form onSubmit={handleSaveProfile}>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <User className="w-4.5 h-4.5 text-purple-400" />
                  Profile Details
                </h3>
                <p className="text-[11px] text-muted-foreground">Verify your researcher identity card details.</p>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
                    <Input
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="text-xs font-medium bg-muted/20"
                      disabled={demoMode}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Position</label>
                    <Input
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value }))}
                      className="text-xs font-medium bg-muted/20"
                      disabled={demoMode}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Institutional Email</label>
                  <Input
                    value={profile.email}
                    onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                    className="text-xs font-medium bg-muted/20"
                    disabled={demoMode}
                  />
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 bg-muted/10 p-3.5 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={demoMode}
                  className="bg-primary text-white text-xs font-semibold px-4.5 h-8.5 rounded-xl cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save Profile
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* 4. Credentials & Integrations */}
          <Card className="border border-border/40 bg-card/90 rounded-2xl">
            <form onSubmit={handleSaveApiKeys}>
              <CardHeader className="pb-3">
                <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Key className="w-4.5 h-4.5 text-purple-400" />
                  API Keys & Connections
                </h3>
                <p className="text-[11px] text-muted-foreground">Configure custom reasoning and memory graph endpoint credentials.</p>
              </CardHeader>
              <CardContent className="space-y-3.5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cognee Server API URL</label>
                  <Input
                    value={apiKeys.cogneeUrl}
                    onChange={(e) => setApiKeys(prev => ({ ...prev, cogneeUrl: e.target.value }))}
                    className="text-xs font-medium bg-muted/20"
                    disabled={demoMode}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Cognee Token</label>
                    <Input
                      type="password"
                      value={apiKeys.cogneeKey}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, cogneeKey: e.target.value }))}
                      className="text-xs font-medium bg-muted/20"
                      disabled={demoMode}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Google Gemini Token</label>
                    <Input
                      type="password"
                      value={apiKeys.geminiKey}
                      onChange={(e) => setApiKeys(prev => ({ ...prev, geminiKey: e.target.value }))}
                      className="text-xs font-medium bg-muted/20"
                      disabled={demoMode}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/30 bg-muted/10 p-3.5 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={demoMode}
                  className="bg-primary text-white text-xs font-semibold px-4.5 h-8.5 rounded-xl cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5 mr-1.5" /> Save Keys
                </Button>
              </CardFooter>
            </form>
          </Card>

        </div>
      </div>
    </div>
  );
}
