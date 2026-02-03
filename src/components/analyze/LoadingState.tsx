import { Loader2, Sparkles, UtensilsCrossed, Brain, Scale } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  imageUrl?: string;
}

const loadingSteps = [
  { icon: UtensilsCrossed, text: "Identifying food items..." },
  { icon: Brain, text: "Analyzing ingredients..." },
  { icon: Scale, text: "Calculating nutrition..." },
];

export function LoadingState({ imageUrl }: LoadingStateProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {imageUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              {/* Image with overlay */}
              <img
                src={imageUrl}
                alt="Analyzing food"
                className="h-64 w-full object-contain transition-all duration-500 sm:h-80"
              />
              
              {/* Animated scanning overlay */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-primary/20 animate-pulse" />
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{
                    animation: 'scanLine 2s ease-in-out infinite',
                  }}
                />
              </div>
              
              {/* Center content */}
              <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-6 text-center px-4">
                  {/* Animated loader */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 ring-4 ring-primary/20">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                    <Sparkles className="absolute -right-1 -top-1 h-6 w-6 animate-pulse text-primary" />
                  </div>
                  
                  {/* Text */}
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground">
                      Analyzing your food...
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Our AI is identifying ingredients and calculating detailed nutrition
                    </p>
                  </div>

                  {/* Loading steps */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {loadingSteps.map((step, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 rounded-full bg-background/80 px-3 py-1.5 text-xs font-medium shadow-sm animate-fade-in"
                        style={{ animationDelay: `${index * 0.3}s` }}
                      >
                        <step.icon className="h-3.5 w-3.5 text-primary animate-pulse" />
                        <span className="text-muted-foreground">{step.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skeleton cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                  <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                </div>
              </div>
              <div className="mt-3 h-2 w-full animate-pulse rounded-full bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add scanning animation keyframes via style tag */}
      <style>{`
        @keyframes scanLine {
          0%, 100% { top: 0; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          50% { top: calc(100% - 4px); }
        }
      `}</style>
    </div>
  );
}
