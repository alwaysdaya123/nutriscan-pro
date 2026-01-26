import { ArrowRight, Camera, Sparkles, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero">
      <div className="container relative z-10 py-20 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8 animate-slide-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Nutrition Analysis
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Know Your Food,
              <span className="block text-primary">Fuel Your Body</span>
            </h1>
            
            <p className="max-w-lg text-lg text-muted-foreground leading-relaxed">
              Snap a photo of your meal and instantly get accurate calorie counts, 
              nutritional breakdown, and personalized health insights powered by 
              advanced AI technology.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="group">
                <Link to="/analyze">
                  <Camera className="mr-2 h-5 w-5" />
                  Analyze Your Food
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#features">
                  Learn More
                </a>
              </Button>
            </div>
            
            <div className="flex items-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">99%</div>
                <div className="text-sm text-muted-foreground">Accuracy</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">3s</div>
                <div className="text-sm text-muted-foreground">Analysis Time</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">1000+</div>
                <div className="text-sm text-muted-foreground">Food Items</div>
              </div>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center lg:justify-end">
            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -left-8 -top-8 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
              <div className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full bg-accent blur-2xl" />
              
              {/* Main illustration */}
              <div className="relative animate-float">
                <div className="flex h-72 w-72 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/20 to-accent/30 shadow-2xl backdrop-blur-sm sm:h-80 sm:w-80 lg:h-96 lg:w-96">
                  <div className="relative">
                    <div className="text-8xl">🥗</div>
                    <div className="absolute -right-4 -top-4 animate-pulse-slow">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                        <Zap className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
