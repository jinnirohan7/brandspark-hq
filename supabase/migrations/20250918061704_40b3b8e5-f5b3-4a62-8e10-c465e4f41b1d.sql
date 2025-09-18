-- Create admin role system for SellSphere Super Admin Panel
-- This will allow admins to manage all sellers, payouts, settings, and integrations

-- Create admin_users table to manage super admin accounts
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  permissions JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(user_id),
  UNIQUE(email)
);

-- Enable RLS for admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Create admin_sessions for tracking admin activities
CREATE TABLE public.admin_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admin_users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT, -- 'seller', 'order', 'payout', etc.
  target_id UUID,
  details JSONB DEFAULT '{}'::jsonb,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for admin_sessions
ALTER TABLE public.admin_sessions ENABLE ROW LEVEL SECURITY;

-- Create admin_settings for platform configuration
CREATE TABLE public.admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL, -- 'payouts', 'security', 'integrations', 'general'
  setting_key TEXT NOT NULL,
  setting_value JSONB NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  UNIQUE(category, setting_key)
);

-- Enable RLS for admin_settings
ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

-- Create courier_partners table for delivery oversight
CREATE TABLE public.courier_partners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  api_endpoint TEXT,
  api_key_encrypted TEXT,
  supported_regions JSONB DEFAULT '[]'::jsonb,
  pricing_config JSONB DEFAULT '{}'::jsonb,
  performance_metrics JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT true,
  contract_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for courier_partners
ALTER TABLE public.courier_partners ENABLE ROW LEVEL SECURITY;

-- Create seller_payouts table for payout management
CREATE TABLE public.seller_payouts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES sellers(id) ON DELETE CASCADE NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payout_date DATE NOT NULL,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  transaction_reference TEXT,
  bank_details JSONB,
  fees NUMERIC(12,2) DEFAULT 0,
  tax_deducted NUMERIC(12,2) DEFAULT 0,
  notes TEXT,
  processed_by UUID REFERENCES admin_users(id),
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for seller_payouts
ALTER TABLE public.seller_payouts ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = _user_id
      AND is_active = true
  )
$$;

-- Create security definer function to get admin permissions
CREATE OR REPLACE FUNCTION public.get_admin_permissions(_user_id UUID)
RETURNS JSONB
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(permissions, '[]'::jsonb)
  FROM public.admin_users
  WHERE user_id = _user_id
    AND is_active = true
$$;

-- RLS Policies for admin_users
CREATE POLICY "Admins can view all admin users"
ON public.admin_users
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can manage admin users"
ON public.admin_users
FOR ALL
USING (public.is_admin(auth.uid()));

-- RLS Policies for admin_sessions
CREATE POLICY "Admins can view all sessions"
ON public.admin_sessions
FOR SELECT
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can create sessions"
ON public.admin_sessions
FOR INSERT
WITH CHECK (public.is_admin(auth.uid()));

-- RLS Policies for admin_settings
CREATE POLICY "Admins can manage settings"
ON public.admin_settings
FOR ALL
USING (public.is_admin(auth.uid()));

-- RLS Policies for courier_partners
CREATE POLICY "Admins can manage courier partners"
ON public.courier_partners
FOR ALL
USING (public.is_admin(auth.uid()));

-- RLS Policies for seller_payouts
CREATE POLICY "Admins can manage all payouts"
ON public.seller_payouts
FOR ALL
USING (public.is_admin(auth.uid()));

CREATE POLICY "Sellers can view their own payouts"
ON public.seller_payouts
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM sellers
    WHERE sellers.id = seller_payouts.seller_id
    AND sellers.user_id = auth.uid()
  )
);

-- Admin-specific RLS policies for existing tables
-- Allow admins to view all sellers data
CREATE POLICY "Admins can view all sellers"
ON public.sellers
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Allow admins to manage all sellers
CREATE POLICY "Admins can manage all sellers"
ON public.sellers
FOR ALL
USING (public.is_admin(auth.uid()));

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Allow admins to manage all orders
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
USING (public.is_admin(auth.uid()));

-- Allow admins to view all websites
CREATE POLICY "Admins can view all websites"
ON public.websites
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Allow admins to manage all websites
CREATE POLICY "Admins can manage all websites"
ON public.websites
FOR ALL
USING (public.is_admin(auth.uid()));

-- Allow admins to view all payments
CREATE POLICY "Admins can view all payments"
ON public.payments
FOR SELECT
USING (public.is_admin(auth.uid()));

-- Allow admins to manage all payments
CREATE POLICY "Admins can manage all payments"
ON public.payments
FOR ALL
USING (public.is_admin(auth.uid()));

-- Create trigger for updating timestamps
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_courier_partners_updated_at
  BEFORE UPDATE ON public.courier_partners
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seller_payouts_updated_at
  BEFORE UPDATE ON public.seller_payouts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default admin settings
INSERT INTO public.admin_settings (category, setting_key, setting_value, description) VALUES
('general', 'platform_name', '"SellSphere"', 'Platform display name'),
('general', 'platform_commission', '{"percentage": 2.5, "minimum": 10}', 'Platform commission structure'),
('payouts', 'payout_schedule', '"weekly"', 'Default payout schedule for sellers'),
('payouts', 'minimum_payout', '1000', 'Minimum payout amount in base currency'),
('security', 'fraud_detection', '{"enabled": true, "threshold": 0.8}', 'Fraud detection settings'),
('security', 'verification_required', 'true', 'Whether seller verification is required'),
('integrations', 'default_courier', '"delhivery"', 'Default courier partner'),
('integrations', 'payment_gateways', '["razorpay", "stripe", "payu"]', 'Enabled payment gateways');

-- Insert default courier partners
INSERT INTO public.courier_partners (name, supported_regions, performance_metrics, contract_details) VALUES
('Delhivery', '["IN"]', '{"delivery_rate": 95.5, "avg_delivery_time": 3.2}', '{"contract_type": "standard", "rates": "volume_based"}'),
('Blue Dart', '["IN"]', '{"delivery_rate": 98.2, "avg_delivery_time": 2.1}', '{"contract_type": "premium", "rates": "weight_based"}'),
('DTDC', '["IN"]', '{"delivery_rate": 92.8, "avg_delivery_time": 4.1}', '{"contract_type": "standard", "rates": "zone_based"}'),
('Ecom Express', '["IN"]', '{"delivery_rate": 94.3, "avg_delivery_time": 3.8}', '{"contract_type": "ecommerce", "rates": "volume_based"}');