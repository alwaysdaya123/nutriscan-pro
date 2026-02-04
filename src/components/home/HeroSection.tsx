import { ArrowRight, Camera, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FoodCarousel } from "./FoodCarousel";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container relative z-10 py-16 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Nutrition Analysis
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight">
              Know Your Food,
              <span className="block text-primary">Fuel Your Body</span>
            </h1>
            
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              Snap a photo of your favorite Indian dishes and instantly get accurate calorie counts, 
              nutritional breakdown, and personalized health insights powered by 
              advanced AI technology.
            </p>
            
            <div className="flex flex-wrap gap-3 pt-2">
              <Button asChild size="lg" className="group h-12 px-6">
                <Link to="/analyze">
                  <Camera className="mr-2 h-5 w-5" />
                  Analyze Your Food
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 px-6">
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
            
            <div className="flex items-center gap-5 pt-4 sm:gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">3s</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Analysis Time</div>
              </div>
              <div className="h-10 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Indian Dishes</div>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-2 pt-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="h-8 w-8 rounded-full border-2 border-background bg-gradient-to-br from-primary/20 to-accent flex items-center justify-center text-xs font-medium text-primary-foreground"
                    style={{ backgroundColor: `hsl(${145 + i * 20}, 50%, ${50 + i * 5}%)` }}
                  />
                ))}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <span className="font-medium text-foreground">4.9</span>
                <span>• Trusted by 10K+ users</span>
              </div>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center lg:justify-end animate-fade-in">
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md">
              {/* Decorative elements */}
              <div className="absolute -left-6 -top-6 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-6 -right-6 h-36 w-36 rounded-full bg-accent blur-2xl" />
              
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
