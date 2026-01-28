import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationsDropdown } from '@/components/notifications/NotificationsDropdown';
import { 
  Leaf, LayoutDashboard, UtensilsCrossed, User, Camera, LogOut, ChevronDown,
  Calendar, TrendingUp, Settings
} from 'lucide-react';

export function DashboardHeader() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
  } = useNotifications();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

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
      <div className="container flex h-16 items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold text-foreground">NutriScan</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          <Link to="/dashboard">
            <Button variant="ghost" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          <Link to="/analyze">
            <Button variant="ghost" className="gap-2">
              <Camera className="h-4 w-4" />
              Analyze
            </Button>
          </Link>
          <Link to="/meal-planner">
            <Button variant="ghost" className="gap-2">
              <Calendar className="h-4 w-4" />
              Meal Plan
            </Button>
          </Link>
          <Link to="/meals">
            <Button variant="ghost" className="gap-2">
              <UtensilsCrossed className="h-4 w-4" />
              Meals
            </Button>
          </Link>
          <Link to="/progress">
            <Button variant="ghost" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Progress
            </Button>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <NotificationsDropdown
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onDelete={deleteNotification}
            onClearAll={clearAllNotifications}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 pl-2 pr-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:inline-block text-sm font-medium">
                  {profile?.full_name || 'User'}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-medium">{profile?.full_name || 'User'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/profile" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="lg:hidden" />
              <DropdownMenuItem asChild className="cursor-pointer lg:hidden">
                <Link to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer lg:hidden">
                <Link to="/analyze" className="flex items-center gap-2">
                  <Camera className="h-4 w-4" />
                  Analyze Food
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer lg:hidden">
                <Link to="/meal-planner" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Meal Planner
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer lg:hidden">
                <Link to="/meals" className="flex items-center gap-2">
                  <UtensilsCrossed className="h-4 w-4" />
                  Meal History
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer lg:hidden">
                <Link to="/progress" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Progress
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
