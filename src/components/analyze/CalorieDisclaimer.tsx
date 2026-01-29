import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface CalorieDisclaimerProps {
  confidence: number;
}

export function CalorieDisclaimer({ confidence }: CalorieDisclaimerProps) {
  const isLowConfidence = confidence < 0.7;
  
  return (
    <Alert variant={isLowConfidence ? "destructive" : "default"} className="animate-fade-in">
      {isLowConfidence ? (
        <AlertTriangle className="h-4 w-4" />
      ) : (
        <Info className="h-4 w-4" />
      )}
      <AlertTitle className="text-sm font-medium">
        {isLowConfidence ? 'Lower Confidence Estimate' : 'AI Estimation Notice'}
      </AlertTitle>
      <AlertDescription className="text-xs">
        {isLowConfidence ? (
          <>
            This analysis has lower confidence ({Math.round(confidence * 100)}%). 
            The food may be partially obscured or unfamiliar. Consider manually verifying the nutritional values.
          </>
        ) : (
          <>
            Calorie and nutrition estimates are AI-generated approximations based on visual analysis. 
            Actual values may vary by ±15-20% depending on preparation methods, ingredients, and portion sizes. 
            For precise dietary requirements, please consult a nutritionist.
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
