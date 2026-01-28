import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { WeightProgressChart } from '@/components/progress/WeightProgressChart';
import { WeightLogForm } from '@/components/progress/WeightLogForm';
import { GoalProgressCard } from '@/components/progress/GoalProgressCard';
import { ProgressRing } from '@/components/progress/ProgressRing';
import { MotivationalMessage } from '@/components/progress/MotivationalMessage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Activity, Target, Flame, Loader2 } from 'lucide-react';
import { useWeightLogs } from '@/hooks/useWeightLogs';
import { useMeals } from '@/hooks/useMeals';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

export default function ProgressPage() {
  const { profile } = useAuth();
  const { weightLogs, loading: weightLoading, addWeightLog, getWeightProgress, getChartData } = useWeightLogs();
  const { meals, weeklyStats } = useMeals();

  const weightProgress = getWeightProgress();
  const chartData = getChartData();

  // Calculate weekly averages
  const today = new Date();
  const weekStart = startOfWeek(today);
  const weekEnd = endOfWeek(today);
  const daysThisWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });
  
  const daysLogged = daysThisWeek.filter(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return meals.some(meal => meal.logged_at.startsWith(dayStr));
  }).length;

  const consistencyPercent = Math.round((daysLogged / 7) * 100);

  // Calculate streak
  let streak = 0;
  for (let i = 0; i <= 30; i++) {
    const checkDate = format(subDays(today, i), 'yyyy-MM-dd');
    const hasMeals = meals.some(meal => meal.logged_at.startsWith(checkDate));
    if (hasMeals) {
      streak++;
    } else if (i > 0) {
      break;
    }
  }

  const dailyTarget = profile?.daily_calorie_target || 2000;
  const todayCalories = weeklyStats?.days.find(
    d => d.date === format(today, 'yyyy-MM-dd')
  )?.totalCalories || 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      <main className="container py-6 space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-7 w-7 text-primary" />
            Progress & Goals
          </h1>
          <p className="text-muted-foreground">
            Track your journey to better health
          </p>
        </div>

        <MotivationalMessage />

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <GoalProgressCard
            title="Today's Calories"
            current={todayCalories}
            target={dailyTarget}
            unit="kcal"
            icon="flame"
            color="text-orange-500"
          />
          <GoalProgressCard
            title="Weekly Consistency"
            current={daysLogged}
            target={7}
            unit="days"
            icon="target"
            color="text-blue-500"
          />
          <GoalProgressCard
            title="Logging Streak"
            current={streak}
            target={7}
            unit="days"
            icon="trophy"
            color="text-amber-500"
          />
          <GoalProgressCard
            title="Avg Daily Calories"
            current={weeklyStats?.averageCalories || 0}
            target={dailyTarget}
            unit="kcal"
            icon="trending"
            color="text-green-500"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {weightLoading ? (
              <Card className="glass">
                <CardContent className="py-12 flex items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
              </Card>
            ) : (
              <WeightProgressChart
                data={chartData}
                currentWeight={weightProgress?.currentWeight || null}
                startingWeight={weightProgress?.startingWeight || null}
                change={weightProgress?.change || null}
                percentChange={weightProgress?.percentChange || null}
                trend={(weightProgress?.trend as 'up' | 'down' | 'stable') || null}
              />
            )}
          </div>
          <WeightLogForm
            onSubmit={addWeightLog}
            currentWeight={profile?.weight_kg}
          />
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Weekly Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-6">
              <ProgressRing
                value={consistencyPercent}
                max={100}
                size={150}
                strokeWidth={12}
                label={`${consistencyPercent}%`}
                sublabel="Consistency"
              />
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Macros Average</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Protein</span>
                <span className="font-semibold">{weeklyStats?.averageProtein.toFixed(0) || 0}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Carbs</span>
                <span className="font-semibold">{weeklyStats?.averageCarbs.toFixed(0) || 0}g</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Fat</span>
                <span className="font-semibold">{weeklyStats?.averageFat.toFixed(0) || 0}g</span>
              </div>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Goal Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Current Goal</p>
                <p className="font-semibold capitalize">
                  {profile?.diet_goal?.replace('_', ' ') || 'Not set'}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Daily Target</p>
                <p className="font-semibold">{dailyTarget} kcal</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">Activity Level</p>
                <p className="font-semibold capitalize">
                  {profile?.activity_level || 'Not set'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
