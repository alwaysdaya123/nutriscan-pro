import { useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import type { DailyStats } from '@/types/database';

type Recommendation = {
  type: 'success' | 'warning' | 'info';
  title: string;
  description: string;
  icon: 'check' | 'alert' | 'info' | 'flame' | 'target';
};

type FoodSuggestion = {
  name: string;
  category: string;
  calories: number;
  reason: string;
};

export function useRecommendations(todayStats: DailyStats | null) {
  const { profile } = useAuth();

  const recommendations = useMemo((): Recommendation[] => {
    if (!profile || !todayStats) return [];

    const target = profile.daily_calorie_target;
    const consumed = todayStats.totalCalories;
    const remaining = target - consumed;
    const percentConsumed = (consumed / target) * 100;
    
    const recs: Recommendation[] = [];

    // Calorie status
    if (percentConsumed < 50 && new Date().getHours() >= 14) {
      recs.push({
        type: 'warning',
        title: 'Under-eating Alert',
        description: `You've only consumed ${consumed} of ${target} calories. Consider having a balanced meal soon.`,
        icon: 'alert',
      });
    } else if (percentConsumed >= 100) {
      if (percentConsumed > 120) {
        recs.push({
          type: 'warning',
          title: 'Calorie Surplus',
          description: `You've exceeded your daily goal by ${consumed - target} calories. Consider lighter meals for the rest of the day.`,
          icon: 'alert',
        });
      } else {
        recs.push({
          type: 'success',
          title: 'Goal Reached',
          description: `You've met your daily calorie goal of ${target} calories.`,
          icon: 'check',
        });
      }
    } else if (percentConsumed >= 80) {
      recs.push({
        type: 'info',
        title: 'Almost There',
        description: `You have ${remaining} calories remaining for today. A light snack would be perfect.`,
        icon: 'target',
      });
    }

    // Protein recommendations
    const proteinTarget = profile.weight_kg ? profile.weight_kg * 1.6 : 100;
    if (todayStats.totalProtein < proteinTarget * 0.5 && new Date().getHours() >= 12) {
      recs.push({
        type: 'info',
        title: 'Protein Boost Needed',
        description: `Consider adding protein-rich foods. You've had ${Math.round(todayStats.totalProtein)}g of ~${Math.round(proteinTarget)}g target.`,
        icon: 'flame',
      });
    }

    // Diet goal specific recommendations
    if (profile.diet_goal === 'weight_loss' && percentConsumed > 90 && percentConsumed < 100) {
      recs.push({
        type: 'success',
        title: 'On Track for Weight Loss',
        description: 'Great job staying within your calorie deficit goal!',
        icon: 'check',
      });
    }

    if (profile.diet_goal === 'muscle_gain' && todayStats.totalProtein >= proteinTarget * 0.8) {
      recs.push({
        type: 'success',
        title: 'Great Protein Intake',
        description: 'You\'re hitting your protein goals for muscle building!',
        icon: 'flame',
      });
    }

    return recs;
  }, [profile, todayStats]);

  const foodsToEatMore = useMemo((): FoodSuggestion[] => {
    if (!profile) return [];

    const suggestions: FoodSuggestion[] = [];

    // Based on diet goal
    if (profile.diet_goal === 'weight_loss') {
      suggestions.push(
        { name: 'Leafy Greens', category: 'Vegetables', calories: 25, reason: 'Low calorie, high fiber' },
        { name: 'Grilled Chicken', category: 'Protein', calories: 165, reason: 'Lean protein source' },
        { name: 'Greek Yogurt', category: 'Dairy', calories: 100, reason: 'High protein, satisfying' },
      );
    } else if (profile.diet_goal === 'muscle_gain') {
      suggestions.push(
        { name: 'Eggs', category: 'Protein', calories: 155, reason: 'Complete protein source' },
        { name: 'Quinoa', category: 'Grains', calories: 220, reason: 'Protein-rich carb' },
        { name: 'Salmon', category: 'Protein', calories: 208, reason: 'Omega-3s and protein' },
      );
    } else {
      suggestions.push(
        { name: 'Mixed Vegetables', category: 'Vegetables', calories: 50, reason: 'Nutrient dense' },
        { name: 'Brown Rice', category: 'Grains', calories: 216, reason: 'Sustained energy' },
        { name: 'Nuts', category: 'Healthy Fats', calories: 170, reason: 'Heart-healthy fats' },
      );
    }

    return suggestions;
  }, [profile]);

  const foodsToLimit = useMemo((): FoodSuggestion[] => {
    if (!profile) return [];

    const suggestions: FoodSuggestion[] = [];

    if (profile.diet_goal === 'weight_loss') {
      suggestions.push(
        { name: 'Sugary Drinks', category: 'Beverages', calories: 150, reason: 'Empty calories' },
        { name: 'Fried Foods', category: 'Fast Food', calories: 400, reason: 'High in fats' },
        { name: 'White Bread', category: 'Refined Carbs', calories: 120, reason: 'Low satiety' },
      );
    } else if (profile.diet_goal === 'muscle_gain') {
      suggestions.push(
        { name: 'Alcohol', category: 'Beverages', calories: 100, reason: 'Affects recovery' },
        { name: 'Processed Foods', category: 'Packaged', calories: 300, reason: 'Low nutrition' },
      );
    } else {
      suggestions.push(
        { name: 'Ultra-processed Foods', category: 'Packaged', calories: 350, reason: 'Low nutrients' },
        { name: 'Excess Sugar', category: 'Sweets', calories: 200, reason: 'Blood sugar spikes' },
      );
    }

    return suggestions;
  }, [profile]);

  return {
    recommendations,
    foodsToEatMore,
    foodsToLimit,
  };
}
