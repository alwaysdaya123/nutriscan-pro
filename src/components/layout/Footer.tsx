import { Leaf, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">NutriScan</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered food recognition and calorie estimation for smarter, healthier eating decisions.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Instant Food Recognition</li>
              <li>Accurate Calorie Estimation</li>
              <li>Nutritional Breakdown</li>
              <li>Health Tips & Alternatives</li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">About</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              NutriScan uses advanced AI vision models to analyze your food and provide accurate nutritional information, helping you make informed dietary choices.
            </p>
          </div>
        </div>
        
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} NutriScan. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Made with <Heart className="h-4 w-4 text-primary" /> for healthier living
          </p>
        </div>
      </div>
    </footer>
  );
}
