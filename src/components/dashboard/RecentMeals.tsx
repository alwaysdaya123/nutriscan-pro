import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, ArrowRight, Clock, Sparkles, Camera } from 'lucide-react';
import type { Meal } from '@/types/database';
import { format, parseISO } from 'date-fns';

type RecentMealsProps = {
  meals: Meal[];
};

const mealTypeColors: Record<string, string> = {
  breakfast: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  lunch: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  dinner: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  snack: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export function RecentMeals({ meals }: RecentMealsProps) {
  const recentMeals = meals.slice(0, 4);

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Today's Meals</span>
          <Link to="/meals">
            <Button variant="ghost" size="sm" className="gap-1 transition-all hover:translate-x-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentMeals.length === 0 ? (
          <div className="text-center py-10 animate-fade-in">
            <div className="relative inline-block">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-4 mx-auto">
                <UtensilsCrossed className="h-10 w-10 text-muted-foreground/50" />
              </div>
              <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center animate-bounce-subtle">
                <Sparkles className="h-3 w-3 text-primary" />
              </div>
            </div>
            <h4 className="font-medium text-muted-foreground mb-2">No meals logged today</h4>
            <p className="text-sm text-muted-foreground/70 mb-4 max-w-xs mx-auto">
              Start tracking your nutrition by analyzing your first meal of the day
            </p>
            <Link to="/analyze">
              <Button size="sm" className="gap-2 animate-scale-in">
                <Camera className="h-4 w-4" />
                Analyze Your First Meal
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMeals.map((meal, index) => (
              <div
                key={meal.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all hover:scale-[1.01] animate-slide-up"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium truncate">{meal.food_name}</h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${mealTypeColors[meal.meal_type]}`}
                    >
                      {meal.meal_type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{format(parseISO(meal.logged_at), 'h:mm a')}</span>
                    <span>•</span>
                    <span className="font-medium">{meal.calories} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
