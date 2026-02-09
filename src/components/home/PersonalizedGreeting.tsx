import { useAuth } from "@/contexts/AuthContext";
import { Sparkles } from "lucide-react";

const motivationalMessages = [
  "Every healthy meal is a step closer to your goals!",
  "Your body deserves the best fuel today.",
  "Small choices lead to big health wins!",
  "Nourish yourself — you're worth it.",
  "Today is a great day to eat mindfully!",
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

export function PersonalizedGreeting() {
  const { user, profile } = useAuth();

  if (!user) return null;

  const name = profile?.full_name?.split(" ")[0] || "there";
  const message =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  return (
    <section className="container pt-6 pb-2 animate-fade-in">
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">
            {getGreeting()}, {name} 👋
          </h2>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            {message}
          </p>
        </div>
      </div>
    </section>
  );
}
