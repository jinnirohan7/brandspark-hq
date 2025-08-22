-- Insert dummy data for the enhanced order system

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
ON CONFLICT DO NOTHING;

-- Insert enhanced dummy orders
INSERT INTO orders (seller_id, customer_name, customer_email, customer_phone, shipping_address, total_amount, status, payment_status, order_source, priority, tracking_number, courier_partner, delivery_attempts, ndr_count, expected_delivery_date, estimated_delivery) 
SELECT 
  s.id,
  names.name,
  lower(replace(names.name, ' ', '.')) || '@example.com',
  '+91' || (9000000000 + (random() * 999999999)::bigint)::text,
  '{"street": "' || streets.street || '", "city": "' || cities.city || '", "state": "' || states.state || '", "pincode": "' || (110001 + (random() * 99999)::int)::text || '"}'::jsonb,
  (500 + random() * 4500)::numeric(10,2),
  statuses.status,
  payment_statuses.payment_status,
  sources.source,
  priorities.priority,
  'TRK' || (100000 + (random() * 899999)::int)::text,
  couriers.courier,
  CASE WHEN statuses.status IN ('delivered', 'cancelled') THEN 1 ELSE (random() * 3)::int END,
  CASE WHEN statuses.status = 'shipped' AND random() > 0.7 THEN (random() * 2)::int ELSE 0 END,
  current_date + interval '3 days' + (random() * 5)::int * interval '1 day',
  current_date + interval '5 days' + (random() * 7)::int * interval '1 day'
FROM 
  sellers s,
  (VALUES 
    ('Rahul Sharma'), ('Priya Patel'), ('Amit Kumar'), ('Sneha Singh'), ('Vikash Gupta'),
    ('Anjali Mehta'), ('Ravi Agarwal'), ('Pooja Yadav'), ('Suresh Reddy'), ('Kavya Nair'),
    ('Arjun Joshi'), ('Meera Sinha'), ('Rohit Verma'), ('Divya Bansal'), ('Karan Malhotra'),
    ('Nisha Kapoor'), ('Sachin Tiwari'), ('Aarti Sharma'), ('Manish Gupta'), ('Shreya Das')
  ) AS names(name),
  (VALUES 
    ('MG Road'), ('Park Street'), ('Brigade Road'), ('Commercial Street'), ('Connaught Place'),
    ('Khan Market'), ('Sector 18'), ('Phoenix Mall'), ('City Center'), ('Mall Road')
  ) AS streets(street),
  (VALUES 
    ('Mumbai'), ('Delhi'), ('Bangalore'), ('Chennai'), ('Kolkata'), ('Hyderabad'), ('Pune'), ('Ahmedabad'), ('Jaipur'), ('Lucknow')
  ) AS cities(city),
  (VALUES 
    ('Maharashtra'), ('Delhi'), ('Karnataka'), ('Tamil Nadu'), ('West Bengal'), ('Telangana'), ('Uttar Pradesh'), ('Gujarat'), ('Rajasthan'), ('Haryana')
  ) AS states(state),
  (VALUES 
    ('pending'), ('confirmed'), ('processing'), ('shipped'), ('delivered'), ('cancelled'), ('returned')
  ) AS statuses(status),
  (VALUES 
    ('pending'), ('paid'), ('failed'), ('refunded')
  ) AS payment_statuses(payment_status),
  (VALUES 
    ('website'), ('mobile_app'), ('marketplace'), ('social_media')
  ) AS sources(source),
  (VALUES 
    ('normal'), ('high'), ('urgent')
  ) AS priorities(priority),
  (VALUES 
    ('BlueDart'), ('DTDC'), ('Delhivery'), ('Ecom Express'), ('FedEx')
  ) AS couriers(courier)
LIMIT 50
ON CONFLICT DO NOTHING;

-- Insert dummy NDRs for some shipped orders
INSERT INTO ndrs (order_id, seller_id, ndr_reason, resolution_status, next_action, auto_resolution_attempted)
SELECT 
  o.id,
  o.seller_id,
  reasons.reason,
  'pending',
  actions.action,
  random() > 0.5
FROM orders o,
  (VALUES 
    ('Customer not available'), ('Address not found'), ('Customer refused delivery'), 
    ('Incomplete address'), ('Phone not reachable'), ('Rescheduled by customer')
  ) AS reasons(reason),
  (VALUES 
    ('Retry delivery'), ('Contact customer'), ('Update address'), ('Schedule callback')
  ) AS actions(action)
WHERE o.status = 'shipped' AND random() > 0.6
LIMIT 15
ON CONFLICT DO NOTHING;

-- Insert dummy notifications
INSERT INTO order_notifications (order_id, seller_id, notification_type, message, sent_via)
SELECT 
  o.id,
  o.seller_id,
  notification_types.type,
  notification_types.message,
  ARRAY[channels.channel]
FROM orders o,
  (VALUES 
    ('delay', 'Your order delivery has been delayed by 1 day due to weather conditions'),
    ('ndr', 'We attempted to deliver your order but you were not available'),
    ('delivery', 'Your order has been successfully delivered'),
    ('return', 'Your return request has been processed')
  ) AS notification_types(type, message),
  (VALUES 
    ('email'), ('sms'), ('whatsapp')
  ) AS channels(channel)
WHERE random() > 0.7
LIMIT 30
ON CONFLICT DO NOTHING;

-- Insert order timeline events
INSERT INTO order_timeline (order_id, event_type, event_description, created_by)
SELECT 
  o.id,
  events.event_type,
  events.description,
  'system'
FROM orders o,
  (VALUES 
    ('order_placed', 'Order has been placed successfully'),
    ('payment_confirmed', 'Payment has been confirmed'),
    ('order_confirmed', 'Order has been confirmed by seller'),
    ('shipped', 'Order has been shipped'),
    ('out_for_delivery', 'Order is out for delivery'),
    ('delivered', 'Order has been delivered successfully')
  ) AS events(event_type, description)
WHERE random() > 0.5
LIMIT 100
ON CONFLICT DO NOTHING;