import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Order {
  id: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  shipping_address: any
  total_amount: number
  status: string
  payment_status: string
  tracking_number?: string
  courier_partner?: string
  created_at: string
  updated_at: string
  estimated_delivery?: string
  order_source: string
  priority: string
  delivery_instructions?: string
  is_duplicate: boolean
  duplicate_of?: string
  ndr_count: number
  last_ndr_date?: string
  delivery_attempts: number
  expected_delivery_date?: string
}

export interface NDR {
  id: string
  order_id: string
  ndr_reason: string
  customer_response?: string
  resolution_status: string
  created_at: string
  resolved_at?: string
  next_action?: string
  auto_resolution_attempted: boolean
}

export interface OrderNotification {
  id: string
  order_id: string
  notification_type: string
  message: string
  sent_via: string[]
  sent_at: string
  status: string
  customer_response?: string
}

export interface OrderTimeline {
  id: string
  order_id: string
  event_type: string
  event_description: string
  event_data?: any
  created_by?: string
  created_at: string
}

export interface ReturnPolicy {
  id: string
  policy_name: string
  return_window_days: number
  conditions: any
  auto_approve: boolean
  require_qc: boolean
  refund_percentage: number
  shipping_charges_refundable: boolean
  is_active: boolean
}

interface OrderFilters {
  status?: string
  payment_status?: string
  priority?: string
  order_source?: string
  date_from?: string
  date_to?: string
  search?: string
  show_duplicates?: boolean
  ndr_only?: boolean
}

export const useOrderManagement = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [ndrs, setNDRs] = useState<NDR[]>([])
  const [notifications, setNotifications] = useState<OrderNotification[]>([])
  const [timeline, setTimeline] = useState<OrderTimeline[]>([])
  const [returnPolicies, setReturnPolicies] = useState<ReturnPolicy[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<OrderFilters>({})
  const { toast } = useToast()

  // Fetch orders with filters
  const fetchOrders = async () => {
    try {
      setLoading(true)
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })

      // Apply filters
      if (filters.status) query = query.eq('status', filters.status)
      if (filters.payment_status) query = query.eq('payment_status', filters.payment_status)
      if (filters.priority) query = query.eq('priority', filters.priority)
      if (filters.order_source) query = query.eq('order_source', filters.order_source)
      if (filters.show_duplicates) query = query.eq('is_duplicate', true)
      if (filters.ndr_only) query = query.gt('ndr_count', 0)
      if (filters.search) {
        query = query.or(`customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%,tracking_number.ilike.%${filters.search}%`)
      }
      if (filters.date_from) query = query.gte('created_at', filters.date_from)
      if (filters.date_to) query = query.lte('created_at', filters.date_to)

      const { data, error } = await query

      if (error) throw error
      setOrders(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching orders",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch NDRs
  const fetchNDRs = async () => {
    try {
      const { data, error } = await supabase
        .from('ndrs')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setNDRs(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching NDRs",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Fetch notifications
  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('order_notifications')
        .select('*')
        .order('sent_at', { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching notifications",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Fetch timeline for specific order
  const fetchOrderTimeline = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_timeline')
        .select('*')
        .eq('order_id', orderId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setTimeline(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching order timeline",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Fetch return policies
  const fetchReturnPolicies = async () => {
    try {
      const { data, error } = await supabase
        .from('return_policies')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReturnPolicies(data || [])
    } catch (error: any) {
      toast({
        title: "Error fetching return policies",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Update order status
  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string, courierPartner?: string) => {
    try {
      const updateData: any = { status, updated_at: new Date().toISOString() }
      if (trackingNumber) updateData.tracking_number = trackingNumber
      if (courierPartner) updateData.courier_partner = courierPartner

      const { error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)

      if (error) throw error

      // Add timeline event
      await supabase.from('order_timeline').insert({
        order_id: orderId,
        event_type: 'status_update',
        event_description: `Order status updated to ${status}`,
        created_by: 'user'
      })

      toast({
        title: "Order updated",
        description: "Order status has been updated successfully"
      })

      fetchOrders()
    } catch (error: any) {
      toast({
        title: "Error updating order",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Process NDR resolution
  const resolveNDR = async (ndrId: string, resolution: string, customerResponse?: string) => {
    try {
      const { error } = await supabase
        .from('ndrs')
        .update({
          resolution_status: 'resolved',
          customer_response: customerResponse,
          resolved_at: new Date().toISOString(),
          next_action: resolution
        })
        .eq('id', ndrId)

      if (error) throw error

      toast({
        title: "NDR resolved",
        description: "NDR has been resolved successfully"
      })

      fetchNDRs()
    } catch (error: any) {
      toast({
        title: "Error resolving NDR",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Send delay notification
  const sendDelayNotification = async (orderId: string, message: string, channels: string[]) => {
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('seller_id')
        .eq('id', orderId)
        .single()

      if (!orderData) throw new Error('Order not found')

      const { error } = await supabase
        .from('order_notifications')
        .insert({
          order_id: orderId,
          seller_id: orderData.seller_id,
          notification_type: 'delay',
          message,
          sent_via: channels,
          status: 'sent'
        })

      if (error) throw error

      toast({
        title: "Notification sent",
        description: "Delay notification has been sent to customer"
      })

      fetchNotifications()
    } catch (error: any) {
      toast({
        title: "Error sending notification",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Process return request
  const processReturnRequest = async (orderId: string, reason: string, policyId: string) => {
    try {
      const { data: orderData } = await supabase
        .from('orders')
        .select('seller_id')
        .eq('id', orderId)
        .single()

      if (!orderData) throw new Error('Order not found')

      const { error } = await supabase
        .from('returns')
        .insert({
          order_id: orderId,
          seller_id: orderData.seller_id,
          reason,
          return_policy_id: policyId,
          status: 'requested',
          qc_status: 'pending'
        })

      if (error) throw error

      // Update order status
      await updateOrderStatus(orderId, 'return_requested')

      toast({
        title: "Return processed",
        description: "Return request has been processed"
      })
    } catch (error: any) {
      toast({
        title: "Error processing return",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Auto-resolve NDRs (smart communication)
  const autoResolveNDRs = async () => {
    try {
      const pendingNDRs = ndrs.filter(ndr => ndr.resolution_status === 'pending' && !ndr.auto_resolution_attempted)
      
      for (const ndr of pendingNDRs) {
        const autoResolution = getAutoResolutionAction(ndr.ndr_reason)
        if (autoResolution) {
          await supabase
            .from('ndrs')
            .update({
              auto_resolution_attempted: true,
              next_action: autoResolution
            })
            .eq('id', ndr.id)

          // Send automated communication based on NDR reason
          await sendAutomatedCommunication(ndr.order_id, ndr.ndr_reason)
        }
      }

      toast({
        title: "Auto-resolution completed",
        description: "NDRs have been processed automatically"
      })

      fetchNDRs()
    } catch (error: any) {
      toast({
        title: "Error in auto-resolution",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Helper function for auto-resolution logic
  const getAutoResolutionAction = (reason: string): string | null => {
    const resolutionMap: { [key: string]: string } = {
      'Customer not available': 'Schedule callback and retry delivery',
      'Address not found': 'Contact customer for address verification',
      'Customer refused delivery': 'Contact customer to understand concerns',
      'Incomplete address': 'Request complete address details',
      'Phone not reachable': 'Send SMS and email notifications',
      'Rescheduled by customer': 'Confirm new delivery slot'
    }
    return resolutionMap[reason] || null
  }

  // Send automated communication
  const sendAutomatedCommunication = async (orderId: string, ndrReason: string) => {
    const messageMap: { [key: string]: string } = {
      'Customer not available': 'We attempted delivery but you were not available. Please let us know your preferred delivery time.',
      'Address not found': 'We could not locate your delivery address. Please verify and update your address details.',
      'Customer refused delivery': 'We noticed you refused the delivery. Please contact us if you have any concerns.',
      'Incomplete address': 'Your delivery address appears incomplete. Please provide complete address details.',
      'Phone not reachable': 'We are unable to reach you on your registered phone number. Please check your phone.',
      'Rescheduled by customer': 'Thank you for rescheduling. We will deliver at your preferred time.'
    }

    const message = messageMap[ndrReason] || 'We have an update regarding your order delivery.'
    
    await sendDelayNotification(orderId, message, ['email', 'sms'])
  }

  // Bulk operations
  const bulkUpdateOrderStatus = async (orderIds: string[], status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .in('id', orderIds)

      if (error) throw error

      // Add timeline events for all orders
      const timelineEvents = orderIds.map(orderId => ({
        order_id: orderId,
        event_type: 'bulk_status_update',
        event_description: `Order status bulk updated to ${status}`,
        created_by: 'user'
      }))

      await supabase.from('order_timeline').insert(timelineEvents)

      toast({
        title: "Bulk update completed",
        description: `${orderIds.length} orders updated successfully`
      })

      fetchOrders()
    } catch (error: any) {
      toast({
        title: "Error in bulk update",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  // Export orders data
  const exportOrders = async (format: 'csv' | 'excel' = 'csv') => {
    try {
      const headers = [
        'Order ID', 'Customer Name', 'Email', 'Phone', 'Total Amount', 'Status', 
        'Payment Status', 'Order Source', 'Priority', 'Tracking Number', 'Courier Partner',
        'Created At', 'Expected Delivery', 'NDR Count', 'Is Duplicate'
      ]

      const csvData = orders.map(order => [
        order.id,
        order.customer_name,
        order.customer_email,
        order.customer_phone || '',
        order.total_amount,
        order.status,
        order.payment_status,
        order.order_source,
        order.priority,
        order.tracking_number || '',
        order.courier_partner || '',
        order.created_at,
        order.expected_delivery_date || '',
        order.ndr_count,
        order.is_duplicate
      ])

      const csvContent = [headers.join(','), ...csvData.map(row => row.join(','))].join('\n')
      
      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `orders-export-${new Date().toISOString().split('T')[0]}.${format}`
      link.click()
      URL.revokeObjectURL(url)

      toast({
        title: "Export completed",
        description: `Orders exported to ${format.toUpperCase()} successfully`
      })
    } catch (error: any) {
      toast({
        title: "Export failed",
        description: error.message,
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchNDRs()
    fetchNotifications()
    fetchReturnPolicies()
  }, [filters])

  return {
    // Data
    orders,
    ndrs,
    notifications,
    timeline,
    returnPolicies,
    loading,
    filters,

    // Actions
    setFilters,
    updateOrderStatus,
    resolveNDR,
    sendDelayNotification,
    processReturnRequest,
    autoResolveNDRs,
    bulkUpdateOrderStatus,
    exportOrders,
    fetchOrderTimeline,
    
    // Refetch functions
    refetch: fetchOrders,
    refetchNDRs: fetchNDRs,
    refetchNotifications: fetchNotifications
  }
}