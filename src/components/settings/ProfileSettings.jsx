import React, { useState } from 'react';
import { User, Save, Upload, Building } from 'lucide-react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { demoModeUtil } from '@/utils/demo';

export function ProfileSettings() {
  const [profile, setProfile] = useState({
    name: 'Dr. Alice Chen',
    email: 'alice.chen@mit.edu',
    role: 'Associate Professor / PI',
    lab: 'Artificial Intelligence Research Lab',
    department: 'Computer Science and Artificial Intelligence (CSAIL)',
    avatarUrl: ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    if (demoModeUtil.isActive()) {
      toast.warning('Profile save disabled in Demo Mode.');
      return;
    }
    
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success('Profile updated successfully');
  };

  const handleAvatarUpload = () => {
    if (demoModeUtil.isActive()) {
      toast.warning('Avatar upload disabled in Demo Mode.');
      return;
    }
    toast.info('Avatar upload triggered (Simulated)');
  };

  return (
    <Card className="border border-border/40 bg-card/90 rounded-2xl shadow-sm">
      <form onSubmit={handleSave}>
        <CardHeader className="pb-3">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-1.5">
            <User className="w-4.5 h-4.5 text-purple-400" />
            Profile Details
          </h3>
          <p className="text-[11px] text-muted-foreground">Manage your identity and laboratory profile card.</p>
        </CardHeader>
        <CardContent className="space-y-6 text-xs">
          {/* Avatar select */}
          <div className="flex items-center gap-4.5 p-3 border border-border/30 rounded-xl bg-muted/15">
            <Avatar className="h-14 w-14 border border-border/40">
              <AvatarImage src={profile.avatarUrl} />
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">AC</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <p className="font-bold text-foreground">Profile Picture</p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAvatarUpload}
                  className="text-[10px] font-bold h-7.5 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <Upload className="w-3 h-3" /> Upload New
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                className="text-xs font-semibold bg-muted/20"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Email Address</label>
              <Input
                value={profile.email}
                disabled
                className="text-xs font-semibold bg-muted/40 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Role</label>
              <Input
                value={profile.role}
                disabled
                className="text-xs font-semibold bg-muted/40 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Research Lab</label>
              <Input
                value={profile.lab}
                disabled
                className="text-xs font-semibold bg-muted/40 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Department
            </label>
            <Input
              value={profile.department}
              onChange={(e) => setProfile(prev => ({ ...prev, department: e.target.value }))}
              className="text-xs font-semibold bg-muted/20"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t border-border/30 bg-muted/10 p-3.5 flex justify-end">
          <Button 
            type="submit" 
            disabled={isSaving}
            className="bg-primary text-white text-xs font-semibold px-4.5 h-8.5 rounded-xl cursor-pointer"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" /> Save Changes
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
export default ProfileSettings;
