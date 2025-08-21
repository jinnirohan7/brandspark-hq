import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface DashboardMetrics {
  totalRevenue: number
  totalOrders: number
  conversionRate: number
  averageOrderValue: number
  lowStockItems: number
  pendingOrders: number
  newReviews: number
  inTransitOrders: number
  revenueChange: number
  ordersChange: number
  conversionChange: number
  aovChange: number
}

export interface TimePeriod {
  value: string
  label: string
  days: number
}

export const timePeriods: TimePeriod[] = [
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '30d', label: 'Last 30 days', days: 30 },
  { value: '3m', label: 'Last 3 months', days: 90 },
  { value: '6m', label: 'Last 6 months', days: 180 },
  { value: '1y', label: 'Last 1 year', days: 365 },
]

export function useDashboardData(selectedPeriod: string = '30d', customStartDate?: Date, customEndDate?: Date) {
  const { user } = useAuth()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const period = timePeriods.find(p => p.value === selectedPeriod) || timePeriods[1]
  
  const getDateRange = () => {
    if (customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate }
    }
    
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - period.days)
    
    return { startDate, endDate }
  }

  const fetchDashboardData = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Get seller ID
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!seller) {
        throw new Error('Seller profile not found')
      }

      const { startDate, endDate } = getDateRange()
      const previousStartDate = new Date(startDate)
      previousStartDate.setDate(previousStartDate.getDate() - period.days)

      // Fetch current period data
      const [ordersResult, productsResult, reviewsResult] = await Promise.all([
        // Orders data
        supabase
          .from('orders')
          .select('*')
          .eq('seller_id', seller.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString()),
        
        // Products data for low stock
        supabase
          .from('products')
          .select('stock_quantity, low_stock_threshold')
          .eq('seller_id', seller.id)
          .eq('status', 'active'),
        
        // Reviews data
        supabase
          .from('reviews')
          .select('*')
          .eq('seller_id', seller.id)
          .gte('created_at', startDate.toISOString())
          .lte('created_at', endDate.toISOString())
      ])

      // Fetch previous period data for comparison
      const { data: previousOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('seller_id', seller.id)
        .gte('created_at', previousStartDate.toISOString())
        .lt('created_at', startDate.toISOString())

      if (ordersResult.error) throw ordersResult.error
      if (productsResult.error) throw productsResult.error
      if (reviewsResult.error) throw reviewsResult.error

      const orders = ordersResult.data || []
      const products = productsResult.data || []
      const reviews = reviewsResult.data || []

      // Calculate current metrics
      const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
      const totalOrders = orders.length
      const pendingOrders = orders.filter(order => order.status === 'pending').length
      const inTransitOrders = orders.filter(order => 
        order.status === 'shipped' || order.status === 'in_transit'
      ).length
      
      const lowStockItems = products.filter(product => 
        product.stock_quantity <= (product.low_stock_threshold || 10)
      ).length
      
      const newReviews = reviews.length
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const conversionRate = 0.034 // Mock data - would need traffic data

      // Calculate previous period metrics for comparison
      const previousRevenue = (previousOrders || []).reduce((sum, order) => sum + Number(order.total_amount), 0)
      const previousOrderCount = (previousOrders || []).length
      
      const revenueChange = previousRevenue > 0 ? ((totalRevenue - previousRevenue) / previousRevenue) * 100 : 0
      const ordersChange = previousOrderCount > 0 ? ((totalOrders - previousOrderCount) / previousOrderCount) * 100 : 0
      
      setMetrics({
        totalRevenue,
        totalOrders,
        conversionRate,
        averageOrderValue,
        lowStockItems,
        pendingOrders,
        newReviews,
        inTransitOrders,
        revenueChange,
        ordersChange,
        conversionChange: 2.1, // Mock data
        aovChange: 5.7 // Mock data
      })

    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [user, selectedPeriod, customStartDate, customEndDate])

  return { metrics, loading, error, refetch: fetchDashboardData }
}