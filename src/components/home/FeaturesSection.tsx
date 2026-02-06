import { Camera, BarChart3, Heart, Lightbulb, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Camera,
    title: "Instant Recognition",
    description: "Simply snap a photo of any Indian dish and our AI instantly identifies it with remarkable accuracy.",
  },
  {
    icon: BarChart3,
    title: "Detailed Nutrition",
    description: "Get comprehensive breakdown of calories, protein, carbs, fats, fiber, and more for traditional recipes.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Analysis completed in seconds, so you can make quick decisions about your meals.",
  },
  {
    icon: Heart,
    title: "Health Insights",
    description: "Receive personalized health tips and healthier alternatives for your food choices.",
  },
  {
    icon: Lightbulb,
    title: "Smart Suggestions",
    description: "Discover healthier cooking methods and nutritional improvements for traditional dishes.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images are analyzed securely and never stored without your permission.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-12 lg:py-16 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-xl text-center mb-8 lg:mb-10">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Everything You Need for
            <span className="text-primary"> Smarter Eating</span>
          </h2>
          <p className="mt-2.5 text-sm text-muted-foreground sm:text-base">
            Our AI-powered platform provides all the tools you need to understand your food and make healthier choices.
          </p>
        </div>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover:shadow-lg hover:-translate-y-0.5 animate-slide-up cursor-default"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <CardHeader className="pb-2 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-200 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-105">
                  <feature.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3 text-sm font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0 px-4 pb-4">
                <CardDescription className="text-xs leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
