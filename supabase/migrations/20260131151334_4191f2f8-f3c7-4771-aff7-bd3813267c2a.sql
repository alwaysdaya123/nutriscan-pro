-- Add is_active column to profiles for user account management
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Create food_items table for admin-managed food database
CREATE TABLE public.food_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  calories integer NOT NULL,
  protein numeric DEFAULT 0,
  carbs numeric DEFAULT 0,
  fat numeric DEFAULT 0,
  fiber numeric DEFAULT 0,
  sugar numeric DEFAULT 0,
  sodium integer DEFAULT 0,
  serving_size text DEFAULT '100g',
  category text DEFAULT 'general',
  is_verified boolean DEFAULT false,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create admin_audit_logs table for tracking admin actions
CREATE TABLE public.admin_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text,
  details jsonb,
  ip_address text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create system_metrics table for monitoring
CREATE TABLE public.system_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name text NOT NULL,
  metric_value numeric NOT NULL,
  metadata jsonb,
  recorded_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_metrics ENABLE ROW LEVEL SECURITY;

-- Food items policies - everyone can read, only admins can modify
CREATE POLICY "Anyone can view food items"
ON public.food_items FOR SELECT
USING (true);

CREATE POLICY "Admins can insert food items"
ON public.food_items FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update food items"
ON public.food_items FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete food items"
ON public.food_items FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Audit logs policies - only admins can access
CREATE POLICY "Admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert audit logs"
ON public.admin_audit_logs FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- System metrics policies - only admins can access
CREATE POLICY "Admins can view system metrics"
ON public.system_metrics FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert system metrics"
ON public.system_metrics FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all profiles
CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to update any profile (for enabling/disabling)
CREATE POLICY "Admins can update any profile"
ON public.profiles FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

-- Add policy for admins to view all meals for analytics
CREATE POLICY "Admins can view all meals"
ON public.meals FOR SELECT
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Create trigger for food_items updated_at
CREATE TRIGGER update_food_items_updated_at
BEFORE UPDATE ON public.food_items
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster audit log queries
CREATE INDEX idx_audit_logs_admin_id ON public.admin_audit_logs(admin_id);
CREATE INDEX idx_audit_logs_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX idx_food_items_category ON public.food_items(category);
CREATE INDEX idx_system_metrics_name ON public.system_metrics(metric_name);
CREATE INDEX idx_system_metrics_recorded_at ON public.system_metrics(recorded_at DESC);