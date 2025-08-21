-- Create storage buckets for document uploads
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents', 'kyc-documents', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('business-documents', 'business-documents', false);

-- Create storage policies for profile images
CREATE POLICY "Profile images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'profile-images');

CREATE POLICY "Users can upload their own profile image" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile image" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile image" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for KYC documents
CREATE POLICY "Users can view their own KYC documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own KYC documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own KYC documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own KYC documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create storage policies for business documents
CREATE POLICY "Users can view their own business documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload their own business documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own business documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own business documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'business-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Enhance sellers table with additional fields
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS profile_image_url TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS business_type TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS establishment_date DATE;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS website_url TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS business_category TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS annual_turnover NUMERIC;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS employee_count INTEGER;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS ifsc_code TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS tax_id TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS vat_number TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'IN';
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS fssai_license TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS shop_establishment_license TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS brand_certificate_url TEXT;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS account_status TEXT DEFAULT 'pending_verification';
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS verification_score INTEGER DEFAULT 0;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS compliance_status TEXT DEFAULT 'incomplete';
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS two_factor_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS preferred_language TEXT DEFAULT 'en';
ALTER TABLE public.sellers ADD COLUMN IF NOT EXISTS preferred_currency TEXT DEFAULT 'INR';

-- Create documents table for tracking uploaded documents
CREATE TABLE IF NOT EXISTS public.seller_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  document_type TEXT NOT NULL,
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT,
  verification_status TEXT DEFAULT 'pending',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  verified_at TIMESTAMP WITH TIME ZONE,
  expires_at DATE,
  document_number TEXT,
  issuing_authority TEXT,
  remarks TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on seller_documents
ALTER TABLE public.seller_documents ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for seller_documents
CREATE POLICY "Sellers can manage their own documents" 
ON public.seller_documents 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM sellers 
  WHERE sellers.id = seller_documents.seller_id 
  AND sellers.user_id = auth.uid()
));

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.subscription_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  currency TEXT DEFAULT 'INR',
  billing_cycle TEXT DEFAULT 'monthly',
  features JSONB DEFAULT '[]',
  max_products INTEGER,
  max_orders INTEGER,
  commission_rate NUMERIC,
  storage_limit_gb INTEGER,
  support_level TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on subscription_plans (public read access)
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active subscription plans" 
ON public.subscription_plans 
FOR SELECT 
USING (is_active = true);

-- Create seller_subscriptions table
CREATE TABLE IF NOT EXISTS public.seller_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  plan_id UUID NOT NULL REFERENCES public.subscription_plans(id),
  status TEXT DEFAULT 'active',
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  auto_renew BOOLEAN DEFAULT true,
  payment_method TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on seller_subscriptions
ALTER TABLE public.seller_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sellers can view their own subscriptions" 
ON public.seller_subscriptions 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM sellers 
  WHERE sellers.id = seller_subscriptions.seller_id 
  AND sellers.user_id = auth.uid()
));

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, price, currency, billing_cycle, features, max_products, max_orders, commission_rate, storage_limit_gb, support_level) VALUES
('Free', 0, 'INR', 'monthly', '["Basic listing", "Standard support", "Basic analytics"]', 50, 100, 5.0, 1, 'Basic'),
('Starter', 999, 'INR', 'monthly', '["Unlimited listings", "Priority support", "Advanced analytics", "GST management"]', 500, 1000, 3.5, 5, 'Standard'),
('Professional', 2999, 'INR', 'monthly', '["Unlimited listings", "24/7 support", "Advanced analytics", "GST management", "Marketing tools", "Bulk operations"]', 2000, 5000, 2.5, 20, 'Premium'),
('Enterprise', 9999, 'INR', 'monthly', '["Unlimited listings", "Dedicated support", "Custom analytics", "GST management", "Marketing tools", "Bulk operations", "API access", "Custom integrations"]', -1, -1, 1.5, 100, 'Enterprise');

-- Add triggers for updated_at columns
CREATE TRIGGER update_seller_documents_updated_at
  BEFORE UPDATE ON public.seller_documents
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
  BEFORE UPDATE ON public.subscription_plans
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_seller_subscriptions_updated_at
  BEFORE UPDATE ON public.seller_subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();