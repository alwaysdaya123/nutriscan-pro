import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './button';
import { Camera, Plus, UtensilsCrossed, X, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

type FABAction = {
  icon: React.ReactNode;
  label: string;
  href: string;
  color?: string;
};

const actions: FABAction[] = [
  {
    icon: <Camera className="h-5 w-5" />,
    label: 'Analyze Food',
    href: '/analyze',
    color: 'bg-primary hover:bg-primary/90',
  },
  {
    icon: <UtensilsCrossed className="h-5 w-5" />,
    label: 'View Meals',
    href: '/meals',
    color: 'bg-blue-500 hover:bg-blue-600',
  },
];

export function FloatingActionButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col-reverse items-end gap-3">
      {/* Action buttons */}
      {isOpen && (
        <div className="flex flex-col-reverse gap-2 animate-fade-in">
          {actions.map((action, index) => (
            <Link key={index} to={action.href} onClick={() => setIsOpen(false)}>
              <div 
                className="flex items-center gap-2 animate-slide-up"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className="px-3 py-1.5 rounded-lg bg-card text-sm font-medium shadow-lg border">
                  {action.label}
                </span>
                <Button
                  size="icon"
                  className={cn(
                    'h-12 w-12 rounded-full shadow-lg transition-all hover:scale-105',
                    action.color
                  )}
                >
                  {action.icon}
                </Button>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        className={cn(
          'h-14 w-14 rounded-full shadow-xl transition-all hover:scale-105',
          isOpen 
            ? 'bg-muted-foreground hover:bg-muted-foreground/90 rotate-45' 
            : 'bg-primary hover:bg-primary/90'
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform" />
        ) : (
          <Plus className="h-6 w-6 transition-transform" />
        )}
      </Button>
    </div>
  );
}
