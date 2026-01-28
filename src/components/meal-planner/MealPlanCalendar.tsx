import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MealPlan } from '@/types/database';

type MealPlanCalendarProps = {
  mealPlans: MealPlan[];
  onDateSelect: (date: Date) => void;
  selectedDate: Date;
};

export function MealPlanCalendar({ mealPlans, onDateSelect, selectedDate }: MealPlanCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => startOfWeek(new Date()));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const getMealsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return mealPlans.filter(plan => plan.plan_date === dateStr);
  };

  const getCaloriesForDate = (date: Date) => {
    const meals = getMealsForDate(date);
    return meals.reduce((sum, meal) => sum + meal.calories, 0);
  };

  const isToday = (date: Date) => isSameDay(date, new Date());

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Meal Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[140px] text-center">
              {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day) => {
            const calories = getCaloriesForDate(day);
            const hasMeals = getMealsForDate(day).length > 0;
            const isSelected = isSameDay(day, selectedDate);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  'p-3 rounded-xl text-center transition-all hover:bg-muted/50',
                  isSelected && 'ring-2 ring-primary bg-primary/10',
                  isToday(day) && !isSelected && 'bg-muted'
                )}
              >
                <p className="text-xs text-muted-foreground font-medium">
                  {format(day, 'EEE')}
                </p>
                <p className={cn(
                  'text-lg font-semibold',
                  isToday(day) && 'text-primary'
                )}>
                  {format(day, 'd')}
                </p>
                {hasMeals && (
                  <p className="text-xs text-primary font-medium mt-1">
                    {calories} kcal
                  </p>
                )}
                {!hasMeals && (
                  <p className="text-xs text-muted-foreground mt-1">
                    No plan
                  </p>
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
