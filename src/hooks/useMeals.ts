import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Meal, MealInsert, DailyStats, WeeklyStats } from '@/types/database';
import { useToast } from '@/hooks/use-toast';
import { format, startOfDay, endOfDay, subDays, parseISO } from 'date-fns';

export function useMeals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(false);
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats | null>(null);

  const fetchTodayMeals = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      const today = new Date();
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', startOfDay(today).toISOString())
        .lte('logged_at', endOfDay(today).toISOString())
        .order('logged_at', { ascending: false });
      
      if (error) throw error;
      
      const typedMeals = (data || []) as Meal[];
      setMeals(typedMeals);
      
      // Calculate today's stats
      const mealsWithScores = typedMeals.filter(m => m.health_score !== null);
      const avgHealthScore = mealsWithScores.length > 0
        ? mealsWithScores.reduce((sum, m) => sum + (m.health_score || 0), 0) / mealsWithScores.length
        : null;
      
      const stats: DailyStats = {
        date: format(today, 'yyyy-MM-dd'),
        totalCalories: typedMeals.reduce((sum, m) => sum + m.calories, 0),
        totalProtein: typedMeals.reduce((sum, m) => sum + Number(m.protein), 0),
        totalCarbs: typedMeals.reduce((sum, m) => sum + Number(m.carbs), 0),
        totalFat: typedMeals.reduce((sum, m) => sum + Number(m.fat), 0),
        mealCount: typedMeals.length,
        averageHealthScore: avgHealthScore,
      };
      setTodayStats(stats);
      
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchWeeklyStats = useCallback(async () => {
    if (!user) return;
    
    try {
      const today = new Date();
      const weekAgo = subDays(today, 6);
      
      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', startOfDay(weekAgo).toISOString())
        .lte('logged_at', endOfDay(today).toISOString())
        .order('logged_at', { ascending: true });
      
      if (error) throw error;
      
      const typedMeals = (data || []) as Meal[];
      
      // Group by day
      const dayMap = new Map<string, DailyStats>();
      
      for (let i = 0; i <= 6; i++) {
        const date = format(subDays(today, 6 - i), 'yyyy-MM-dd');
        dayMap.set(date, {
          date,
          totalCalories: 0,
          totalProtein: 0,
          totalCarbs: 0,
          totalFat: 0,
          mealCount: 0,
          averageHealthScore: null,
        });
      }
      
      typedMeals.forEach(meal => {
        const date = format(parseISO(meal.logged_at), 'yyyy-MM-dd');
        const existing = dayMap.get(date);
        if (existing) {
          existing.totalCalories += meal.calories;
          existing.totalProtein += Number(meal.protein);
          existing.totalCarbs += Number(meal.carbs);
          existing.totalFat += Number(meal.fat);
          existing.mealCount += 1;
        }
      });
      
      const days = Array.from(dayMap.values());
      const daysWithData = days.filter(d => d.mealCount > 0);
      
      // Calculate overall average health score
      const allMealsWithScores = typedMeals.filter(m => m.health_score !== null);
      const avgWeeklyHealthScore = allMealsWithScores.length > 0
        ? allMealsWithScores.reduce((sum, m) => sum + (m.health_score || 0), 0) / allMealsWithScores.length
        : null;
      
      setWeeklyStats({
        days,
        averageCalories: daysWithData.length > 0 
          ? Math.round(daysWithData.reduce((sum, d) => sum + d.totalCalories, 0) / daysWithData.length)
          : 0,
        averageProtein: daysWithData.length > 0
          ? Math.round(daysWithData.reduce((sum, d) => sum + d.totalProtein, 0) / daysWithData.length)
          : 0,
        averageCarbs: daysWithData.length > 0
          ? Math.round(daysWithData.reduce((sum, d) => sum + d.totalCarbs, 0) / daysWithData.length)
          : 0,
        averageFat: daysWithData.length > 0
          ? Math.round(daysWithData.reduce((sum, d) => sum + d.totalFat, 0) / daysWithData.length)
          : 0,
        averageHealthScore: avgWeeklyHealthScore,
      });
      
    } catch (error) {
      console.error('Error fetching weekly stats:', error);
    }
  }, [user]);

  const addMeal = useCallback(async (meal: Omit<MealInsert, 'user_id'>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    try {
      const { error } = await supabase
        .from('meals')
        .insert({
          ...meal,
          user_id: user.id,
        });
      
      if (error) throw error;
      
      toast({
        title: 'Meal logged',
        description: `${meal.food_name} has been added to your diary.`,
      });
      
      await fetchTodayMeals();
      await fetchWeeklyStats();
      
      return { error: null };
    } catch (error) {
      console.error('Error adding meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to log meal. Please try again.',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  }, [user, toast, fetchTodayMeals, fetchWeeklyStats]);

  const deleteMeal = useCallback(async (mealId: string) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    try {
      const { error } = await supabase
        .from('meals')
        .delete()
        .eq('id', mealId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Meal deleted',
        description: 'The meal has been removed from your diary.',
      });
      
      await fetchTodayMeals();
      await fetchWeeklyStats();
      
      return { error: null };
    } catch (error) {
      console.error('Error deleting meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete meal. Please try again.',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  }, [user, toast, fetchTodayMeals, fetchWeeklyStats]);

  const updateMeal = useCallback(async (mealId: string, updates: Partial<Meal>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    try {
      const { error } = await supabase
        .from('meals')
        .update(updates)
        .eq('id', mealId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast({
        title: 'Meal updated',
        description: 'Your meal has been updated successfully.',
      });
      
      await fetchTodayMeals();
      await fetchWeeklyStats();
      
      return { error: null };
    } catch (error) {
      console.error('Error updating meal:', error);
      toast({
        title: 'Error',
        description: 'Failed to update meal. Please try again.',
        variant: 'destructive',
      });
      return { error: error as Error };
    }
  }, [user, toast, fetchTodayMeals, fetchWeeklyStats]);

  useEffect(() => {
    if (user) {
      fetchTodayMeals();
      fetchWeeklyStats();
    }
  }, [user, fetchTodayMeals, fetchWeeklyStats]);

  return {
    meals,
    todayStats,
    weeklyStats,
    loading,
    addMeal,
    deleteMeal,
    updateMeal,
    refreshMeals: fetchTodayMeals,
  };
}
