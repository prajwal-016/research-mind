import React, { useState } from 'react';
import { Eye, ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { demoModeUtil } from '@/utils/demo';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function DemoModeSettings() {
  const [isActive, setIsActive] = useState(() => demoModeUtil.isActive());
  const [showWarning, setShowWarning] = useState(false);

  const handleToggleChange = (checked) => {
    if (checked) {
      // Trigger confirmation dialog
      setShowWarning(true);
    } else {
      // Disable directly
      demoModeUtil.setActive(false);
      setIsActive(false);
      toast.success('Demo Mode Deactivated', {
        description: 'All database mutator writes and deletes have been fully restored.'
      });
      // Force refresh components that listen to demo mode
      window.dispatchEvent(new Event('storage'));
    }
  };

  const confirmEnable = () => {
    demoModeUtil.setActive(true);
    setIsActive(true);
    setShowWarning(false);
    toast.warning('Demo Mode Sandbox Active', {
      description: 'Database deletes, updates, and inserts are now intercepted app-wide.'
    });
    // Force refresh components
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm select-none">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Eye className="w-4.5 h-4.5 text-amber-500" />
          Hackathon Demo Configuration
        </h3>
        <p className="text-[11px] text-muted-foreground">Toggle presentation safeguards, sandbox constraints, and mock modes.</p>
      </CardHeader>
      <CardContent className="space-y-6 text-xs">
        
        {/* State Banner */}
        <div className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/15 border-border/30">
          <div className="space-y-1 pr-6">
            <p className="font-bold text-foreground">Sandbox Demo Safeguard</p>
            <p className="text-[10px] text-muted-foreground leading-normal font-medium">
              When active, the Supabase client wrapper intercepts all write, edit, and delete requests app-wide to prevent presentation data loss or corruption.
            </p>
          </div>
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => handleToggleChange(e.target.checked)}
            className="w-8 h-4 rounded-full bg-muted border border-border/50 checked:bg-primary accent-primary cursor-pointer shrink-0"
          />
        </div>

        {/* Informative card blocks */}
        <div className="p-3.5 border rounded-xl bg-amber-500/5 border-amber-500/15 flex gap-3 text-[10.5px] leading-relaxed text-amber-600 dark:text-amber-400 font-semibold">
          <ShieldAlert className="w-4.5 h-4.5 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">What happens when Demo Mode is active?</p>
            <ul className="list-disc pl-4 space-y-1 text-[10px] font-medium text-muted-foreground">
              <li>App-wide inserts, updates, and deletes are disabled.</li>
              <li>A floating warning toast alerts the user during attempts.</li>
              <li>An orange warning badge is shown next to the lab selector in the sidebar.</li>
            </ul>
          </div>
        </div>

        {/* Warning Confirmation Dialog */}
        <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
          <AlertDialogContent className="rounded-2xl border border-border bg-card max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-sm font-bold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Activate Demo Safeguard?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed mt-2">
                This will lock database mutations app-wide and block deletion triggers. Any attempt to write or delete records will result in a warning notification.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="mt-4 gap-2">
              <AlertDialogCancel 
                onClick={() => setShowWarning(false)} 
                className="text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction 
                onClick={confirmEnable} 
                className="bg-primary text-white text-xs font-semibold rounded-xl cursor-pointer hover:bg-primary/95"
              >
                Enable Safeguard
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardContent>
    </Card>
  );
}
export default DemoModeSettings;
