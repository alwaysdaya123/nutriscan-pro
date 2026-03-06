import { Flame, Beef, Wheat, Droplets, Apple, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NutritionData } from "@/types/nutrition";

interface NutritionGridProps {
  data: NutritionData;
}

const dailyTargets: Record<string, number> = {
  calories: 2000,
  protein: 50,
  carbs: 300,
  fat: 65,
  fiber: 25,
  sugar: 50,
};

const nutritionItems = [
  { key: "calories", label: "Calories", unit: "kcal", icon: Flame, gradient: "from-orange-500 to-red-500", bg: "bg-orange-50 dark:bg-orange-950/30", barColor: "bg-gradient-to-r from-orange-500 to-red-500" },
  { key: "protein", label: "Protein", unit: "g", icon: Beef, gradient: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-950/30", barColor: "bg-gradient-to-r from-rose-500 to-pink-500" },
  { key: "carbs", label: "Carbs", unit: "g", icon: Wheat, gradient: "from-amber-500 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-950/30", barColor: "bg-gradient-to-r from-amber-500 to-yellow-500" },
  { key: "fat", label: "Fat", unit: "g", icon: Droplets, gradient: "from-yellow-500 to-orange-400", bg: "bg-yellow-50 dark:bg-yellow-950/30", barColor: "bg-gradient-to-r from-yellow-500 to-orange-400" },
  { key: "fiber", label: "Fiber", unit: "g", icon: Apple, gradient: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-950/30", barColor: "bg-gradient-to-r from-green-500 to-emerald-500" },
  { key: "sugar", label: "Sugar", unit: "g", icon: Cookie, gradient: "from-pink-500 to-rose-400", bg: "bg-pink-50 dark:bg-pink-950/30", barColor: "bg-gradient-to-r from-pink-500 to-rose-400" },
] as const;

export function NutritionGrid({ data }: NutritionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {nutritionItems.map((item, index) => {
        const value = data[item.key as keyof typeof data] as number;
        const isCalories = item.key === "calories";
        const target = dailyTargets[item.key] || 100;
        const percent = Math.min((value / target) * 100, 100);
        
        return (
          <div
            key={item.key}
            className={cn(
              "relative overflow-hidden rounded-xl p-3.5 transition-all duration-300 hover:scale-[1.02] hover:shadow-md animate-slide-up",
              item.bg,
              isCalories && "col-span-2"
            )}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className={cn(
              "flex items-center gap-3",
              isCalories && "justify-between"
            )}>
              <div className={cn(
                "flex items-center justify-center rounded-lg shrink-0",
                `bg-gradient-to-br ${item.gradient}`,
                isCalories ? "h-12 w-12" : "h-9 w-9"
              )}>
                <item.icon className={cn(
                  "text-white",
                  isCalories ? "h-6 w-6" : "h-4 w-4"
                )} />
              </div>
              
              <div className={cn("flex-1 min-w-0", isCalories && "text-right")}>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
                <p className={cn(
                  "font-bold text-foreground leading-tight",
                  isCalories ? "text-3xl" : "text-xl"
                )}>
                  {typeof value === 'number' ? value.toFixed(item.key === 'calories' ? 0 : 1) : value}
                  <span className={cn(
                    "font-normal text-muted-foreground ml-0.5",
                    isCalories ? "text-sm" : "text-xs"
                  )}>
                    {item.unit}
                  </span>
                </p>
              </div>
            </div>

            {/* Mini progress bar */}
            <div className="mt-2.5">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] text-muted-foreground">
                  {Math.round(percent)}% of daily
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all duration-1000 ease-out", item.barColor)}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
