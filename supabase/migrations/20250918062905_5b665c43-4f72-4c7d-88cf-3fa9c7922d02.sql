-- Insert admin user into auth.users first (this will be the base auth user)
-- Note: In production, this should be done through proper auth flow, but for demo purposes:

-- Insert into admin_users table 
-- First we need to create a user in auth.users, but since we can't directly insert there,
-- we'll assume the user will be created through normal signup flow first

-- For demo purposes, let's create a function to handle admin user creation
CREATE OR REPLACE FUNCTION create_demo_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- This is a demo function - in production, admins should be created through proper auth flow
  -- For now, we'll just prepare the admin_users table to accept this email when the user signs up
  
  -- Check if admin already exists
  IF NOT EXISTS (SELECT 1 FROM admin_users WHERE email = 'rohanbhatia534@gmail.com') THEN
    -- Insert placeholder admin record (will be updated when user actually signs up)
    INSERT INTO admin_users (
      user_id,
      email,
      full_name,
      role,
      permissions,
      is_active,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(), -- Temporary UUID, will be updated when user signs up
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
    );
  END IF;
END;
$$;

-- Execute the function
SELECT create_demo_admin();

-- Create a trigger to automatically make rohanbhatia534@gmail.com an admin when they sign up
CREATE OR REPLACE FUNCTION auto_make_admin()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If this is the admin email, update the admin_users record with the actual user_id
  IF NEW.email = 'rohanbhatia534@gmail.com' THEN
    UPDATE admin_users 
    SET user_id = NEW.id,
        updated_at = now()
    WHERE email = 'rohanbhatia534@gmail.com';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
CREATE OR REPLACE TRIGGER make_admin_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auto_make_admin();

-- Drop the demo function as it's no longer needed
DROP FUNCTION create_demo_admin();