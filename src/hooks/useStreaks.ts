import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, startOfDay, endOfDay, differenceInDays, parseISO } from 'date-fns';

export type StreakData = {
  currentStreak: number;
  longestStreak: number;
  consistencyScore: number;
  lastLoggedDate: string | null;
  streakActive: boolean;
  daysLoggedThisWeek: number;
  daysLoggedThisMonth: number;
};

export function useStreaks() {
  const { user } = useAuth();
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    consistencyScore: 0,
    lastLoggedDate: null,
    streakActive: false,
    daysLoggedThisWeek: 0,
    daysLoggedThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  const calculateStreaks = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch all meals from the last 90 days for streak calculation
      const ninetyDaysAgo = subDays(new Date(), 90);
      
      const { data: meals, error } = await supabase
        .from('meals')
        .select('logged_at')
        .eq('user_id', user.id)
        .gte('logged_at', ninetyDaysAgo.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;

      // Get unique dates with meals
      const datesWithMeals = new Set<string>();
      (meals || []).forEach(meal => {
        const date = format(parseISO(meal.logged_at), 'yyyy-MM-dd');
        datesWithMeals.add(date);
      });

      const sortedDates = Array.from(datesWithMeals).sort().reverse();
      const today = format(new Date(), 'yyyy-MM-dd');
      const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

      // Calculate current streak
      let currentStreak = 0;
      let streakActive = false;

      if (sortedDates.length > 0) {
        const lastLoggedDate = sortedDates[0];
        
        // Check if streak is still active (logged today or yesterday)
        if (lastLoggedDate === today || lastLoggedDate === yesterday) {
          streakActive = true;
          let checkDate = lastLoggedDate === today ? today : yesterday;
          
          for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = format(subDays(new Date(checkDate), i), 'yyyy-MM-dd');
            if (sortedDates.includes(expectedDate)) {
              currentStreak++;
            } else {
              break;
            }
          }
        }
      }

      // Calculate longest streak
      let longestStreak = 0;
      let tempStreak = 0;
      
      for (let i = 0; i < 90; i++) {
        const checkDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
        if (datesWithMeals.has(checkDate)) {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          tempStreak = 0;
        }
      }

      // Calculate days logged this week
      let daysLoggedThisWeek = 0;
      for (let i = 0; i < 7; i++) {
        const checkDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
        if (datesWithMeals.has(checkDate)) {
          daysLoggedThisWeek++;
        }
      }

      // Calculate days logged this month
      let daysLoggedThisMonth = 0;
      for (let i = 0; i < 30; i++) {
        const checkDate = format(subDays(new Date(), i), 'yyyy-MM-dd');
        if (datesWithMeals.has(checkDate)) {
          daysLoggedThisMonth++;
        }
      }

      // Calculate consistency score (percentage of days with meals in the last 30 days)
      const consistencyScore = Math.round((daysLoggedThisMonth / 30) * 100);

      setStreakData({
        currentStreak,
        longestStreak: Math.max(longestStreak, currentStreak),
        consistencyScore,
        lastLoggedDate: sortedDates[0] || null,
        streakActive,
        daysLoggedThisWeek,
        daysLoggedThisMonth,
      });
    } catch (error) {
      console.error('Error calculating streaks:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    calculateStreaks();
  }, [calculateStreaks]);

  return {
    ...streakData,
    loading,
    refresh: calculateStreaks,
  };
}
