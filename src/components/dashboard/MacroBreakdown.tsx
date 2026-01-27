import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { DailyStats } from '@/types/database';

type MacroBreakdownProps = {
  todayStats: DailyStats | null;
};

export function MacroBreakdown({ todayStats }: MacroBreakdownProps) {
  const protein = todayStats?.totalProtein || 0;
  const carbs = todayStats?.totalCarbs || 0;
  const fat = todayStats?.totalFat || 0;
  const total = protein + carbs + fat;

  const macros = [
    {
      name: 'Protein',
      value: Math.round(protein),
      percentage: total > 0 ? (protein / total) * 100 : 0,
      color: 'bg-blue-500',
      target: '25-35%',
    },
    {
      name: 'Carbs',
      value: Math.round(carbs),
      percentage: total > 0 ? (carbs / total) * 100 : 0,
      color: 'bg-amber-500',
      target: '45-55%',
    },
    {
      name: 'Fat',
      value: Math.round(fat),
      percentage: total > 0 ? (fat / total) * 100 : 0,
      color: 'bg-rose-500',
      target: '20-30%',
    },
  ];

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Macronutrients</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pie-style visual */}
        <div className="flex items-center justify-center py-2">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {total > 0 ? (
                <>
                  {/* Protein */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-blue-500"
                    strokeDasharray={`${(protein / total) * 251.2} 251.2`}
                  />
                  {/* Carbs */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-amber-500"
                    strokeDasharray={`${(carbs / total) * 251.2} 251.2`}
                    strokeDashoffset={`-${(protein / total) * 251.2}`}
                  />
                  {/* Fat */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-rose-500"
                    strokeDasharray={`${(fat / total) * 251.2} 251.2`}
                    strokeDashoffset={`-${((protein + carbs) / total) * 251.2}`}
                  />
                </>
              ) : (
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="transparent"
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-muted"
                />
              )}
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-xl font-bold">{Math.round(total)}g</span>
                <p className="text-xs text-muted-foreground">total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Macro details */}
        <div className="space-y-3">
          {macros.map((macro) => (
            <div key={macro.name} className="space-y-1">
              <div className="flex justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${macro.color}`} />
                  <span className="font-medium">{macro.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">{macro.value}g</span>
                  <span className="text-muted-foreground ml-1">
                    ({Math.round(macro.percentage)}%)
                  </span>
                </div>
              </div>
              <Progress 
                value={macro.percentage} 
                className={`h-2 [&>div]:${macro.color}`}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
