import { useState, useEffect, useCallback } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, FileText, Table, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import type { Meal } from '@/types/database';
import { EmptyState } from '@/components/ui/empty-state';

type GroupedMeals = {
  [date: string]: Meal[];
};

export default function DietHistoryPage() {
  const { user } = useAuth();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [exporting, setExporting] = useState(false);

  const fetchMeals = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', start.toISOString())
        .lte('logged_at', end.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setMeals((data || []) as Meal[]);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const groupedMeals: GroupedMeals = meals.reduce((acc, meal) => {
    const date = format(parseISO(meal.logged_at), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as GroupedMeals);

  const exportAsCSV = () => {
    setExporting(true);
    try {
      const headers = ['Date', 'Time', 'Food', 'Meal Type', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)', 'Sugar (g)', 'Sodium (mg)'];
      const rows = meals.map(meal => [
        format(parseISO(meal.logged_at), 'yyyy-MM-dd'),
        format(parseISO(meal.logged_at), 'HH:mm'),
        meal.food_name,
        meal.meal_type,
        meal.calories,
        meal.protein,
        meal.carbs,
        meal.fat,
        meal.fiber,
        meal.sugar,
        meal.sodium,
      ]);

      const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `nutriscan-diet-${format(currentMonth, 'yyyy-MM')}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting(false);
    }
  };

  const generateReport = () => {
    const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
    const avgCalories = meals.length > 0 ? Math.round(totalCalories / Object.keys(groupedMeals).length) : 0;
    const totalProtein = meals.reduce((sum, m) => sum + Number(m.protein), 0);
    const totalCarbs = meals.reduce((sum, m) => sum + Number(m.carbs), 0);
    const totalFat = meals.reduce((sum, m) => sum + Number(m.fat), 0);

    const reportContent = `
NutriScan Monthly Diet Report
=============================
Month: ${format(currentMonth, 'MMMM yyyy')}
Generated: ${format(new Date(), 'PPP')}

Summary Statistics
------------------
Total Meals Logged: ${meals.length}
Days with Logged Meals: ${Object.keys(groupedMeals).length}
Total Calories: ${totalCalories.toLocaleString()} kcal
Average Daily Calories: ${avgCalories.toLocaleString()} kcal

Macronutrient Totals
--------------------
Protein: ${totalProtein.toFixed(1)}g
Carbohydrates: ${totalCarbs.toFixed(1)}g
Fat: ${totalFat.toFixed(1)}g

Meal Type Breakdown
-------------------
Breakfast: ${meals.filter(m => m.meal_type === 'breakfast').length} meals
Lunch: ${meals.filter(m => m.meal_type === 'lunch').length} meals
Dinner: ${meals.filter(m => m.meal_type === 'dinner').length} meals
Snacks: ${meals.filter(m => m.meal_type === 'snack').length} meals

Note: This report is based on AI-estimated nutritional values.
Actual values may vary. For precise dietary planning, consult a nutritionist.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nutriscan-report-${format(currentMonth, 'yyyy-MM')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const mealTypeColors: Record<string, string> = {
    breakfast: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    lunch: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    dinner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    snack: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />

      <main className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Diet History</h1>
            <p className="text-muted-foreground mt-1">
              View and export your meal history
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportAsCSV} disabled={exporting || meals.length === 0}>
              <Table className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={generateReport} disabled={meals.length === 0}>
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <Card className="glass mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                disabled={currentMonth >= new Date()}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {!loading && meals.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{meals.length}</p>
                <p className="text-sm text-muted-foreground">Meals Logged</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{Object.keys(groupedMeals).length}</p>
                <p className="text-sm text-muted-foreground">Days Tracked</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {meals.reduce((sum, m) => sum + m.calories, 0).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">Total Calories</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">
                  {meals.length > 0 
                    ? Math.round(meals.reduce((sum, m) => sum + m.calories, 0) / Object.keys(groupedMeals).length).toLocaleString()
                    : 0
                  }
                </p>
                <p className="text-sm text-muted-foreground">Avg Daily Calories</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Meals Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="No meals logged this month"
            description="Start tracking your meals to see your diet history here."
            action={{
              label: 'Analyze Food',
              href: '/analyze',
            }}
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMeals)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, dayMeals]) => {
                const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
                return (
                  <Card key={date} className="glass animate-fade-in">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {format(parseISO(date), 'EEEE, MMMM d')}
                        </CardTitle>
                        <Badge variant="secondary" className="font-mono">
                          {dayCalories.toLocaleString()} kcal
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dayMeals.map(meal => (
                          <div
                            key={meal.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium truncate">{meal.food_name}</span>
                                <Badge className={mealTypeColors[meal.meal_type]} variant="secondary">
                                  {meal.meal_type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(parseISO(meal.logged_at), 'h:mm a')} • {meal.serving_size || 'Standard serving'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{meal.calories} kcal</p>
                              <p className="text-xs text-muted-foreground">
                                P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
