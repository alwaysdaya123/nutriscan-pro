import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/home/HeroSection";
import { FeaturesSection } from "@/components/home/FeaturesSection";
import { CTASection } from "@/components/home/CTASection";
import { PersonalizedGreeting } from "@/components/home/PersonalizedGreeting";
import { QuickActionBar } from "@/components/home/QuickActionBar";
import { FoodSuggestions } from "@/components/home/FoodSuggestions";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <PersonalizedGreeting />
        <QuickActionBar />
        <FoodSuggestions />
        <HeroSection />
        <FeaturesSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
