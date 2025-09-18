import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAdmin } from '@/contexts/AdminContext'

export interface AdminSellerData {
  id: string
  user_id: string
  email: string
  full_name: string
  company_name: string
  phone: string | null
  address: string | null
  business_type: string | null
  subscription_plan: string
  account_status: string
  created_at: string
  updated_at: string
  kyc_verified: boolean
  verification_score: number
  last_login: string | null
  total_orders: number
  total_revenue: number
  active_orders: number
  website_count: number
}

export interface AdminOrderData {
  id: string
  seller_id: string
  customer_name: string
  customer_email: string
  total_amount: number
  status: string
  payment_status: string
  tracking_number: string | null
  courier_partner: string | null
  created_at: string
  seller: {
    company_name: string
    email: string
  }
}

export interface AdminPayoutData {
  id: string
  seller_id: string
  amount: number
  currency: string
  payout_date: string
  status: string
  transaction_reference: string | null
  seller: {
    company_name: string
    email: string
  }
}

export interface AdminSettings {
  id: string
  category: string
  setting_key: string
  setting_value: any
  description: string | null
  is_active: boolean
}

export interface CourierPartner {
  id: string
  name: string
  performance_metrics: any
  is_active: boolean
  supported_regions: any
  created_at: string
}

export const useAdminData = () => {
  const { isAdmin, logAdminAction } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [sellers, setSellers] = useState<AdminSellerData[]>([])
  const [orders, setOrders] = useState<AdminOrderData[]>([])
  const [payouts, setPayouts] = useState<AdminPayoutData[]>([])
  const [settings, setSettings] = useState<AdminSettings[]>([])
  const [courierPartners, setCourierPartners] = useState<CourierPartner[]>([])

  // Fetch all sellers with their metrics
  const fetchSellers = async () => {
    if (!isAdmin) return

    try {
      setLoading(true)
      
      // Get basic seller data
      const { data: sellersData, error: sellersError } = await supabase
        .from('sellers')
        .select('*')
        .order('created_at', { ascending: false })

      if (sellersError) throw sellersError

      // Get aggregated metrics for each seller
      const sellersWithMetrics = await Promise.all(
        sellersData.map(async (seller) => {
          // Get order counts and revenue
          const { data: orderMetrics } = await supabase
            .from('orders')
            .select('total_amount, status')
            .eq('seller_id', seller.id)

          const totalOrders = orderMetrics?.length || 0
          const totalRevenue = orderMetrics?.reduce((sum, order) => sum + parseFloat(order.total_amount.toString()), 0) || 0
          const activeOrders = orderMetrics?.filter(order => ['pending', 'processing', 'shipped'].includes(order.status)).length || 0

          // Get website count
          const { data: websites } = await supabase
            .from('websites')
            .select('id')
            .eq('seller_id', seller.id)

          const websiteCount = websites?.length || 0

          return {
            ...seller,
            total_orders: totalOrders,
            total_revenue: totalRevenue,
            active_orders: activeOrders,
            website_count: websiteCount,
          }
        })
      )

      setSellers(sellersWithMetrics)
      await logAdminAction('view_sellers')
    } catch (error) {
      console.error('Error fetching sellers:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all orders with seller information
  const fetchOrders = async () => {
    if (!isAdmin) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          seller:sellers(company_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(1000)

      if (error) throw error

      setOrders(data || [])
      await logAdminAction('view_orders')
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch all payouts
  const fetchPayouts = async () => {
    if (!isAdmin) return

    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('seller_payouts')
        .select(`
          *,
          seller:sellers(company_name, email)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPayouts(data || [])
      await logAdminAction('view_payouts')
    } catch (error) {
      console.error('Error fetching payouts:', error)
    } finally {
      setLoading(false)
    }
  }

  // Fetch admin settings
  const fetchSettings = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .select('*')
        .order('category', { ascending: true })

      if (error) throw error

      setSettings(data || [])
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  // Fetch courier partners
  const fetchCourierPartners = async () => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('courier_partners')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error

      setCourierPartners(data || [])
    } catch (error) {
      console.error('Error fetching courier partners:', error)
    }
  }

  // Create a new seller
  const createSeller = async (sellerData: {
    email: string
    full_name: string
    company_name: string
    phone?: string
    business_type?: string
  }) => {
    if (!isAdmin) return

    try {
      // First create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: sellerData.email,
        password: Math.random().toString(36).slice(-8) + 'A1!', // Temporary password
        email_confirm: true,
      })

      if (authError) throw authError

      // Create seller profile
      const { data, error } = await supabase
        .from('sellers')
        .insert({
          user_id: authData.user.id,
          email: sellerData.email,
          full_name: sellerData.full_name,
          company_name: sellerData.company_name,
          phone: sellerData.phone,
          business_type: sellerData.business_type,
          account_status: 'active',
        })
        .select()
        .single()

      if (error) throw error

      await logAdminAction('create_seller', 'seller', data.id, sellerData)
      await fetchSellers() // Refresh list
      return { data, error: null }
    } catch (error) {
      console.error('Error creating seller:', error)
      return { data: null, error }
    }
  }

  // Update seller status
  const updateSellerStatus = async (sellerId: string, status: string) => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('sellers')
        .update({ account_status: status })
        .eq('id', sellerId)
        .select()
        .single()

      if (error) throw error

      await logAdminAction('update_seller_status', 'seller', sellerId, { status })
      await fetchSellers()
      return { data, error: null }
    } catch (error) {
      console.error('Error updating seller status:', error)
      return { data: null, error }
    }
  }

  // Process payout
  const processPayout = async (payoutId: string, status: 'completed' | 'failed', transactionRef?: string) => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('seller_payouts')
        .update({
          status,
          transaction_reference: transactionRef,
          processed_at: new Date().toISOString(),
        })
        .eq('id', payoutId)
        .select()
        .single()

      if (error) throw error

      await logAdminAction('process_payout', 'payout', payoutId, { status, transactionRef })
      await fetchPayouts()
      return { data, error: null }
    } catch (error) {
      console.error('Error processing payout:', error)
      return { data: null, error }
    }
  }

  // Update setting
  const updateSetting = async (settingId: string, value: any) => {
    if (!isAdmin) return

    try {
      const { data, error } = await supabase
        .from('admin_settings')
        .update({ setting_value: value })
        .eq('id', settingId)
        .select()
        .single()

      if (error) throw error

      await logAdminAction('update_setting', 'setting', settingId, { value })
      await fetchSettings()
      return { data, error: null }
    } catch (error) {
      console.error('Error updating setting:', error)
      return { data: null, error }
    }
  }

  return {
    loading,
    sellers,
    orders,
    payouts,
    settings,
    courierPartners,
    fetchSellers,
    fetchOrders,
    fetchPayouts,
    fetchSettings,
    fetchCourierPartners,
    createSeller,
    updateSellerStatus,
    processPayout,
    updateSetting,
  }
}