import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Info, Flame, Target, Lightbulb, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useRecommendations } from '@/hooks/useRecommendations';
import type { DailyStats } from '@/types/database';

type RecommendationsProps = {
  todayStats: DailyStats | null;
};

const iconMap = {
  check: Check,
  alert: AlertTriangle,
  info: Info,
  flame: Flame,
  target: Target,
};

export function Recommendations({ todayStats }: RecommendationsProps) {
  const { recommendations, foodsToEatMore, foodsToLimit } = useRecommendations(todayStats);

  return (
    <div className="space-y-4">
      {/* Status Recommendations */}
      {recommendations.length > 0 && (
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-primary" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendations.map((rec, index) => {
              const Icon = iconMap[rec.icon];
              return (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    rec.type === 'success' 
                      ? 'bg-green-50 border-green-200' 
                      : rec.type === 'warning'
                      ? 'bg-amber-50 border-amber-200'
                      : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`h-5 w-5 mt-0.5 ${
                      rec.type === 'success' 
                        ? 'text-green-600' 
                        : rec.type === 'warning'
                        ? 'text-amber-600'
                        : 'text-blue-600'
                    }`} />
                    <div>
                      <h4 className="font-medium">{rec.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Food Suggestions */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Foods to Eat More */}
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-green-600" />
              Foods to Eat More
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {foodsToEatMore.map((food, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-green-50/50"
              >
                <div>
                  <p className="font-medium text-sm">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.reason}</p>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  {food.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Foods to Limit */}
        <Card className="glass">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-amber-600" />
              Foods to Limit
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {foodsToLimit.map((food, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 rounded-lg bg-amber-50/50"
              >
                <div>
                  <p className="font-medium text-sm">{food.name}</p>
                  <p className="text-xs text-muted-foreground">{food.reason}</p>
                </div>
                <Badge variant="secondary" className="bg-amber-100 text-amber-700">
                  {food.category}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
