import { useState, useEffect, useCallback } from 'react';
import { DashboardHeader } from '@/components/layout/DashboardHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Calendar, Download, FileText, FileSpreadsheet, ChevronLeft, ChevronRight, Utensils } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO, startOfMonth, endOfMonth, subMonths, addMonths } from 'date-fns';
import type { Meal } from '@/types/database';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

type GroupedMeals = {
  [date: string]: Meal[];
};

export default function DietHistoryPage() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [exporting, setExporting] = useState(false);

  const fetchMeals = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const start = startOfMonth(currentMonth);
      const end = endOfMonth(currentMonth);

      const { data, error } = await supabase
        .from('meals')
        .select('*')
        .eq('user_id', user.id)
        .gte('logged_at', start.toISOString())
        .lte('logged_at', end.toISOString())
        .order('logged_at', { ascending: false });

      if (error) throw error;
      setMeals((data || []) as Meal[]);
    } catch (error) {
      console.error('Error fetching meals:', error);
    } finally {
      setLoading(false);
    }
  }, [user, currentMonth]);

  useEffect(() => {
    fetchMeals();
  }, [fetchMeals]);

  const groupedMeals: GroupedMeals = meals.reduce((acc, meal) => {
    const date = format(parseISO(meal.logged_at), 'yyyy-MM-dd');
    if (!acc[date]) acc[date] = [];
    acc[date].push(meal);
    return acc;
  }, {} as GroupedMeals);

  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein = meals.reduce((sum, m) => sum + Number(m.protein), 0);
  const totalCarbs = meals.reduce((sum, m) => sum + Number(m.carbs), 0);
  const totalFat = meals.reduce((sum, m) => sum + Number(m.fat), 0);
  const daysTracked = Object.keys(groupedMeals).length;
  const avgCalories = daysTracked > 0 ? Math.round(totalCalories / daysTracked) : 0;

  const exportAsExcel = () => {
    setExporting(true);
    try {
      // Create workbook
      const wb = XLSX.utils.book_new();

      // Summary sheet
      const summaryData = [
        ['NutriScan Diet Report'],
        [''],
        ['Month', format(currentMonth, 'MMMM yyyy')],
        ['Generated', format(new Date(), 'PPP')],
        [''],
        ['Summary Statistics'],
        ['Total Meals', meals.length],
        ['Days Tracked', daysTracked],
        ['Total Calories', totalCalories],
        ['Average Daily Calories', avgCalories],
        [''],
        ['Macronutrient Totals'],
        ['Protein (g)', totalProtein.toFixed(1)],
        ['Carbohydrates (g)', totalCarbs.toFixed(1)],
        ['Fat (g)', totalFat.toFixed(1)],
      ];
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      
      // Style the header
      summarySheet['A1'] = { v: 'NutriScan Diet Report', s: { font: { bold: true, sz: 16 } } };
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

      // Detailed meals sheet
      const mealsData = [
        ['Date', 'Time', 'Food', 'Meal Type', 'Serving Size', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)', 'Fiber (g)', 'Sugar (g)', 'Sodium (mg)'],
        ...meals.map(meal => [
          format(parseISO(meal.logged_at), 'yyyy-MM-dd'),
          format(parseISO(meal.logged_at), 'HH:mm'),
          meal.food_name,
          meal.meal_type.charAt(0).toUpperCase() + meal.meal_type.slice(1),
          meal.serving_size || 'Standard',
          meal.calories,
          meal.protein,
          meal.carbs,
          meal.fat,
          meal.fiber,
          meal.sugar,
          meal.sodium,
        ])
      ];
      const mealsSheet = XLSX.utils.aoa_to_sheet(mealsData);
      
      // Set column widths
      mealsSheet['!cols'] = [
        { wch: 12 }, { wch: 8 }, { wch: 30 }, { wch: 12 }, { wch: 15 },
        { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 }
      ];
      XLSX.utils.book_append_sheet(wb, mealsSheet, 'Meal Details');

      // Daily summary sheet
      const dailyData = [
        ['Date', 'Meals', 'Calories', 'Protein (g)', 'Carbs (g)', 'Fat (g)'],
        ...Object.entries(groupedMeals)
          .sort(([a], [b]) => b.localeCompare(a))
          .map(([date, dayMeals]) => [
            format(parseISO(date), 'EEEE, MMM d'),
            dayMeals.length,
            dayMeals.reduce((sum, m) => sum + m.calories, 0),
            dayMeals.reduce((sum, m) => sum + Number(m.protein), 0).toFixed(1),
            dayMeals.reduce((sum, m) => sum + Number(m.carbs), 0).toFixed(1),
            dayMeals.reduce((sum, m) => sum + Number(m.fat), 0).toFixed(1),
          ])
      ];
      const dailySheet = XLSX.utils.aoa_to_sheet(dailyData);
      dailySheet['!cols'] = [{ wch: 20 }, { wch: 8 }, { wch: 10 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];
      XLSX.utils.book_append_sheet(wb, dailySheet, 'Daily Summary');

      // Download
      XLSX.writeFile(wb, `nutriscan-diet-${format(currentMonth, 'yyyy-MM')}.xlsx`);
      
      toast({
        title: 'Export Successful',
        description: 'Your diet data has been exported to Excel.',
      });
    } catch (error) {
      console.error('Excel export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to export data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const exportAsPDF = () => {
    setExporting(true);
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Title
      doc.setFontSize(24);
      doc.setTextColor(34, 139, 34); // Forest green
      doc.text('NutriScan', pageWidth / 2, y, { align: 'center' });
      y += 10;
      
      doc.setFontSize(16);
      doc.setTextColor(60, 60, 60);
      doc.text('Monthly Diet Report', pageWidth / 2, y, { align: 'center' });
      y += 15;

      // Report info
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Month: ${format(currentMonth, 'MMMM yyyy')}`, 20, y);
      doc.text(`Generated: ${format(new Date(), 'PPP')}`, pageWidth - 20, y, { align: 'right' });
      y += 5;
      
      if (profile?.full_name) {
        doc.text(`User: ${profile.full_name}`, 20, y);
        y += 5;
      }
      
      // Divider
      doc.setDrawColor(200, 200, 200);
      doc.line(20, y, pageWidth - 20, y);
      y += 15;

      // Summary Statistics
      doc.setFontSize(14);
      doc.setTextColor(34, 139, 34);
      doc.text('Summary Statistics', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      const summaryItems = [
        ['Total Meals Logged', meals.length.toString()],
        ['Days with Logged Meals', daysTracked.toString()],
        ['Total Calories', `${totalCalories.toLocaleString()} kcal`],
        ['Average Daily Calories', `${avgCalories.toLocaleString()} kcal`],
      ];

      summaryItems.forEach(([label, value]) => {
        doc.text(label + ':', 25, y);
        doc.setFont('helvetica', 'bold');
        doc.text(value, 100, y);
        doc.setFont('helvetica', 'normal');
        y += 7;
      });
      y += 10;

      // Macronutrients
      doc.setFontSize(14);
      doc.setTextColor(34, 139, 34);
      doc.text('Macronutrient Totals', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      const macros = [
        ['Protein', `${totalProtein.toFixed(1)}g`],
        ['Carbohydrates', `${totalCarbs.toFixed(1)}g`],
        ['Fat', `${totalFat.toFixed(1)}g`],
      ];

      macros.forEach(([label, value]) => {
        doc.text(label + ':', 25, y);
        doc.setFont('helvetica', 'bold');
        doc.text(value, 100, y);
        doc.setFont('helvetica', 'normal');
        y += 7;
      });
      y += 10;

      // Meal Type Breakdown
      doc.setFontSize(14);
      doc.setTextColor(34, 139, 34);
      doc.text('Meal Type Breakdown', 20, y);
      y += 10;

      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      
      const mealTypes = [
        ['Breakfast', meals.filter(m => m.meal_type === 'breakfast').length],
        ['Lunch', meals.filter(m => m.meal_type === 'lunch').length],
        ['Dinner', meals.filter(m => m.meal_type === 'dinner').length],
        ['Snacks', meals.filter(m => m.meal_type === 'snack').length],
      ];

      mealTypes.forEach(([label, count]) => {
        doc.text(`${label}:`, 25, y);
        doc.setFont('helvetica', 'bold');
        doc.text(`${count} meals`, 100, y);
        doc.setFont('helvetica', 'normal');
        y += 7;
      });
      y += 15;

      // Daily breakdown (new page if needed)
      if (y > 200) {
        doc.addPage();
        y = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(34, 139, 34);
      doc.text('Daily Breakdown', 20, y);
      y += 10;

      doc.setFontSize(9);
      doc.setTextColor(60, 60, 60);

      Object.entries(groupedMeals)
        .sort(([a], [b]) => b.localeCompare(a))
        .slice(0, 15) // Limit to 15 days to fit on pages
        .forEach(([date, dayMeals]) => {
          if (y > 270) {
            doc.addPage();
            y = 20;
          }
          
          const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
          doc.setFont('helvetica', 'bold');
          doc.text(format(parseISO(date), 'EEE, MMM d'), 25, y);
          doc.setFont('helvetica', 'normal');
          doc.text(`${dayMeals.length} meals • ${dayCalories.toLocaleString()} kcal`, 70, y);
          y += 6;
        });

      // Footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
          'Generated by NutriScan • AI-powered nutrition tracking',
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `Page ${i} of ${pageCount}`,
          pageWidth - 20,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'right' }
        );
      }

      doc.save(`nutriscan-report-${format(currentMonth, 'yyyy-MM')}.pdf`);
      
      toast({
        title: 'PDF Generated',
        description: 'Your diet report has been saved as PDF.',
      });
    } catch (error) {
      console.error('PDF export error:', error);
      toast({
        title: 'Export Failed',
        description: 'Failed to generate PDF. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setExporting(false);
    }
  };

  const mealTypeColors: Record<string, string> = {
    breakfast: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    lunch: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    dinner: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    snack: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <DashboardHeader />

      <main className="container py-8">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
          <div>
            <h1 className="text-3xl font-bold">Diet History</h1>
            <p className="text-muted-foreground mt-1">
              View and export your meal history
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportAsExcel} 
              disabled={exporting || meals.length === 0}
              className="gap-2 transition-all hover:scale-105"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportAsPDF} 
              disabled={exporting || meals.length === 0}
              className="gap-2 transition-all hover:scale-105"
            >
              <FileText className="h-4 w-4" />
              PDF Report
            </Button>
          </div>
        </div>

        {/* Month Navigation */}
        <Card className="glass mb-6 animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-lg font-semibold">{format(currentMonth, 'MMMM yyyy')}</span>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                disabled={currentMonth >= new Date()}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        {!loading && meals.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-4 mb-6">
            {[
              { label: 'Meals Logged', value: meals.length },
              { label: 'Days Tracked', value: daysTracked },
              { label: 'Total Calories', value: totalCalories.toLocaleString() },
              { label: 'Avg Daily Calories', value: avgCalories.toLocaleString() },
            ].map((stat, i) => (
              <Card key={stat.label} className="animate-scale-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Meals Timeline */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : meals.length === 0 ? (
          <EmptyState
            icon={Utensils}
            title="No meals logged this month"
            description="Start tracking your meals to see your diet history here."
            action={{
              label: 'Analyze Food',
              href: '/analyze',
            }}
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedMeals)
              .sort(([a], [b]) => b.localeCompare(a))
              .map(([date, dayMeals], index) => {
                const dayCalories = dayMeals.reduce((sum, m) => sum + m.calories, 0);
                return (
                  <Card 
                    key={date} 
                    className="glass animate-slide-up overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {format(parseISO(date), 'EEEE, MMMM d')}
                        </CardTitle>
                        <Badge variant="secondary" className="font-mono">
                          {dayCalories.toLocaleString()} kcal
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {dayMeals.map((meal, mealIndex) => (
                          <div
                            key={meal.id}
                            className="flex items-center gap-4 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-all hover:scale-[1.01]"
                            style={{ animationDelay: `${mealIndex * 25}ms` }}
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium truncate">{meal.food_name}</span>
                                <Badge className={mealTypeColors[meal.meal_type]} variant="secondary">
                                  {meal.meal_type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {format(parseISO(meal.logged_at), 'h:mm a')} • {meal.serving_size || 'Standard serving'}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{meal.calories} kcal</p>
                              <p className="text-xs text-muted-foreground">
                                P: {meal.protein}g • C: {meal.carbs}g • F: {meal.fat}g
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>
        )}
      </main>
    </div>
  );
}
