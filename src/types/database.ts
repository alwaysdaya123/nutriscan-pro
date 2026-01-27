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
};

export type MealInsert = Omit<Meal, 'id' | 'user_id' | 'created_at'>;

export type DailyStats = {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  mealCount: number;
};

export type WeeklyStats = {
  days: DailyStats[];
  averageCalories: number;
  averageProtein: number;
  averageCarbs: number;
  averageFat: number;
};
