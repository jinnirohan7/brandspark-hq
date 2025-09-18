-- Remove the foreign key constraint temporarily to allow demo admin creation
ALTER TABLE admin_users DROP CONSTRAINT IF EXISTS admin_users_user_id_fkey;

-- Create a more flexible admin_users table that can work without auth.users initially
ALTER TABLE admin_users ALTER COLUMN user_id DROP NOT NULL;

-- Insert the demo admin user
INSERT INTO admin_users (
  email,
  full_name,
  role,
  permissions,
  is_active,
  created_at,
  updated_at
) VALUES (
  'rohanbhatia534@gmail.com',
  'Super Admin',
  'super_admin',
  jsonb_build_object(
    'manage_sellers', true,
    'view_all_data', true,
    'manage_payouts', true,
    'manage_settings', true,
    'manage_integrations', true,
    'delivery_oversight', true
  ),
  true,
  now(),
  now()
) ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  permissions = EXCLUDED.permissions,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- Create a trigger to link admin when they sign up with auth
CREATE OR REPLACE FUNCTION link_admin_on_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Update admin_users with the actual user_id when admin signs up
  UPDATE admin_users 
  SET user_id = NEW.id,
      updated_at = now()
  WHERE email = NEW.email AND user_id IS NULL;
  
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS link_admin_trigger ON auth.users;
CREATE TRIGGER link_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION link_admin_on_signup();

-- Update admin context functions to work with email-based lookup
CREATE OR REPLACE FUNCTION public.is_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE (user_id = _user_id OR email = (SELECT email FROM auth.users WHERE id = _user_id))
      AND is_active = true
  )
$function$;

CREATE OR REPLACE FUNCTION public.get_admin_permissions(_user_id uuid)
RETURNS jsonb
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(permissions, '[]'::jsonb)
  FROM public.admin_users
  WHERE (user_id = _user_id OR email = (SELECT email FROM auth.users WHERE id = _user_id))
    AND is_active = true
  LIMIT 1
$function$;