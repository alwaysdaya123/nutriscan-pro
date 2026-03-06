import { useState } from 'react';
import { RefreshCw, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NutritionData } from "@/types/nutrition";
import { useAuth } from "@/contexts/AuthContext";
import { useMeals } from "@/hooks/useMeals";
import { useToast } from "@/hooks/use-toast";
import { ManualCorrectionForm } from "./ManualCorrectionForm";
import { IngredientsList } from "./IngredientsList";
import { NutritionInsights } from "./NutritionInsights";
import { ImagePreviewCard } from "./ImagePreviewCard";
import { AlternativesSection } from "./AlternativesSection";
import { NutritionGrid } from "./NutritionGrid";
import { SodiumCard } from "./SodiumCard";
import { HealthScoreChart } from "./HealthScoreChart";

interface NutritionResultsProps {
  data: NutritionData;
  imageUrl?: string;
  onReset: () => void;
  onDataCorrect?: (corrected: NutritionData) => void;
}

export function NutritionResults({ data, imageUrl, onReset, onDataCorrect }: NutritionResultsProps) {
  const { user } = useAuth();
  const { addMeal } = useMeals();
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [mealType, setMealType] = useState<string>('lunch');
  const [currentData, setCurrentData] = useState(data);

  const handleCorrect = (corrected: NutritionData) => {
    setCurrentData(corrected);
    onDataCorrect?.(corrected);
    toast({
      title: 'Values updated',
      description: 'Nutritional values have been corrected.',
    });
  };

  const handleSaveMeal = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save meals to your diary.',
        variant: 'destructive',
      });
      return;
    }

    setSaving(true);
    try {
      await addMeal({
        food_name: currentData.foodName,
        description: currentData.description,
        calories: currentData.calories,
        protein: currentData.protein,
        carbs: currentData.carbs,
        fat: currentData.fat,
        fiber: currentData.fiber,
        sugar: currentData.sugar,
        sodium: currentData.sodium,
        serving_size: currentData.servingSize,
        meal_type: mealType as any,
        image_url: imageUrl || null,
        logged_at: new Date().toISOString(),
        health_score: currentData.healthScore?.score ?? null,
      });
      toast({
        title: 'Meal saved!',
        description: 'Added to your food diary.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save meal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Two-Column Layout */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Left Column: Image Preview */}
        <div className="space-y-3 animate-slide-up">
          {imageUrl && (
            <ImagePreviewCard
              imageUrl={imageUrl}
              foodName={currentData.foodName}
              confidence={currentData.confidence}
            />
          )}
          
          {/* Food Details */}
          <Card className="overflow-hidden border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-4">
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold text-foreground">{currentData.foodName}</h2>
                <p className="text-muted-foreground text-sm">{currentData.description}</p>
                <p className="text-xs text-muted-foreground/80">
                  <span className="font-medium">Serving:</span> {currentData.servingSize}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Nutrition Values */}
        <div className="space-y-3 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <NutritionGrid data={currentData} />
        </div>
      </div>

      {/* Sodium Card - Standalone */}
      <SodiumCard sodium={currentData.sodium} />

      {/* Health Score Chart */}
      {currentData.healthScore && (
        <HealthScoreChart healthScore={currentData.healthScore} />
      )}

      {/* Ingredients Section */}
      {currentData.ingredients && currentData.ingredients.length > 0 && (
        <IngredientsList ingredients={currentData.ingredients} />
      )}

      {/* Nutrition Insights */}
      <NutritionInsights data={currentData} />

      {/* Smart Alternatives Section */}
      <AlternativesSection 
        alternatives={currentData.alternatives || []} 
        currentCalories={currentData.calories} 
      />

      {/* Health Tips */}
      {currentData.healthTips && currentData.healthTips.length > 0 && (
        <Card className="bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-4">
            <ul className="space-y-2">
              {currentData.healthTips.slice(0, 3).map((tip, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary font-bold">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Manual Correction */}
      <ManualCorrectionForm data={currentData} onCorrect={handleCorrect} />

      {/* Save to Diary */}
      {user && (
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="font-medium">Save to your food diary?</p>
                <p className="text-sm text-muted-foreground">Track this meal in your daily log</p>
              </div>
              <div className="flex items-center gap-3">
                <Select value={mealType} onValueChange={setMealType}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="breakfast">Breakfast</SelectItem>
                    <SelectItem value="lunch">Lunch</SelectItem>
                    <SelectItem value="dinner">Dinner</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleSaveMeal} disabled={saving} className="min-w-[100px]">
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      <Button onClick={onReset} variant="outline" className="w-full group">
        <RefreshCw className="mr-2 h-4 w-4 transition-transform group-hover:rotate-180" />
        Analyze Another Food
      </Button>
    </div>
  );
}
