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
    <section id="features" className="py-16 lg:py-24 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-12 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Everything You Need for
            <span className="text-primary"> Smarter Eating</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our AI-powered platform provides all the tools you need to understand your food and make healthier choices.
          </p>
        </div>
        
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="group border-border/50 bg-card/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <CardTitle className="mt-4 text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-sm leading-relaxed">
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
