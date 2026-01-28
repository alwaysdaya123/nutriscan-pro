import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { MealPlan, Profile } from '@/types/database';
import { format, addDays, startOfWeek } from 'date-fns';

export function useMealPlans() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (user) {
      fetchMealPlans();
    }
  }, [user]);

  const fetchMealPlans = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('meal_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('plan_date', { ascending: true })
        .order('meal_type', { ascending: true });

      if (error) throw error;
      setMealPlans(data as MealPlan[]);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMealPlan = async (days: number = 7) => {
    if (!user || !profile) {
      toast({
        title: 'Profile required',
        description: 'Please complete your profile first.',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await supabase.functions.invoke('generate-meal-plan', {
        body: {
          dietGoal: profile.diet_goal || 'maintenance',
          dailyCalorieTarget: profile.daily_calorie_target || 2000,
          dietaryPreference: (profile as any).dietary_preference || 'non-veg',
          days,
        },
      });

      if (response.error) throw response.error;

      const { mealPlans: generatedPlans } = response.data;
      
      // Delete existing future meal plans
      const today = format(new Date(), 'yyyy-MM-dd');
      await supabase
        .from('meal_plans')
        .delete()
        .eq('user_id', user.id)
        .gte('plan_date', today);

      // Insert new meal plans
      const startDate = new Date();
      const plansToInsert: any[] = [];

      generatedPlans.forEach((dayPlan: any) => {
        const planDate = format(addDays(startDate, dayPlan.day - 1), 'yyyy-MM-dd');
        dayPlan.meals.forEach((meal: any) => {
          plansToInsert.push({
            user_id: user.id,
            plan_date: planDate,
            meal_type: meal.meal_type,
            food_name: meal.food_name,
            description: meal.description,
            calories: meal.calories,
            protein: meal.protein || 0,
            carbs: meal.carbs || 0,
            fat: meal.fat || 0,
            is_completed: false,
          });
        });
      });

      const { error: insertError } = await supabase
        .from('meal_plans')
        .insert(plansToInsert);

      if (insertError) throw insertError;

      toast({
        title: 'Meal plan generated!',
        description: `Your ${days}-day meal plan is ready.`,
      });

      await fetchMealPlans();
    } catch (error: any) {
      console.error('Error generating meal plan:', error);
      toast({
        title: 'Generation failed',
        description: error.message || 'Failed to generate meal plan.',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const toggleMealCompletion = async (mealPlanId: string, isCompleted: boolean) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .update({ is_completed: !isCompleted })
        .eq('id', mealPlanId);

      if (error) throw error;

      setMealPlans(prev =>
        prev.map(plan =>
          plan.id === mealPlanId ? { ...plan, is_completed: !isCompleted } : plan
        )
      );
    } catch (error) {
      console.error('Error toggling meal completion:', error);
    }
  };

  const deleteMealPlan = async (mealPlanId: string) => {
    try {
      const { error } = await supabase
        .from('meal_plans')
        .delete()
        .eq('id', mealPlanId);

      if (error) throw error;

      setMealPlans(prev => prev.filter(plan => plan.id !== mealPlanId));
    } catch (error) {
      console.error('Error deleting meal plan:', error);
    }
  };

  const getMealsByDate = (date: string) => {
    return mealPlans.filter(plan => plan.plan_date === date);
  };

  const getWeeklyCalories = () => {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const weekDates = Array.from({ length: 7 }, (_, i) => 
      format(addDays(weekStart, i), 'yyyy-MM-dd')
    );

    return weekDates.map(date => ({
      date,
      calories: mealPlans
        .filter(plan => plan.plan_date === date)
        .reduce((sum, plan) => sum + plan.calories, 0),
    }));
  };

  return {
    mealPlans,
    loading,
    generating,
    generateMealPlan,
    toggleMealCompletion,
    deleteMealPlan,
    getMealsByDate,
    getWeeklyCalories,
    refreshMealPlans: fetchMealPlans,
  };
}
