-- Add columns to orders table for enhanced tracking
ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_source text DEFAULT 'website';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS priority text DEFAULT 'normal';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_instructions text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS is_duplicate boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS duplicate_of uuid;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS ndr_count integer DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS last_ndr_date timestamp with time zone;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_attempts integer DEFAULT 0;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_delivery_date date;

-- Create NDR (Non-Delivery Report) tracking table
CREATE TABLE IF NOT EXISTS ndrs (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  ndr_reason text NOT NULL,
  customer_response text,
  resolution_status text DEFAULT 'pending',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  resolved_at timestamp with time zone,
  next_action text,
  auto_resolution_attempted boolean DEFAULT false,
  CONSTRAINT fk_ndr_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create return policies table
CREATE TABLE IF NOT EXISTS return_policies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id uuid NOT NULL,
  policy_name text NOT NULL,
  return_window_days integer NOT NULL DEFAULT 7,
  conditions jsonb DEFAULT '[]',
  auto_approve boolean DEFAULT false,
  require_qc boolean DEFAULT true,
  refund_percentage numeric DEFAULT 100,
  shipping_charges_refundable boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  is_active boolean DEFAULT true
);

-- Create notifications table for delay and other notifications
CREATE TABLE IF NOT EXISTS order_notifications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL,
  seller_id uuid NOT NULL,
  notification_type text NOT NULL, -- 'delay', 'ndr', 'delivery', 'return'
  message text NOT NULL,
  sent_via text[], -- array of channels: email, sms, whatsapp
  sent_at timestamp with time zone DEFAULT now(),
  status text DEFAULT 'sent',
  customer_response text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_notification_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Create order timeline table for tracking all order events
CREATE TABLE IF NOT EXISTS order_timeline (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid NOT NULL,
  event_type text NOT NULL,
  event_description text NOT NULL,
  event_data jsonb,
  created_by text, -- system, user_id, or external_service
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT fk_timeline_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- Add columns to returns table for enhanced return processing
ALTER TABLE returns ADD COLUMN IF NOT EXISTS return_policy_id uuid;
ALTER TABLE returns ADD COLUMN IF NOT EXISTS qc_status text DEFAULT 'pending';
ALTER TABLE returns ADD COLUMN IF NOT EXISTS qc_notes text;
ALTER TABLE returns ADD COLUMN IF NOT EXISTS pickup_scheduled_at timestamp with time zone;
ALTER TABLE returns ADD COLUMN IF NOT EXISTS pickup_completed_at timestamp with time zone;
ALTER TABLE returns ADD COLUMN IF NOT EXISTS refund_processed_at timestamp with time zone;
ALTER TABLE returns ADD COLUMN IF NOT EXISTS return_tracking_number text;
ALTER TABLE returns ADD COLUMN IF NOT EXISTS courier_partner text;

-- Enable RLS on new tables
ALTER TABLE ndrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_timeline ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Sellers can manage their own NDRs" ON ndrs
  FOR ALL USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = ndrs.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "Sellers can manage their own return policies" ON return_policies
  FOR ALL USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = return_policies.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "Sellers can manage their own order notifications" ON order_notifications
  FOR ALL USING (EXISTS (
    SELECT 1 FROM sellers WHERE sellers.id = order_notifications.seller_id AND sellers.user_id = auth.uid()
  ));

CREATE POLICY "Sellers can view their own order timeline" ON order_timeline
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM orders o 
    JOIN sellers s ON s.id = o.seller_id 
    WHERE o.id = order_timeline.order_id AND s.user_id = auth.uid()
  ));

-- Create function for duplicate order detection
CREATE OR REPLACE FUNCTION detect_duplicate_orders()
RETURNS trigger AS $$
BEGIN
  -- Check for potential duplicates based on customer email, total amount, and created within 1 hour
  UPDATE orders 
  SET is_duplicate = true, 
      duplicate_of = (
        SELECT id FROM orders 
        WHERE customer_email = NEW.customer_email 
        AND total_amount = NEW.total_amount 
        AND seller_id = NEW.seller_id
        AND created_at > (NEW.created_at - interval '1 hour')
        AND id != NEW.id
        AND NOT is_duplicate
        ORDER BY created_at ASC
        LIMIT 1
      )
  WHERE customer_email = NEW.customer_email 
  AND total_amount = NEW.total_amount 
  AND seller_id = NEW.seller_id
  AND created_at > (NEW.created_at - interval '1 hour')
  AND id = NEW.id
  AND EXISTS (
    SELECT 1 FROM orders 
    WHERE customer_email = NEW.customer_email 
    AND total_amount = NEW.total_amount 
    AND seller_id = NEW.seller_id
    AND created_at > (NEW.created_at - interval '1 hour')
    AND id != NEW.id
    AND NOT is_duplicate
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for duplicate detection
DROP TRIGGER IF EXISTS trigger_detect_duplicate_orders ON orders;
CREATE TRIGGER trigger_detect_duplicate_orders
  AFTER INSERT ON orders
  FOR EACH ROW
  EXECUTE FUNCTION detect_duplicate_orders();