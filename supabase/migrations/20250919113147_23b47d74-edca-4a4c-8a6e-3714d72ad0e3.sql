-- Templates uploaded by Super Admin
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT,
  stack TEXT,
  version TEXT,
  preview_url TEXT,
  file_path TEXT,
  description TEXT,
  tags TEXT[],
  is_premium BOOLEAN DEFAULT false,
  price DECIMAL(10,2) DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft'))
);

-- Seller's selected/customized templates
CREATE TABLE IF NOT EXISTS public.seller_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  theme_name TEXT NOT NULL,
  customizations JSONB DEFAULT '{}',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'live')),
  custom_domain TEXT,
  subdomain TEXT UNIQUE,
  ssl_enabled BOOLEAN DEFAULT false,
  hosting_config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_published TIMESTAMP WITH TIME ZONE,
  version INTEGER DEFAULT 1
);

-- Domain management
CREATE TABLE IF NOT EXISTS public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  seller_theme_id UUID REFERENCES public.seller_themes(id) ON DELETE CASCADE,
  domain_name TEXT NOT NULL,
  domain_type TEXT DEFAULT 'custom' CHECK (domain_type IN ('subdomain', 'custom')),
  ssl_status TEXT DEFAULT 'pending' CHECK (ssl_status IN ('pending', 'active', 'failed', 'expired')),
  dns_provider TEXT,
  dns_records JSONB DEFAULT '{}',
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activity logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id) ON DELETE SET NULL,
  seller_theme_id UUID REFERENCES public.seller_themes(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Template ratings
CREATE TABLE IF NOT EXISTS public.template_ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.templates(id) ON DELETE CASCADE,
  seller_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(template_id, seller_id)
);

-- Update existing theme_versions table structure
ALTER TABLE public.theme_versions 
ADD COLUMN IF NOT EXISTS seller_theme_id UUID REFERENCES public.seller_themes(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Hosting metrics
CREATE TABLE IF NOT EXISTS public.hosting_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_theme_id UUID REFERENCES public.seller_themes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bandwidth_gb DECIMAL(10,3) DEFAULT 0,
  cpu_usage DECIMAL(5,2) DEFAULT 0,
  memory_usage DECIMAL(5,2) DEFAULT 0,
  uptime_percentage DECIMAL(5,2) DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(seller_theme_id, date)
);

-- Enable RLS on new tables
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.seller_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.template_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hosting_metrics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for templates
DROP POLICY IF EXISTS "Anyone can view active templates" ON public.templates;
CREATE POLICY "Anyone can view active templates" ON public.templates
  FOR SELECT USING (status = 'active');

DROP POLICY IF EXISTS "Admins can manage templates" ON public.templates;
CREATE POLICY "Admins can manage templates" ON public.templates
  FOR ALL USING (is_admin(auth.uid()));

-- RLS Policies for seller_themes
DROP POLICY IF EXISTS "Sellers can manage their own themes" ON public.seller_themes;
CREATE POLICY "Sellers can manage their own themes" ON public.seller_themes
  FOR ALL USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Admins can view all seller themes" ON public.seller_themes;
CREATE POLICY "Admins can view all seller themes" ON public.seller_themes
  FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for domains
DROP POLICY IF EXISTS "Sellers can manage their own domains" ON public.domains;
CREATE POLICY "Sellers can manage their own domains" ON public.domains
  FOR ALL USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Admins can view all domains" ON public.domains;
CREATE POLICY "Admins can view all domains" ON public.domains
  FOR SELECT USING (is_admin(auth.uid()));

-- RLS Policies for activity_logs
DROP POLICY IF EXISTS "Sellers can view their own activity" ON public.activity_logs;
CREATE POLICY "Sellers can view their own activity" ON public.activity_logs
  FOR SELECT USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Admins can view all activity" ON public.activity_logs;
CREATE POLICY "Admins can view all activity" ON public.activity_logs
  FOR SELECT USING (is_admin(auth.uid()));

DROP POLICY IF EXISTS "Anyone can create activity logs" ON public.activity_logs;
CREATE POLICY "Anyone can create activity logs" ON public.activity_logs
  FOR INSERT WITH CHECK (true);

-- RLS Policies for template_ratings
DROP POLICY IF EXISTS "Sellers can manage their own ratings" ON public.template_ratings;
CREATE POLICY "Sellers can manage their own ratings" ON public.template_ratings
  FOR ALL USING (auth.uid() = seller_id);

DROP POLICY IF EXISTS "Anyone can view ratings" ON public.template_ratings;
CREATE POLICY "Anyone can view ratings" ON public.template_ratings
  FOR SELECT USING (true);

-- RLS Policies for hosting_metrics
DROP POLICY IF EXISTS "Sellers can view their hosting metrics" ON public.hosting_metrics;
CREATE POLICY "Sellers can view their hosting metrics" ON public.hosting_metrics
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.seller_themes 
    WHERE id = hosting_metrics.seller_theme_id AND seller_id = auth.uid()
  ));

DROP POLICY IF EXISTS "Admins can view all hosting metrics" ON public.hosting_metrics;
CREATE POLICY "Admins can view all hosting metrics" ON public.hosting_metrics
  FOR SELECT USING (is_admin(auth.uid()));

-- Storage bucket for templates (will fail if exists, but that's ok)
INSERT INTO storage.buckets (id, name, public) VALUES ('templates', 'templates', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for templates
DROP POLICY IF EXISTS "Admins can upload templates" ON storage.objects;
CREATE POLICY "Admins can upload templates" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'templates' AND is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view template files" ON storage.objects;
CREATE POLICY "Admins can view template files" ON storage.objects
  FOR SELECT USING (bucket_id = 'templates' AND is_admin(auth.uid()));

DROP POLICY IF EXISTS "Sellers can view template files for their themes" ON storage.objects;
CREATE POLICY "Sellers can view template files for their themes" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'templates' AND 
    EXISTS (
      SELECT 1 FROM public.seller_themes st
      JOIN public.templates t ON st.template_id = t.id
      WHERE st.seller_id = auth.uid() AND t.file_path = name
    )
  );

-- Update templates rating when new rating is added
CREATE OR REPLACE FUNCTION update_template_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.templates 
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 2)
    FROM public.template_ratings 
    WHERE template_id = COALESCE(NEW.template_id, OLD.template_id)
  )
  WHERE id = COALESCE(NEW.template_id, OLD.template_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_template_rating_trigger ON public.template_ratings;
CREATE TRIGGER update_template_rating_trigger
  AFTER INSERT OR UPDATE OR DELETE ON public.template_ratings
  FOR EACH ROW EXECUTE FUNCTION update_template_rating();

-- Auto-update updated_at timestamp
DROP TRIGGER IF EXISTS update_templates_updated_at ON public.templates;
CREATE TRIGGER update_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_seller_themes_updated_at ON public.seller_themes;
CREATE TRIGGER update_seller_themes_updated_at
  BEFORE UPDATE ON public.seller_themes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_domains_updated_at ON public.domains;
CREATE TRIGGER update_domains_updated_at
  BEFORE UPDATE ON public.domains
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();