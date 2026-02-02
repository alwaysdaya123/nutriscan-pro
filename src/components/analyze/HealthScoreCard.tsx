import { useState } from 'react';
import { 
  Award, 
  TrendingUp, 
  ChevronDown, 
  Lightbulb,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Target
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';
import type { HealthScore, HealthScoreLabel } from '@/types/nutrition';

interface HealthScoreCardProps {
  healthScore: HealthScore;
}

const scoreConfig: Record<HealthScoreLabel, { 
  color: string; 
  bgColor: string; 
  ringColor: string;
  icon: typeof Award;
  text: string;
}> = {
  excellent: { 
    color: 'text-emerald-600', 
    bgColor: 'bg-emerald-100 dark:bg-emerald-900/30',
    ringColor: 'stroke-emerald-500',
    icon: Sparkles,
    text: 'Excellent'
  },
  good: { 
    color: 'text-green-600', 
    bgColor: 'bg-green-100 dark:bg-green-900/30',
    ringColor: 'stroke-green-500',
    icon: CheckCircle2,
    text: 'Good'
  },
  average: { 
    color: 'text-amber-600', 
    bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    ringColor: 'stroke-amber-500',
    icon: Target,
    text: 'Average'
  },
  poor: { 
    color: 'text-red-600', 
    bgColor: 'bg-red-100 dark:bg-red-900/30',
    ringColor: 'stroke-red-500',
    icon: AlertTriangle,
    text: 'Poor'
  },
};

function ScoreRing({ score, label }: { score: number; label: HealthScoreLabel }) {
  const config = scoreConfig[label];
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className="stroke-muted"
          strokeWidth="8"
        />
        {/* Score circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          className={cn("transition-all duration-1000 ease-out", config.ringColor)}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            animation: 'score-fill 1s ease-out forwards',
          }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn("text-3xl font-bold", config.color)}>{score}</span>
        <span className="text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

export function HealthScoreCard({ healthScore }: HealthScoreCardProps) {
  const [isOpen, setIsOpen] = useState(true);
  const config = scoreConfig[healthScore.label];
  const IconComponent = config.icon;

  return (
    <Card className={cn("overflow-hidden border-2", config.bgColor.replace('bg-', 'border-').replace('/30', '/50'))}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className={cn("h-5 w-5", config.color)} />
                Health Score
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className={cn(
                  "inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold",
                  config.bgColor, config.color
                )}>
                  <IconComponent className="h-4 w-4" />
                  {config.text}
                </span>
                <ChevronDown 
                  className={cn(
                    "h-4 w-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )} 
                />
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-accordion-down">
          <CardContent className="pt-0 space-y-6">
            {/* Score Ring and Explanation */}
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <ScoreRing score={healthScore.score} label={healthScore.label} />
              
              <div className="flex-1 space-y-3">
                <div className="flex items-start gap-2">
                  <TrendingUp className={cn("h-5 w-5 mt-0.5 shrink-0", config.color)} />
                  <div>
                    <p className="font-medium text-foreground">Why this score?</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {healthScore.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actionable Suggestions */}
            {healthScore.suggestions && healthScore.suggestions.length > 0 && (
              <div className="space-y-3">
                <p className="font-medium text-foreground flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-primary" />
                  How to improve
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  {healthScore.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-2 rounded-lg bg-background/80 p-3 text-sm border"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                        {index + 1}
                      </span>
                      <span className="text-muted-foreground">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
