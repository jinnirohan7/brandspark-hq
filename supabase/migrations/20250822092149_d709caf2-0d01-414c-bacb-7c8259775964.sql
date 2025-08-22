-- Insert dummy data for return policies
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

-- Insert dummy orders with enhanced data (corrected JSON format)
DO $$
DECLARE
    seller_record RECORD;
    customer_names text[] := ARRAY['Rahul Sharma', 'Priya Patel', 'Amit Kumar', 'Sneha Singh', 'Vikash Gupta', 
                                   'Anjali Mehta', 'Ravi Agarwal', 'Pooja Yadav', 'Suresh Reddy', 'Kavya Nair'];
    streets text[] := ARRAY['MG Road', 'Park Street', 'Brigade Road', 'Commercial Street', 'Connaught Place'];
    cities text[] := ARRAY['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
    states text[] := ARRAY['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'West Bengal'];
    statuses text[] := ARRAY['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    payment_statuses text[] := ARRAY['pending', 'paid', 'failed', 'refunded'];
    sources text[] := ARRAY['website', 'mobile_app', 'marketplace', 'social_media'];
    priorities text[] := ARRAY['normal', 'high', 'urgent'];
    couriers text[] := ARRAY['BlueDart', 'DTDC', 'Delhivery', 'Ecom Express', 'FedEx'];
    order_count integer := 0;
BEGIN
    FOR seller_record IN SELECT id FROM sellers LOOP
        -- Insert 10 orders per seller
        FOR i IN 1..10 LOOP
            INSERT INTO orders (
                seller_id, customer_name, customer_email, customer_phone, 
                shipping_address, total_amount, status, payment_status, 
                order_source, priority, tracking_number, courier_partner,
                delivery_attempts, ndr_count, expected_delivery_date, estimated_delivery
            ) VALUES (
                seller_record.id,
                customer_names[1 + (random() * (array_length(customer_names, 1) - 1))::int],
                'customer' || i || '@example.com',
                '+91' || (9000000000 + (random() * 999999999)::bigint)::text,
                json_build_object(
                    'street', streets[1 + (random() * (array_length(streets, 1) - 1))::int],
                    'city', cities[1 + (random() * (array_length(cities, 1) - 1))::int],
                    'state', states[1 + (random() * (array_length(states, 1) - 1))::int],
                    'pincode', (110001 + (random() * 99999)::int)::text
                )::jsonb,
                (500 + random() * 4500)::numeric(10,2),
                statuses[1 + (random() * (array_length(statuses, 1) - 1))::int],
                payment_statuses[1 + (random() * (array_length(payment_statuses, 1) - 1))::int],
                sources[1 + (random() * (array_length(sources, 1) - 1))::int],
                priorities[1 + (random() * (array_length(priorities, 1) - 1))::int],
                'TRK' || (100000 + (random() * 899999)::int)::text,
                couriers[1 + (random() * (array_length(couriers, 1) - 1))::int],
                (random() * 3)::int,
                CASE WHEN random() > 0.8 THEN (random() * 2)::int ELSE 0 END,
                current_date + interval '3 days' + (random() * 5)::int * interval '1 day',
                current_date + interval '5 days' + (random() * 7)::int * interval '1 day'
            );
            
            order_count := order_count + 1;
            EXIT WHEN order_count >= 50; -- Limit total orders
        END LOOP;
        EXIT WHEN order_count >= 50;
    END LOOP;
END $$;