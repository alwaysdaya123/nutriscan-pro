export interface Ingredient {
  name: string;
  category: 'grain' | 'vegetable' | 'fruit' | 'protein' | 'dairy' | 'oil' | 'spice' | 'other';
  isMajor: boolean;
  warnings?: ('high-sugar' | 'high-fat' | 'allergen-nuts' | 'allergen-dairy' | 'allergen-gluten' | 'allergen-soy' | 'allergen-eggs')[];
}

export interface NutritionData {
  foodName: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sugar: number;
  sodium: number;
  servingSize: string;
  confidence: number;
  healthTips: string[];
  alternatives: string[];
  ingredients: Ingredient[];
  insights: string[];
}

export interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "success" | "error";
  error?: string;
  data?: NutritionData;
  imageUrl?: string;
}
