import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2, Utensils, Coffee, Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MealPlan } from '@/types/database';

type DailyMealPlanProps = {
  date: string;
  meals: MealPlan[];
  onToggleComplete: (id: string, isCompleted: boolean) => void;
  onDelete: (id: string) => void;
};

const mealTypeConfig = {
  breakfast: { icon: Coffee, label: 'Breakfast', color: 'text-amber-500' },
  lunch: { icon: Sun, label: 'Lunch', color: 'text-orange-500' },
  dinner: { icon: Moon, label: 'Dinner', color: 'text-indigo-500' },
  snack: { icon: Utensils, label: 'Snack', color: 'text-green-500' },
};

export function DailyMealPlan({ date, meals, onToggleComplete, onDelete }: DailyMealPlanProps) {
  const sortedMeals = [...meals].sort((a, b) => {
    const order = ['breakfast', 'lunch', 'dinner', 'snack'];
    return order.indexOf(a.meal_type) - order.indexOf(b.meal_type);
  });

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const completedCalories = meals
    .filter(meal => meal.is_completed)
    .reduce((sum, meal) => sum + meal.calories, 0);

  if (meals.length === 0) {
    return (
      <Card className="glass">
        <CardContent className="p-6 text-center">
          <Utensils className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
          <p className="text-muted-foreground">No meal plan for this day</p>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a meal plan to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </CardTitle>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {completedCalories} / {totalCalories} kcal
            </p>
            <div className="w-24 h-1.5 bg-muted rounded-full mt-1">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${(completedCalories / totalCalories) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedMeals.map((meal) => {
          const config = mealTypeConfig[meal.meal_type as keyof typeof mealTypeConfig];
          const Icon = config.icon;

          return (
            <div
              key={meal.id}
              className={cn(
                'p-4 rounded-xl border transition-all',
                meal.is_completed
                  ? 'bg-muted/50 border-muted'
                  : 'bg-background border-border hover:border-primary/50'
              )}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={meal.is_completed}
                  onCheckedChange={() => onToggleComplete(meal.id, meal.is_completed)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className={cn('h-4 w-4', config.color)} />
                    <span className="text-xs font-medium text-muted-foreground uppercase">
                      {config.label}
                    </span>
                  </div>
                  <p className={cn(
                    'font-medium',
                    meal.is_completed && 'line-through text-muted-foreground'
                  )}>
                    {meal.food_name}
                  </p>
                  {meal.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {meal.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="font-semibold text-primary">{meal.calories} kcal</span>
                    <span className="text-muted-foreground">P: {meal.protein}g</span>
                    <span className="text-muted-foreground">C: {meal.carbs}g</span>
                    <span className="text-muted-foreground">F: {meal.fat}g</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={() => onDelete(meal.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
