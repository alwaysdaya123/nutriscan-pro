import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import foodBiryani from "@/assets/food-biryani.jpg";
import foodDosa from "@/assets/food-dosa.jpg";
import foodChicken65 from "@/assets/food-chicken65.jpg";
import foodIdli from "@/assets/food-idli.jpg";
import foodAndhraCurry from "@/assets/food-andhra-curry.jpg";

const foodImages = [
  { 
    src: foodBiryani, 
    alt: "Hyderabadi Chicken Biryani",
    label: "Hyderabadi Biryani",
    calories: "~350 kcal/serving"
  },
  { 
    src: foodDosa, 
    alt: "Crispy Masala Dosa with Sambar",
    label: "Masala Dosa",
    calories: "~200 kcal"
  },
  { 
    src: foodChicken65, 
    alt: "Spicy Chicken 65",
    label: "Chicken 65",
    calories: "~280 kcal/serving"
  },
  { 
    src: foodIdli, 
    alt: "Soft Idli with Sambar",
    label: "Idli Sambar",
    calories: "~150 kcal"
  },
  { 
    src: foodAndhraCurry, 
    alt: "Andhra Chicken Curry",
    label: "Andhra Curry",
    calories: "~320 kcal/serving"
  },
];

const SLIDE_INTERVAL = 2500; // 2.5 seconds

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

  const currentFood = foodImages[currentIndex];

  return (
    <div 
      className="relative w-full overflow-hidden rounded-2xl shadow-2xl group cursor-pointer border border-border/30"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AspectRatio ratio={1}>
        <div className="relative h-full w-full bg-muted">
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>
          ))}
          
          {/* AI Scanning effect overlay */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-primary/80 to-transparent animate-scan-line" />
          </div>
          
          {/* Food label badge */}
          <div className="absolute top-4 left-4 animate-fade-in">
            <div className="flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3 py-1.5 border border-white/10">
              <span className="text-white text-sm font-medium">{currentFood.label}</span>
              <span className="text-white/70 text-xs">{currentFood.calories}</span>
            </div>
          </div>
          
          {/* Bottom content */}
          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
            <div className="text-white">
              <p className="text-sm font-semibold opacity-95">AI-Powered Analysis</p>
              <p className="text-xs opacity-75">Snap • Scan • Know</p>
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
            <div className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-md animate-fade-in border border-white/10">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              Paused
            </div>
          )}
        </div>
      </AspectRatio>
    </div>
  );
}
