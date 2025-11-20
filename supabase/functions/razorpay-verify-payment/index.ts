import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.55.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      seller_id,
      order_id,
      amount
    } = await req.json();

    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keySecret) {
      throw new Error('Razorpay secret not configured');
    }

    // Verify signature using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keySecret);
    const messageData = encoder.encode(`${razorpay_order_id}|${razorpay_payment_id}`);
    
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );
    
    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const generatedSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (generatedSignature !== razorpay_signature) {
      console.error('Signature mismatch:', { generatedSignature, razorpay_signature });
      throw new Error('Invalid payment signature');
    }

    // Fetch payment details from Razorpay
    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const authHeader = btoa(`${keyId}:${keySecret}`);
    
    const paymentResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${razorpay_payment_id}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      }
    );

    if (!paymentResponse.ok) {
      throw new Error('Failed to fetch payment details');
    }

    const paymentDetails = await paymentResponse.json();

    // Store payment in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('payments')
      .insert({
        seller_id,
        order_id: order_id || null,
        amount: amount,
        type: 'sale',
        status: paymentDetails.status === 'captured' ? 'completed' : 'pending',
        gateway: 'razorpay',
        transaction_id: razorpay_payment_id,
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to store payment record');
    }

    console.log('Payment verified and stored:', razorpay_payment_id);

    return new Response(
      JSON.stringify({ 
        success: true,
        payment: data,
        razorpayDetails: paymentDetails
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in razorpay-verify-payment:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
