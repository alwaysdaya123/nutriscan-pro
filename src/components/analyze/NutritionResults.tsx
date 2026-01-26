import { Flame, Beef, Wheat, Droplets, Apple, Cookie, AlertCircle, Lightbulb, RefreshCw, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { NutritionData } from "@/types/nutrition";

interface NutritionResultsProps {
  data: NutritionData;
  imageUrl?: string;
  onReset: () => void;
}

const nutritionItems = [
  { key: "calories", label: "Calories", unit: "kcal", icon: Flame, color: "text-orange-500", max: 800 },
  { key: "protein", label: "Protein", unit: "g", icon: Beef, color: "text-red-500", max: 50 },
  { key: "carbs", label: "Carbs", unit: "g", icon: Wheat, color: "text-amber-500", max: 100 },
  { key: "fat", label: "Fat", unit: "g", icon: Droplets, color: "text-yellow-500", max: 40 },
  { key: "fiber", label: "Fiber", unit: "g", icon: Apple, color: "text-green-500", max: 30 },
  { key: "sugar", label: "Sugar", unit: "g", icon: Cookie, color: "text-pink-500", max: 50 },
] as const;

export function NutritionResults({ data, imageUrl, onReset }: NutritionResultsProps) {
  const confidencePercent = Math.round(data.confidence * 100);

  return (
    <div className="space-y-6 animate-scale-in">
      {/* Food Card */}
      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {imageUrl && (
            <div className="relative h-48 md:h-auto md:w-1/3">
              <img
                src={imageUrl}
                alt={data.foodName}
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
                <h2 className="text-2xl font-bold text-foreground">{data.foodName}</h2>
                <p className="mt-1 text-muted-foreground">{data.description}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  <span className="font-medium">Serving size:</span> {data.servingSize}
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{data.calories}</div>
                <div className="text-sm text-muted-foreground">kcal</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Nutrition Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {nutritionItems.map((item) => {
          const value = data[item.key as keyof typeof data] as number;
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
                        {value}
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
              <AlertCircle className="h-4 w-4 text-warning" />
              Sodium
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-foreground">
              {data.sodium}
              <span className="text-sm font-normal text-muted-foreground ml-1">mg</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {data.sodium < 500 ? "Low sodium content" : data.sodium < 1500 ? "Moderate sodium" : "High sodium content"}
            </p>
          </CardContent>
        </Card>

        {/* Health Tips Card */}
        {data.healthTips && data.healthTips.length > 0 && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Lightbulb className="h-4 w-4 text-primary" />
                Health Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {data.healthTips.slice(0, 3).map((tip, index) => (
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
      {data.alternatives && data.alternatives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Healthier Alternatives</CardTitle>
            <CardDescription>Consider these options for a healthier meal</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.alternatives.map((alt, index) => (
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

      {/* Reset Button */}
      <Button onClick={onReset} variant="outline" className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Analyze Another Food
      </Button>
    </div>
  );
}
