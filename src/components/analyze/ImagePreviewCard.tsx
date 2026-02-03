import { useState } from 'react';
import { ZoomIn, X, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImagePreviewCardProps {
  imageUrl: string;
  foodName: string;
  confidence: number;
  className?: string;
}

export function ImagePreviewCard({ imageUrl, foodName, confidence, className }: ImagePreviewCardProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const confidencePercent = Math.round(confidence * 100);

  return (
    <Card className={cn("overflow-hidden group", className)}>
      <CardContent className="p-0">
        <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
          <DialogTrigger asChild>
            <div className="relative cursor-zoom-in">
              {/* Image container with hover effect */}
              <div className="relative overflow-hidden">
                <img
                  src={imageUrl}
                  alt={foodName}
                  className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-64"
                />
                
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Zoom indicator */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-lg backdrop-blur-sm">
                    <ZoomIn className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </div>

              {/* Confidence badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-background/95 px-3 py-1.5 text-xs font-medium shadow-md backdrop-blur-sm">
                <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                <span>{confidencePercent}% confidence</span>
              </div>

              {/* Food name overlay */}
              <div className="absolute bottom-3 left-3 max-w-[60%]">
                <h3 className="truncate rounded-lg bg-background/95 px-3 py-1.5 text-sm font-semibold shadow-md backdrop-blur-sm">
                  {foodName}
                </h3>
              </div>
            </div>
          </DialogTrigger>

          <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
            <div className="relative">
              <Button
                variant="secondary"
                size="icon"
                className="absolute -right-2 -top-2 z-10 h-10 w-10 rounded-full shadow-lg"
                onClick={() => setIsZoomed(false)}
              >
                <X className="h-5 w-5" />
              </Button>
              <img
                src={imageUrl}
                alt={foodName}
                className="max-h-[80vh] w-full rounded-xl object-contain shadow-2xl"
              />
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-background/95 px-4 py-2 shadow-lg backdrop-blur-sm">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="font-medium">{foodName}</span>
                <span className="text-muted-foreground">• {confidencePercent}% confidence</span>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
