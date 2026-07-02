import React from 'react';
import { Shield, KeyRound, Monitor, Smartphone, Globe, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { demoModeUtil } from '@/utils/demo';

export function SecuritySettings() {
  
  const handleResetPassword = () => {
    if (demoModeUtil.isActive()) {
      toast.warning('Resetting password is blocked in Demo Mode.');
      return;
    }
    toast.info('Password reset instructions dispatched to email');
  };

  const handleSignOutOthers = () => {
    if (demoModeUtil.isActive()) {
      toast.warning('Session termination is blocked in Demo Mode.');
      return;
    }
    toast.success('Successfully terminated all other active sessions');
  };

  const sessions = [
    { device: 'MacBook Pro 16"', location: 'Cambridge, USA (Current)', ip: '18.9.22.10', current: true, icon: Monitor },
    { device: 'iPhone 15 Pro', location: 'Cambridge, USA', ip: '172.56.21.90', current: false, icon: Smartphone }
  ];

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Shield className="w-4.5 h-4.5 text-purple-400" />
          Security Credentials
        </h3>
        <p className="text-[11px] text-muted-foreground">Monitor current sign-in locations, password metadata, and sessions.</p>
      </CardHeader>
      <CardContent className="space-y-6 text-xs">
        
        {/* Active sessions list */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Active Sessions</label>
          <div className="space-y-2">
            {sessions.map((session, idx) => {
              const DeviceIcon = session.icon;

              return (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/15 border-border/30"
                >
                  <div className="flex gap-3 items-center">
                    <div className="p-2 bg-card border border-border/30 rounded-xl text-muted-foreground">
                      <DeviceIcon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-foreground flex items-center gap-1.5">
                        {session.device}
                        {session.current && (
                          <Badge className="bg-emerald-500/15 text-emerald-400 border-none font-bold text-[8px] px-1.5 py-0.5">
                            This Device
                          </Badge>
                        )}
                      </p>
                      <p className="text-[10px] text-muted-foreground font-medium">
                        {session.location} • {session.ip}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Security Parameters */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/15 border-border/30">
            <span className="font-semibold text-muted-foreground">Last Password Change</span>
            <span className="font-semibold text-foreground/80">3 months ago (March 12, 2026)</span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={handleResetPassword}
              className="text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
            >
              <KeyRound className="w-4 h-4" /> Reset Password
            </Button>

            <Button
              variant="outline"
              onClick={handleSignOutOthers}
              className="text-xs font-semibold rounded-xl gap-1.5 cursor-pointer border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
            >
              <AlertTriangle className="w-4 h-4" /> Terminate Other Sessions
            </Button>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
export default SecuritySettings;
