import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Check, X } from 'lucide-react';
import type { NutritionData } from '@/types/nutrition';

interface ManualCorrectionFormProps {
  data: NutritionData;
  onCorrect: (corrected: NutritionData) => void;
}

export function ManualCorrectionForm({ data, onCorrect }: ManualCorrectionFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    foodName: data.foodName,
    calories: data.calories.toString(),
    protein: data.protein.toString(),
    carbs: data.carbs.toString(),
    fat: data.fat.toString(),
    fiber: data.fiber.toString(),
    sugar: data.sugar.toString(),
    sodium: data.sodium.toString(),
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const corrected: NutritionData = {
      ...data,
      foodName: formData.foodName,
      calories: parseInt(formData.calories) || 0,
      protein: parseFloat(formData.protein) || 0,
      carbs: parseFloat(formData.carbs) || 0,
      fat: parseFloat(formData.fat) || 0,
      fiber: parseFloat(formData.fiber) || 0,
      sugar: parseFloat(formData.sugar) || 0,
      sodium: parseInt(formData.sodium) || 0,
    };
    onCorrect(corrected);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      foodName: data.foodName,
      calories: data.calories.toString(),
      protein: data.protein.toString(),
      carbs: data.carbs.toString(),
      fat: data.fat.toString(),
      fiber: data.fiber.toString(),
      sugar: data.sugar.toString(),
      sodium: data.sodium.toString(),
    });
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="gap-2"
      >
        <Pencil className="h-4 w-4" />
        Correct Values
      </Button>
    );
  }

  return (
    <Card className="animate-scale-in">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Pencil className="h-4 w-4" />
          Manual Correction
        </CardTitle>
        <CardDescription>
          Update the values if the AI estimation seems incorrect
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="foodName">Food Name</Label>
            <Input
              id="foodName"
              value={formData.foodName}
              onChange={(e) => handleChange('foodName', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="space-y-1">
              <Label htmlFor="calories" className="text-xs">Calories (kcal)</Label>
              <Input
                id="calories"
                type="number"
                min="0"
                value={formData.calories}
                onChange={(e) => handleChange('calories', e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="protein" className="text-xs">Protein (g)</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                step="0.1"
                value={formData.protein}
                onChange={(e) => handleChange('protein', e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="carbs" className="text-xs">Carbs (g)</Label>
              <Input
                id="carbs"
                type="number"
                min="0"
                step="0.1"
                value={formData.carbs}
                onChange={(e) => handleChange('carbs', e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="fat" className="text-xs">Fat (g)</Label>
              <Input
                id="fat"
                type="number"
                min="0"
                step="0.1"
                value={formData.fat}
                onChange={(e) => handleChange('fat', e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="fiber" className="text-xs">Fiber (g)</Label>
              <Input
                id="fiber"
                type="number"
                min="0"
                step="0.1"
                value={formData.fiber}
                onChange={(e) => handleChange('fiber', e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sugar" className="text-xs">Sugar (g)</Label>
              <Input
                id="sugar"
                type="number"
                min="0"
                step="0.1"
                value={formData.sugar}
                onChange={(e) => handleChange('sugar', e.target.value)}
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="sodium" className="text-xs">Sodium (mg)</Label>
              <Input
                id="sodium"
                type="number"
                min="0"
                value={formData.sodium}
                onChange={(e) => handleChange('sodium', e.target.value)}
                className="h-9"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="ghost" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Apply Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
