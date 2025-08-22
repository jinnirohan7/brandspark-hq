import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export interface Website {
  id: string;
  seller_id: string;
  domain_name?: string;
  subdomain: string;
  site_name: string;
  logo_url?: string;
  favicon_url?: string;
  theme_id?: string;
  custom_css?: string;
  is_active: boolean;
  ssl_enabled: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  google_analytics_id?: string;
  facebook_pixel_id?: string;
  contact_email?: string;
  contact_phone?: string;
  social_links?: any;
  business_hours?: any;
  shipping_info?: any;
  return_policy?: string;
  privacy_policy?: string;
  terms_of_service?: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteTheme {
  id: string;
  name: string;
  category: string;
  description?: string;
  preview_image_url?: string;
  template_data: any;
  is_premium: boolean;
  price: number;
  rating: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

export interface WebsiteWidget {
  id: string;
  name: string;
  category: string;
  description?: string;
  preview_image_url?: string;
  widget_config: any;
  is_premium: boolean;
  created_at: string;
}

export interface WebsitePage {
  id: string;
  website_id: string;
  page_type: string;
  title: string;
  slug: string;
  content: any;
  is_published: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string[];
  created_at: string;
  updated_at: string;
}

export interface WebsiteOrder {
  id: string;
  website_id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  shipping_address: any;
  billing_address?: any;
  items: any;
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  discount_amount: number;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  tracking_number?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface WebsiteAnalytics {
  id: string;
  website_id: string;
  date: string;
  page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  conversion_rate: number;
  revenue: number;
  top_pages?: any;
  traffic_sources?: any;
  device_types?: any;
  created_at: string;
}

export const useWebsiteManagement = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [websites, setWebsites] = useState<Website[]>([]);
  const [themes, setThemes] = useState<WebsiteTheme[]>([]);
  const [widgets, setWidgets] = useState<WebsiteWidget[]>([]);
  const [currentWebsite, setCurrentWebsite] = useState<Website | null>(null);

  useEffect(() => {
    if (user) {
      fetchWebsites();
      fetchThemes();
      fetchWidgets();
    }
  }, [user]);

  const fetchWebsites = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('websites')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWebsites(data || []);
      
      if (data && data.length > 0) {
        setCurrentWebsite(data[0]);
      }
    } catch (error: any) {
      console.error('Error fetching websites:', error);
      toast.error('Failed to fetch websites');
    } finally {
      setLoading(false);
    }
  };

  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('website_themes')
        .select('*')
        .order('downloads', { ascending: false });

      if (error) throw error;
      setThemes(data || []);
    } catch (error: any) {
      console.error('Error fetching themes:', error);
    }
  };

  const fetchWidgets = async () => {
    try {
      const { data, error } = await supabase
        .from('website_widgets')
        .select('*')
        .order('name');

      if (error) throw error;
      setWidgets(data || []);
    } catch (error: any) {
      console.error('Error fetching widgets:', error);
    }
  };

  const createWebsite = async (websiteData: Partial<Website>) => {
    try {
      setLoading(true);
      
      // Get seller ID from sellers table
      const { data: sellerData, error: sellerError } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user?.id)
        .single();

      if (sellerError) throw sellerError;

      const { data, error } = await supabase
        .from('websites')
        .insert({
          site_name: websiteData.site_name || '',
          subdomain: websiteData.subdomain || '',
          seller_id: sellerData.id,
          seo_title: websiteData.seo_title,
          seo_description: websiteData.seo_description,
          contact_email: websiteData.contact_email,
          contact_phone: websiteData.contact_phone,
          is_active: websiteData.is_active || false,
          ssl_enabled: websiteData.ssl_enabled || true
        })
        .select()
        .single();

      if (error) throw error;

      setWebsites(prev => [data, ...prev]);
      setCurrentWebsite(data);
      toast.success('Website created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating website:', error);
      toast.error('Failed to create website');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateWebsite = async (id: string, updates: Partial<Website>) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('websites')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setWebsites(prev => prev.map(website => 
        website.id === id ? data : website
      ));
      
      if (currentWebsite?.id === id) {
        setCurrentWebsite(data);
      }
      
      toast.success('Website updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating website:', error);
      toast.error('Failed to update website');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteWebsite = async (id: string) => {
    try {
      setLoading(true);
      const { error } = await supabase
        .from('websites')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setWebsites(prev => prev.filter(website => website.id !== id));
      
      if (currentWebsite?.id === id) {
        setCurrentWebsite(websites.find(w => w.id !== id) || null);
      }
      
      toast.success('Website deleted successfully');
    } catch (error: any) {
      console.error('Error deleting website:', error);
      toast.error('Failed to delete website');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const publishWebsite = async (id: string) => {
    try {
      await updateWebsite(id, { is_active: true });
      toast.success('Website published successfully');
    } catch (error) {
      toast.error('Failed to publish website');
    }
  };

  const unpublishWebsite = async (id: string) => {
    try {
      await updateWebsite(id, { is_active: false });
      toast.success('Website unpublished successfully');
    } catch (error) {
      toast.error('Failed to unpublish website');
    }
  };

  const applyTheme = async (websiteId: string, themeId: string) => {
    try {
      await updateWebsite(websiteId, { theme_id: themeId });
      
      // Update theme downloads manually since we can't use RPC yet
      const { data: themeData, error: fetchError } = await supabase
        .from('website_themes')
        .select('downloads')
        .eq('id', themeId)
        .single();

      if (!fetchError && themeData) {
        const { error: themeError } = await supabase
          .from('website_themes')
          .update({ downloads: (themeData.downloads || 0) + 1 })
          .eq('id', themeId);
        
        if (themeError) console.error('Error updating theme downloads:', themeError);
      }

      
      toast.success('Theme applied successfully');
    } catch (error) {
      toast.error('Failed to apply theme');
    }
  };

  const getWebsitePages = async (websiteId: string): Promise<WebsitePage[]> => {
    try {
      const { data, error } = await supabase
        .from('website_pages')
        .select('*')
        .eq('website_id', websiteId)
        .order('created_at');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching website pages:', error);
      return [];
    }
  };

  const getWebsiteOrders = async (websiteId: string): Promise<WebsiteOrder[]> => {
    try {
      const { data, error } = await supabase
        .from('website_orders')
        .select('*')
        .eq('website_id', websiteId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching website orders:', error);
      return [];
    }
  };

  const getWebsiteAnalytics = async (websiteId: string, days: number = 30): Promise<WebsiteAnalytics[]> => {
    try {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const { data, error } = await supabase
        .from('website_analytics')
        .select('*')
        .eq('website_id', websiteId)
        .gte('date', startDate.toISOString().split('T')[0])
        .order('date');

      if (error) throw error;
      return data || [];
    } catch (error: any) {
      console.error('Error fetching website analytics:', error);
      return [];
    }
  };

  return {
    websites,
    themes,
    widgets,
    currentWebsite,
    loading,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    publishWebsite,
    unpublishWebsite,
    applyTheme,
    getWebsitePages,
    getWebsiteOrders,
    getWebsiteAnalytics,
    setCurrentWebsite,
    refetch: fetchWebsites
  };
};