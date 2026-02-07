import { Link } from 'react-router-dom';
import { Leaf, Github, Mail, Heart, MessageCircle } from "lucide-react";
import { Separator } from '@/components/ui/separator';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t border-border/50 bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Leaf className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold">NutriScan</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered food recognition and calorie estimation for smarter, healthier eating decisions.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://wa.me/917993275992" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="WhatsApp">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="https://github.com/alwaysdaya123" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </a>
              <a href="mailto:alwaysdaya123@gmail.com" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Email">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/analyze" className="hover:text-foreground transition-colors">
                  Food Recognition
                </Link>
              </li>
              <li>
                <Link to="/meal-planner" className="hover:text-foreground transition-colors">
                  AI Meal Planner
                </Link>
              </li>
              <li>
                <Link to="/progress" className="hover:text-foreground transition-colors">
                  Progress Tracking
                </Link>
              </li>
              <li>
                <Link to="/diet-history" className="hover:text-foreground transition-colors">
                  Diet History & Export
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="mailto:alwaysdaya123@gmail.com" className="hover:text-foreground transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link to="/privacy" className="hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Cookie Policy
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <Separator className="my-8" />
        
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {currentYear} NutriScan. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            Developed by Rentamallu Dayakar <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
}
