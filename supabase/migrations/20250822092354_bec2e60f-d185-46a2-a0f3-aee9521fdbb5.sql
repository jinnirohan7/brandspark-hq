-- Insert dummy data with corrected JSON syntax

-- Insert return policies for sellers
INSERT INTO return_policies (seller_id, policy_name, return_window_days, conditions, auto_approve, require_qc, refund_percentage, shipping_charges_refundable) 
SELECT 
  s.id,
  'Standard Return Policy',
  7,
  '[{"condition": "Item must be unused", "required": true}, {"condition": "Original packaging required", "required": true}]'::jsonb,
  false,
  true,
  100,
  false
FROM sellers s
WHERE NOT EXISTS (SELECT 1 FROM return_policies WHERE seller_id = s.id);

-- Insert enhanced dummy orders with proper JSON formatting
INSERT INTO orders (seller_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, payment_status, order_source, priority, tracking_number, courier_partner, delivery_attempts, ndr_count, expected_delivery_date, estimated_delivery) 
VALUES 
-- Sample orders with proper JSON addresses
((SELECT id FROM sellers LIMIT 1), 'Rahul Sharma', 'rahul.sharma@example.com', '+919876543210', 
 '{"street": "MG Road", "city": "Mumbai", "state": "Maharashtra", "pincode": "400001"}'::jsonb, 
 2499.00, 'processing', 'paid', 'website', 'normal', 'TRK123456', 'BlueDart', 0, 0, current_date + 3, current_date + 5),
 
((SELECT id FROM sellers LIMIT 1), 'Priya Patel', 'priya.patel@example.com', '+919876543211', 
 '{"street": "Park Street", "city": "Delhi", "state": "Delhi", "pincode": "110001"}'::jsonb, 
 1299.00, 'shipped', 'paid', 'mobile_app', 'high', 'TRK123457', 'DTDC', 1, 1, current_date + 2, current_date + 4),
 
((SELECT id FROM sellers LIMIT 1), 'Amit Kumar', 'amit.kumar@example.com', '+919876543212', 
 '{"street": "Brigade Road", "city": "Bangalore", "state": "Karnataka", "pincode": "560001"}'::jsonb, 
 3599.00, 'delivered', 'paid', 'marketplace', 'normal', 'TRK123458', 'Delhivery', 1, 0, current_date - 1, current_date + 1),
 
((SELECT id FROM sellers LIMIT 1), 'Sneha Singh', 'sneha.singh@example.com', '+919876543213', 
 '{"street": "Commercial Street", "city": "Chennai", "state": "Tamil Nadu", "pincode": "600001"}'::jsonb, 
 899.00, 'pending', 'pending', 'website', 'urgent', 'TRK123459', 'Ecom Express', 0, 0, current_date + 4, current_date + 6),
 
((SELECT id FROM sellers LIMIT 1), 'Vikash Gupta', 'vikash.gupta@example.com', '+919876543214', 
 '{"street": "Connaught Place", "city": "Kolkata", "state": "West Bengal", "pincode": "700001"}'::jsonb, 
 1899.00, 'shipped', 'paid', 'social_media', 'normal', 'TRK123460', 'FedEx', 0, 2, current_date + 3, current_date + 5)

ON CONFLICT DO NOTHING;

-- Insert some NDRs for shipped orders
INSERT INTO ndrs (order_id, seller_id, ndr_reason, resolution_status, next_action, auto_resolution_attempted)
SELECT 
  o.id,
  o.seller_id,
  'Customer not available',
  'pending',
  'Retry delivery',
  false
FROM orders o
WHERE o.status = 'shipped' AND o.ndr_count > 0
LIMIT 3
ON CONFLICT DO NOTHING;

-- Insert notifications
INSERT INTO order_notifications (order_id, seller_id, notification_type, message, sent_via)
SELECT 
  o.id,
  o.seller_id,
  CASE 
    WHEN o.status = 'shipped' THEN 'delay'
    WHEN o.status = 'delivered' THEN 'delivery'
    ELSE 'order_update'
  END,
  CASE 
    WHEN o.status = 'shipped' THEN 'Your order delivery has been delayed by 1 day due to weather conditions'
    WHEN o.status = 'delivered' THEN 'Your order has been successfully delivered'
    ELSE 'Your order status has been updated'
  END,
  ARRAY['email', 'sms']
FROM orders o
LIMIT 10
ON CONFLICT DO NOTHING;

-- Insert order timeline events
INSERT INTO order_timeline (order_id, event_type, event_description, created_by)
SELECT 
  o.id,
  'order_placed',
  'Order has been placed successfully',
  'system'
FROM orders o
LIMIT 20
ON CONFLICT DO NOTHING;