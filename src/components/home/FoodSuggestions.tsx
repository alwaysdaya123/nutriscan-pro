import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Flame } from "lucide-react";

import foodBiryani from "@/assets/food-biryani.jpg";
import foodDosa from "@/assets/food-dosa.jpg";
import foodChicken65 from "@/assets/food-chicken65.jpg";
import foodIdli from "@/assets/food-idli.jpg";
import foodAndhraCurry from "@/assets/food-andhra-curry.jpg";

type FoodItem = {
  name: string;
  calories: number;
  tag: string;
  image: string;
};

const suggestions: Record<string, FoodItem[]> = {
  weight_loss: [
    { name: "Idli Sambar", calories: 150, tag: "Low Cal", image: foodIdli },
    { name: "Masala Dosa", calories: 200, tag: "Balanced", image: foodDosa },
    { name: "Chicken 65", calories: 280, tag: "Protein", image: foodChicken65 },
  ],
  muscle_gain: [
    { name: "Chicken Biryani", calories: 350, tag: "High Protein", image: foodBiryani },
    { name: "Andhra Curry", calories: 320, tag: "Protein Rich", image: foodAndhraCurry },
    { name: "Chicken 65", calories: 280, tag: "Lean Protein", image: foodChicken65 },
  ],
  default: [
    { name: "Chicken Biryani", calories: 350, tag: "Popular", image: foodBiryani },
    { name: "Masala Dosa", calories: 200, tag: "Classic", image: foodDosa },
    { name: "Idli Sambar", calories: 150, tag: "Light", image: foodIdli },
    { name: "Andhra Curry", calories: 320, tag: "Spicy", image: foodAndhraCurry },
    { name: "Chicken 65", calories: 280, tag: "Favorite", image: foodChicken65 },
  ],
};

export function FoodSuggestions() {
  const { user, profile } = useAuth();
  if (!user) return null;

  const goal = profile?.diet_goal || "default";
  const items = suggestions[goal] || suggestions.default;

  return (
    <section className="container pb-6 animate-slide-up" style={{ animationDelay: "200ms" }}>
      <h3 className="mb-3 text-sm font-semibold text-foreground">
        Recommended for You
      </h3>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-3 pb-2">
          {items.map((item) => (
            <Card
              key={item.name}
              className="min-w-[140px] max-w-[140px] overflow-hidden border-border/40 hover-lift cursor-default"
            >
              <div className="relative h-20 w-full overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <Badge
                  variant="secondary"
                  className="absolute top-1.5 left-1.5 text-[10px] px-1.5 py-0"
                >
                  {item.tag}
                </Badge>
              </div>
              <CardContent className="p-2">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <p className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5">
                  <Flame className="h-3 w-3 text-primary" />
                  {item.calories} kcal
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </section>
  );
}
