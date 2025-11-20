import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, count = 10, skip = 0 } = await req.json();

    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Build query params
    const params = new URLSearchParams({
      count: count.toString(),
      skip: skip.toString(),
    });

    if (from) params.append('from', from.toString());
    if (to) params.append('to', to.toString());

    // Fetch payments from Razorpay
    const authHeader = btoa(`${keyId}:${keySecret}`);
    const razorpayResponse = await fetch(
      `https://api.razorpay.com/v1/payments?${params.toString()}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
        },
      }
    );

    if (!razorpayResponse.ok) {
      const error = await razorpayResponse.json();
      console.error('Razorpay error:', error);
      throw new Error(error.error?.description || 'Failed to fetch payments');
    }

    const payments = await razorpayResponse.json();

    return new Response(
      JSON.stringify({ 
        success: true,
        payments: payments.items,
        count: payments.count
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in razorpay-fetch-payments:', error);
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
