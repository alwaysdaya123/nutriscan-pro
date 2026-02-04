import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import foodImage1 from "@/assets/food-carousel-1.jpg";
import foodImage2 from "@/assets/food-carousel-2.jpg";
import foodImage3 from "@/assets/food-carousel-3.jpg";
import foodImage4 from "@/assets/food-carousel-4.jpg";

const foodImages = [
  { src: foodImage1, alt: "Fresh healthy salad bowl with grilled chicken" },
  { src: foodImage2, alt: "Grilled salmon with asparagus" },
  { src: foodImage3, alt: "Colorful smoothie bowl with berries" },
  { src: foodImage4, alt: "Mediterranean grain bowl with falafel" },
];

const SLIDE_INTERVAL = 3000; // 3 seconds

export function FoodCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % foodImages.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(goToNext, SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl group cursor-pointer"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AspectRatio ratio={1}>
        <div className="relative h-full w-full">
          {foodImages.map((image, index) => (
            <div
              key={index}
              className={cn(
                "absolute inset-0 transition-all duration-700 ease-in-out",
                index === currentIndex 
                  ? "opacity-100 scale-100" 
                  : "opacity-0 scale-105"
              )}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            </div>
          ))}
          
          {/* AI Scanning effect overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-scan-line" />
          </div>
          
          {/* Bottom content */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="text-white">
              <p className="text-sm font-medium opacity-90">AI-Powered Analysis</p>
              <p className="text-xs opacity-70">Snap • Scan • Know</p>
            </div>
            
            {/* Indicator dots */}
            <div className="flex gap-1.5">
              {foodImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all duration-300",
                    index === currentIndex 
                      ? "w-6 bg-white" 
                      : "w-2 bg-white/50 hover:bg-white/70"
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          
          {/* Pause indicator */}
          {isPaused && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1.5 text-xs text-white backdrop-blur-sm animate-fade-in">
              <span className="h-2 w-2 rounded-full bg-white/80" />
              Paused
            </div>
          )}
        </div>
      </AspectRatio>
    </div>
  );
}
