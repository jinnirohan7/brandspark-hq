-- Enhance themes table and add sample data
INSERT INTO website_themes (name, category, description, preview_image_url, template_data, layout_json, tags, price, is_featured, rating, downloads) VALUES
-- Business Themes
('Modern Corporate', 'business', 'Professional corporate website with clean design', '/api/placeholder/400/300', '{"sections": ["hero", "about", "services", "contact"]}', '{"grid": "12", "layout": "standard"}', ARRAY['professional', 'corporate', 'clean'], 0, true, 4.8, 1250),
('Startup Landing', 'business', 'Perfect for tech startups and SaaS companies', '/api/placeholder/400/300', '{"sections": ["hero", "features", "pricing", "testimonials"]}', '{"grid": "12", "layout": "landing"}', ARRAY['startup', 'tech', 'saas'], 999, true, 4.9, 856),
('Legal Firm Pro', 'business', 'Professional design for law firms and consultants', '/api/placeholder/400/300', '{"sections": ["hero", "practice-areas", "team", "contact"]}', '{"grid": "12", "layout": "professional"}', ARRAY['legal', 'professional', 'corporate'], 1499, false, 4.7, 634),

-- E-commerce Themes
('Fashion Store', 'ecommerce', 'Stylish fashion e-commerce template', '/api/placeholder/400/300', '{"sections": ["hero", "categories", "featured-products", "newsletter"]}', '{"grid": "12", "layout": "shop"}', ARRAY['fashion', 'retail', 'modern'], 1999, true, 4.9, 2150),
('Electronics Hub', 'ecommerce', 'Tech gadgets and electronics store', '/api/placeholder/400/300', '{"sections": ["hero", "categories", "deals", "brands"]}', '{"grid": "12", "layout": "tech"}', ARRAY['electronics', 'gadgets', 'tech'], 1799, false, 4.6, 1840),
('Food Delivery', 'ecommerce', 'Restaurant and food delivery platform', '/api/placeholder/400/300', '{"sections": ["hero", "menu", "delivery", "contact"]}', '{"grid": "12", "layout": "food"}', ARRAY['food', 'restaurant', 'delivery'], 1299, true, 4.8, 1120),

-- Portfolio Themes
('Creative Portfolio', 'portfolio', 'Showcase your creative work beautifully', '/api/placeholder/400/300', '{"sections": ["hero", "portfolio", "about", "contact"]}', '{"grid": "12", "layout": "portfolio"}', ARRAY['creative', 'portfolio', 'artist'], 799, false, 4.7, 890),
('Photographer Pro', 'portfolio', 'Professional photography portfolio', '/api/placeholder/400/300', '{"sections": ["hero", "gallery", "services", "contact"]}', '{"grid": "12", "layout": "gallery"}', ARRAY['photography', 'gallery', 'visual'], 1199, true, 4.9, 1560),
('Designer Showcase', 'portfolio', 'Perfect for UI/UX designers and agencies', '/api/placeholder/400/300', '{"sections": ["hero", "work", "process", "contact"]}', '{"grid": "12", "layout": "design"}', ARRAY['design', 'agency', 'modern'], 999, false, 4.8, 720),

-- Blog Themes
('Minimal Blog', 'blog', 'Clean and minimal blog design', '/api/placeholder/400/300', '{"sections": ["header", "posts", "sidebar", "footer"]}', '{"grid": "12", "layout": "blog"}', ARRAY['blog', 'minimal', 'clean'], 0, false, 4.5, 1890),
('Magazine Style', 'blog', 'News and magazine layout template', '/api/placeholder/400/300', '{"sections": ["featured", "categories", "trending", "newsletter"]}', '{"grid": "12", "layout": "magazine"}', ARRAY['magazine', 'news', 'content'], 1299, true, 4.7, 980),

-- Health & Fitness
('Fitness Studio', 'health', 'Gym and fitness studio website', '/api/placeholder/400/300', '{"sections": ["hero", "classes", "trainers", "membership"]}', '{"grid": "12", "layout": "fitness"}', ARRAY['fitness', 'gym', 'health'], 1499, false, 4.6, 560),
('Medical Clinic', 'health', 'Healthcare and medical practice website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "doctors", "appointments"]}', '{"grid": "12", "layout": "medical"}', ARRAY['medical', 'healthcare', 'clinic'], 1799, true, 4.8, 430),

-- Education
('Online Course', 'education', 'E-learning and online course platform', '/api/placeholder/400/300', '{"sections": ["hero", "courses", "instructors", "testimonials"]}', '{"grid": "12", "layout": "education"}', ARRAY['education', 'elearning', 'courses'], 1999, false, 4.7, 670),
('University Site', 'education', 'Academic institution website template', '/api/placeholder/400/300', '{"sections": ["hero", "programs", "campus", "admissions"]}', '{"grid": "12", "layout": "academic"}', ARRAY['university', 'academic', 'education'], 2499, true, 4.9, 340),

-- Real Estate
('Property Listings', 'realestate', 'Real estate listings and agency website', '/api/placeholder/400/300', '{"sections": ["hero", "listings", "agents", "search"]}', '{"grid": "12", "layout": "realestate"}', ARRAY['realestate', 'property', 'listings'], 1999, false, 4.6, 450),

-- Restaurant & Food
('Fine Dining', 'restaurant', 'Elegant restaurant website template', '/api/placeholder/400/300', '{"sections": ["hero", "menu", "reservations", "gallery"]}', '{"grid": "12", "layout": "restaurant"}', ARRAY['restaurant', 'dining', 'elegant'], 1299, true, 4.8, 780),
('Cafe & Bakery', 'restaurant', 'Cozy cafe and bakery website', '/api/placeholder/400/300', '{"sections": ["hero", "menu", "location", "events"]}', '{"grid": "12", "layout": "cafe"}', ARRAY['cafe', 'bakery', 'cozy'], 999, false, 4.5, 650),

-- Travel & Tourism
('Travel Agency', 'travel', 'Travel booking and tour agency website', '/api/placeholder/400/300', '{"sections": ["hero", "destinations", "packages", "booking"]}', '{"grid": "12", "layout": "travel"}', ARRAY['travel', 'tourism', 'booking'], 1799, true, 4.7, 520),
('Hotel Booking', 'travel', 'Hotel and resort booking platform', '/api/placeholder/400/300', '{"sections": ["hero", "rooms", "amenities", "booking"]}', '{"grid": "12", "layout": "hotel"}', ARRAY['hotel', 'resort', 'booking'], 2199, false, 4.8, 380),

-- Beauty & Wellness
('Beauty Salon', 'beauty', 'Beauty salon and spa website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "gallery", "booking"]}', '{"grid": "12", "layout": "beauty"}', ARRAY['beauty', 'salon', 'spa'], 1499, false, 4.6, 420),

-- Technology
('Software Company', 'technology', 'Software development company website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "portfolio", "team"]}', '{"grid": "12", "layout": "software"}', ARRAY['software', 'technology', 'development'], 1999, true, 4.9, 890),
('App Landing', 'technology', 'Mobile app landing page template', '/api/placeholder/400/300', '{"sections": ["hero", "features", "screenshots", "download"]}', '{"grid": "12", "layout": "app"}', ARRAY['app', 'mobile', 'landing'], 1299, false, 4.7, 1120),

-- Non-Profit
('Charity Org', 'nonprofit', 'Non-profit and charity organization website', '/api/placeholder/400/300', '{"sections": ["hero", "mission", "programs", "donate"]}', '{"grid": "12", "layout": "charity"}', ARRAY['charity', 'nonprofit', 'organization'], 0, false, 4.5, 290),

-- Events
('Event Planning', 'events', 'Event management and planning website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "gallery", "contact"]}', '{"grid": "12", "layout": "events"}', ARRAY['events', 'planning', 'management'], 1499, false, 4.6, 340),
('Conference Site', 'events', 'Conference and seminar website template', '/api/placeholder/400/300', '{"sections": ["hero", "agenda", "speakers", "registration"]}', '{"grid": "12", "layout": "conference"}', ARRAY['conference', 'seminar', 'event'], 1799, true, 4.8, 560),

-- Automotive
('Car Dealership', 'automotive', 'Auto dealership and car sales website', '/api/placeholder/400/300', '{"sections": ["hero", "inventory", "services", "contact"]}', '{"grid": "12", "layout": "automotive"}', ARRAY['automotive', 'cars', 'dealership'], 1999, false, 4.7, 380),

-- Fashion & Lifestyle
('Lifestyle Blog', 'lifestyle', 'Fashion and lifestyle blog template', '/api/placeholder/400/300', '{"sections": ["hero", "posts", "categories", "newsletter"]}', '{"grid": "12", "layout": "lifestyle"}', ARRAY['lifestyle', 'fashion', 'blog'], 999, false, 4.5, 670),

-- Music & Entertainment
('Music Band', 'entertainment', 'Band and musician website template', '/api/placeholder/400/300', '{"sections": ["hero", "music", "tours", "contact"]}', '{"grid": "12", "layout": "music"}', ARRAY['music', 'band', 'entertainment'], 1299, false, 4.6, 450),

-- Wedding
('Wedding Planner', 'wedding', 'Wedding planning and services website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "gallery", "testimonials"]}', '{"grid": "12", "layout": "wedding"}', ARRAY['wedding', 'planning', 'services'], 1799, true, 4.9, 320),

-- Consulting
('Business Consultant', 'consulting', 'Professional consulting services website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "expertise", "contact"]}', '{"grid": "12", "layout": "consulting"}', ARRAY['consulting', 'business', 'professional'], 1499, false, 4.7, 290),

-- Agriculture
('Organic Farm', 'agriculture', 'Organic farming and agriculture website', '/api/placeholder/400/300', '{"sections": ["hero", "products", "about", "contact"]}', '{"grid": "12", "layout": "agriculture"}', ARRAY['agriculture', 'organic', 'farming'], 1199, false, 4.5, 180),

-- Architecture
('Architecture Firm', 'architecture', 'Architectural services and portfolio website', '/api/placeholder/400/300', '{"sections": ["hero", "projects", "services", "team"]}', '{"grid": "12", "layout": "architecture"}', ARRAY['architecture', 'design', 'construction'], 2199, true, 4.8, 410),

-- Sports
('Sports Club', 'sports', 'Sports club and team website', '/api/placeholder/400/300', '{"sections": ["hero", "team", "fixtures", "news"]}', '{"grid": "12", "layout": "sports"}', ARRAY['sports', 'club', 'team'], 1299, false, 4.6, 520),

-- Finance
('Financial Services', 'finance', 'Financial advisory and services website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "about", "contact"]}', '{"grid": "12", "layout": "finance"}', ARRAY['finance', 'advisory', 'services'], 1999, false, 4.7, 350),

-- Kids & Education
('Kids Learning', 'kids', 'Children education and learning platform', '/api/placeholder/400/300', '{"sections": ["hero", "courses", "activities", "parents"]}', '{"grid": "12", "layout": "kids"}', ARRAY['kids', 'education', 'learning'], 1499, false, 4.8, 280),

-- Art & Culture
('Art Gallery', 'art', 'Art gallery and exhibition website', '/api/placeholder/400/300', '{"sections": ["hero", "exhibitions", "artists", "visit"]}', '{"grid": "12", "layout": "gallery"}', ARRAY['art', 'gallery', 'culture'], 1799, true, 4.9, 230),

-- Gaming
('Gaming Studio', 'gaming', 'Game development studio website', '/api/placeholder/400/300', '{"sections": ["hero", "games", "team", "contact"]}', '{"grid": "12", "layout": "gaming"}', ARRAY['gaming', 'development', 'studio'], 1999, false, 4.7, 380),

-- Minimalist Templates
('Ultra Minimal', 'minimal', 'Ultra-clean minimal design', '/api/placeholder/400/300', '{"sections": ["hero", "content", "contact"]}', '{"grid": "12", "layout": "minimal"}', ARRAY['minimal', 'clean', 'simple'], 599, false, 4.6, 1890),
('Scandinavian', 'minimal', 'Scandinavian-inspired minimal design', '/api/placeholder/400/300', '{"sections": ["hero", "features", "contact"]}', '{"grid": "12", "layout": "scandinavian"}', ARRAY['scandinavian', 'minimal', 'nordic'], 799, true, 4.8, 1560),

-- Dark Mode Templates
('Dark Corporate', 'dark', 'Modern dark theme for businesses', '/api/placeholder/400/300', '{"sections": ["hero", "services", "team", "contact"]}', '{"grid": "12", "layout": "dark-corporate"}', ARRAY['dark', 'modern', 'corporate'], 1299, false, 4.7, 890),
('Neon Gaming', 'dark', 'Neon-style dark theme for gaming', '/api/placeholder/400/300', '{"sections": ["hero", "games", "news", "community"]}', '{"grid": "12", "layout": "neon-gaming"}', ARRAY['dark', 'neon', 'gaming'], 1599, true, 4.9, 670),

-- Creative & Artistic
('Abstract Art', 'creative', 'Abstract and artistic design template', '/api/placeholder/400/300', '{"sections": ["hero", "portfolio", "about", "contact"]}', '{"grid": "12", "layout": "abstract"}', ARRAY['abstract', 'artistic', 'creative'], 1999, false, 4.8, 450),
('Geometric Modern', 'creative', 'Geometric patterns and modern design', '/api/placeholder/400/300', '{"sections": ["hero", "work", "process", "contact"]}', '{"grid": "12", "layout": "geometric"}', ARRAY['geometric', 'modern', 'design'], 1499, true, 4.7, 720),

-- Industry Specific
('Manufacturing', 'industrial', 'Industrial and manufacturing website', '/api/placeholder/400/300', '{"sections": ["hero", "products", "capabilities", "contact"]}', '{"grid": "12", "layout": "industrial"}', ARRAY['industrial', 'manufacturing', 'business'], 1799, false, 4.6, 320),
('Logistics Company', 'logistics', 'Shipping and logistics services website', '/api/placeholder/400/300', '{"sections": ["hero", "services", "tracking", "contact"]}', '{"grid": "12", "layout": "logistics"}', ARRAY['logistics', 'shipping', 'transport'], 1599, false, 4.5, 280),

-- Seasonal & Special
('Christmas Store', 'seasonal', 'Holiday and seasonal e-commerce template', '/api/placeholder/400/300', '{"sections": ["hero", "products", "offers", "gifts"]}', '{"grid": "12", "layout": "seasonal"}', ARRAY['seasonal', 'holiday', 'christmas'], 999, false, 4.6, 890),
('Valentine Special', 'seasonal', 'Valentine''s Day themed template', '/api/placeholder/400/300', '{"sections": ["hero", "gifts", "romance", "contact"]}', '{"grid": "12", "layout": "valentine"}', ARRAY['valentine', 'romantic', 'seasonal'], 799, false, 4.4, 340);