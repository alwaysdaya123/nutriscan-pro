import { useState } from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

type AddMealPlanDialogProps = {
  selectedDate: string;
  onMealAdded: () => void;
};

export function AddMealPlanDialog({ selectedDate, onMealAdded }: AddMealPlanDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    food_name: '',
    meal_type: 'breakfast',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !form.food_name || !form.calories) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('meal_plans').insert({
        user_id: user.id,
        plan_date: selectedDate,
        meal_type: form.meal_type,
        food_name: form.food_name,
        calories: parseInt(form.calories),
        protein: form.protein ? parseFloat(form.protein) : 0,
        carbs: form.carbs ? parseFloat(form.carbs) : 0,
        fat: form.fat ? parseFloat(form.fat) : 0,
        description: form.description || null,
        is_completed: false,
      });

      if (error) throw error;

      toast({ title: 'Meal added', description: 'Your custom meal has been added to the plan.' });
      setForm({ food_name: '', meal_type: 'breakfast', calories: '', protein: '', carbs: '', fat: '', description: '' });
      setOpen(false);
      onMealAdded();
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to add meal.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Meal
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Meal</DialogTitle>
          <DialogDescription>
            Add a meal to your plan for {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="food_name">Meal Name *</Label>
            <Input
              id="food_name"
              placeholder="e.g. Grilled Chicken Salad"
              value={form.food_name}
              onChange={(e) => setForm(prev => ({ ...prev, food_name: e.target.value }))}
              required
              maxLength={100}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="meal_type">Meal Type</Label>
            <Select value={form.meal_type} onValueChange={(val) => setForm(prev => ({ ...prev, meal_type: val }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="breakfast">Breakfast</SelectItem>
                <SelectItem value="lunch">Lunch</SelectItem>
                <SelectItem value="dinner">Dinner</SelectItem>
                <SelectItem value="snack">Snack</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="calories">Calories *</Label>
              <Input
                id="calories"
                type="number"
                placeholder="e.g. 350"
                value={form.calories}
                onChange={(e) => setForm(prev => ({ ...prev, calories: e.target.value }))}
                required
                min={0}
                max={5000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="protein">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                placeholder="e.g. 25"
                value={form.protein}
                onChange={(e) => setForm(prev => ({ ...prev, protein: e.target.value }))}
                min={0}
                max={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carbs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                placeholder="e.g. 40"
                value={form.carbs}
                onChange={(e) => setForm(prev => ({ ...prev, carbs: e.target.value }))}
                min={0}
                max={500}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fat">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                placeholder="e.g. 12"
                value={form.fat}
                onChange={(e) => setForm(prev => ({ ...prev, fat: e.target.value }))}
                min={0}
                max={500}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Notes (optional)</Label>
            <Textarea
              id="description"
              placeholder="Any additional notes..."
              value={form.description}
              onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={saving || !form.food_name || !form.calories}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              Add Meal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
