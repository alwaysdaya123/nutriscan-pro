-- Add health_score column to meals table
ALTER TABLE public.meals ADD COLUMN IF NOT EXISTS health_score integer DEFAULT NULL;

-- Add constraint to ensure health_score is between 0 and 100
ALTER TABLE public.meals ADD CONSTRAINT meals_health_score_range CHECK (health_score IS NULL OR (health_score >= 0 AND health_score <= 100));