import { 
  Zap, 
  TrendingUp, 
  Heart,
  Flame,
  Dumbbell,
  Leaf,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { NutritionData } from '@/types/nutrition';

interface NutritionInsightsProps {
  data: NutritionData;
}

// Keywords to icon/color mapping for visual variety
const insightStyleMap: Record<string, { icon: typeof Zap; color: string }> = {
  protein: { icon: Dumbbell, color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/30' },
  carb: { icon: Zap, color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
  fat: { icon: Flame, color: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30' },
  fiber: { icon: Leaf, color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  sugar: { icon: AlertCircle, color: 'text-pink-500 bg-pink-100 dark:bg-pink-900/30' },
  dairy: { icon: Heart, color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  calorie: { icon: Flame, color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
  healthy: { icon: Heart, color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' },
  balanced: { icon: TrendingUp, color: 'text-indigo-500 bg-indigo-100 dark:bg-indigo-900/30' },
};

function getInsightStyle(insight: string): { icon: typeof Zap; color: string } {
  const lowerInsight = insight.toLowerCase();
  for (const [keyword, style] of Object.entries(insightStyleMap)) {
    if (lowerInsight.includes(keyword)) {
      return style;
    }
  }
  return { icon: TrendingUp, color: 'text-primary bg-primary/10' };
}

export function NutritionInsights({ data }: NutritionInsightsProps) {
  // Generate automatic insights if none provided
  const insights = data.insights && data.insights.length > 0 
    ? data.insights 
    : generateAutoInsights(data);

  if (insights.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <TrendingUp className="h-4 w-4 text-primary" />
          Dietary Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2">
          {insights.map((insight, index) => {
            const { icon: IconComponent, color } = getInsightStyle(insight);
            return (
              <div
                key={index}
                className={cn(
                  "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all hover:scale-[1.02]",
                  color
                )}
              >
                <IconComponent className="h-4 w-4 shrink-0" />
                <span>{insight}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function generateAutoInsights(data: NutritionData): string[] {
  const insights: string[] = [];

  // Protein analysis
  if (data.protein >= 20) {
    insights.push('High protein meal');
  } else if (data.protein >= 10) {
    insights.push('Moderate protein content');
  } else if (data.protein < 5) {
    insights.push('Low protein option');
  }

  // Carb analysis
  if (data.carbs >= 50) {
    insights.push('High carb meal');
  } else if (data.carbs < 15) {
    insights.push('Low carb option');
  }

  // Fat analysis
  if (data.fat >= 25) {
    insights.push('High fat content');
  } else if (data.fat < 5) {
    insights.push('Low fat option');
  }

  // Fiber analysis
  if (data.fiber >= 8) {
    insights.push('Rich in fiber');
  }

  // Sugar analysis
  if (data.sugar >= 15) {
    insights.push('Contains significant sugar');
  } else if (data.sugar < 3) {
    insights.push('Low sugar option');
  }

  // Calorie analysis
  if (data.calories < 200) {
    insights.push('Light meal option');
  } else if (data.calories >= 600) {
    insights.push('Calorie-dense meal');
  }

  // Check for dairy in ingredients
  if (data.ingredients?.some(i => i.category === 'dairy')) {
    insights.push('Contains dairy');
  }

  // Balance check
  const ratio = data.protein / (data.carbs || 1);
  if (ratio >= 0.4 && ratio <= 0.8 && data.fiber >= 3) {
    insights.push('Balanced macronutrient profile');
  }

  return insights.slice(0, 4); // Limit to 4 insights
}
