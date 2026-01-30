import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Target, Trophy, AlertTriangle, PartyPopper, 
  TrendingUp, Clock, X, CheckCircle 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { DailyStats, WeeklyStats } from '@/types/database';
import { cn } from '@/lib/utils';

type Alert = {
  id: string;
  type: 'success' | 'warning' | 'achievement' | 'reminder';
  title: string;
  message: string;
  icon: React.ReactNode;
  dismissable?: boolean;
};

type GoalAlertsProps = {
  todayStats: DailyStats | null;
  weeklyStats: WeeklyStats | null;
  mealCount: number;
};

export function GoalAlerts({ todayStats, weeklyStats, mealCount }: GoalAlertsProps) {
  const { profile } = useAuth();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newAlerts: Alert[] = [];
    const target = profile?.daily_calorie_target || 2000;
    const consumed = todayStats?.totalCalories || 0;
    const percentage = (consumed / target) * 100;

    // Daily goal reached
    if (percentage >= 95 && percentage <= 105) {
      newAlerts.push({
        id: 'goal-reached',
        type: 'success',
        title: '🎯 Daily Goal Reached!',
        message: `Perfect! You've hit your ${target.toLocaleString()} calorie target.`,
        icon: <Target className="h-5 w-5 text-primary" />,
        dismissable: true,
      });
    }

    // Approaching limit
    if (percentage >= 85 && percentage < 95) {
      newAlerts.push({
        id: 'approaching-limit',
        type: 'warning',
        title: 'Almost There!',
        message: `You're at ${Math.round(percentage)}% of your daily goal. Only ${Math.round(target - consumed)} kcal remaining.`,
        icon: <TrendingUp className="h-5 w-5 text-amber-500" />,
        dismissable: true,
      });
    }

    // Exceeded limit
    if (percentage > 110) {
      newAlerts.push({
        id: 'exceeded-limit',
        type: 'warning',
        title: 'Over Daily Limit',
        message: `You've exceeded your goal by ${Math.round(consumed - target).toLocaleString()} kcal. Consider lighter meals tomorrow.`,
        icon: <AlertTriangle className="h-5 w-5 text-destructive" />,
        dismissable: true,
      });
    }

    // No meals logged today (mid-day reminder)
    const currentHour = new Date().getHours();
    if (mealCount === 0 && currentHour >= 12) {
      newAlerts.push({
        id: 'no-meals-logged',
        type: 'reminder',
        title: "Don't Forget to Log!",
        message: "You haven't logged any meals today. Keep your streak going!",
        icon: <Clock className="h-5 w-5 text-blue-500" />,
        dismissable: true,
      });
    }

    // Weekly achievement
    if (weeklyStats) {
      const daysWithMeals = weeklyStats.days.filter(d => d.mealCount > 0).length;
      if (daysWithMeals >= 7) {
        newAlerts.push({
          id: 'weekly-achievement',
          type: 'achievement',
          title: '🏆 Perfect Week!',
          message: "Amazing! You logged meals every day this week!",
          icon: <Trophy className="h-5 w-5 text-yellow-500" />,
          dismissable: true,
        });
      }
    }

    setAlerts(newAlerts.filter(a => !dismissedAlerts.has(a.id)));
  }, [todayStats, weeklyStats, profile, mealCount, dismissedAlerts]);

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3 animate-fade-in">
      {alerts.map((alert) => (
        <Card 
          key={alert.id}
          className={cn(
            'relative overflow-hidden transition-all hover:shadow-md',
            alert.type === 'success' && 'border-primary/50 bg-primary/5',
            alert.type === 'warning' && 'border-amber-500/50 bg-amber-500/5',
            alert.type === 'achievement' && 'border-yellow-500/50 bg-yellow-500/5',
            alert.type === 'reminder' && 'border-blue-500/50 bg-blue-500/5'
          )}
        >
          {alert.type === 'achievement' && (
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse" />
          )}
          <CardContent className="p-4 flex items-start gap-3">
            <div className="mt-0.5">{alert.icon}</div>
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{alert.title}</h4>
              <p className="text-sm text-muted-foreground mt-0.5">{alert.message}</p>
            </div>
            {alert.dismissable && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={() => dismissAlert(alert.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
