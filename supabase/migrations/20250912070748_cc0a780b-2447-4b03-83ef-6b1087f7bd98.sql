-- Fix security issue: Ensure websites table is properly protected with RLS
-- The websites table contains sensitive business information that should only be accessible to owners

-- Ensure RLS is enabled on websites table
ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Drop any existing overly permissive policies if they exist
DROP POLICY IF EXISTS "Anyone can view websites" ON websites;
DROP POLICY IF EXISTS "Public can view websites" ON websites;
DROP POLICY IF EXISTS "Enable read access for all users" ON websites;

-- Ensure only the existing policy for sellers managing their own websites is active
-- The existing policy "Sellers can manage their own websites" should be sufficient
-- But let's be explicit about SELECT access to ensure no public access

-- Verify the SELECT policy is restrictive (this recreates the existing logic more explicitly)
DROP POLICY IF EXISTS "Sellers can view their own websites" ON websites;
CREATE POLICY "Sellers can view their own websites" 
ON websites 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM sellers 
    WHERE sellers.id = websites.seller_id 
    AND sellers.user_id = auth.uid()
  )
);

-- Ensure INSERT/UPDATE/DELETE are also properly restricted
DROP POLICY IF EXISTS "Sellers can create their own websites" ON websites;
CREATE POLICY "Sellers can create their own websites" 
ON websites 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM sellers 
    WHERE sellers.id = websites.seller_id 
    AND sellers.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Sellers can update their own websites" ON websites;
CREATE POLICY "Sellers can update their own websites" 
ON websites 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM sellers 
    WHERE sellers.id = websites.seller_id 
    AND sellers.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM sellers 
    WHERE sellers.id = websites.seller_id 
    AND sellers.user_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Sellers can delete their own websites" ON websites;
CREATE POLICY "Sellers can delete their own websites" 
ON websites 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM sellers 
    WHERE sellers.id = websites.seller_id 
    AND sellers.user_id = auth.uid()
  )
);