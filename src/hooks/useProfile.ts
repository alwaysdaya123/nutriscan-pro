import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Profile } from '@/types/database';
import { useToast } from '@/hooks/use-toast';

export function useProfile() {
  const { user, refreshProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('Not authenticated') };
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      await refreshProfile();
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been saved successfully.',
      });
      
      return { error: null };
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
        variant: 'destructive',
      });
      return { error: error as Error };
    } finally {
      setLoading(false);
    }
  }, [user, refreshProfile, toast]);

  const calculateDailyCalories = useCallback((
    weight: number,
    height: number,
    age: number,
    gender: string,
    activityLevel: string,
    dietGoal: string
  ): number => {
    // Mifflin-St Jeor Equation
    let bmr: number;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity multipliers
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    const tdee = bmr * (activityMultipliers[activityLevel] || 1.55);

    // Goal adjustments
    switch (dietGoal) {
      case 'weight_loss':
        return Math.round(tdee - 500);
      case 'muscle_gain':
        return Math.round(tdee + 300);
      default:
        return Math.round(tdee);
    }
  }, []);

  return {
    updateProfile,
    calculateDailyCalories,
    loading,
  };
}
