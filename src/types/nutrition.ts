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
}

export interface AnalysisState {
  status: "idle" | "uploading" | "analyzing" | "success" | "error";
  error?: string;
  data?: NutritionData;
  imageUrl?: string;
}
