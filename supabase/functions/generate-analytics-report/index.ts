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

    const url = new URL(req.url);
    const sellerId = url.searchParams.get('sellerId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!sellerId) {
      throw new Error('Seller ID is required');
    }

    console.log('Generating analytics report for seller:', sellerId);

    // Get seller themes
    const { data: sellerThemes, error: themesError } = await supabaseClient
      .from('seller_themes')
      .select(`
        id,
        theme_name,
        status,
        created_at,
        last_published,
        subdomain,
        custom_domain
      `)
      .eq('seller_id', sellerId);

    if (themesError) {
      throw new Error(`Failed to get seller themes: ${themesError.message}`);
    }

    // Get hosting metrics
    const { data: hostingMetrics, error: metricsError } = await supabaseClient
      .from('hosting_metrics')
      .select('*')
      .in('seller_theme_id', sellerThemes.map(t => t.id))
      .gte('date', startDate || '2024-01-01')
      .lte('date', endDate || new Date().toISOString().split('T')[0])
      .order('date', { ascending: true });

    if (metricsError) {
      throw new Error(`Failed to get hosting metrics: ${metricsError.message}`);
    }

    // Get activity logs
    const { data: activityLogs, error: logsError } = await supabaseClient
      .from('activity_logs')
      .select('*')
      .eq('seller_id', sellerId)
      .gte('timestamp', startDate ? `${startDate}T00:00:00Z` : '2024-01-01T00:00:00Z')
      .lte('timestamp', endDate ? `${endDate}T23:59:59Z` : new Date().toISOString())
      .order('timestamp', { ascending: false })
      .limit(100);

    if (logsError) {
      throw new Error(`Failed to get activity logs: ${logsError.message}`);
    }

    // Calculate summary statistics
    const totalPageViews = hostingMetrics.reduce((sum, metric) => sum + (metric.page_views || 0), 0);
    const totalUniqueVisitors = hostingMetrics.reduce((sum, metric) => sum + (metric.unique_visitors || 0), 0);
    const totalBandwidth = hostingMetrics.reduce((sum, metric) => sum + (metric.bandwidth_gb || 0), 0);
    const avgCpuUsage = hostingMetrics.length > 0 
      ? hostingMetrics.reduce((sum, metric) => sum + (metric.cpu_usage || 0), 0) / hostingMetrics.length 
      : 0;
    const avgMemoryUsage = hostingMetrics.length > 0 
      ? hostingMetrics.reduce((sum, metric) => sum + (metric.memory_usage || 0), 0) / hostingMetrics.length 
      : 0;
    const avgUptimePercentage = hostingMetrics.length > 0 
      ? hostingMetrics.reduce((sum, metric) => sum + (metric.uptime_percentage || 100), 0) / hostingMetrics.length 
      : 100;

    // Group metrics by date for charts
    const dailyMetrics = hostingMetrics.reduce((acc, metric) => {
      const date = metric.date;
      if (!acc[date]) {
        acc[date] = {
          date,
          page_views: 0,
          unique_visitors: 0,
          bandwidth_gb: 0,
          cpu_usage: 0,
          memory_usage: 0,
          uptime_percentage: 0,
          themes_count: 0
        };
      }
      
      acc[date].page_views += metric.page_views || 0;
      acc[date].unique_visitors += metric.unique_visitors || 0;
      acc[date].bandwidth_gb += metric.bandwidth_gb || 0;
      acc[date].cpu_usage += metric.cpu_usage || 0;
      acc[date].memory_usage += metric.memory_usage || 0;
      acc[date].uptime_percentage += metric.uptime_percentage || 100;
      acc[date].themes_count += 1;
      
      return acc;
    }, {});

    // Calculate averages for daily metrics
    Object.values(dailyMetrics).forEach((day: any) => {
      if (day.themes_count > 0) {
        day.cpu_usage = day.cpu_usage / day.themes_count;
        day.memory_usage = day.memory_usage / day.themes_count;
        day.uptime_percentage = day.uptime_percentage / day.themes_count;
      }
    });

    // Activity breakdown
    const activityBreakdown = activityLogs.reduce((acc, log) => {
      const action = log.action;
      acc[action] = (acc[action] || 0) + 1;
      return acc;
    }, {});

    // Theme status breakdown
    const themeStatusBreakdown = sellerThemes.reduce((acc, theme) => {
      const status = theme.status;
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Recent activities (last 10)
    const recentActivities = activityLogs.slice(0, 10).map(log => ({
      id: log.id,
      action: log.action,
      timestamp: log.timestamp,
      details: log.details
    }));

    const report = {
      seller_id: sellerId,
      report_generated_at: new Date().toISOString(),
      period: {
        start_date: startDate || '2024-01-01',
        end_date: endDate || new Date().toISOString().split('T')[0]
      },
      summary: {
        total_themes: sellerThemes.length,
        live_themes: sellerThemes.filter(t => t.status === 'live').length,
        draft_themes: sellerThemes.filter(t => t.status === 'draft').length,
        total_page_views: totalPageViews,
        total_unique_visitors: totalUniqueVisitors,
        total_bandwidth_gb: Math.round(totalBandwidth * 100) / 100,
        avg_cpu_usage: Math.round(avgCpuUsage * 100) / 100,
        avg_memory_usage: Math.round(avgMemoryUsage * 100) / 100,
        avg_uptime_percentage: Math.round(avgUptimePercentage * 100) / 100
      },
      charts_data: {
        daily_metrics: Object.values(dailyMetrics),
        activity_breakdown: activityBreakdown,
        theme_status_breakdown: themeStatusBreakdown
      },
      themes: sellerThemes,
      recent_activities: recentActivities,
      hosting_metrics: hostingMetrics
    };

    return new Response(JSON.stringify({
      success: true,
      report
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Analytics report error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});