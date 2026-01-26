import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { NutritionData, AnalysisState } from "@/types/nutrition";

export function useFoodAnalysis() {
  const [state, setState] = useState<AnalysisState>({ status: "idle" });

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

  const reset = useCallback(() => {
    if (state.imageUrl) {
      URL.revokeObjectURL(state.imageUrl);
    }
    setState({ status: "idle" });
  }, [state.imageUrl]);

  return {
    ...state,
    analyzeImage,
    reset,
  };
}
