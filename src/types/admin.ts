export type AppRole = 'admin' | 'user';

export type UserRole = {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
};

export type FoodItem = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving_size: string;
  category: string;
  is_verified: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FoodItemInsert = Omit<FoodItem, 'id' | 'created_at' | 'updated_at'>;

export type AdminAuditLog = {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
};

export type SystemMetric = {
  id: string;
  metric_name: string;
  metric_value: number;
  metadata: Record<string, unknown> | null;
  recorded_at: string;
};

export type AdminStats = {
  totalUsers: number;
  activeUsers: number;
  totalMeals: number;
  averageCalories: number;
  newUsersToday: number;
  mealsToday: number;
};

export type UserWithProfile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  email?: string;
  meal_count?: number;
  last_activity?: string;
};
