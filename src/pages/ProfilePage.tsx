import { useState } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { useAuth } from '@/contexts/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Loader2, Save, User, Activity, Target, Utensils } from 'lucide-react';

export default function ProfilePage() {
  const { profile, user } = useAuth();
  const { updateProfile, calculateDailyCalories, loading } = useProfile();

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    age: profile?.age?.toString() || '',
    gender: profile?.gender || '',
    height_cm: profile?.height_cm?.toString() || '',
    weight_kg: profile?.weight_kg?.toString() || '',
    activity_level: profile?.activity_level || 'moderate',
    diet_goal: profile?.diet_goal || 'maintenance',
    dietary_preference: (profile as any)?.dietary_preference || 'non-veg',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updates: Record<string, unknown> = {
      full_name: formData.full_name || null,
      age: formData.age ? parseInt(formData.age) : null,
      gender: formData.gender || null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      activity_level: formData.activity_level,
      diet_goal: formData.diet_goal,
      dietary_preference: formData.dietary_preference,
    };

    // Calculate daily calorie target if all required fields are present
    if (formData.weight_kg && formData.height_cm && formData.age && formData.gender) {
      updates.daily_calorie_target = calculateDailyCalories(
        parseFloat(formData.weight_kg),
        parseFloat(formData.height_cm),
        parseInt(formData.age),
        formData.gender,
        formData.activity_level,
        formData.diet_goal
      );
    }

    await updateProfile(updates);
  };

  const getInitials = () => {
    if (formData.full_name) {
      return formData.full_name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.charAt(0).toUpperCase() || 'U';
  };

  // Calculate preview calories
  const previewCalories = formData.weight_kg && formData.height_cm && formData.age && formData.gender
    ? calculateDailyCalories(
        parseFloat(formData.weight_kg),
        parseFloat(formData.height_cm),
        parseInt(formData.age),
        formData.gender,
        formData.activity_level,
        formData.diet_goal
      )
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />
      
      <main className="container py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Profile Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your health profile and goals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Your personal details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{formData.full_name || 'Your Name'}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleChange('full_name', e.target.value)}
                    placeholder="John Doe"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="1"
                    max="150"
                    value={formData.age}
                    onChange={(e) => handleChange('age', e.target.value)}
                    placeholder="25"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={formData.gender} onValueChange={(value) => handleChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Body Metrics */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Body Metrics
              </CardTitle>
              <CardDescription>
                Your physical measurements for accurate calorie calculations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="height_cm">Height (cm)</Label>
                  <Input
                    id="height_cm"
                    type="number"
                    min="50"
                    max="300"
                    step="0.1"
                    value={formData.height_cm}
                    onChange={(e) => handleChange('height_cm', e.target.value)}
                    placeholder="175"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight_kg">Weight (kg)</Label>
                  <Input
                    id="weight_kg"
                    type="number"
                    min="20"
                    max="500"
                    step="0.1"
                    value={formData.weight_kg}
                    onChange={(e) => handleChange('weight_kg', e.target.value)}
                    placeholder="70"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity_level">Activity Level</Label>
                <Select 
                  value={formData.activity_level} 
                  onValueChange={(value) => handleChange('activity_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little or no exercise)</SelectItem>
                    <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (intense exercise daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Diet Goal */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Diet Goal
              </CardTitle>
              <CardDescription>
                Choose your nutrition objective
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: 'weight_loss', label: 'Weight Loss', desc: '500 kcal deficit' },
                  { value: 'maintenance', label: 'Maintenance', desc: 'Maintain weight' },
                  { value: 'muscle_gain', label: 'Muscle Gain', desc: '300 kcal surplus' },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => handleChange('diet_goal', goal.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.diet_goal === goal.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium">{goal.label}</p>
                    <p className="text-xs text-muted-foreground">{goal.desc}</p>
                  </button>
                ))}
              </div>

              {previewCalories && (
                <div className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your daily calorie target</p>
                  <p className="text-3xl font-bold text-primary">{previewCalories.toLocaleString()} kcal</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dietary Preference */}
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Dietary Preference
              </CardTitle>
              <CardDescription>
                For personalized meal planning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { value: 'non-veg', label: 'Non-Vegetarian', desc: 'Includes meat & fish' },
                  { value: 'veg', label: 'Vegetarian', desc: 'No meat or fish' },
                  { value: 'vegan', label: 'Vegan', desc: 'Plant-based only' },
                ].map((pref) => (
                  <button
                    key={pref.value}
                    type="button"
                    onClick={() => handleChange('dietary_preference', pref.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      formData.dietary_preference === pref.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <p className="font-medium">{pref.label}</p>
                    <p className="text-xs text-muted-foreground">{pref.desc}</p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <Button type="submit" size="lg" className="w-full gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            Save Profile
          </Button>
        </form>
      </main>
    </div>
  );
}
