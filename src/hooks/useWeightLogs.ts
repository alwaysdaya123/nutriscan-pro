import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { WeightLog } from '@/types/database';

export function useWeightLogs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [weightLogs, setWeightLogs] = useState<WeightLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchWeightLogs();
    }
  }, [user]);

  const fetchWeightLogs = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setWeightLogs(data as WeightLog[]);
    } catch (error) {
      console.error('Error fetching weight logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const addWeightLog = async (weight: number, notes?: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('weight_logs')
        .insert({
          user_id: user.id,
          weight_kg: weight,
          notes,
        })
        .select()
        .single();

      if (error) throw error;

      setWeightLogs(prev => [data as WeightLog, ...prev]);
      
      toast({
        title: 'Weight logged',
        description: `Recorded ${weight} kg`,
      });

      return data;
    } catch (error) {
      console.error('Error adding weight log:', error);
      toast({
        title: 'Error',
        description: 'Failed to log weight',
        variant: 'destructive',
      });
    }
  };

  const deleteWeightLog = async (logId: string) => {
    try {
      const { error } = await supabase
        .from('weight_logs')
        .delete()
        .eq('id', logId);

      if (error) throw error;

      setWeightLogs(prev => prev.filter(log => log.id !== logId));
    } catch (error) {
      console.error('Error deleting weight log:', error);
    }
  };

  const getWeightProgress = () => {
    if (weightLogs.length < 2) return null;

    const latest = weightLogs[0];
    const oldest = weightLogs[weightLogs.length - 1];
    const change = latest.weight_kg - oldest.weight_kg;
    const percentChange = ((change / oldest.weight_kg) * 100).toFixed(1);

    return {
      currentWeight: latest.weight_kg,
      startingWeight: oldest.weight_kg,
      change,
      percentChange,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
    };
  };

  const getWeeklyAverage = () => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const recentLogs = weightLogs.filter(
      log => new Date(log.logged_at) >= oneWeekAgo
    );

    if (recentLogs.length === 0) return null;

    const sum = recentLogs.reduce((acc, log) => acc + log.weight_kg, 0);
    return sum / recentLogs.length;
  };

  const getChartData = () => {
    return [...weightLogs]
      .reverse()
      .slice(-30)
      .map(log => ({
        date: new Date(log.logged_at).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        }),
        weight: log.weight_kg,
      }));
  };

  return {
    weightLogs,
    loading,
    addWeightLog,
    deleteWeightLog,
    getWeightProgress,
    getWeeklyAverage,
    getChartData,
    refreshWeightLogs: fetchWeightLogs,
  };
}
