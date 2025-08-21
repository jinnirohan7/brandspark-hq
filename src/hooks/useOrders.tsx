import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  total_amount: number
  status: string
  payment_status: string
  tracking_number?: string
  courier_partner?: string
  shipping_address: any
  estimated_delivery?: string
  created_at: string
  updated_at: string
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  unit_price: number
  total_price: number
  product?: {
    name: string
    sku: string
    image_url?: string
  }
}

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            *,
            products (
              name,
              sku,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (ordersError) throw ordersError

      setOrders(ordersData || [])
    } catch (err: any) {
      setError(err.message)
      toast({
        title: "Error fetching orders",
        description: err.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error

      // Update local state
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
      const { error } = await supabase
        .from('orders')
        .update({ payment_status: paymentStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)

      if (error) throw error

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
      const { error } = await supabase
        .from('orders')
        .update({ 
          tracking_number: trackingNumber, 
          courier_partner: courierPartner,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)

      if (error) throw error

      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, tracking_number: trackingNumber, courier_partner: courierPartner, updated_at: new Date().toISOString() }
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

  useEffect(() => {
    fetchOrders()
  }, [])

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    updatePaymentStatus,
    updateTrackingInfo
  }
}