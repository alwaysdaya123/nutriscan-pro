import { Link } from "react-router-dom";
import { Camera, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const actions = [
  { to: "/analyze", icon: Camera, label: "Analyze Food" },
  { to: "/meal-planner", icon: Calendar, label: "Meal Plan" },
  { to: "/progress", icon: TrendingUp, label: "Diet Tracker" },
];

export function QuickActionBar() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <section className="container pb-4 animate-slide-up" style={{ animationDelay: "100ms" }}>
      <div className="flex flex-wrap gap-2">
        {actions.map(({ to, icon: Icon, label }) => (
          <Button
            key={to}
            asChild
            variant="outline"
            size="sm"
            className="gap-1.5 hover-lift"
          >
            <Link to={to}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
