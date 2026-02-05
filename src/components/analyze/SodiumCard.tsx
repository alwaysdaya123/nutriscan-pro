import { Droplet, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SodiumCardProps {
  sodium: number;
}

export function SodiumCard({ sodium }: SodiumCardProps) {
  const getSodiumLevel = () => {
    if (sodium < 500) return { label: 'Low', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30', icon: CheckCircle, message: 'Heart-healthy sodium level' };
    if (sodium < 1500) return { label: 'Moderate', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30', icon: Info, message: 'Within normal daily range' };
    return { label: 'High', color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950/30', icon: AlertTriangle, message: 'Consider lower sodium alternatives' };
  };

  const level = getSodiumLevel();
  const StatusIcon = level.icon;
  const percentage = Math.min((sodium / 2300) * 100, 100); // Based on 2300mg daily limit

  return (
    <div className={cn(
      "rounded-xl p-4 transition-all duration-300 hover:shadow-md",
      level.bg
    )}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500">
            <Droplet className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Sodium</p>
            <p className="text-2xl font-bold text-foreground">
              {sodium}
              <span className="text-sm font-normal text-muted-foreground ml-1">mg</span>
            </p>
          </div>
        </div>
        
        <div className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5",
          level.bg, level.color
        )}>
          <StatusIcon className="h-4 w-4" />
          <span className="text-sm font-semibold">{level.label}</span>
        </div>
      </div>
      
      {/* Progress bar */}
      <div className="space-y-1.5">
        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
          <div 
            className={cn(
              "h-full rounded-full transition-all duration-700 ease-out",
              sodium < 500 ? "bg-emerald-500" : sodium < 1500 ? "bg-amber-500" : "bg-red-500"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className={cn("flex items-center gap-1", level.color)}>
            <StatusIcon className="h-3 w-3" />
            {level.message}
          </span>
          <span className="text-muted-foreground">{Math.round(percentage)}% of daily limit</span>
        </div>
      </div>
    </div>
  );
}
