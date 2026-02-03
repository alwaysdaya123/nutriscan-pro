import { useState } from 'react';
import { Flame, Beef, Wheat, Droplets, Apple, Cookie, AlertCircle, Lightbulb, RefreshCw, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NutritionData } from "@/types/nutrition";
import type { PortionSize } from "@/types/database";
import { useAuth } from "@/contexts/AuthContext";
import { useMeals } from "@/hooks/useMeals";
import { useToast } from "@/hooks/use-toast";
import { CalorieDisclaimer } from "./CalorieDisclaimer";
import { ManualCorrectionForm } from "./ManualCorrectionForm";
import { IngredientsList } from "./IngredientsList";
import { NutritionInsights } from "./NutritionInsights";
import { HealthScoreCard } from "./HealthScoreCard";
import { ImagePreviewCard } from "./ImagePreviewCard";
import { AlternativesSection } from "./AlternativesSection";

interface NutritionResultsProps {
  data: NutritionData;
  imageUrl?: string;
  onReset: () => void;
  portionSize?: PortionSize;
  onDataCorrect?: (corrected: NutritionData) => void;
}

const nutritionItems = [
  { key: "calories", label: "Calories", unit: "kcal", icon: Flame, color: "text-orange-500", max: 800 },
  { key: "protein", label: "Protein", unit: "g", icon: Beef, color: "text-red-500", max: 50 },
  { key: "carbs", label: "Carbs", unit: "g", icon: Wheat, color: "text-amber-500", max: 100 },
  { key: "fat", label: "Fat", unit: "g", icon: Droplets, color: "text-yellow-500", max: 40 },
  { key: "fiber", label: "Fiber", unit: "g", icon: Apple, color: "text-green-500", max: 30 },
  { key: "sugar", label: "Sugar", unit: "g", icon: Cookie, color: "text-pink-500", max: 50 },
] as const;

const portionLabels: Record<PortionSize, string> = {
  small: 'Small (70%)',
  medium: 'Medium (Standard)',
  large: 'Large (140%)',
};

export function NutritionResults({ data, imageUrl, onReset, portionSize = 'medium', onDataCorrect }: NutritionResultsProps) {
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
        serving_size: `${portionLabels[portionSize]} - ${currentData.servingSize}`,
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
    <div className="space-y-6 animate-scale-in">
      {/* Hero Section: Image + Health Score side by side on desktop */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Image Preview with Zoom */}
        {imageUrl && (
          <ImagePreviewCard
            imageUrl={imageUrl}
            foodName={currentData.foodName}
            confidence={currentData.confidence}
          />
        )}
        
        {/* Health Score - Most prominent */}
        {currentData.healthScore && (
          <HealthScoreCard healthScore={currentData.healthScore} />
        )}
      </div>

      {/* Food Details Card */}
      <Card className="overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold text-foreground">{currentData.foodName}</h2>
              <p className="text-muted-foreground">{currentData.description}</p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Serving:</span> {portionLabels[portionSize]} - {currentData.servingSize}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3">
              <Flame className="h-6 w-6 text-primary" />
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{currentData.calories}</div>
                <div className="text-xs text-muted-foreground">calories</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calorie Disclaimer */}
      <CalorieDisclaimer confidence={currentData.confidence} />

      {/* Nutrition Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {nutritionItems.map((item) => {
          const value = currentData[item.key as keyof typeof currentData] as number;
          const percentage = Math.min((value / item.max) * 100, 100);
          
          return (
            <Card key={item.key} className="group transition-all duration-300 hover:shadow-md hover:border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-primary">
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-xl font-bold text-foreground">
                        {typeof value === 'number' ? value.toFixed(item.key === 'calories' ? 0 : 1) : value}
                        <span className="text-sm font-normal text-muted-foreground ml-1">
                          {item.unit}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                <Progress value={percentage} className="mt-3 h-2" />
              </CardContent>
            </Card>
          );
        })}
      </div>

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

      {/* Additional Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Sodium Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-destructive" />
              Sodium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {currentData.sodium}
              <span className="text-sm font-normal text-muted-foreground ml-1">mg</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground/80">
              {currentData.sodium < 500 ? "Low sodium content" : currentData.sodium < 1500 ? "Moderate sodium" : "High sodium content"}
            </p>
          </CardContent>
        </Card>

        {/* Health Tips Card */}
        {currentData.healthTips && currentData.healthTips.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-primary" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {currentData.healthTips.slice(0, 3).map((tip, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

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
