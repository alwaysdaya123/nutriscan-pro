import { Flame, Beef, Wheat, Droplets, Apple, Cookie } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NutritionData } from "@/types/nutrition";

interface NutritionGridProps {
  data: NutritionData;
}

const nutritionItems = [
  { key: "calories", label: "Calories", unit: "kcal", icon: Flame, gradient: "from-orange-500 to-red-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  { key: "protein", label: "Protein", unit: "g", icon: Beef, gradient: "from-rose-500 to-pink-500", bg: "bg-rose-50 dark:bg-rose-950/30" },
  { key: "carbs", label: "Carbs", unit: "g", icon: Wheat, gradient: "from-amber-500 to-yellow-500", bg: "bg-amber-50 dark:bg-amber-950/30" },
  { key: "fat", label: "Fat", unit: "g", icon: Droplets, gradient: "from-yellow-500 to-orange-400", bg: "bg-yellow-50 dark:bg-yellow-950/30" },
  { key: "fiber", label: "Fiber", unit: "g", icon: Apple, gradient: "from-green-500 to-emerald-500", bg: "bg-green-50 dark:bg-green-950/30" },
  { key: "sugar", label: "Sugar", unit: "g", icon: Cookie, gradient: "from-pink-500 to-rose-400", bg: "bg-pink-50 dark:bg-pink-950/30" },
] as const;

export function NutritionGrid({ data }: NutritionGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {nutritionItems.map((item, index) => {
        const value = data[item.key as keyof typeof data] as number;
        const isCalories = item.key === "calories";
        
        return (
          <div
            key={item.key}
            className={cn(
              "relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg",
              item.bg,
              isCalories && "col-span-2"
            )}
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            {/* Decorative gradient orb */}
            <div className={cn(
              "absolute -right-4 -top-4 h-16 w-16 rounded-full opacity-20 blur-xl",
              `bg-gradient-to-br ${item.gradient}`
            )} />
            
            <div className={cn(
              "flex items-center gap-3",
              isCalories && "justify-between"
            )}>
              <div className={cn(
                "flex items-center justify-center rounded-lg",
                `bg-gradient-to-br ${item.gradient}`,
                isCalories ? "h-14 w-14" : "h-10 w-10"
              )}>
                <item.icon className={cn(
                  "text-white",
                  isCalories ? "h-7 w-7" : "h-5 w-5"
                )} />
              </div>
              
              <div className={cn(isCalories && "text-right")}>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  {item.label}
                </p>
                <p className={cn(
                  "font-bold text-foreground",
                  isCalories ? "text-4xl" : "text-2xl"
                )}>
                  {typeof value === 'number' ? value.toFixed(item.key === 'calories' ? 0 : 1) : value}
                  <span className={cn(
                    "font-normal text-muted-foreground ml-1",
                    isCalories ? "text-lg" : "text-sm"
                  )}>
                    {item.unit}
                  </span>
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
