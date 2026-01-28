import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Bell, Mail, Droplets, Utensils, AlertTriangle, Settings, Loader2 } from 'lucide-react';
import { useUserSettings } from '@/hooks/useUserSettings';

export default function SettingsPage() {
  const { settings, loading, toggleSetting } = useUserSettings();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <DashboardHeader />
        <main className="container py-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      <main className="container py-6 space-y-6 max-w-2xl animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-7 w-7 text-primary" />
            Settings
          </h1>
          <p className="text-muted-foreground">
            Manage your notification preferences
          </p>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Preferences
            </CardTitle>
            <CardDescription>
              Control when and how you receive notifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="meal-reminders" className="flex items-center gap-2">
                  <Utensils className="h-4 w-4 text-muted-foreground" />
                  Meal Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Get reminded to log your meals
                </p>
              </div>
              <Switch
                id="meal-reminders"
                checked={settings?.meal_reminders ?? true}
                onCheckedChange={() => toggleSetting('meal_reminders')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="calorie-alerts" className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                  Calorie Alerts
                </Label>
                <p className="text-sm text-muted-foreground">
                  Alert when nearing daily calorie limit
                </p>
              </div>
              <Switch
                id="calorie-alerts"
                checked={settings?.calorie_alerts ?? true}
                onCheckedChange={() => toggleSetting('calorie_alerts')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="hydration-reminders" className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-muted-foreground" />
                  Hydration Reminders
                </Label>
                <p className="text-sm text-muted-foreground">
                  Encourage regular water intake
                </p>
              </div>
              <Switch
                id="hydration-reminders"
                checked={settings?.hydration_reminders ?? true}
                onCheckedChange={() => toggleSetting('hydration_reminders')}
              />
            </div>

            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly progress summaries via email
                  </p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings?.email_notifications ?? false}
                  onCheckedChange={() => toggleSetting('email_notifications')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader>
            <CardTitle>About NutriScan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Version</span>
              <span className="font-medium">2.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">AI Powered by</span>
              <span className="font-medium">Lovable AI</span>
            </div>
            <p className="text-sm text-muted-foreground pt-4">
              NutriScan uses advanced AI to help you track nutrition, plan meals, 
              and achieve your health goals. Your data is securely stored and 
              never shared with third parties.
            </p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
