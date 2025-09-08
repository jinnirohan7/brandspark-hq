-- Insert 50 free ThemeWagon templates into website_themes table
INSERT INTO website_themes (
  id,
  name,
  category,
  description,
  preview_image_url,
  template_data,
  layout_json,
  tags,
  price,
  is_featured,
  rating,
  downloads,
  is_premium
) VALUES
-- Business Templates
('550e8400-e29b-41d4-a716-446655440001', 'PerfectCut', 'business', 'Free Responsive Bootstrap Salon Website Template', 'https://themewagon.com/wp-content/uploads/2025/09/PerfectCut.webp', '{"framework": "bootstrap", "type": "salon", "responsive": true}', '{"sections": ["header", "hero", "services", "gallery", "footer"]}', ARRAY['salon', 'business', 'bootstrap', 'responsive'], 0, true, 4.5, 152, false),

('550e8400-e29b-41d4-a716-446655440002', 'iStudio', 'design', 'Free Bootstrap 5 Interior Design Website Template', 'https://themewagon.com/wp-content/uploads/2025/08/iStudio.webp', '{"framework": "bootstrap-5", "type": "interior", "responsive": true}', '{"sections": ["header", "hero", "portfolio", "about", "footer"]}', ARRAY['interior', 'design', 'bootstrap', 'portfolio'], 0, true, 4.6, 829, false),

('550e8400-e29b-41d4-a716-446655440003', 'Nextly', 'landing', 'Free Responsive Tailwind CSS Landing Page Template', 'https://themewagon.com/wp-content/uploads/2025/08/Nextly.webp', '{"framework": "tailwind", "type": "landing", "responsive": true}', '{"sections": ["hero", "features", "testimonials", "cta", "footer"]}', ARRAY['landing', 'tailwind', 'modern', 'responsive'], 0, true, 4.7, 1054, false),

('550e8400-e29b-41d4-a716-446655440004', 'Windster', 'dashboard', 'Free Responsive Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/08/windster.webp', '{"framework": "tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "main", "widgets", "charts"]}', ARRAY['dashboard', 'admin', 'tailwind', 'charts'], 0, false, 4.4, 376, false),

('550e8400-e29b-41d4-a716-446655440005', 'Electro', 'ecommerce', 'Free Bootstrap 5 eCommerce Website Template', 'https://themewagon.com/wp-content/uploads/2025/08/electro-Bootstrap.webp', '{"framework": "bootstrap-5", "type": "ecommerce", "responsive": true}', '{"sections": ["header", "hero", "products", "cart", "footer"]}', ARRAY['ecommerce', 'shopping', 'bootstrap', 'products'], 0, true, 4.5, 2372, false),

('550e8400-e29b-41d4-a716-446655440006', 'Picto', 'portfolio', 'Free Tailwind CSS Portfolio Website Template', 'https://themewagon.com/wp-content/uploads/2025/08/Picto.webp', '{"framework": "tailwind", "type": "portfolio", "responsive": true}', '{"sections": ["header", "hero", "portfolio", "about", "contact"]}', ARRAY['portfolio', 'creative', 'tailwind', 'modern'], 0, false, 4.6, 3519, false),

('550e8400-e29b-41d4-a716-446655440007', 'Salone', 'business', 'Free Responsive Bootstrap 5 Business Template', 'https://themewagon.com/wp-content/uploads/2025/08/Salone.webp', '{"framework": "bootstrap-5", "type": "business", "responsive": true}', '{"sections": ["header", "hero", "services", "team", "footer"]}', ARRAY['business', 'corporate', 'bootstrap', 'team'], 0, false, 4.3, 850, false),

-- Dashboard Templates
('550e8400-e29b-41d4-a716-446655440008', 'Mantis Vue', 'dashboard', 'Free Responsive Vue.js Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/08/Mantis-Vue.webp', '{"framework": "vue", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "analytics", "tables"]}', ARRAY['dashboard', 'admin', 'vue', 'analytics'], 0, false, 4.4, 1292, false),

('550e8400-e29b-41d4-a716-446655440009', 'Desher', 'dashboard', 'Free Responsive Next.js Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/08/desher.webp', '{"framework": "nextjs", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "reports", "settings"]}', ARRAY['dashboard', 'admin', 'nextjs', 'reports'], 0, false, 4.5, 98, false),

('550e8400-e29b-41d4-a716-446655440010', 'Material App', 'landing', 'Free Tailwind CSS App Presentation Page Template', 'https://themewagon.com/wp-content/uploads/2025/08/Material.webp', '{"framework": "tailwind", "type": "presentation", "responsive": true}', '{"sections": ["hero", "features", "screenshots", "download", "footer"]}', ARRAY['app', 'presentation', 'tailwind', 'mobile'], 0, false, 4.2, 598, false),

('550e8400-e29b-41d4-a716-446655440011', 'Material Tailwind Education', 'education', 'Free Tailwind CSS Educational Website Template', 'https://themewagon.com/wp-content/uploads/2025/08/MaterialTailwind-CourseLanding-Page.webp', '{"framework": "tailwind", "type": "education", "responsive": true}', '{"sections": ["header", "hero", "courses", "instructors", "footer"]}', ARRAY['education', 'courses', 'tailwind', 'learning'], 0, false, 4.3, 694, false),

('550e8400-e29b-41d4-a716-446655440012', 'Berry Vue', 'dashboard', 'Free Responsive Vue.js Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/07/Berry-Vue.webp', '{"framework": "vue", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "widgets", "charts", "tables"]}', ARRAY['dashboard', 'admin', 'vue', 'widgets'], 0, false, 4.5, 1951, false),

('550e8400-e29b-41d4-a716-446655440013', 'Notus Next', 'dashboard', 'Free Tailwind CSS & Next.js Dashboard UI Kit Template', 'https://themewagon.com/wp-content/uploads/2025/07/Notus-next.webp', '{"framework": "nextjs-tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "components", "pages"]}', ARRAY['dashboard', 'nextjs', 'tailwind', 'uikit'], 0, false, 4.4, 934, false),

('550e8400-e29b-41d4-a716-446655440014', 'Notus React', 'dashboard', 'Free Tailwind CSS Dashboard UI Kit Template', 'https://themewagon.com/wp-content/uploads/2025/07/Notus-react.webp', '{"framework": "react-tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "components", "auth"]}', ARRAY['dashboard', 'react', 'tailwind', 'uikit'], 0, false, 4.6, 935, false),

('550e8400-e29b-41d4-a716-446655440015', 'BusTraveller', 'travel', 'Free HTML5 Travel Agency Website Template', 'https://themewagon.com/wp-content/uploads/2025/07/bustraveller.webp', '{"framework": "html5", "type": "travel", "responsive": true}', '{"sections": ["header", "hero", "destinations", "packages", "footer"]}', ARRAY['travel', 'agency', 'html5', 'tourism'], 0, false, 4.3, 2111, false),

('550e8400-e29b-41d4-a716-446655440016', 'Studiova', 'business', 'Free Bootstrap 5 Business & Agency Template', 'https://themewagon.com/wp-content/uploads/2025/07/Studiova-scaled.webp', '{"framework": "bootstrap-5", "type": "agency", "responsive": true}', '{"sections": ["header", "hero", "services", "portfolio", "footer"]}', ARRAY['business', 'agency', 'bootstrap', 'corporate'], 0, true, 4.7, 2050, false),

('550e8400-e29b-41d4-a716-446655440017', 'SoftUI Dashboard', 'dashboard', 'Free Tailwind CSS Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/07/softUI-tailwind-scaled.webp', '{"framework": "tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "widgets", "analytics", "tables"]}', ARRAY['dashboard', 'admin', 'tailwind', 'soft-ui'], 0, false, 4.5, 2944, false),

('550e8400-e29b-41d4-a716-446655440018', 'DashboardKit', 'dashboard', 'Free Multipage React Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/07/DashboardKit-scaled.webp', '{"framework": "react", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "analytics", "users"]}', ARRAY['dashboard', 'admin', 'react', 'multipage'], 0, false, 4.4, 5552, false),

('550e8400-e29b-41d4-a716-446655440019', 'Lounge', 'restaurant', 'Free Responsive HTML Restaurant Website Template', 'https://themewagon.com/wp-content/uploads/2025/06/Lounge.webp', '{"framework": "html5", "type": "restaurant", "responsive": true}', '{"sections": ["header", "hero", "menu", "about", "contact"]}', ARRAY['restaurant', 'food', 'html5', 'menu'], 0, true, 4.8, 2919, false),

('550e8400-e29b-41d4-a716-446655440020', 'MaterialTailwind Portfolio', 'portfolio', 'Free Tailwind CSS Next.js Portfolio Template', 'https://themewagon.com/wp-content/uploads/2025/06/MaterialTailwind.webp', '{"framework": "nextjs-tailwind", "type": "portfolio", "responsive": true}', '{"sections": ["header", "hero", "projects", "skills", "contact"]}', ARRAY['portfolio', 'nextjs', 'tailwind', 'personal'], 0, false, 4.5, 3852, false),

('550e8400-e29b-41d4-a716-446655440021', 'Oberlo', 'automotive', 'Free Bootstrap Car Shop Website Template', 'https://themewagon.com/wp-content/uploads/2025/06/Oberlo.webp', '{"framework": "bootstrap", "type": "automotive", "responsive": true}', '{"sections": ["header", "hero", "inventory", "services", "footer"]}', ARRAY['automotive', 'cars', 'bootstrap', 'shop'], 0, false, 4.3, 2693, false),

('550e8400-e29b-41d4-a716-446655440022', 'Netic', 'hosting', 'Free Bootstrap Web Hosting Website Template', 'https://themewagon.com/wp-content/uploads/2025/06/Netic.webp', '{"framework": "bootstrap", "type": "hosting", "responsive": true}', '{"sections": ["header", "hero", "plans", "features", "footer"]}', ARRAY['hosting', 'web-hosting', 'bootstrap', 'pricing'], 0, false, 4.4, 1911, false),

('550e8400-e29b-41d4-a716-446655440023', 'Nova Bootstrap', 'business', 'Free Bootstrap 5 Business Website Template', 'https://themewagon.com/wp-content/uploads/2025/06/Nova.webp', '{"framework": "bootstrap-5", "type": "business", "responsive": true}', '{"sections": ["header", "hero", "services", "team", "contact"]}', ARRAY['business', 'corporate', 'bootstrap', 'services'], 0, false, 4.5, 6075, false),

('550e8400-e29b-41d4-a716-446655440024', 'Argon Dashboard', 'dashboard', 'Free Tailwind CSS Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/05/Argon-Tailwind.webp', '{"framework": "tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "components", "pages"]}', ARRAY['dashboard', 'admin', 'tailwind', 'argon'], 0, true, 4.7, 8425, false),

('550e8400-e29b-41d4-a716-446655440025', 'Crypgo', 'crypto', 'Free Tailwind CSS Crypto Business Website Template', 'https://themewagon.com/wp-content/uploads/2025/05/crypgo.webp', '{"framework": "tailwind", "type": "crypto", "responsive": true}', '{"sections": ["header", "hero", "features", "prices", "footer"]}', ARRAY['crypto', 'blockchain', 'tailwind', 'business'], 0, true, 4.6, 9202, false),

('550e8400-e29b-41d4-a716-446655440026', 'Materially', 'dashboard', 'Free Material UI Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/05/Materially-1.webp', '{"framework": "react-mui", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "widgets", "tables"]}', ARRAY['dashboard', 'material-ui', 'react', 'admin'], 0, false, 4.5, 8620, false),

('550e8400-e29b-41d4-a716-446655440027', 'DattaAble', 'dashboard', 'Free Responsive Tailwind CSS Admin Template', 'https://themewagon.com/wp-content/uploads/2025/05/DattaAble.webp', '{"framework": "tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "analytics", "tables", "forms"]}', ARRAY['dashboard', 'admin', 'tailwind', 'analytics'], 0, false, 4.6, 13951, false),

('550e8400-e29b-41d4-a716-446655440028', 'Spike Tailwind', 'dashboard', 'Free Tailwind CSS Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/05/spike-tailwind.webp', '{"framework": "tailwind", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "widgets", "apps"]}', ARRAY['dashboard', 'admin', 'tailwind', 'modern'], 0, false, 4.4, 2058, false),

('550e8400-e29b-41d4-a716-446655440029', 'Flexy', 'dashboard', 'Free Bootstrap 5 Admin Dashboard Template', 'https://themewagon.com/wp-content/uploads/2025/05/Flexy-scaled-e1747128648803.webp', '{"framework": "bootstrap-5", "type": "dashboard", "responsive": true}', '{"sections": ["sidebar", "header", "dashboard", "tables", "forms"]}', ARRAY['dashboard', 'admin', 'bootstrap', 'flexy'], 0, false, 4.3, 8504, false),

('550e8400-e29b-41d4-a716-446655440030', 'eLearning', 'education', 'Free Tailwind CSS Educational Website Template', 'https://themewagon.com/wp-content/uploads/2025/05/E-learning.webp', '{"framework": "tailwind", "type": "education", "responsive": true}', '{"sections": ["header", "hero", "courses", "features", "footer"]}', ARRAY['education', 'elearning', 'tailwind', 'courses'], 0, true, 4.7, 7729, false),

('550e8400-e29b-41d4-a716-446655440031', 'WindMill SaaS', 'saas', 'Free Tailwind CSS SaaS Landing Page Template', 'https://themewagon.com/wp-content/uploads/2025/05/Screen-Shot-2025-05-06-at-13.10.14.webp', '{"framework": "tailwind", "type": "saas", "responsive": true}', '{"sections": ["header", "hero", "features", "pricing", "footer"]}', ARRAY['saas', 'landing', 'tailwind', 'pricing'], 0, false, 4.5, 0, false),

-- Creative & Portfolio Templates
('550e8400-e29b-41d4-a716-446655440032', 'Creative Agency', 'creative', 'Modern Creative Agency Template', 'https://images.unsplash.com/photo-1559028006-448665bd7c7f?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "creative", "responsive": true}', '{"sections": ["header", "hero", "portfolio", "team", "contact"]}', ARRAY['creative', 'agency', 'modern', 'portfolio'], 0, false, 4.4, 1200, false),

('550e8400-e29b-41d4-a716-446655440033', 'Photography Pro', 'photography', 'Professional Photography Portfolio Template', 'https://images.unsplash.com/photo-1542038784456-1ea8e2b8f6d0?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "photography", "responsive": true}', '{"sections": ["hero", "gallery", "about", "services", "contact"]}', ARRAY['photography', 'portfolio', 'gallery', 'professional'], 0, false, 4.6, 800, false),

('550e8400-e29b-41d4-a716-446655440034', 'Fashion Store', 'fashion', 'Elegant Fashion E-commerce Template', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "fashion", "responsive": true}', '{"sections": ["header", "hero", "products", "collections", "footer"]}', ARRAY['fashion', 'ecommerce', 'elegant', 'shopping'], 0, false, 4.5, 1500, false),

('550e8400-e29b-41d4-a716-446655440035', 'Tech Startup', 'startup', 'Modern Tech Startup Landing Page', 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "startup", "responsive": true}', '{"sections": ["header", "hero", "features", "team", "contact"]}', ARRAY['startup', 'tech', 'modern', 'landing'], 0, false, 4.3, 900, false),

('550e8400-e29b-41d4-a716-446655440036', 'Medical Clinic', 'medical', 'Professional Medical Clinic Template', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "medical", "responsive": true}', '{"sections": ["header", "hero", "services", "doctors", "appointments"]}', ARRAY['medical', 'healthcare', 'clinic', 'professional'], 0, false, 4.7, 1100, false),

('550e8400-e29b-41d4-a716-446655440037', 'Fitness Gym', 'fitness', 'Dynamic Fitness Gym Website Template', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "fitness", "responsive": true}', '{"sections": ["header", "hero", "classes", "trainers", "contact"]}', ARRAY['fitness', 'gym', 'sports', 'health'], 0, false, 4.4, 700, false),

('550e8400-e29b-41d4-a716-446655440038', 'Real Estate', 'realestate', 'Premium Real Estate Website Template', 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "realestate", "responsive": true}', '{"sections": ["header", "hero", "properties", "agents", "contact"]}', ARRAY['realestate', 'property', 'premium', 'listings'], 0, false, 4.6, 1300, false),

('550e8400-e29b-41d4-a716-446655440039', 'Event Management', 'events', 'Modern Event Management Template', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "events", "responsive": true}', '{"sections": ["header", "hero", "events", "speakers", "tickets"]}', ARRAY['events', 'conference', 'management', 'modern'], 0, false, 4.5, 600, false),

('550e8400-e29b-41d4-a716-446655440040', 'Architecture Firm', 'architecture', 'Elegant Architecture Firm Template', 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "architecture", "responsive": true}', '{"sections": ["header", "hero", "projects", "team", "contact"]}', ARRAY['architecture', 'construction', 'elegant', 'projects'], 0, false, 4.4, 500, false),

('550e8400-e29b-41d4-a716-446655440041', 'Law Firm', 'legal', 'Professional Law Firm Template', 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "legal", "responsive": true}', '{"sections": ["header", "hero", "services", "lawyers", "contact"]}', ARRAY['legal', 'law', 'professional', 'services'], 0, false, 4.6, 400, false),

('550e8400-e29b-41d4-a716-446655440042', 'Consulting', 'consulting', 'Business Consulting Template', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "consulting", "responsive": true}', '{"sections": ["header", "hero", "services", "team", "testimonials"]}', ARRAY['consulting', 'business', 'corporate', 'services'], 0, false, 4.3, 800, false),

('550e8400-e29b-41d4-a716-446655440043', 'Non-Profit', 'nonprofit', 'Charity Non-Profit Organization Template', 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "nonprofit", "responsive": true}', '{"sections": ["header", "hero", "causes", "donate", "volunteers"]}', ARRAY['nonprofit', 'charity', 'donation', 'volunteer'], 0, false, 4.7, 350, false),

('550e8400-e29b-41d4-a716-446655440044', 'Music Studio', 'music', 'Creative Music Studio Template', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "music", "responsive": true}', '{"sections": ["header", "hero", "services", "portfolio", "contact"]}', ARRAY['music', 'studio', 'creative', 'audio'], 0, false, 4.5, 450, false),

('550e8400-e29b-41d4-a716-446655440045', 'Wedding Planner', 'wedding', 'Elegant Wedding Planner Template', 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "wedding", "responsive": true}', '{"sections": ["header", "hero", "services", "gallery", "contact"]}', ARRAY['wedding', 'planner', 'elegant', 'event'], 0, false, 4.8, 300, false),

('550e8400-e29b-41d4-a716-446655440046', 'Pet Care', 'petcare', 'Friendly Pet Care Services Template', 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "petcare", "responsive": true}', '{"sections": ["header", "hero", "services", "team", "appointments"]}', ARRAY['pets', 'veterinary', 'care', 'animals'], 0, false, 4.4, 250, false),

('550e8400-e29b-41d4-a716-446655440047', 'App Landing', 'app', 'Mobile App Landing Page Template', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "app", "responsive": true}', '{"sections": ["header", "hero", "features", "download", "testimonials"]}', ARRAY['app', 'mobile', 'landing', 'download'], 0, false, 4.6, 900, false),

('550e8400-e29b-41d4-a716-446655440048', 'Conference', 'conference', 'Professional Conference Event Template', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "conference", "responsive": true}', '{"sections": ["header", "hero", "schedule", "speakers", "register"]}', ARRAY['conference', 'event', 'speakers', 'schedule'], 0, false, 4.5, 550, false),

('550e8400-e29b-41d4-a716-446655440049', 'Digital Marketing', 'marketing', 'Modern Digital Marketing Agency Template', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop', '{"framework": "bootstrap", "type": "marketing", "responsive": true}', '{"sections": ["header", "hero", "services", "portfolio", "team"]}', ARRAY['marketing', 'digital', 'agency', 'seo'], 0, false, 4.4, 750, false),

('550e8400-e29b-41d4-a716-446655440050', 'Bakery Shop', 'food', 'Sweet Bakery Shop Website Template', 'https://images.unsplash.com/photo-1586444248902-2f64eddc13df?w=800&h=600&fit=crop', '{"framework": "tailwind", "type": "bakery", "responsive": true}', '{"sections": ["header", "hero", "menu", "gallery", "order"]}', ARRAY['bakery', 'food', 'sweets', 'shop'], 0, false, 4.7, 200, false);