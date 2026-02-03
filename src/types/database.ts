export type Profile = {
  id: string;
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | 'prefer_not_to_say' | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  diet_goal: 'weight_loss' | 'maintenance' | 'muscle_gain';
  dietary_preference: 'veg' | 'non-veg' | 'vegan';
  daily_calorie_target: number;
  created_at: string;
  updated_at: string;
};

export type Meal = {
  id: string;
  user_id: string;
  food_name: string;
  description: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  serving_size: string | null;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  image_url: string | null;
  logged_at: string;
  created_at: string;
  health_score: number | null;
};

export type MealInsert = Omit<Meal, 'id' | 'user_id' | 'created_at'>;

export type MealPlan = {
  id: string;
  user_id: string;
  plan_date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  description: string | null;
  is_completed: boolean;
  created_at: string;
};

export type WeightLog = {
  id: string;
  user_id: string;
  weight_kg: number;
  logged_at: string;
  notes: string | null;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'reminder';
  is_read: boolean;
  created_at: string;
};

export type UserSettings = {
  id: string;
  user_id: string;
  meal_reminders: boolean;
  calorie_alerts: boolean;
  hydration_reminders: boolean;
  email_notifications: boolean;
  reminder_times: {
    breakfast: string;
    lunch: string;
    dinner: string;
  };
  created_at: string;
  updated_at: string;
};

export type DailyStats = {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
  averageHealthScore: number | null;
};

export type WeeklyStats = {
  days: DailyStats[];
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
  averageHealthScore: number | null;
};

export type PortionSize = 'small' | 'medium' | 'large';

export const PORTION_MULTIPLIERS: Record<PortionSize, number> = {
  small: 0.7,
  medium: 1.0,
  large: 1.4,
};
