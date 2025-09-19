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

    const { templateId, sellerId, customizations, subdomain } = await req.json();

    console.log('Processing template deployment:', { templateId, sellerId, subdomain });

    // Get template data
    const { data: template, error: templateError } = await supabaseClient
      .from('website_themes')
      .select('*')
      .eq('id', templateId)
      .single();

    if (templateError) {
      throw new Error(`Template not found: ${templateError.message}`);
    }

    // Create or update seller theme
    const { data: sellerTheme, error: sellerThemeError } = await supabaseClient
      .from('seller_themes')
      .upsert({
        seller_id: sellerId,
        template_id: templateId,
        theme_name: `${template.name} - ${new Date().toLocaleDateString()}`,
        customizations,
        subdomain: subdomain || `seller-${sellerId}-${Date.now()}`.substring(0, 30),
        status: 'published',
        hosting_config: {
          cpu_limit: '500m',
          memory_limit: '512Mi',
          ssl_enabled: true,
          auto_scale: true
        },
        last_published: new Date().toISOString()
      })
      .select()
      .single();

    if (sellerThemeError) {
      throw new Error(`Failed to create seller theme: ${sellerThemeError.message}`);
    }

    // Create hosting metrics record
    await supabaseClient
      .from('hosting_metrics')
      .upsert({
        seller_theme_id: sellerTheme.id,
        date: new Date().toISOString().split('T')[0],
        page_views: 0,
        unique_visitors: 0,
        bandwidth_gb: 0,
        cpu_usage: 0,
        memory_usage: 0,
        uptime_percentage: 100
      });

    // Log deployment activity
    await supabaseClient
      .from('activity_logs')
      .insert({
        seller_id: sellerId,
        template_id: templateId,
        seller_theme_id: sellerTheme.id,
        action: 'template_deployed',
        details: {
          subdomain: sellerTheme.subdomain,
          customizations,
          hosting_config: sellerTheme.hosting_config
        },
        ip_address: req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown',
        user_agent: req.headers.get('user-agent') || 'unknown'
      });

    // Simulate deployment process
    const deploymentSteps = [
      { step: 'initializing', progress: 10, message: 'Initializing deployment...' },
      { step: 'processing_template', progress: 30, message: 'Processing template files...' },
      { step: 'applying_customizations', progress: 50, message: 'Applying customizations...' },
      { step: 'configuring_hosting', progress: 70, message: 'Configuring hosting environment...' },
      { step: 'deploying', progress: 90, message: 'Deploying to subdomain...' },
      { step: 'completed', progress: 100, message: 'Deployment completed successfully!' }
    ];

    // Generate the deployment URL
    const deploymentUrl = `https://${sellerTheme.subdomain}.sellsphere.app`;

    // Update theme with deployment URL
    await supabaseClient
      .from('seller_themes')
      .update({
        status: 'live',
        hosting_config: {
          ...sellerTheme.hosting_config,
          deployment_url: deploymentUrl,
          deployed_at: new Date().toISOString()
        }
      })
      .eq('id', sellerTheme.id);

    return new Response(JSON.stringify({
      success: true,
      sellerTheme,
      deploymentSteps,
      deploymentUrl,
      message: 'Template deployed successfully!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Deployment error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});