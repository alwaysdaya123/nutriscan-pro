import { Sparkles, Flame, TrendingDown, Leaf, ChefHat } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Alternative {
  name: string;
  calories?: number;
  benefit?: string;
}

interface AlternativesSectionProps {
  alternatives: string[];
  currentCalories: number;
}

// Parse alternatives and add estimated data
function parseAlternatives(alternatives: string[], currentCalories: number): Alternative[] {
  return alternatives.map((alt) => {
    // Estimate calories (15-30% lower than current)
    const reduction = 0.15 + Math.random() * 0.15;
    const estimatedCalories = Math.round(currentCalories * (1 - reduction));
    
    // Generate benefit based on keywords
    let benefit = 'Healthier option';
    const lowerAlt = alt.toLowerCase();
    
    if (lowerAlt.includes('grilled') || lowerAlt.includes('baked')) {
      benefit = 'Less oil, lower fat content';
    } else if (lowerAlt.includes('salad') || lowerAlt.includes('vegetable')) {
      benefit = 'More fiber and nutrients';
    } else if (lowerAlt.includes('lean') || lowerAlt.includes('chicken') || lowerAlt.includes('fish')) {
      benefit = 'High protein, low fat';
    } else if (lowerAlt.includes('whole') || lowerAlt.includes('brown')) {
      benefit = 'Complex carbs, more fiber';
    } else if (lowerAlt.includes('steamed')) {
      benefit = 'Retains nutrients, no added fat';
    } else if (lowerAlt.includes('low') || lowerAlt.includes('lite') || lowerAlt.includes('light')) {
      benefit = 'Reduced calories';
    }
    
    return {
      name: alt,
      calories: estimatedCalories,
      benefit,
    };
  });
}

function getAlternativeIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes('salad') || lower.includes('vegetable') || lower.includes('leaf')) {
    return Leaf;
  }
  if (lower.includes('grilled') || lower.includes('baked') || lower.includes('steamed')) {
    return ChefHat;
  }
  return TrendingDown;
}

export function AlternativesSection({ alternatives, currentCalories }: AlternativesSectionProps) {
  if (!alternatives || alternatives.length === 0) return null;

  const parsedAlternatives = parseAlternatives(alternatives, currentCalories);

  return (
    <Card className="overflow-hidden border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Healthier Alternatives
        </CardTitle>
        <CardDescription>
          Smart suggestions to improve your nutrition
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid gap-3 sm:grid-cols-2">
          {parsedAlternatives.map((alt, index) => {
            const Icon = getAlternativeIcon(alt.name);
            const caloriesSaved = currentCalories - (alt.calories || 0);
            
            return (
              <Card 
                key={index} 
                className="group cursor-pointer border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 hover:shadow-md"
              >
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium text-foreground">
                      {alt.name}
                    </h4>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {alt.benefit}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="gap-1 text-xs">
                        <Flame className="h-3 w-3" />
                        ~{alt.calories} kcal
                      </Badge>
                      {caloriesSaved > 0 && (
                        <Badge variant="outline" className="gap-1 border-primary/30 bg-primary/10 text-xs text-primary">
                          <TrendingDown className="h-3 w-3" />
                          -{caloriesSaved} kcal
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
