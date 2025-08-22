-- Create websites table for seller's D2C sites
CREATE TABLE public.websites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  domain_name TEXT UNIQUE,
  subdomain TEXT UNIQUE NOT NULL, -- seller-name.sellsphere.com
  site_name TEXT NOT NULL,
  logo_url TEXT,
  favicon_url TEXT,
  theme_id UUID,
  custom_css TEXT,
  is_active BOOLEAN DEFAULT true,
  ssl_enabled BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  google_analytics_id TEXT,
  facebook_pixel_id TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  social_links JSONB DEFAULT '{}',
  business_hours JSONB,
  shipping_info JSONB,
  return_policy TEXT,
  privacy_policy TEXT,
  terms_of_service TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website themes table
CREATE TABLE public.website_themes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'ecommerce', 'fashion', 'electronics', etc.
  description TEXT,
  preview_image_url TEXT,
  template_data JSONB NOT NULL, -- Contains theme structure and styles
  is_premium BOOLEAN DEFAULT false,
  price NUMERIC DEFAULT 0,
  rating NUMERIC DEFAULT 0,
  downloads INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website pages table
CREATE TABLE public.website_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL,
  page_type TEXT NOT NULL, -- 'home', 'products', 'about', 'contact', 'custom'
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  content JSONB NOT NULL, -- Page content and widgets
  is_published BOOLEAN DEFAULT true,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(website_id, slug)
);

-- Create website widgets table
CREATE TABLE public.website_widgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'banner', 'hero', 'testimonials', 'products', etc.
  description TEXT,
  preview_image_url TEXT,
  widget_config JSONB NOT NULL, -- Widget structure and default settings
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website orders table (for customer orders on the website)
CREATE TABLE public.website_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL,
  order_number TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  items JSONB NOT NULL, -- Order items with product details
  subtotal NUMERIC NOT NULL,
  tax_amount NUMERIC DEFAULT 0,
  shipping_cost NUMERIC DEFAULT 0,
  discount_amount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  payment_method TEXT NOT NULL, -- 'razorpay', 'paytm', 'cod', etc.
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'failed', 'refunded'
  order_status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website reviews table
CREATE TABLE public.website_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL,
  product_id UUID,
  order_id UUID,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  images TEXT[], -- Array of image URLs
  videos TEXT[], -- Array of video URLs
  is_verified BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website analytics table
CREATE TABLE public.website_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  website_id UUID NOT NULL,
  date DATE NOT NULL,
  page_views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate NUMERIC DEFAULT 0,
  avg_session_duration INTEGER DEFAULT 0, -- in seconds
  conversion_rate NUMERIC DEFAULT 0,
  revenue NUMERIC DEFAULT 0,
  top_pages JSONB,
  traffic_sources JSONB,
  device_types JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(website_id, date)
);

-- Enable RLS
ALTER TABLE public.websites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_themes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for websites
CREATE POLICY "Sellers can manage their own websites"
ON public.websites
FOR ALL
USING (EXISTS (
  SELECT 1 FROM sellers 
  WHERE sellers.id = websites.seller_id 
  AND sellers.user_id = auth.uid()
));

-- RLS Policies for website_themes (everyone can view)
CREATE POLICY "Anyone can view website themes"
ON public.website_themes
FOR SELECT
USING (true);

-- RLS Policies for website_pages
CREATE POLICY "Sellers can manage their website pages"
ON public.website_pages
FOR ALL
USING (EXISTS (
  SELECT 1 FROM websites w
  JOIN sellers s ON s.id = w.seller_id
  WHERE w.id = website_pages.website_id 
  AND s.user_id = auth.uid()
));

-- Public read access for published pages
CREATE POLICY "Public can view published pages"
ON public.website_pages
FOR SELECT
USING (is_published = true);

-- RLS Policies for website_widgets (everyone can view)
CREATE POLICY "Anyone can view website widgets"
ON public.website_widgets
FOR SELECT
USING (true);

-- RLS Policies for website_orders
CREATE POLICY "Sellers can view their website orders"
ON public.website_orders
FOR SELECT
USING (EXISTS (
  SELECT 1 FROM websites w
  JOIN sellers s ON s.id = w.seller_id
  WHERE w.id = website_orders.website_id 
  AND s.user_id = auth.uid()
));

-- RLS Policies for website_reviews
CREATE POLICY "Sellers can manage reviews for their websites"
ON public.website_reviews
FOR ALL
USING (EXISTS (
  SELECT 1 FROM websites w
  JOIN sellers s ON s.id = w.seller_id
  WHERE w.id = website_reviews.website_id 
  AND s.user_id = auth.uid()
));

-- Public read access for approved reviews
CREATE POLICY "Public can view approved reviews"
ON public.website_reviews
FOR SELECT
USING (is_approved = true);

-- RLS Policies for website_analytics
CREATE POLICY "Sellers can view their website analytics"
ON public.website_analytics
FOR ALL
USING (EXISTS (
  SELECT 1 FROM websites w
  JOIN sellers s ON s.id = w.seller_id
  WHERE w.id = website_analytics.website_id 
  AND s.user_id = auth.uid()
));

-- Add triggers for updated_at
CREATE TRIGGER update_websites_updated_at
  BEFORE UPDATE ON public.websites
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_themes_updated_at
  BEFORE UPDATE ON public.website_themes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_website_orders_updated_at
  BEFORE UPDATE ON public.website_orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default themes
INSERT INTO public.website_themes (name, category, description, preview_image_url, template_data, rating, downloads) VALUES
('Modern Store', 'ecommerce', 'Clean and modern ecommerce theme with product showcase', '/themes/modern-store.jpg', '{"layout": "modern", "colors": {"primary": "#3b82f6", "secondary": "#64748b"}, "sections": ["hero", "featured_products", "testimonials", "footer"]}', 4.8, 2430),
('Fashion Hub', 'fashion', 'Elegant fashion-focused theme with lookbook style', '/themes/fashion-hub.jpg', '{"layout": "fashion", "colors": {"primary": "#ec4899", "secondary": "#6b7280"}, "sections": ["banner", "collections", "instagram_feed", "newsletter"]}', 4.9, 1820),
('Tech Store', 'electronics', 'High-tech theme perfect for electronics and gadgets', '/themes/tech-store.jpg', '{"layout": "tech", "colors": {"primary": "#10b981", "secondary": "#374151"}, "sections": ["hero_carousel", "categories", "bestsellers", "features"]}', 4.7, 1650),
('Minimal', 'general', 'Clean minimal design focusing on content', '/themes/minimal.jpg', '{"layout": "minimal", "colors": {"primary": "#1f2937", "secondary": "#9ca3af"}, "sections": ["simple_hero", "products_grid", "about", "contact"]}', 4.6, 3200),
('Luxury', 'premium', 'Premium luxury theme with elegant animations', '/themes/luxury.jpg', '{"layout": "luxury", "colors": {"primary": "#92400e", "secondary": "#78716c"}, "sections": ["video_hero", "premium_products", "brand_story", "testimonials"]}', 4.9, 890);

-- Insert default widgets
INSERT INTO public.website_widgets (name, category, description, preview_image_url, widget_config) VALUES
('Hero Banner', 'banner', 'Large hero banner with call-to-action', '/widgets/hero-banner.jpg', '{"type": "hero", "settings": {"title": "Welcome to Our Store", "subtitle": "Discover amazing products", "buttonText": "Shop Now", "backgroundImage": "", "textAlign": "center"}}'),
('Product Carousel', 'products', 'Scrollable product showcase carousel', '/widgets/product-carousel.jpg', '{"type": "carousel", "settings": {"title": "Featured Products", "itemsPerView": 4, "autoplay": true, "showDots": true}}'),
('Testimonials', 'social', 'Customer testimonials slider', '/widgets/testimonials.jpg', '{"type": "testimonials", "settings": {"title": "What Our Customers Say", "layout": "slider", "showStars": true, "autoplay": true}}'),
('Newsletter Signup', 'marketing', 'Email subscription form', '/widgets/newsletter.jpg', '{"type": "newsletter", "settings": {"title": "Stay Updated", "description": "Get latest offers and updates", "placeholder": "Enter your email", "buttonText": "Subscribe"}}'),
('Countdown Timer', 'promotion', 'Sale countdown timer', '/widgets/countdown.jpg', '{"type": "countdown", "settings": {"title": "Limited Time Offer", "endDate": "", "showDays": true, "showHours": true}}'),
('Photo Gallery', 'media', 'Image gallery with lightbox', '/widgets/gallery.jpg', '{"type": "gallery", "settings": {"columns": 3, "spacing": "medium", "lightbox": true, "captions": true}}'),
('FAQ Section', 'content', 'Frequently asked questions accordion', '/widgets/faq.jpg', '{"type": "faq", "settings": {"title": "Frequently Asked Questions", "layout": "accordion", "searchable": true}}'),
('Social Media Feed', 'social', 'Instagram/social media feed', '/widgets/social-feed.jpg', '{"type": "social", "settings": {"platform": "instagram", "feedType": "hashtag", "itemsToShow": 6, "layout": "grid"}}');