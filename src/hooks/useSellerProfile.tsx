import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'

interface SellerProfile {
  id: string
  user_id: string
  email: string
  full_name: string
  company_name: string
  phone?: string
  address?: string
  gst_number?: string
  pan_number?: string
  bank_account?: string
  profile_image_url?: string
  business_type?: string
  establishment_date?: string
  website_url?: string
  business_category?: string
  annual_turnover?: number
  employee_count?: number
  ifsc_code?: string
  upi_id?: string
  tax_id?: string
  vat_number?: string
  country: string
  state?: string
  city?: string
  pincode?: string
  fssai_license?: string
  shop_establishment_license?: string
  brand_certificate_url?: string
  account_status: string
  verification_score: number
  compliance_status: string
  subscription_plan: string
  kyc_verified: boolean
  two_factor_enabled: boolean
  preferred_language: string
  preferred_currency: string
  last_login?: string
  created_at: string
  updated_at: string
}

interface Document {
  id: string
  seller_id: string
  document_type: string
  document_name: string
  file_path: string
  verification_status: string
  uploaded_at: string
  expires_at?: string
  document_number?: string
}

interface SubscriptionPlan {
  id: string
  name: string
  price: number
  currency: string
  billing_cycle: string
  features: string[]
  max_products: number
  max_orders: number
  commission_rate: number
  storage_limit_gb: number
  support_level: string
}

export const useSellerProfile = () => {
  const [profile, setProfile] = useState<SellerProfile | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  const fetchProfile = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('sellers')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive"
      })
    }
  }

  const fetchDocuments = async () => {
    if (!user) return

    try {
      const { data: sellerData } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!sellerData) return

      const { data, error } = await supabase
        .from('seller_documents')
        .select('*')
        .eq('seller_id', sellerData.id)
        .order('uploaded_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error('Error fetching documents:', error)
    }
  }

  const fetchSubscriptionPlan = async () => {
    if (!profile) return

    try {
      // Get current subscription
      const { data: subscription } = await supabase
        .from('seller_subscriptions')
        .select(`
          *,
          subscription_plans (*)
        `)
        .eq('seller_id', profile.id)
        .eq('status', 'active')
        .single()

      if (subscription?.subscription_plans) {
        const plan = subscription.subscription_plans as any
        setSubscriptionPlan({
          ...plan,
          features: Array.isArray(plan.features) ? plan.features : JSON.parse(String(plan.features) || '[]')
        })
      } else {
        // Get free plan as fallback
        const { data: freePlan } = await supabase
          .from('subscription_plans')
          .select('*')
          .eq('name', 'Free')
          .single()

        if (freePlan) {
          setSubscriptionPlan({
            ...freePlan,
            features: Array.isArray(freePlan.features) ? freePlan.features : JSON.parse(String(freePlan.features) || '[]')
          })
        }
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
    }
  }

  const updateProfile = async (updates: Partial<SellerProfile>) => {
    if (!user || !profile) return

    try {
      const { data, error } = await supabase
        .from('sellers')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      })

      return { success: true }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      })
      return { success: false, error }
    }
  }

  const refreshDocuments = () => {
    fetchDocuments()
  }

  useEffect(() => {
    if (user) {
      Promise.all([
        fetchProfile(),
        fetchDocuments()
      ]).finally(() => setLoading(false))
    }
  }, [user])

  useEffect(() => {
    if (profile) {
      fetchSubscriptionPlan()
    }
  }, [profile])

  return {
    profile,
    documents,
    subscriptionPlan,
    loading,
    updateProfile,
    refreshDocuments,
    refreshProfile: fetchProfile
  }
}