import { ArrowRight, Camera, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FoodCarousel } from "./FoodCarousel";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container relative z-10 py-10 lg:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4 animate-slide-up">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              AI-Powered Nutrition Analysis
            </div>
            
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
              Know Your Food,
              <span className="block text-primary">Fuel Your Body</span>
            </h1>
            
            <p className="max-w-lg text-sm text-muted-foreground leading-relaxed sm:text-base">
              Snap a photo of your favorite Indian dishes and instantly get accurate calorie counts, 
              nutritional breakdown, and personalized health insights powered by 
              advanced AI technology.
            </p>
            
            <div className="flex flex-wrap gap-2.5 pt-1">
              <Button asChild size="default" className="group h-10 px-5 text-sm">
                <Link to="/analyze">
                  <Camera className="mr-1.5 h-4 w-4" />
                  Analyze Your Food
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="default" className="h-10 px-5 text-sm">
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
            
            <div className="flex items-center gap-4 pt-2 sm:gap-6">
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">99%</div>
                <div className="text-xs text-muted-foreground">Accuracy</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">3s</div>
                <div className="text-xs text-muted-foreground">Analysis Time</div>
              </div>
              <div className="h-8 w-px bg-border" />
              <div className="text-center">
                <div className="text-xl font-bold text-foreground">1000+</div>
                <div className="text-xs text-muted-foreground">Indian Dishes</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex -space-x-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-xs font-medium text-primary-foreground"
                    style={{ backgroundColor: `hsl(${145 + i * 20}, 50%, ${50 + i * 5}%)` }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                <span className="font-medium text-foreground">4.9</span>
                <span>• Trusted by 10K+ users</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center lg:justify-end animate-fade-in">
            <div className="relative w-full max-w-[280px] sm:max-w-xs lg:max-w-sm">
              {/* Decorative elements */}
              <div className="absolute -left-4 -top-4 h-36 w-36 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-accent blur-2xl" />
              
              {/* Food Carousel */}
              <div className="relative animate-float">
                <FoodCarousel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
