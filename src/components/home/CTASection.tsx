import { ArrowRight, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-12 lg:py-16">
      <div className="container">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-6 text-primary-foreground sm:p-8 lg:p-10">
          {/* Decorative elements */}
          <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
          
          <div className="relative z-10 mx-auto max-w-xl text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to Start Your Health Journey?
            </h2>
            <p className="mt-2.5 text-sm text-primary-foreground/90 sm:text-base">
              Take control of your nutrition with instant AI analysis. Upload your first food image and discover the power of smart eating.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild size="default" variant="secondary" className="group h-10 text-sm">
                <Link to="/analyze">
                  <Camera className="mr-1.5 h-4 w-4" />
                  Start Analyzing
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
