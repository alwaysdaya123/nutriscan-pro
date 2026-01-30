import { LucideIcon, Sparkles } from 'lucide-react';
import { Button } from './button';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center mb-6 animate-float">
          <Icon className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center animate-bounce-subtle">
          <Sparkles className="h-4 w-4 text-primary" />
        </div>
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {action && (
        <Button asChild className="animate-scale-in">
          <Link to={action.href}>{action.label}</Link>
        </Button>
      )}
    </div>
  );
}
