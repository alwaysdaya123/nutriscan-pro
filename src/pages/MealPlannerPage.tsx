import { useState } from 'react';
import { format } from 'date-fns';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { MealPlanCalendar } from '@/components/meal-planner/MealPlanCalendar';
import { DailyMealPlan } from '@/components/meal-planner/DailyMealPlan';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sparkles, Calendar, Loader2, Utensils } from 'lucide-react';
import { useMealPlans } from '@/hooks/useMealPlans';
import { useAuth } from '@/contexts/AuthContext';
import { MotivationalMessage } from '@/components/progress/MotivationalMessage';

export default function MealPlannerPage() {
  const { profile } = useAuth();
  const { mealPlans, loading, generating, generateMealPlan, toggleMealCompletion, deleteMealPlan, getMealsByDate } = useMealPlans();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [planDays, setPlanDays] = useState<string>('7');

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd');
  const mealsForSelectedDate = getMealsByDate(selectedDateStr);

  const handleGeneratePlan = () => {
    generateMealPlan(parseInt(planDays));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      <main className="container py-6 space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="h-7 w-7 text-primary" />
              Meal Planner
            </h1>
            <p className="text-muted-foreground">
              AI-powered personalized meal planning
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={planDays} onValueChange={setPlanDays}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day Plan</SelectItem>
                <SelectItem value="3">3 Day Plan</SelectItem>
                <SelectItem value="7">7 Day Plan</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleGeneratePlan}
              disabled={generating || !profile}
              className="gap-2"
            >
              {generating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Plan
            </Button>
          </div>
        </div>

        <MotivationalMessage />

        {!profile && (
          <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
            <CardContent className="p-4 flex items-center gap-3">
              <Utensils className="h-5 w-5 text-amber-600" />
              <p className="text-sm text-amber-700 dark:text-amber-400">
                Complete your profile to generate personalized meal plans based on your goals.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <MealPlanCalendar
            mealPlans={mealPlans}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
          <DailyMealPlan
            date={selectedDateStr}
            meals={mealsForSelectedDate}
            onToggleComplete={toggleMealCompletion}
            onDelete={deleteMealPlan}
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && mealPlans.length === 0 && (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <Sparkles className="h-12 w-12 text-primary/50 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No meal plans yet</h3>
              <p className="text-muted-foreground mb-4">
                Generate your first AI-powered meal plan to get started
              </p>
              <Button onClick={handleGeneratePlan} disabled={generating || !profile}>
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                Generate Your First Plan
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
