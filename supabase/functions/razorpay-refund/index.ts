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
    const { payment_id, amount, notes, seller_id } = await req.json();

    const keyId = Deno.env.get('RAZORPAY_KEY_ID');
    const keySecret = Deno.env.get('RAZORPAY_KEY_SECRET');

    if (!keyId || !keySecret) {
      throw new Error('Razorpay credentials not configured');
    }

    // Create refund
    const authHeader = btoa(`${keyId}:${keySecret}`);
    const refundData: any = { notes: notes || {} };
    
    if (amount) {
      refundData.amount = Math.round(amount * 100); // Convert to paise
    }

    const razorpayResponse = await fetch(
      `https://api.razorpay.com/v1/payments/${payment_id}/refund`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${authHeader}`,
        },
        body: JSON.stringify(refundData),
      }
    );

    if (!razorpayResponse.ok) {
      const error = await razorpayResponse.json();
      console.error('Razorpay refund error:', error);
      throw new Error(error.error?.description || 'Failed to process refund');
    }

    const refund = await razorpayResponse.json();

    // Store refund in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
      .from('payments')
      .insert({
        seller_id,
        amount: -(refund.amount / 100), // Negative for refund
        type: 'refund',
        status: refund.status === 'processed' ? 'completed' : 'pending',
        gateway: 'razorpay',
        transaction_id: refund.id,
        processed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      throw new Error('Failed to store refund record');
    }

    console.log('Refund processed:', refund.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        refund: data,
        razorpayDetails: refund
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in razorpay-refund:', error);
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
