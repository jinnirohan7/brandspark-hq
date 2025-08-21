import { useState, useEffect, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'
import { 
  generateAnalyticsData, 
  generateTrafficSources, 
  generateTopProducts,
  generateRevenueByCategory,
  generateCustomerMetrics,
  generateInventoryAlerts
} from '@/lib/dummyData'

export interface AnalyticsData {
  salesData: any[]
  trafficSources: any[]
  topProducts: any[]
  revenueByCategory: any[]
  customerMetrics: any
  inventoryAlerts: any[]
}

export interface AnalyticsFilters {
  dateRange: string
  customStartDate?: Date
  customEndDate?: Date
  category?: string
  segment?: string
}

export const useAdvancedAnalytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: '30d',
  })
  const { toast } = useToast()

  // Generate analytics data
  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const analyticsData: AnalyticsData = {
          salesData: generateAnalyticsData(),
          trafficSources: generateTrafficSources(),
          topProducts: generateTopProducts(),
          revenueByCategory: generateRevenueByCategory(),
          customerMetrics: generateCustomerMetrics(),
          inventoryAlerts: generateInventoryAlerts(),
        }
        
        setData(analyticsData)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error loading analytics",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAnalyticsData()
  }, [filters, toast])

  // Filtered data based on date range
  const filteredData = useMemo(() => {
    if (!data) return null

    let filteredSalesData = data.salesData

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const monthsToShow = {
        '7d': 1,
        '30d': 3,
        '90d': 6,
        '1y': 12,
      }[filters.dateRange] || 12

      filteredSalesData = data.salesData.slice(-monthsToShow)
    }

    // Apply custom date range if specified
    if (filters.customStartDate && filters.customEndDate) {
      // For demo purposes, we'll just return the last few months
      filteredSalesData = data.salesData.slice(-6)
    }

    return {
      ...data,
      salesData: filteredSalesData,
    }
  }, [data, filters])

  // Key metrics calculations
  const keyMetrics = useMemo(() => {
    if (!filteredData) return null

    const currentPeriodData = filteredData.salesData
    const totalRevenue = currentPeriodData.reduce((sum, item) => sum + item.sales, 0)
    const totalOrders = currentPeriodData.reduce((sum, item) => sum + item.orders, 0)
    const totalVisitors = currentPeriodData.reduce((sum, item) => sum + item.visitors, 0)
    const totalPageViews = currentPeriodData.reduce((sum, item) => sum + item.pageViews, 0)
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const conversionRate = totalVisitors > 0 ? (totalOrders / totalVisitors) * 100 : 0

    // Calculate growth (mock previous period data)
    const previousPeriodRevenue = totalRevenue * 0.87 // Simulate 13% growth
    const previousPeriodOrders = totalOrders * 0.92 // Simulate 8% growth
    const previousPeriodVisitors = totalVisitors * 0.95 // Simulate 5% growth

    const revenueGrowth = ((totalRevenue - previousPeriodRevenue) / previousPeriodRevenue) * 100
    const orderGrowth = ((totalOrders - previousPeriodOrders) / previousPeriodOrders) * 100
    const visitorGrowth = ((totalVisitors - previousPeriodVisitors) / previousPeriodVisitors) * 100

    return {
      totalRevenue,
      totalOrders,
      totalVisitors,
      totalPageViews,
      averageOrderValue,
      conversionRate,
      revenueGrowth,
      orderGrowth,
      visitorGrowth,
    }
  }, [filteredData])

  const exportReport = async (reportType: string, format: 'csv' | 'pdf' = 'csv') => {
    try {
      if (!filteredData) return

      let csvContent = ''
      const timestamp = new Date().toISOString().split('T')[0]

      switch (reportType) {
        case 'sales':
          csvContent = [
            'Month,Revenue,Orders,Visitors,Conversion Rate',
            ...filteredData.salesData.map(item => 
              `${item.month},${item.sales},${item.orders},${item.visitors},${item.conversion}%`
            )
          ].join('\n')
          break

        case 'products':
          csvContent = [
            'Product Name,SKU,Sales,Revenue,Growth,Views,Conversion Rate',
            ...filteredData.topProducts.map(product => 
              `"${product.name}",${product.sku},${product.sales},${product.revenue},${product.growth},${product.views},${product.conversionRate}%`
            )
          ].join('\n')
          break

        case 'traffic':
          csvContent = [
            'Source,Percentage',
            ...filteredData.trafficSources.map(source => 
              `"${source.name}",${source.value}%`
            )
          ].join('\n')
          break

        default:
          csvContent = 'Report type not supported'
      }

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `${reportType}-report-${timestamp}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Report exported",
        description: `${reportType} report exported successfully`,
      })
    } catch (err: any) {
      toast({
        title: "Export failed",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const refetch = async () => {
    setLoading(true)
    setData(null)
    
    // Regenerate data
    setTimeout(() => {
      const analyticsData: AnalyticsData = {
        salesData: generateAnalyticsData(),
        trafficSources: generateTrafficSources(),
        topProducts: generateTopProducts(),
        revenueByCategory: generateRevenueByCategory(),
        customerMetrics: generateCustomerMetrics(),
        inventoryAlerts: generateInventoryAlerts(),
      }
      setData(analyticsData)
      setLoading(false)
    }, 800)
  }

  return {
    data: filteredData,
    loading,
    error,
    filters,
    setFilters,
    keyMetrics,
    exportReport,
    refetch,
  }
}