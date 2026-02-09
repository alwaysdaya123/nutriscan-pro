import { Leaf } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  const getInitials = () => {
    if (profile?.full_name) {
      return profile.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 glass">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">NutriScan</span>
        </Link>
        <nav className="flex items-center gap-4">
          <ThemeToggle />
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground hidden sm:block px-2 py-1 rounded-md",
              location.pathname === "/" ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            to="/analyze"
            className={cn(
              "text-sm font-medium transition-colors hover:text-foreground hidden sm:block px-2 py-1 rounded-md",
              location.pathname === "/analyze" ? "text-primary bg-primary/10" : "text-muted-foreground"
            )}
          >
            Analyze
          </Link>

          {!loading && (
            <>
              {user ? (
                <Link to="/dashboard">
                  <Button variant="ghost" className="gap-2">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">Dashboard</span>
                  </Button>
                </Link>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/auth/signin">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link to="/auth/signup">
                    <Button size="sm">Get Started</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
