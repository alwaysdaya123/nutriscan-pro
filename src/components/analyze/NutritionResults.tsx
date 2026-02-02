import { useState } from 'react';
import { Flame, Beef, Wheat, Droplets, Apple, Cookie, AlertCircle, Lightbulb, RefreshCw, CheckCircle2, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  
  const confidencePercent = Math.round(currentData.confidence * 100);

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
      {/* Health Score - Most prominent */}
      {currentData.healthScore && (
        <HealthScoreCard healthScore={currentData.healthScore} />
      )}

      {/* Calorie Disclaimer */}
      <CalorieDisclaimer confidence={currentData.confidence} />

      {/* Food Card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {imageUrl && (
            <div className="relative h-48 md:h-auto md:w-1/3">
              <img
                src={imageUrl}
                alt={currentData.foodName}
                className="h-full w-full object-cover"
              />
              <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs font-medium backdrop-blur-sm">
                <CheckCircle2 className="h-3 w-3 text-primary" />
                {confidencePercent}% confidence
              </div>
            </div>
          )}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{currentData.foodName}</h2>
                <p className="mt-1 text-muted-foreground">{currentData.description}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Serving:</span> {portionLabels[portionSize]} - {currentData.servingSize}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{currentData.calories}</div>
                <div className="text-sm text-muted-foreground">kcal</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Ingredients Section */}
      {currentData.ingredients && currentData.ingredients.length > 0 && (
        <IngredientsList ingredients={currentData.ingredients} />
      )}

      {/* Nutrition Insights */}
      <NutritionInsights data={currentData} />

      {/* Manual Correction */}
      <ManualCorrectionForm data={currentData} onCorrect={handleCorrect} />

      {/* Nutrition Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nutritionItems.map((item) => {
          const value = currentData[item.key as keyof typeof currentData] as number;
          const percentage = Math.min((value / item.max) * 100, 100);
          
          return (
            <Card key={item.key} className="group transition-all hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${item.color}`}>
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

      {/* Additional Info Grid */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Sodium Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              Sodium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {currentData.sodium}
              <span className="text-sm font-normal text-muted-foreground ml-1">mg</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
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

      {/* Alternatives */}
      {currentData.alternatives && currentData.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Healthier Alternatives</CardTitle>
            <CardDescription>Consider these options for a healthier meal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {currentData.alternatives.map((alt, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-sm font-medium text-accent-foreground"
                >
                  {alt}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save to Diary */}
      {user && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4">
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
                <Button onClick={handleSaveMeal} disabled={saving}>
                  {saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reset Button */}
      <Button onClick={onReset} variant="outline" className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Analyze Another Food
      </Button>
    </div>
  );
}
