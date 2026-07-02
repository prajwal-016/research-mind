import React, { useState } from 'react';
import { Bell, ShieldCheck, Mail, Send, Radio } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export function NotificationSettings() {
  const [config, setConfig] = useState({
    emailNotifications: true,
    inAppNotifications: true,
    experimentUpdates: true,
    paperUpdates: false,
    meetingReminders: true,
    professorReviews: true,
    publicationAlerts: false
  });

  const handleToggle = (key, checked) => {
    setConfig(prev => ({ ...prev, [key]: checked }));
    toast.success('Notification settings saved');
  };

  const ITEMS = [
    { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive critical activity digests directly in your inbox.', icon: Mail },
    { key: 'inAppNotifications', label: 'In-App Alerts', desc: 'Show toast notifications for real-time events.', icon: Bell },
    { key: 'experimentUpdates', label: 'Experiment updates', desc: 'Alert when a running experiment completes or fails.', icon: Radio },
    { key: 'paperUpdates', label: 'Research Paper updates', desc: 'Notify when a lab researcher uploads a new ArXiv preprint.', icon: Send },
    { key: 'meetingReminders', label: 'Meeting Reminders', desc: 'Send notifications 15 minutes before scheduled lab syncs.', icon: Bell },
    { key: 'professorReviews', label: 'Professor Reviews', desc: 'Alert when a decision is approved or rejected by a Professor.', icon: ShieldCheck },
    { key: 'publicationAlerts', label: 'Publication alerts', desc: 'Notify when a target submission status is accepted.', icon: ShieldCheck },
  ];

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm select-none animate-fade-in">
      <CardHeader className="pb-3">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
          <Bell className="w-4.5 h-4.5 text-purple-400" />
          Notification Dispatch
        </h3>
        <p className="text-[11px] text-muted-foreground">Toggle real-time alerts, email digests, and reviews notifications.</p>
      </CardHeader>
      <CardContent className="space-y-4 text-xs">
        
        <div className="space-y-2">
          {ITEMS.map((item) => {
            const Icon = item.icon;

            return (
              <div 
                key={item.key} 
                className="flex items-center justify-between p-3.5 border rounded-xl bg-muted/15 border-border/30"
              >
                <div className="flex gap-3 pr-6 items-start">
                  <div className="p-1.5 bg-card border border-border/30 rounded-lg text-muted-foreground shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="font-bold text-foreground">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-normal font-medium">
                      {item.desc}
                    </p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={config[item.key]}
                  onChange={(e) => handleToggle(item.key, e.target.checked)}
                  className="w-8 h-4 rounded-full bg-muted border border-border/50 checked:bg-primary accent-primary cursor-pointer shrink-0"
                />
              </div>
            );
          })}
        </div>

      </CardContent>
    </Card>
  );
}
export default NotificationSettings;
