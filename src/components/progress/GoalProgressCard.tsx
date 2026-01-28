import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Flame, Target, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

type GoalProgressCardProps = {
  title: string;
  current: number;
  target: number;
  unit: string;
  icon: 'trophy' | 'flame' | 'target' | 'trending';
  color?: string;
};

const icons = {
  trophy: Trophy,
  flame: Flame,
  target: Target,
  trending: TrendingUp,
};

export function GoalProgressCard({
  title,
  current,
  target,
  unit,
  icon,
  color = 'text-primary',
}: GoalProgressCardProps) {
  const Icon = icons[icon];
  const progress = Math.min((current / target) * 100, 100);
  const isComplete = current >= target;

  return (
    <Card className="glass overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center justify-between text-sm font-medium">
          <span className="flex items-center gap-2">
            <Icon className={cn('h-4 w-4', color)} />
            {title}
          </span>
          {isComplete && (
            <span className="text-xs bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full">
              Complete!
            </span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold">{current.toLocaleString()}</span>
            <span className="text-sm text-muted-foreground">
              / {target.toLocaleString()} {unit}
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isComplete ? 'bg-green-500' : 'bg-primary'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {progress.toFixed(0)}% complete
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
