import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NutritionData, AnalysisState } from "@/types/nutrition";
import { useAuth } from "@/contexts/AuthContext";
import { useMeals } from "@/hooks/useMeals";
import { useToast } from "@/hooks/use-toast";

export function useFoodAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });
  const { user } = useAuth();
  const { addMeal } = useMeals();
  const { toast } = useToast();

  const analyzeImage = useCallback(async (file: File) => {
    setState({ status: "uploading" });

    try {
      // Create image preview URL
      const imageUrl = URL.createObjectURL(file);

      // Convert file to base64
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      setState({ status: "analyzing", imageUrl });

      // Call the edge function
      const { data, error } = await supabase.functions.invoke("analyze-food", {
        body: { imageBase64: base64 },
      });

      if (error) {
        console.error("Analysis error:", error);
        setState({
          status: "error",
          error: error.message || "Failed to analyze image",
          imageUrl,
        });
        return;
      }

      if (data.error) {
        setState({
          status: "error",
          error: data.error,
          imageUrl,
        });
        return;
      }

      setState({
        status: "success",
        data: data as NutritionData,
        imageUrl,
      });
    } catch (err) {
      console.error("Analysis error:", err);
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  }, []);

  const saveMeal = useCallback(async (
    nutritionData: NutritionData,
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  ) => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save meals to your diary.",
        variant: "destructive",
      });
      return { error: new Error("Not authenticated") };
    }

    const result = await addMeal({
      food_name: nutritionData.foodName,
      description: nutritionData.description,
      calories: nutritionData.calories,
      protein: nutritionData.protein,
      carbs: nutritionData.carbs,
      fat: nutritionData.fat,
      fiber: nutritionData.fiber,
      sugar: nutritionData.sugar,
      sodium: nutritionData.sodium,
      serving_size: nutritionData.servingSize,
      meal_type: mealType,
      image_url: null,
      logged_at: new Date().toISOString(),
    });

    return result;
  }, [user, addMeal, toast]);

  const reset = useCallback(() => {
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
    }
    setState({ status: "idle" });
  }, [state.imageUrl]);

  return {
    ...state,
    analyzeImage,
    saveMeal,
    reset,
  };
}
