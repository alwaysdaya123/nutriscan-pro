import { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useMeals } from '@/hooks/useMeals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { UtensilsCrossed, Clock, Trash2, Camera, Coffee, Sun, Moon, Cookie } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';
import type { Meal } from '@/types/database';

const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

const mealTypeColors: Record<string, string> = {
  breakfast: 'bg-amber-100 text-amber-700',
  lunch: 'bg-green-100 text-green-700',
  dinner: 'bg-blue-100 text-blue-700',
  snack: 'bg-purple-100 text-purple-700',
};

export default function MealsPage() {
  const { meals, todayStats, deleteMeal, loading } = useMeals();
  const [filterType, setFilterType] = useState<string>('all');
  const [mealToDelete, setMealToDelete] = useState<Meal | null>(null);

  const filteredMeals = filterType === 'all' 
    ? meals 
    : meals.filter(m => m.meal_type === filterType);

  const groupedMeals = {
    breakfast: meals.filter(m => m.meal_type === 'breakfast'),
    lunch: meals.filter(m => m.meal_type === 'lunch'),
    dinner: meals.filter(m => m.meal_type === 'dinner'),
    snack: meals.filter(m => m.meal_type === 'snack'),
  };

  const handleDelete = async () => {
    if (mealToDelete) {
      await deleteMeal(mealToDelete.id);
      setMealToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="container py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Today's Meals</h1>
            <p className="text-muted-foreground mt-1">
              {todayStats?.mealCount || 0} meals logged • {todayStats?.totalCalories.toLocaleString() || 0} calories
            </p>
          </div>
          <Link to="/analyze">
            <Button className="gap-2">
              <Camera className="h-4 w-4" />
              Add Meal
            </Button>
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Object.entries(groupedMeals).map(([type, typeMeals]) => {
            const Icon = mealTypeIcons[type as keyof typeof mealTypeIcons];
            const calories = typeMeals.reduce((sum, m) => sum + m.calories, 0);
            return (
              <Card key={type} className="glass">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${mealTypeColors[type]}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm capitalize font-medium">{type}</p>
                      <p className="text-lg font-bold">{calories} kcal</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4 mb-6">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Meals</SelectItem>
              <SelectItem value="breakfast">Breakfast</SelectItem>
              <SelectItem value="lunch">Lunch</SelectItem>
              <SelectItem value="dinner">Dinner</SelectItem>
              <SelectItem value="snack">Snacks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Meals list */}
        {filteredMeals.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <UtensilsCrossed className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-medium mb-2">No meals logged yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by analyzing your food to track your nutrition
              </p>
              <Link to="/analyze">
                <Button>Analyze Your First Meal</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredMeals.map((meal) => {
              const Icon = mealTypeIcons[meal.meal_type as keyof typeof mealTypeIcons];
              return (
                <Card key={meal.id} className="glass hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${mealTypeColors[meal.meal_type]}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-lg">{meal.food_name}</h3>
                            {meal.description && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {meal.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{format(parseISO(meal.logged_at), 'h:mm a')}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${mealTypeColors[meal.meal_type]}`}
                              >
                                {meal.meal_type}
                              </Badge>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary">{meal.calories}</p>
                            <p className="text-sm text-muted-foreground">calories</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                          <div className="text-center">
                            <p className="text-lg font-semibold">{Math.round(Number(meal.protein))}g</p>
                            <p className="text-xs text-muted-foreground">Protein</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">{Math.round(Number(meal.carbs))}g</p>
                            <p className="text-xs text-muted-foreground">Carbs</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-semibold">{Math.round(Number(meal.fat))}g</p>
                            <p className="text-xs text-muted-foreground">Fat</p>
                          </div>
                          
                          <div className="flex-1" />
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => setMealToDelete(meal)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>

      {/* Delete confirmation */}
      <AlertDialog open={!!mealToDelete} onOpenChange={() => setMealToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Meal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{mealToDelete?.food_name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
