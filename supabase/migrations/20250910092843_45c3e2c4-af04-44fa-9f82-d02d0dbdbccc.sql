-- Add missing RLS policies for website_orders table to protect financial data

-- Allow website owners to insert orders for their own websites
CREATE POLICY "Website owners can create orders for their websites" 
ON website_orders 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM websites w
    JOIN sellers s ON s.id = w.seller_id
    WHERE w.id = website_orders.website_id 
    AND s.user_id = auth.uid()
  )
);

-- Allow website owners to update orders for their own websites
CREATE POLICY "Website owners can update their website orders" 
ON website_orders 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM websites w
    JOIN sellers s ON s.id = w.seller_id
    WHERE w.id = website_orders.website_id 
    AND s.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM websites w
    JOIN sellers s ON s.id = w.seller_id
    WHERE w.id = website_orders.website_id 
    AND s.user_id = auth.uid()
  )
);

-- Allow website owners to delete orders for their own websites (with restrictions)
-- Note: In production, consider restricting deletion based on order status
CREATE POLICY "Website owners can delete their website orders" 
ON website_orders 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM websites w
    JOIN sellers s ON s.id = w.seller_id
    WHERE w.id = website_orders.website_id 
    AND s.user_id = auth.uid()
  )
);