import { useState } from 'react';
import { 
  Wheat, 
  Leaf, 
  Apple, 
  Beef, 
  Milk, 
  Droplet, 
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Nut,
  Egg,
  Bean
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Ingredient } from '@/types/nutrition';

interface IngredientsListProps {
  ingredients: Ingredient[];
}

const categoryConfig: Record<Ingredient['category'], { icon: typeof Wheat; label: string; color: string }> = {
  grain: { icon: Wheat, label: 'Grain', color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30' },
  vegetable: { icon: Leaf, label: 'Vegetable', color: 'text-green-600 bg-green-100 dark:bg-green-900/30' },
  fruit: { icon: Apple, label: 'Fruit', color: 'text-red-500 bg-red-100 dark:bg-red-900/30' },
  protein: { icon: Beef, label: 'Protein', color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
  dairy: { icon: Milk, label: 'Dairy', color: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30' },
  oil: { icon: Droplet, label: 'Oil/Fat', color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30' },
  spice: { icon: Sparkles, label: 'Spice', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
  other: { icon: Bean, label: 'Other', color: 'text-gray-500 bg-gray-100 dark:bg-gray-800' },
};

const warningConfig: Record<string, { label: string; icon: typeof AlertTriangle; color: string }> = {
  'high-sugar': { label: 'High Sugar', icon: AlertTriangle, color: 'text-pink-600' },
  'high-fat': { label: 'High Fat', icon: AlertTriangle, color: 'text-yellow-600' },
  'allergen-nuts': { label: 'Contains Nuts', icon: Nut, color: 'text-amber-700' },
  'allergen-dairy': { label: 'Contains Dairy', icon: Milk, color: 'text-blue-600' },
  'allergen-gluten': { label: 'Contains Gluten', icon: Wheat, color: 'text-orange-600' },
  'allergen-soy': { label: 'Contains Soy', icon: Bean, color: 'text-green-700' },
  'allergen-eggs': { label: 'Contains Eggs', icon: Egg, color: 'text-yellow-500' },
};

export function IngredientsList({ ingredients }: IngredientsListProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (!ingredients || ingredients.length === 0) return null;

  const majorIngredients = ingredients.filter(i => i.isMajor);
  const minorIngredients = ingredients.filter(i => !i.isMajor);

  // Collect all unique warnings
  const allWarnings = new Set<string>();
  ingredients.forEach(ing => {
    ing.warnings?.forEach(w => allWarnings.add(w));
  });

  return (
    <Card className="overflow-hidden">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <Leaf className="h-4 w-4 text-primary" />
                Ingredients ({ingredients.length})
              </CardTitle>
              <ChevronDown 
                className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )} 
              />
            </div>
            {/* Warning badges preview */}
            {allWarnings.size > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {Array.from(allWarnings).slice(0, 4).map(warning => {
                  const config = warningConfig[warning];
                  if (!config) return null;
                  return (
                    <Badge 
                      key={warning} 
                      variant="outline" 
                      className={cn("text-xs", config.color)}
                    >
                      <config.icon className="h-3 w-3 mr-1" />
                      {config.label}
                    </Badge>
                  );
                })}
                {allWarnings.size > 4 && (
                  <Badge variant="outline" className="text-xs text-muted-foreground">
                    +{allWarnings.size - 4} more
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          <CardContent className="pt-0 space-y-4">
            {/* Major Ingredients */}
            {majorIngredients.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Main Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    {majorIngredients.map((ingredient, index) => {
                      const config = categoryConfig[ingredient.category];
                      const IconComponent = config.icon;
                      const hasWarnings = ingredient.warnings && ingredient.warnings.length > 0;
                      
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all hover:scale-105 cursor-default",
                                config.color,
                                hasWarnings && "ring-2 ring-amber-400/50"
                              )}
                            >
                              <IconComponent className="h-3.5 w-3.5" />
                              {ingredient.name}
                              {hasWarnings && (
                                <AlertTriangle className="h-3 w-3 text-amber-600" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{ingredient.name}</p>
                              <p className="text-xs text-muted-foreground">Category: {config.label}</p>
                              {ingredient.warnings && ingredient.warnings.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ingredient.warnings.map(w => (
                                    <span key={w} className="text-xs text-amber-600">
                                      • {warningConfig[w]?.label || w}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </div>
            )}

            {/* Minor Ingredients */}
            {minorIngredients.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Additional Ingredients</p>
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    {minorIngredients.map((ingredient, index) => {
                      const config = categoryConfig[ingredient.category];
                      const IconComponent = config.icon;
                      const hasWarnings = ingredient.warnings && ingredient.warnings.length > 0;
                      
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium opacity-80 transition-all hover:opacity-100 cursor-default",
                                config.color,
                                hasWarnings && "ring-1 ring-amber-400/50"
                              )}
                            >
                              <IconComponent className="h-3 w-3" />
                              {ingredient.name}
                              {hasWarnings && (
                                <AlertTriangle className="h-2.5 w-2.5 text-amber-600" />
                              )}
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div className="space-y-1">
                              <p className="font-medium">{ingredient.name}</p>
                              <p className="text-xs text-muted-foreground">Category: {config.label}</p>
                              {ingredient.warnings && ingredient.warnings.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {ingredient.warnings.map(w => (
                                    <span key={w} className="text-xs text-amber-600">
                                      • {warningConfig[w]?.label || w}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
