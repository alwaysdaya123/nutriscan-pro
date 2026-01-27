import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Target, TrendingUp, TrendingDown } from 'lucide-react';
import type { DailyStats } from '@/types/database';

type CalorieProgressProps = {
  todayStats: DailyStats | null;
};

export function CalorieProgress({ todayStats }: CalorieProgressProps) {
  const { profile } = useAuth();

  const target = profile?.daily_calorie_target || 2000;
  const consumed = todayStats?.totalCalories || 0;
  const remaining = target - consumed;
  const percentage = Math.min((consumed / target) * 100, 100);

  const getStatusColor = () => {
    if (percentage > 100) return 'text-destructive';
    if (percentage >= 90) return 'text-amber-500';
    return 'text-primary';
  };

  const getStatusIcon = () => {
    if (percentage > 100) return <TrendingUp className="h-5 w-5 text-destructive" />;
    if (percentage >= 90) return <Target className="h-5 w-5 text-amber-500" />;
    return <Flame className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Today's Calories</span>
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className={`text-4xl font-bold ${getStatusColor()}`}>
              {consumed.toLocaleString()}
            </span>
            <span className="text-lg text-muted-foreground ml-1">
              / {target.toLocaleString()} kcal
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-semibold">
              {remaining > 0 ? remaining.toLocaleString() : 0}
            </span>
            <p className="text-sm text-muted-foreground">remaining</p>
          </div>
        </div>

        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>{Math.round(percentage)}% of daily goal</span>
            <span>100%</span>
          </div>
        </div>

        {percentage > 100 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            <TrendingDown className="h-4 w-4" />
            <span>You've exceeded your daily goal by {(consumed - target).toLocaleString()} kcal</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
