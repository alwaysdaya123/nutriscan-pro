import { Award, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { DailyStats, WeeklyStats } from '@/types/database';

interface AverageHealthScoreProps {
  todayStats: DailyStats | null;
  weeklyStats: WeeklyStats | null;
}

function getScoreConfig(score: number | null) {
  if (score === null) return { color: 'text-muted-foreground', bg: 'bg-muted', label: 'No data' };
  if (score >= 80) return { color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'Excellent' };
  if (score >= 60) return { color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30', label: 'Good' };
  if (score >= 40) return { color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Average' };
  return { color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30', label: 'Poor' };
}

export function AverageHealthScore({ todayStats, weeklyStats }: AverageHealthScoreProps) {
  const todayScore = todayStats?.averageHealthScore ?? null;
  const weeklyScore = weeklyStats?.averageHealthScore ?? null;
  
  const todayConfig = getScoreConfig(todayScore);
  const weeklyConfig = getScoreConfig(weeklyScore);
  
  // Calculate trend
  let TrendIcon = Minus;
  let trendText = 'No change';
  let trendColor = 'text-muted-foreground';
  
  if (todayScore !== null && weeklyScore !== null) {
    const diff = todayScore - weeklyScore;
    if (diff > 5) {
      TrendIcon = TrendingUp;
      trendText = `+${Math.round(diff)} from average`;
      trendColor = 'text-emerald-600';
    } else if (diff < -5) {
      TrendIcon = TrendingDown;
      trendText = `${Math.round(diff)} from average`;
      trendColor = 'text-red-600';
    }
  }

  return (
    <Card className="animate-fade-in" style={{ animationDelay: '200ms' }}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Award className="h-4 w-4 text-primary" />
          Health Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Score */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Today</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-2xl font-bold", todayConfig.color)}>
                {todayScore !== null ? Math.round(todayScore) : '—'}
              </span>
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                todayConfig.bg, todayConfig.color
              )}>
                {todayConfig.label}
              </span>
            </div>
          </div>
          
          {/* Trend indicator */}
          {todayScore !== null && weeklyScore !== null && (
            <div className={cn("flex items-center gap-1 text-sm", trendColor)}>
              <TrendIcon className="h-4 w-4" />
              <span>{trendText}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Weekly Average */}
        <div>
          <p className="text-sm text-muted-foreground">7-Day Average</p>
          <div className="flex items-center gap-2 mt-1">
            <span className={cn("text-xl font-semibold", weeklyConfig.color)}>
              {weeklyScore !== null ? Math.round(weeklyScore) : '—'}
            </span>
            <span className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full",
              weeklyConfig.bg, weeklyConfig.color
            )}>
              {weeklyConfig.label}
            </span>
          </div>
        </div>

        {/* Motivational message */}
        {todayScore !== null && (
          <p className="text-xs text-muted-foreground pt-2 border-t">
            {todayScore >= 80 
              ? "🌟 Outstanding! Keep making healthy choices!" 
              : todayScore >= 60 
              ? "👍 You're doing well! A few tweaks could make it even better."
              : todayScore >= 40
              ? "💪 Room for improvement. Try adding more vegetables!"
              : "🎯 Focus on balanced meals with more protein and fiber."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
