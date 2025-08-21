import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Package, MapPin, CreditCard, Clock, Edit } from 'lucide-react'
import type { Order } from '@/hooks/useOrders'

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdateStatus: (orderId: string, status: string) => void
  onUpdatePaymentStatus: (orderId: string, paymentStatus: string) => void
  onUpdateTrackingInfo: (orderId: string, trackingNumber: string, courierPartner: string) => void
}

export const OrderDetailsDialog = ({
  order,
  open,
  onOpenChange,
  onUpdateStatus,
  onUpdatePaymentStatus,
  onUpdateTrackingInfo
}: OrderDetailsDialogProps) => {
  const [editingTracking, setEditingTracking] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [courierPartner, setCourierPartner] = useState('')

  if (!order) return null

  const getStatusBadge = (status: string) => {
    const variants = {
      'pending': 'destructive',
      'processing': 'outline',
      'shipped': 'secondary',
      'delivered': 'default',
      'cancelled': 'destructive',
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>
  }

  const getPaymentBadge = (status: string) => {
    const variants = {
      'pending': 'destructive',
      'paid': 'default',
      'failed': 'destructive',
      'refunded': 'secondary',
    } as const
    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>
  }

  const handleTrackingUpdate = () => {
    if (trackingNumber && courierPartner) {
      onUpdateTrackingInfo(order.id, trackingNumber, courierPartner)
      setEditingTracking(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order Details</span>
            <div className="flex gap-2">
              {getStatusBadge(order.status)}
              {getPaymentBadge(order.payment_status)}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                <p className="font-medium">{order.customer_name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                <p>{order.customer_email}</p>
              </div>
              {order.customer_phone && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                  <p>{order.customer_phone}</p>
                </div>
              )}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Order Date</Label>
                <p>{formatDate(order.created_at)}</p>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.shipping_address && (
                <div className="space-y-1">
                  <p>{order.shipping_address.street}</p>
                  <p>{order.shipping_address.city}, {order.shipping_address.state}</p>
                  <p>{order.shipping_address.postal_code}</p>
                  <p>{order.shipping_address.country}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Order Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Edit className="h-5 w-5" />
                Order Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="order-status">Order Status</Label>
                <Select value={order.status} onValueChange={(value) => onUpdateStatus(order.id, value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="payment-status">Payment Status</Label>
                <Select value={order.payment_status} onValueChange={(value) => onUpdatePaymentStatus(order.id, value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Tracking Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tracking Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!editingTracking ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
                    <p>{order.tracking_number || 'Not assigned'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Courier Partner</Label>
                    <p>{order.courier_partner || 'Not assigned'}</p>
                  </div>
                  {order.estimated_delivery && (
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Estimated Delivery</Label>
                      <p>{new Date(order.estimated_delivery).toLocaleDateString()}</p>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setEditingTracking(true)
                      setTrackingNumber(order.tracking_number || '')
                      setCourierPartner(order.courier_partner || '')
                    }}
                  >
                    Edit Tracking Info
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="tracking-number">Tracking Number</Label>
                    <Input
                      id="tracking-number"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Enter tracking number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="courier-partner">Courier Partner</Label>
                    <Input
                      id="courier-partner"
                      value={courierPartner}
                      onChange={(e) => setCourierPartner(e.target.value)}
                      placeholder="Enter courier partner"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleTrackingUpdate}>
                      Update
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setEditingTracking(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Order Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    {item.product?.image_url && (
                      <img 
                        src={item.product.image_url} 
                        alt={item.product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{item.product?.name}</p>
                      <p className="text-sm text-muted-foreground">SKU: {item.product?.sku}</p>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{formatCurrency(item.total_price)}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(item.unit_price)} each
                    </p>
                  </div>
                </div>
              ))}
              
              <Separator />
              
              <div className="flex justify-between items-center font-semibold text-lg">
                <span>Total Amount:</span>
                <span>{formatCurrency(order.total_amount)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}