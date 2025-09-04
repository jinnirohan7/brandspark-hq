-- Create user themes table for storing user's selected themes and customizations
CREATE TABLE IF NOT EXISTS public.user_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  theme_id UUID NOT NULL REFERENCES website_themes(id),
  customizations_json JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create theme versions table for versioning theme customizations
CREATE TABLE IF NOT EXISTS public.theme_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_theme_id UUID NOT NULL REFERENCES user_themes(id),
  version_number INTEGER NOT NULL DEFAULT 1,
  customizations_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create AI suggestions table
CREATE TABLE IF NOT EXISTS public.ai_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  business_type TEXT NOT NULL,
  current_theme JSONB NOT NULL,
  suggestions JSONB NOT NULL,
  applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add categories and more fields to existing website_themes
ALTER TABLE public.website_themes 
ADD COLUMN IF NOT EXISTS layout_json JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Enable RLS on new tables
ALTER TABLE public.user_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user_themes
CREATE POLICY "Users can manage their own themes" ON public.user_themes
FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for theme_versions
CREATE POLICY "Users can manage their own theme versions" ON public.theme_versions
FOR ALL USING (EXISTS (
  SELECT 1 FROM user_themes ut 
  WHERE ut.id = theme_versions.user_theme_id 
  AND ut.user_id = auth.uid()
));

-- Create RLS policies for ai_suggestions
CREATE POLICY "Users can manage their own AI suggestions" ON public.ai_suggestions
FOR ALL USING (auth.uid() = user_id);

-- Insert sample themes data
INSERT INTO public.website_themes (name, category, description, preview_image_url, template_data, layout_json, tags, price, is_featured) VALUES
('Modern Minimal', 'fashion', 'Clean and minimal design perfect for fashion brands', '/themes/modern-minimal.jpg', '{"header":{"style":"minimal","logo":"center"},"footer":{"style":"simple"}}', '{"sections":[{"type":"hero","layout":"center"},{"type":"products","layout":"grid"}]}', '{"minimal","clean","fashion"}', 0, true),
('Tech Pro', 'electronics', 'Professional layout for tech and electronics stores', '/themes/tech-pro.jpg', '{"header":{"style":"professional","logo":"left"},"footer":{"style":"detailed"}}', '{"sections":[{"type":"hero","layout":"split"},{"type":"features","layout":"cards"}]}', '{"tech","professional","electronics"}', 29.99, true),
('Food Delight', 'food', 'Warm and inviting design for food businesses', '/themes/food-delight.jpg', '{"header":{"style":"warm","logo":"center"},"footer":{"style":"simple"}}', '{"sections":[{"type":"hero","layout":"full"},{"type":"menu","layout":"categories"}]}', '{"food","warm","restaurant"}', 19.99, false),
('Boutique Luxury', 'fashion', 'Elegant design for luxury fashion brands', '/themes/boutique-luxury.jpg', '{"header":{"style":"elegant","logo":"center"},"footer":{"style":"minimal"}}', '{"sections":[{"type":"hero","layout":"fullscreen"},{"type":"collections","layout":"masonry"}]}', '{"luxury","elegant","boutique"}', 49.99, true),
('Sports Dynamic', 'sports', 'Energetic design for sports and fitness brands', '/themes/sports-dynamic.jpg', '{"header":{"style":"dynamic","logo":"left"},"footer":{"style":"detailed"}}', '{"sections":[{"type":"hero","layout":"video"},{"type":"products","layout":"carousel"}]}', '{"sports","dynamic","fitness"}', 34.99, false),
('Beauty Glow', 'beauty', 'Soft and elegant design for beauty products', '/themes/beauty-glow.jpg', '{"header":{"style":"soft","logo":"center"},"footer":{"style":"elegant"}}', '{"sections":[{"type":"hero","layout":"gradient"},{"type":"testimonials","layout":"slider"}]}', '{"beauty","soft","elegant"}', 24.99, true),
('Home Comfort', 'home', 'Cozy design for home and lifestyle products', '/themes/home-comfort.jpg', '{"header":{"style":"cozy","logo":"left"},"footer":{"style":"detailed"}}', '{"sections":[{"type":"hero","layout":"split"},{"type":"categories","layout":"grid"}]}', '{"home","cozy","lifestyle"}', 19.99, false),
('Art Gallery', 'art', 'Creative design for artists and galleries', '/themes/art-gallery.jpg', '{"header":{"style":"creative","logo":"center"},"footer":{"style":"minimal"}}', '{"sections":[{"type":"hero","layout":"fullscreen"},{"type":"gallery","layout":"masonry"}]}', '{"art","creative","gallery"}', 39.99, true);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_themes_updated_at
    BEFORE UPDATE ON user_themes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();