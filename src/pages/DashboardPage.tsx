import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { CalorieProgress } from '@/components/dashboard/CalorieProgress';
import { MacroBreakdown } from '@/components/dashboard/MacroBreakdown';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { RecentMeals } from '@/components/dashboard/RecentMeals';
import { Recommendations } from '@/components/dashboard/Recommendations';
import { useMeals } from '@/hooks/useMeals';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Camera, User } from 'lucide-react';

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
            <h1 className="text-3xl font-bold">
              Welcome back{profile?.full_name ? `, ${profile.full_name.split(' ')[0]}` : ''}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Here's your nutrition summary for today
            </p>
          </div>
          <Link to="/analyze">
            <Button className="gap-2">
              <Camera className="h-4 w-4" />
              Analyze Food
            </Button>
          </Link>
        </div>

        {/* Profile setup prompt */}
        {needsProfileSetup && (
          <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 animate-fade-in">
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

        {/* Dashboard grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column - Main stats */}
          <div className="lg:col-span-2 space-y-6">
            <CalorieProgress todayStats={todayStats} />
            <WeeklyChart weeklyStats={weeklyStats} />
            <RecentMeals meals={meals} />
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            <MacroBreakdown todayStats={todayStats} />
            <Recommendations todayStats={todayStats} />
          </div>
        </div>
      </main>
    </div>
  );
}
