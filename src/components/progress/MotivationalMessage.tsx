import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, Heart, Leaf, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

const motivationalMessages = [
  { icon: Sparkles, message: "You're doing amazing! Keep up the great work! 💪", color: 'text-amber-500' },
  { icon: Heart, message: "Every healthy choice is a step toward your goals! ❤️", color: 'text-rose-500' },
  { icon: Leaf, message: "Nourish your body, feed your soul! 🌿", color: 'text-green-500' },
  { icon: Award, message: "Champions are made one meal at a time! 🏆", color: 'text-blue-500' },
  { icon: Sparkles, message: "Your dedication to health is inspiring! ✨", color: 'text-purple-500' },
  { icon: Heart, message: "Small progress is still progress! Keep going! 💖", color: 'text-pink-500' },
  { icon: Leaf, message: "Healthy eating is a form of self-respect! 🥗", color: 'text-emerald-500' },
  { icon: Award, message: "You're building a healthier future, one day at a time! 🌟", color: 'text-orange-500' },
];

export function MotivationalMessage() {
  const [currentMessage, setCurrentMessage] = useState(motivationalMessages[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * motivationalMessages.length);
    setCurrentMessage(motivationalMessages[randomIndex]);
  }, []);

  const Icon = currentMessage.icon;

  return (
    <Card className="glass border-none bg-gradient-to-r from-primary/10 via-primary/5 to-transparent">
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`p-2 rounded-full bg-background/50 ${currentMessage.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <p className="text-sm font-medium">{currentMessage.message}</p>
      </CardContent>
    </Card>
  );
}
