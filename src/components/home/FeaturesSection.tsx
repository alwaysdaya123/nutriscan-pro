import { Camera, BarChart3, Heart, Lightbulb, Shield, Zap } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Camera,
    title: "Instant Recognition",
    description: "Simply snap a photo and our AI instantly identifies your food items with remarkable accuracy.",
  },
  {
    icon: BarChart3,
    title: "Detailed Nutrition",
    description: "Get comprehensive breakdown of calories, protein, carbs, fats, fiber, and more.",
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
    description: "Discover healthier alternatives and nutritional improvements for your diet.",
  },
  {
    icon: Shield,
    title: "Privacy First",
    description: "Your images are analyzed securely and never stored without your permission.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 lg:py-32">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need for
            <span className="text-primary"> Smarter Eating</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered platform provides all the tools you need to understand your food and make healthier choices.
          </p>
        </div>
        
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card/50 transition-all duration-300 hover:border-primary/30 hover:shadow-lg animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
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
