import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminData } from '@/hooks/useAdminData'
import { useToast } from '@/hooks/use-toast'
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'

export const AdminOrders = () => {
  const { orders, sellers, loading } = useAdminData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [filteredOrders, setFilteredOrders] = useState(orders)

  useEffect(() => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }, [orders, searchTerm, statusFilter])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'delivered':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Delivered</Badge>
      case 'shipped':
        return <Badge className="bg-blue-100 text-blue-800"><Truck className="h-3 w-3 mr-1" />Shipped</Badge>
      case 'processing':
        return <Badge className="bg-yellow-100 text-yellow-800"><Package className="h-3 w-3 mr-1" />Processing</Badge>
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Monitor and manage all platform orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Order Stats Cards */}
      <div className="grid gap-4 md:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.processing}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shipped</CardTitle>
            <Truck className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.shipped}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.delivered}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.cancelled}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>View and manage all platform orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by customer name, email, or tracking number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order Details</TableHead>
                <TableHead>Seller</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Order Status</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const seller = sellers.find(s => s.id === order.seller_id)
                return (
                  <TableRow key={order.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">#{order.id.slice(-8)}</div>
                        {order.tracking_number && (
                          <div className="text-sm text-muted-foreground">
                            Track: {order.tracking_number}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{seller?.company_name}</div>
                        <div className="text-sm text-muted-foreground">{seller?.full_name}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.customer_name}</div>
                        <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">₹{Number(order.total_amount).toLocaleString()}</div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(order.status)}
                    </TableCell>
                    <TableCell>
                      {getPaymentStatusBadge(order.payment_status)}
                    </TableCell>
                    <TableCell>
                      {new Date(order.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete order information and management options
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="space-y-4">
              <TabsList>
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="shipping">Shipping Info</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Order ID:</span>
                        <span>#{selectedOrder.id.slice(-8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Status:</span>
                        {getStatusBadge(selectedOrder.status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Payment:</span>
                        {getPaymentStatusBadge(selectedOrder.payment_status)}
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold">₹{Number(selectedOrder.total_amount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Order Date:</span>
                        <span>{new Date(selectedOrder.created_at).toLocaleDateString()}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Customer Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Name:</span>
                        <span>{selectedOrder.customer_name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Email:</span>
                        <span>{selectedOrder.customer_email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Phone:</span>
                        <span>{selectedOrder.customer_phone || 'N/A'}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Shipping Address</h4>
                        <div className="text-sm text-muted-foreground">
                          {selectedOrder.shipping_address && typeof selectedOrder.shipping_address === 'object' ? (
                            <div>
                              <p>{selectedOrder.shipping_address.street}</p>
                              <p>{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state}</p>
                              <p>{selectedOrder.shipping_address.zipCode}</p>
                            </div>
                          ) : (
                            <p>Address information not available</p>
                          )}
                        </div>
                      </div>
                      {selectedOrder.tracking_number && (
                        <div>
                          <h4 className="font-medium mb-2">Tracking Information</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">Tracking Number:</span>
                            <Badge variant="outline">{selectedOrder.tracking_number}</Badge>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">Order Placed</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(selectedOrder.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {selectedOrder.status !== 'pending' && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-yellow-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">Order Confirmed</p>
                            <p className="text-sm text-muted-foreground">Order processing started</p>
                          </div>
                        </div>
                      )}
                      {selectedOrder.status === 'shipped' || selectedOrder.status === 'delivered' ? (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-indigo-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">Order Shipped</p>
                            <p className="text-sm text-muted-foreground">Package dispatched</p>
                          </div>
                        </div>
                      ) : null}
                      {selectedOrder.status === 'delivered' && (
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <div>
                            <p className="font-medium">Order Delivered</p>
                            <p className="text-sm text-muted-foreground">Package delivered successfully</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}