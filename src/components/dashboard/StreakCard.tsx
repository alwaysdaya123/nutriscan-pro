import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Flame, Trophy, Calendar, TrendingUp, Zap } from 'lucide-react';
import { useStreaks } from '@/hooks/useStreaks';
import { Skeleton } from '@/components/ui/skeleton';

export function StreakCard() {
  const { 
    currentStreak, 
    longestStreak, 
    consistencyScore, 
    streakActive, 
    daysLoggedThisWeek,
    loading 
  } = useStreaks();

  const getStreakBadge = () => {
    if (currentStreak >= 30) return { label: '🏆 Champion', color: 'bg-yellow-500 text-white' };
    if (currentStreak >= 14) return { label: '🔥 On Fire', color: 'bg-orange-500 text-white' };
    if (currentStreak >= 7) return { label: '⭐ Weekly Star', color: 'bg-blue-500 text-white' };
    if (currentStreak >= 3) return { label: '💪 Building', color: 'bg-primary text-primary-foreground' };
    return null;
  };

  const badge = getStreakBadge();

  if (loading) {
    return (
      <Card className="glass">
        <CardHeader className="pb-2">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass overflow-hidden">
      <div className={`h-1 ${streakActive ? 'bg-gradient-to-r from-orange-400 via-red-500 to-pink-500' : 'bg-muted'}`} />
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Flame className={`h-5 w-5 ${streakActive ? 'text-orange-500 animate-pulse' : 'text-muted-foreground'}`} />
            Meal Streak
          </span>
          {badge && (
            <Badge className={`${badge.color} animate-scale-in`}>
              {badge.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <div className={`text-4xl font-bold ${streakActive ? 'text-orange-500' : 'text-muted-foreground'}`}>
              {currentStreak}
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>
          <div className="h-12 w-px bg-border" />
          <div className="text-center flex-1">
            <div className="text-2xl font-semibold text-primary flex items-center justify-center gap-1">
              <Trophy className="h-5 w-5" />
              {longestStreak}
            </div>
            <p className="text-sm text-muted-foreground">Best Streak</p>
          </div>
        </div>

        {/* Consistency Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Consistency (30 days)
            </span>
            <span className="font-medium">{consistencyScore}%</span>
          </div>
          <Progress value={consistencyScore} className="h-2" />
        </div>

        {/* Weekly Progress */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">This Week</span>
          </div>
          <div className="flex items-center gap-1">
            {[...Array(7)].map((_, i) => (
              <div
                key={i}
                className={`h-3 w-3 rounded-full transition-all ${
                  i < daysLoggedThisWeek 
                    ? 'bg-primary scale-110' 
                    : 'bg-muted-foreground/20'
                }`}
              />
            ))}
            <span className="ml-2 text-sm font-medium">{daysLoggedThisWeek}/7</span>
          </div>
        </div>

        {!streakActive && currentStreak === 0 && (
          <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 text-sm animate-fade-in">
            <Zap className="h-4 w-4 text-primary" />
            <span>Log a meal today to start your streak!</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
