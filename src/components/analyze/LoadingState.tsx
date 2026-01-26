import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LoadingStateProps {
  imageUrl?: string;
}

export function LoadingState({ imageUrl }: LoadingStateProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {imageUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <img
                src={imageUrl}
                alt="Analyzing food"
                className="h-64 w-full object-contain opacity-50 sm:h-80"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4 text-center">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                    <Sparkles className="absolute -right-1 -top-1 h-5 w-5 animate-pulse text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                      Analyzing your food...
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI is identifying ingredients and calculating nutrition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-8 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
