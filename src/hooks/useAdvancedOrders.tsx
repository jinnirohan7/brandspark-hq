import { useState, useEffect, useMemo } from 'react'
import { useToast } from '@/hooks/use-toast'
import { Order } from '@/hooks/useOrders'
import { generateDummyOrders } from '@/lib/dummyData'

export interface OrderFilters {
  search: string
  status: string
  paymentStatus: string
  dateRange: {
    from: Date | null
    to: Date | null
  }
  amountRange: {
    min: number | null
    max: number | null
  }
  courierPartner: string
}

export interface OrderStats {
  totalOrders: number
  totalRevenue: number
  pendingOrders: number
  shippedOrders: number
  averageOrderValue: number
  conversionRate: number
}

export const useAdvancedOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrderFilters>({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    dateRange: { from: null, to: null },
    amountRange: { min: null, max: null },
    courierPartner: 'all',
  })
  const { toast } = useToast()

  // Generate dummy data on mount
  useEffect(() => {
    const loadDummyData = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 800))
        
        const dummyOrders = generateDummyOrders(150)
        setOrders(dummyOrders)
      } catch (err: any) {
        setError(err.message)
        toast({
          title: "Error loading orders",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDummyData()
  }, [toast])

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesSearch = 
          order.customer_name.toLowerCase().includes(searchLower) ||
          order.id.toLowerCase().includes(searchLower) ||
          order.customer_email.toLowerCase().includes(searchLower) ||
          (order.tracking_number && order.tracking_number.toLowerCase().includes(searchLower))
        
        if (!matchesSearch) return false
      }

      // Status filter
      if (filters.status !== 'all' && order.status !== filters.status) {
        return false
      }

      // Payment status filter
      if (filters.paymentStatus !== 'all' && order.payment_status !== filters.paymentStatus) {
        return false
      }

      // Date range filter
      if (filters.dateRange.from || filters.dateRange.to) {
        const orderDate = new Date(order.created_at)
        if (filters.dateRange.from && orderDate < filters.dateRange.from) return false
        if (filters.dateRange.to && orderDate > filters.dateRange.to) return false
      }

      // Amount range filter
      if (filters.amountRange.min !== null && order.total_amount < filters.amountRange.min) {
        return false
      }
      if (filters.amountRange.max !== null && order.total_amount > filters.amountRange.max) {
        return false
      }

      // Courier partner filter
      if (filters.courierPartner !== 'all' && order.courier_partner !== filters.courierPartner) {
        return false
      }

      return true
    })
  }, [orders, filters])

  // Order statistics
  const orderStats = useMemo((): OrderStats => {
    const totalOrders = filteredOrders.length
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.total_amount, 0)
    const pendingOrders = filteredOrders.filter(order => order.status === 'pending').length
    const shippedOrders = filteredOrders.filter(order => order.status === 'shipped').length
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    
    // Calculate conversion rate (mock calculation)
    const conversionRate = 3.2 // This would normally come from analytics

    return {
      totalOrders,
      totalRevenue,
      pendingOrders,
      shippedOrders,
      averageOrderValue,
      conversionRate,
    }
  }, [filteredOrders])

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, updated_at: new Date().toISOString() }
          : order
      ))

      toast({
        title: "Order updated",
        description: `Order status updated to ${status}`,
      })
    } catch (err: any) {
      toast({
        title: "Error updating order",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updatePaymentStatus = async (orderId: string, paymentStatus: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, payment_status: paymentStatus, updated_at: new Date().toISOString() }
          : order
      ))

      toast({
        title: "Payment status updated",
        description: `Payment status updated to ${paymentStatus}`,
      })
    } catch (err: any) {
      toast({
        title: "Error updating payment status",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const updateTrackingInfo = async (orderId: string, trackingNumber: string, courierPartner: string) => {
    try {
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              tracking_number: trackingNumber, 
              courier_partner: courierPartner,
              status: trackingNumber ? 'shipped' : order.status,
              updated_at: new Date().toISOString() 
            }
          : order
      ))

      toast({
        title: "Tracking info updated",
        description: "Order tracking information has been updated",
      })
    } catch (err: any) {
      toast({
        title: "Error updating tracking info",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const bulkUpdateStatus = async (orderIds: string[], status: string) => {
    try {
      setOrders(prev => prev.map(order => 
        orderIds.includes(order.id)
          ? { ...order, status, updated_at: new Date().toISOString() }
          : order
      ))

      toast({
        title: "Bulk update completed",
        description: `Updated ${orderIds.length} orders to ${status}`,
      })
    } catch (err: any) {
      toast({
        title: "Error in bulk update",
        description: err.message,
        variant: "destructive",
      })
    }
  }

  const exportOrders = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      // Create CSV content
      const headers = ['Order ID', 'Customer Name', 'Email', 'Phone', 'Total Amount', 'Status', 'Payment Status', 'Created Date', 'Shipping Address']
      const csvContent = [
        headers.join(','),
        ...filteredOrders.map(order => [
          order.id,
          `"${order.customer_name}"`,
          order.customer_email,
          order.customer_phone || '',
          order.total_amount,
          order.status,
          order.payment_status,
          new Date(order.created_at).toLocaleDateString(),
          `"${order.shipping_address.street}, ${order.shipping_address.city}, ${order.shipping_address.state} ${order.shipping_address.pincode}"`,
        ].join(','))
      ].join('\n')

      // Download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `orders-export-${new Date().toISOString().split('T')[0]}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: "Export completed",
        description: `Orders exported successfully as ${format.toUpperCase()}`,
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
    const dummyOrders = generateDummyOrders(150)
    setOrders(dummyOrders)
    setLoading(false)
  }

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    filters,
    setFilters,
    orderStats,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingInfo,
    bulkUpdateStatus,
    exportOrders,
    refetch,
  }
}