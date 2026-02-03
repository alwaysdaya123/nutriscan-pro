import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CalorieProgress } from '@/components/dashboard/CalorieProgress';
import { MacroBreakdown } from '@/components/dashboard/MacroBreakdown';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecentMeals } from '@/components/dashboard/RecentMeals';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { StreakCard } from '@/components/dashboard/StreakCard';
import { GoalAlerts } from '@/components/dashboard/GoalAlerts';
import { AverageHealthScore } from '@/components/dashboard/AverageHealthScore';
import { FloatingActionButton } from '@/components/ui/floating-action-button';
import { useMeals } from '@/hooks/useMeals';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, User, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const { profile } = useAuth();
  const { meals, todayStats, weeklyStats } = useMeals();

  const needsProfileSetup = !profile?.age || !profile?.height_cm || !profile?.weight_kg;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold animate-fade-in">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground mt-1 animate-fade-in" style={{ animationDelay: '100ms' }}>
              Here's your nutrition summary for today
            </p>
          </div>
          <Link to="/analyze">
            <Button className="gap-2 animate-scale-in">
              <Camera className="h-4 w-4" />
              Analyze Food
            </Button>
          </Link>
        </div>

        {/* Goal-based alerts */}
        <GoalAlerts 
          todayStats={todayStats} 
          weeklyStats={weeklyStats} 
          mealCount={meals.length} 
        />

        {/* Profile setup prompt */}
        {needsProfileSetup && (
          <div className="my-6 p-4 rounded-xl bg-primary/10 border border-primary/20 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/20">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Complete Your Profile</h3>
                  <p className="text-sm text-muted-foreground">
                    Set up your health profile to get personalized calorie recommendations
                  </p>
                </div>
              </div>
              <Link to="/profile">
                <Button variant="outline" size="sm">
                  Complete Profile
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* First-time user guidance */}
        {meals.length === 0 && !needsProfileSetup && (
          <div className="my-6 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/20 border border-primary/20 animate-slide-up">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/20">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">Ready to Start Your Journey?</h3>
                <p className="text-muted-foreground mt-1">
                  Log your first meal to begin tracking your nutrition and building healthy habits.
                </p>
              </div>
              <Link to="/analyze">
                <Button className="gap-2">
                  <Camera className="h-4 w-4" />
                  Log First Meal
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Dashboard grid */}
        <div className="grid gap-6 lg:grid-cols-3 mt-6">
          {/* Left column - Main stats */}
          <div className="lg:col-span-2 space-y-6">
            <CalorieProgress todayStats={todayStats} />
            <StreakCard />
            <WeeklyChart weeklyStats={weeklyStats} />
            <RecentMeals meals={meals} />
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            <AverageHealthScore todayStats={todayStats} weeklyStats={weeklyStats} />
            <MacroBreakdown todayStats={todayStats} />
            <Recommendations todayStats={todayStats} />
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
