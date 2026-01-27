import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import type { WeeklyStats } from '@/types/database';
import { format, parseISO } from 'date-fns';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from 'recharts';

type WeeklyChartProps = {
  weeklyStats: WeeklyStats | null;
};

export function WeeklyChart({ weeklyStats }: WeeklyChartProps) {
  const { profile } = useAuth();
  const target = profile?.daily_calorie_target || 2000;

  const chartData = weeklyStats?.days.map(day => ({
    day: format(parseISO(day.date), 'EEE'),
    calories: day.totalCalories,
    date: day.date,
  })) || [];

  const chartConfig = {
    calories: {
      label: 'Calories',
      color: 'hsl(var(--primary))',
    },
  };

  return (
    <Card className="glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Weekly Calories</span>
          <span className="text-sm font-normal text-muted-foreground">
            Avg: {weeklyStats?.averageCalories.toLocaleString() || 0} kcal
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis 
                dataKey="day" 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `${value / 1000}k`}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine 
                y={target} 
                stroke="hsl(var(--muted-foreground))" 
                strokeDasharray="5 5"
                label={{ value: 'Goal', position: 'right', fontSize: 10 }}
              />
              <Bar 
                dataKey="calories" 
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
