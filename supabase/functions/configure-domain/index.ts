import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { sellerThemeId, domainName, domainType = 'custom' } = await req.json();

    console.log('Configuring domain:', { sellerThemeId, domainName, domainType });

    // Get seller theme
    const { data: sellerTheme, error: themeError } = await supabaseClient
      .from('seller_themes')
      .select('*')
      .eq('id', sellerThemeId)
      .single();

    if (themeError) {
      throw new Error(`Seller theme not found: ${themeError.message}`);
    }

    // DNS configuration for different domain types
    let dnsRecords = {};
    let verificationSteps = [];

    if (domainType === 'custom') {
      dnsRecords = {
        a_record: [
          { type: 'A', name: '@', value: '185.158.133.1', ttl: 300 },
          { type: 'A', name: 'www', value: '185.158.133.1', ttl: 300 }
        ],
        cname_record: [
          { type: 'CNAME', name: 'subdomain', value: `${sellerTheme.subdomain}.sellsphere.app`, ttl: 300 }
        ],
        txt_record: [
          { type: 'TXT', name: '@', value: `sellsphere-verification=${sellerThemeId}`, ttl: 300 }
        ]
      };

      verificationSteps = [
        'Add A records pointing to 185.158.133.1',
        'Add CNAME record for www subdomain',
        'Add TXT record for domain verification',
        'Wait for DNS propagation (may take up to 48 hours)',
        'SSL certificate will be automatically issued'
      ];
    } else {
      // Subdomain configuration
      dnsRecords = {
        cname_record: [
          { type: 'CNAME', name: domainName, value: `${sellerTheme.subdomain}.sellsphere.app`, ttl: 300 }
        ]
      };

      verificationSteps = [
        'Subdomain automatically configured',
        'SSL certificate issued',
        'Domain ready for use'
      ];
    }

    // Create domain record
    const { data: domain, error: domainError } = await supabaseClient
      .from('domains')
      .insert({
        seller_id: sellerTheme.seller_id,
        seller_theme_id: sellerThemeId,
        domain_name: domainName,
        domain_type: domainType,
        ssl_status: 'pending',
        dns_provider: 'auto-detect',
        dns_records: dnsRecords,
        verification_status: domainType === 'subdomain' ? 'verified' : 'pending'
      })
      .select()
      .single();

    if (domainError) {
      throw new Error(`Failed to create domain: ${domainError.message}`);
    }

    // Update seller theme with domain info
    await supabaseClient
      .from('seller_themes')
      .update({
        custom_domain: domainType === 'custom' ? domainName : null,
        subdomain: domainType === 'subdomain' ? domainName : sellerTheme.subdomain
      })
      .eq('id', sellerThemeId);

    // Log domain configuration activity
    await supabaseClient
      .from('activity_logs')
      .insert({
        seller_id: sellerTheme.seller_id,
        seller_theme_id: sellerThemeId,
        action: 'domain_configured',
        details: {
          domain_name: domainName,
          domain_type: domainType,
          dns_records: dnsRecords
        },
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    // Simulate SSL certificate generation for subdomains
    if (domainType === 'subdomain') {
      setTimeout(async () => {
        await supabaseClient
          .from('domains')
          .update({
            ssl_status: 'active',
            verification_status: 'verified'
          })
          .eq('id', domain.id);
      }, 2000);
    }

    return new Response(JSON.stringify({
      success: true,
      domain,
      dnsRecords,
      verificationSteps,
      estimatedPropagationTime: domainType === 'custom' ? '24-48 hours' : 'Immediate',
      message: `Domain ${domainName} configured successfully!`
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Domain configuration error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});