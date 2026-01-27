import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UtensilsCrossed, ArrowRight, Clock } from 'lucide-react';
import type { Meal } from '@/types/database';
import { format, parseISO } from 'date-fns';

type RecentMealsProps = {
  meals: Meal[];
};

const mealTypeColors: Record<string, string> = {
  breakfast: 'bg-amber-100 text-amber-700',
  lunch: 'bg-green-100 text-green-700',
  dinner: 'bg-blue-100 text-blue-700',
  snack: 'bg-purple-100 text-purple-700',
};

export function RecentMeals({ meals }: RecentMealsProps) {
  const recentMeals = meals.slice(0, 4);

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Today's Meals</span>
          <Link to="/meals">
            <Button variant="ghost" size="sm" className="gap-1">
              View all
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentMeals.length === 0 ? (
          <div className="text-center py-8">
            <UtensilsCrossed className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
            <p className="text-muted-foreground mb-3">No meals logged today</p>
            <Link to="/analyze">
              <Button size="sm">Analyze Your First Meal</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentMeals.map((meal) => (
              <div
                key={meal.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
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
                    <span>{meal.calories} kcal</span>
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
