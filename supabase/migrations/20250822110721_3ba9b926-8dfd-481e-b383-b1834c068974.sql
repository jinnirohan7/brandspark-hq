-- Create RPC function to increment theme downloads
CREATE OR REPLACE FUNCTION increment_downloads(theme_id UUID)
RETURNS void
LANGUAGE SQL
SECURITY DEFINER
AS $$
  UPDATE website_themes 
  SET downloads = downloads + 1 
  WHERE id = theme_id;
$$;