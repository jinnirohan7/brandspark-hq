import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Filter, Download, Eye, Package, Truck, RefreshCw } from 'lucide-react'
import { useOrders, type Order } from '@/hooks/useOrders'
import { OrderDetailsDialog } from '@/components/OrderDetailsDialog'

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDialogOpen, setOrderDialogOpen] = useState(false)
  
  const { 
    orders, 
    loading, 
    error, 
    refetch, 
    updateOrderStatus, 
    updatePaymentStatus, 
    updateTrackingInfo 
  } = useOrders()

  const getStatusBadge = (status: string) => {
    const variants = {
      'processing': 'outline',
      'shipped': 'secondary',
      'delivered': 'default',
      'pending': 'destructive',
      'cancelled': 'destructive',
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  }

  const getPaymentBadge = (status: string) => {
    const variants = {
      'paid': 'default',
      'pending': 'destructive',
      'failed': 'destructive',
      'refunded': 'secondary',
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
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
      day: 'numeric'
    })
  }

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [orders, searchTerm, statusFilter])

  const orderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
    }
  }, [orders])

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setOrderDialogOpen(true)
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders & Fulfillment</h1>
          <Button onClick={refetch} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Failed to load orders. Please try again.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders & Fulfillment</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refetch} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Orders ({orderStats.total})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({orderStats.pending})</TabsTrigger>
          <TabsTrigger value="processing">Processing ({orderStats.processing})</TabsTrigger>
          <TabsTrigger value="shipped">Shipped ({orderStats.shipped})</TabsTrigger>
          <TabsTrigger value="delivered">Delivered ({orderStats.delivered})</TabsTrigger>
        </TabsList>

        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                Manage all your customer orders, track fulfillment, and handle returns
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-24" />
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  ))}
                </div>
              ) : filteredOrders.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No orders found</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Payment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredOrders.map((order) => (
                        <TableRow key={order.id} className="cursor-pointer hover:bg-muted/50">
                          <TableCell className="font-medium">
                            {order.id.slice(0, 8)}...
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(order.total_amount)}
                          </TableCell>
                          <TableCell>
                            {order.order_items?.length || 0} items
                          </TableCell>
                          <TableCell>{getStatusBadge(order.status)}</TableCell>
                          <TableCell>{getPaymentBadge(order.payment_status)}</TableCell>
                          <TableCell>{formatDate(order.created_at)}</TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleViewOrder(order)}
                                title="View Details"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'processing')}
                                disabled={order.status === 'processing'}
                                title="Process Order"
                              >
                                <Package className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, 'shipped')}
                                disabled={order.status === 'shipped' || order.status === 'delivered'}
                                title="Mark as Shipped"
                              >
                                <Truck className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status-specific tabs */}
        {['pending', 'processing', 'shipped', 'delivered'].map((status) => (
          <TabsContent key={status} value={status}>
            <Card>
              <CardHeader>
                <CardTitle>
                  {status.charAt(0).toUpperCase() + status.slice(1)} Orders
                </CardTitle>
                <CardDescription>
                  Orders with {status} status
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-24" />
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {orders
                        .filter(order => order.status === status)
                        .map((order) => (
                          <div 
                            key={order.id} 
                            className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer"
                            onClick={() => handleViewOrder(order)}
                          >
                            <div className="space-y-1">
                              <p className="font-medium">{order.customer_name}</p>
                              <p className="text-sm text-muted-foreground">
                                Order #{order.id.slice(0, 8)}... • {formatDate(order.created_at)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{formatCurrency(order.total_amount)}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.order_items?.length || 0} items
                              </p>
                            </div>
                          </div>
                        ))}
                      {orders.filter(order => order.status === status).length === 0 && (
                        <div className="text-center py-8">
                          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                          <p className="text-muted-foreground">No {status} orders found</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <OrderDetailsDialog
        order={selectedOrder}
        open={orderDialogOpen}
        onOpenChange={setOrderDialogOpen}
        onUpdateStatus={updateOrderStatus}
        onUpdatePaymentStatus={updatePaymentStatus}
        onUpdateTrackingInfo={updateTrackingInfo}
      />
    </div>
  )
}

export default Orders
