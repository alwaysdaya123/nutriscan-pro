import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Scale } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

type WeightProgressChartProps = {
  data: { date: string; weight: number }[];
  currentWeight: number | null;
  startingWeight: number | null;
  change: number | null;
  percentChange: string | null;
  trend: 'up' | 'down' | 'stable' | null;
};

export function WeightProgressChart({
  data,
  currentWeight,
  startingWeight,
  change,
  percentChange,
  trend,
}: WeightProgressChartProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-amber-500' : trend === 'down' ? 'text-green-500' : 'text-muted-foreground';

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-primary" />
          Weight Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length < 2 ? (
          <div className="h-[200px] flex items-center justify-center">
            <p className="text-muted-foreground text-center">
              Log your weight at least twice to see progress
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current</p>
                <p className="text-2xl font-bold">{currentWeight?.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Change</p>
                <div className="flex items-center justify-center gap-1">
                  <TrendIcon className={cn('h-5 w-5', trendColor)} />
                  <p className={cn('text-2xl font-bold', trendColor)}>
                    {change && change > 0 ? '+' : ''}{change?.toFixed(1)}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">kg ({percentChange}%)</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Starting</p>
                <p className="text-2xl font-bold">{startingWeight?.toFixed(1)}</p>
                <p className="text-xs text-muted-foreground">kg</p>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    className="text-muted-foreground"
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    domain={['dataMin - 1', 'dataMax + 1']}
                    className="text-muted-foreground"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
