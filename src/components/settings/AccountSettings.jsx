import React from 'react';
import { UserCheck, ShieldAlert, LogOut, KeyRound, Calendar } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

export function AccountSettings() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      navigate('/auth/login');
    } catch (err) {
      toast.error('Failed to log out');
    }
  };

  const handleChangePassword = () => {
    toast.info('Password change link sent (Simulated)');
  };

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <UserCheck className="w-4.5 h-4.5 text-purple-400" />
          Account Parameters
        </h3>
        <p className="text-[11px] text-muted-foreground">Manage your credentials, verify status, and sessions.</p>
      </CardHeader>
      <CardContent className="space-y-6 text-xs">
        
        {/* Account statuses */}
        <div className="space-y-3.5">
          <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/15 border-border/30">
            <span className="font-semibold text-muted-foreground">Account Status</span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-bold px-2 py-0.5">
              Active Member
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/15 border-border/30">
            <span className="font-semibold text-muted-foreground">Email Verification</span>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 font-bold px-2 py-0.5">
              Verified
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-xl bg-muted/15 border-border/30">
            <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> Last Login
            </span>
            <span className="font-semibold text-foreground/80">Today, 5:48 PM</span>
          </div>
        </div>

        <hr className="border-border/40" />

        {/* Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleChangePassword}
            className="text-xs font-semibold rounded-xl gap-1.5 cursor-pointer"
          >
            <KeyRound className="w-4 h-4" /> Change Password
          </Button>

          <Button
            variant="destructive"
            onClick={handleLogout}
            className="text-xs font-semibold rounded-xl gap-1.5 cursor-pointer bg-red-600/90 hover:bg-red-600"
          >
            <LogOut className="w-4 h-4" /> Logout Account
          </Button>
        </div>

      </CardContent>
    </Card>
  );
}
export default AccountSettings;
