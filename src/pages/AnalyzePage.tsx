import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ImageUploader } from "@/components/analyze/ImageUploader";
import { LoadingState } from "@/components/analyze/LoadingState";
import { NutritionResults } from "@/components/analyze/NutritionResults";
import { ErrorState } from "@/components/analyze/ErrorState";
import { PortionSelector } from "@/components/analyze/PortionSelector";
import { useFoodAnalysis } from "@/hooks/useFoodAnalysis";
import type { PortionSize } from "@/types/database";
import { PORTION_MULTIPLIERS } from "@/types/database";

export default function AnalyzePage() {
  const { status, data, error, imageUrl, analyzeImage, reset } = useFoodAnalysis();
  const [portionSize, setPortionSize] = useState<PortionSize>('medium');

  const getAdjustedData = () => {
    if (!data) return null;
    const multiplier = PORTION_MULTIPLIERS[portionSize];
    return {
      ...data,
      calories: Math.round(data.calories * multiplier),
      protein: Math.round(data.protein * multiplier * 10) / 10,
      carbs: Math.round(data.carbs * multiplier * 10) / 10,
      fat: Math.round(data.fat * multiplier * 10) / 10,
      fiber: Math.round(data.fiber * multiplier * 10) / 10,
      sugar: Math.round(data.sugar * multiplier * 10) / 10,
      sodium: Math.round(data.sodium * multiplier),
    };
  };

  const adjustedData = getAdjustedData();

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-background via-background to-muted/20">
      <Header />
      <main className="flex-1 py-8 lg:py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            {/* Page Header */}
            <div className="mb-8 text-center animate-fade-in">
              <h1 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Analyze Your Food
              </h1>
              <p className="mt-3 text-muted-foreground text-lg max-w-xl mx-auto">
                Upload or capture a photo of your meal to get instant nutritional insights
              </p>
            </div>

            {status === "idle" && (
              <div className="animate-scale-in">
                <ImageUploader
                  onImageSelect={analyzeImage}
                  isLoading={false}
                />
              </div>
            )}

            {status === "uploading" && (
              <ImageUploader
                onImageSelect={analyzeImage}
                isLoading={true}
              />
            )}

            {status === "analyzing" && (
              <LoadingState imageUrl={imageUrl} />
            )}

            {status === "success" && adjustedData && (
              <div className="space-y-6 animate-fade-in">
                <PortionSelector value={portionSize} onChange={setPortionSize} />
                <NutritionResults
                  data={adjustedData}
                  imageUrl={imageUrl}
                  onReset={reset}
                  portionSize={portionSize}
                />
              </div>
            )}

            {status === "error" && (
              <ErrorState
                error={error || "An unknown error occurred"}
                imageUrl={imageUrl}
                onReset={reset}
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
