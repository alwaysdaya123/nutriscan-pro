import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  error: string;
  imageUrl?: string;
  onReset: () => void;
}

export function ErrorState({ error, imageUrl, onReset }: ErrorStateProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      {imageUrl && (
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <img
              src={imageUrl}
              alt="Failed to analyze"
              className="h-64 w-full object-contain opacity-50 sm:h-80"
            />
          </CardContent>
        </Card>
      )}

      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex flex-col items-center p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <AlertCircle className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            Analysis Failed
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {error}
          </p>
          <Button onClick={onReset} className="mt-6">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
