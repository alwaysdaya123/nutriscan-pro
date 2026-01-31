import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { AdminStats, UserWithProfile, FoodItem, FoodItemInsert, AdminAuditLog } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export function useIsAdmin() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['isAdmin', user?.id],
    queryFn: async () => {
      if (!user) return false;
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        return false;
      }

      return !!data;
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminStats() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['adminStats'],
    queryFn: async (): Promise<AdminStats> => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISO = today.toISOString();

      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (logged meal in last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { data: activeUsersData } = await supabase
        .from('meals')
        .select('user_id')
        .gte('logged_at', weekAgo.toISOString());
      
      const activeUsers = new Set(activeUsersData?.map(m => m.user_id)).size;

      // Get total meals
      const { count: totalMeals } = await supabase
        .from('meals')
        .select('*', { count: 'exact', head: true });

      // Get average calories per meal
      const { data: calorieData } = await supabase
        .from('meals')
        .select('calories');
      
      const averageCalories = calorieData?.length 
        ? Math.round(calorieData.reduce((acc, m) => acc + m.calories, 0) / calorieData.length)
        : 0;

      // Get new users today
      const { count: newUsersToday } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', todayISO);

      // Get meals logged today
      const { count: mealsToday } = await supabase
        .from('meals')
        .select('*', { count: 'exact', head: true })
        .gte('logged_at', todayISO);

      return {
        totalUsers: totalUsers || 0,
        activeUsers,
        totalMeals: totalMeals || 0,
        averageCalories,
        newUsersToday: newUsersToday || 0,
        mealsToday: mealsToday || 0,
      };
    },
    enabled: !!user,
    refetchInterval: 30000,
  });
}

export function useAdminUsers(searchQuery: string = '', filter: 'all' | 'active' | 'disabled' = 'all') {
  return useQuery({
    queryKey: ['adminUsers', searchQuery, filter],
    queryFn: async (): Promise<UserWithProfile[]> => {
      let query = supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchQuery) {
        query = query.ilike('full_name', `%${searchQuery}%`);
      }

      if (filter === 'active') {
        query = query.eq('is_active', true);
      } else if (filter === 'disabled') {
        query = query.eq('is_active', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Get meal counts for each user
      const usersWithStats = await Promise.all(
        (data || []).map(async (profile) => {
          const { count } = await supabase
            .from('meals')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', profile.user_id);

          const { data: lastMeal } = await supabase
            .from('meals')
            .select('logged_at')
            .eq('user_id', profile.user_id)
            .order('logged_at', { ascending: false })
            .limit(1)
            .maybeSingle();

          return {
            ...profile,
            is_active: profile.is_active ?? true,
            meal_count: count || 0,
            last_activity: lastMeal?.logged_at,
          } as UserWithProfile;
        })
      );

      return usersWithStats;
    },
  });
}

export function useToggleUserStatus() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ userId, isActive }: { userId: string; isActive: boolean }) => {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: isActive })
        .eq('user_id', userId);

      if (error) throw error;

      // Log the action
      await supabase.from('admin_audit_logs').insert({
        admin_id: user?.id,
        action: isActive ? 'ENABLE_USER' : 'DISABLE_USER',
        target_type: 'user',
        target_id: userId,
        details: { is_active: isActive },
      });

      return { userId, isActive };
    },
    onSuccess: (_, { isActive }) => {
      queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
      toast({
        title: isActive ? 'User Enabled' : 'User Disabled',
        description: `User account has been ${isActive ? 'enabled' : 'disabled'} successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update user status.',
        variant: 'destructive',
      });
      console.error('Error toggling user status:', error);
    },
  });
}

export function useFoodItems(searchQuery: string = '', category: string = 'all') {
  return useQuery({
    queryKey: ['foodItems', searchQuery, category],
    queryFn: async (): Promise<FoodItem[]> => {
      let query = supabase
        .from('food_items')
        .select('*')
        .order('name', { ascending: true });

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return (data || []) as FoodItem[];
    },
  });
}

export function useCreateFoodItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (foodItem: FoodItemInsert) => {
      const { data, error } = await supabase
        .from('food_items')
        .insert({ ...foodItem, created_by: user?.id })
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase.from('admin_audit_logs').insert({
        admin_id: user?.id,
        action: 'CREATE_FOOD_ITEM',
        target_type: 'food_item',
        target_id: data.id,
        details: { name: foodItem.name },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      toast({
        title: 'Food Item Created',
        description: 'New food item has been added to the database.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to create food item.',
        variant: 'destructive',
      });
      console.error('Error creating food item:', error);
    },
  });
}

export function useUpdateFoodItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<FoodItem> & { id: string }) => {
      const { data, error } = await supabase
        .from('food_items')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase.from('admin_audit_logs').insert({
        admin_id: user?.id,
        action: 'UPDATE_FOOD_ITEM',
        target_type: 'food_item',
        target_id: id,
        details: updates,
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      toast({
        title: 'Food Item Updated',
        description: 'Food item has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to update food item.',
        variant: 'destructive',
      });
      console.error('Error updating food item:', error);
    },
  });
}

export function useDeleteFoodItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (id: string) => {
      // Get food item name for audit log
      const { data: foodItem } = await supabase
        .from('food_items')
        .select('name')
        .eq('id', id)
        .single();

      const { error } = await supabase
        .from('food_items')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Log the action
      await supabase.from('admin_audit_logs').insert({
        admin_id: user?.id,
        action: 'DELETE_FOOD_ITEM',
        target_type: 'food_item',
        target_id: id,
        details: { name: foodItem?.name },
      });

      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['foodItems'] });
      toast({
        title: 'Food Item Deleted',
        description: 'Food item has been removed from the database.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: 'Failed to delete food item.',
        variant: 'destructive',
      });
      console.error('Error deleting food item:', error);
    },
  });
}

export function useAuditLogs(limit: number = 50) {
  return useQuery({
    queryKey: ['auditLogs', limit],
    queryFn: async (): Promise<AdminAuditLog[]> => {
      const { data, error } = await supabase
        .from('admin_audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return (data || []) as AdminAuditLog[];
    },
  });
}

export function useSystemHealth() {
  return useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const startTime = Date.now();
      
      try {
        // Test database connection
        const { error: dbError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);

        const dbLatency = Date.now() - startTime;

        // Test edge function
        const edgeStartTime = Date.now();
        let edgeStatus = 'ok';
        let edgeLatency = 0;

        try {
          const response = await supabase.functions.invoke('health-check');
          edgeLatency = Date.now() - edgeStartTime;
          if (response.error) {
            edgeStatus = 'error';
          }
        } catch {
          edgeStatus = 'error';
          edgeLatency = Date.now() - edgeStartTime;
        }

        return {
          database: {
            status: dbError ? 'error' : 'ok',
            latency: dbLatency,
          },
          api: {
            status: edgeStatus,
            latency: edgeLatency,
          },
          overall: dbError || edgeStatus === 'error' ? 'degraded' : 'healthy',
          timestamp: new Date().toISOString(),
        };
      } catch (error) {
        return {
          database: { status: 'error', latency: 0 },
          api: { status: 'error', latency: 0 },
          overall: 'unhealthy',
          timestamp: new Date().toISOString(),
        };
      }
    },
    refetchInterval: 30000,
  });
}
