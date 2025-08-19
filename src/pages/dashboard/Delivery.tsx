import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Truck, Package, MapPin, Clock, TrendingDown, AlertTriangle, Filter, Search } from 'lucide-react'

export default function Delivery() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const deliveryStats = [
    {
      title: 'In Transit',
      value: '156',
      change: '+8',
      icon: Truck,
      color: 'text-blue-600'
    },
    {
      title: 'Out for Delivery',
      value: '43',
      change: '+12',
      icon: Package,
      color: 'text-green-600'
    },
    {
      title: 'RTO Rate',
      value: '3.2%',
      change: '-0.8%',
      icon: TrendingDown,
      color: 'text-orange-600'
    },
    {
      title: 'Delivery Issues',
      value: '7',
      change: '-2',
      icon: AlertTriangle,
      color: 'text-red-600'
    }
  ]

  const shipments = [
    {
      id: 'SH001',
      orderId: 'ORD-2024-001',
      customer: 'Rahul Sharma',
      destination: 'Mumbai, Maharashtra',
      courier: 'BlueDart',
      status: 'in_transit',
      tracking: 'BD123456789',
      estimatedDelivery: '2024-01-25',
      weight: '0.5kg'
    },
    {
      id: 'SH002', 
      orderId: 'ORD-2024-002',
      customer: 'Priya Patel',
      destination: 'Delhi, Delhi',
      courier: 'Delhivery',
      status: 'out_for_delivery',
      tracking: 'DL987654321',
      estimatedDelivery: '2024-01-24',
      weight: '1.2kg'
    },
    {
      id: 'SH003',
      orderId: 'ORD-2024-003', 
      customer: 'Amit Kumar',
      destination: 'Bangalore, Karnataka',
      courier: 'Ekart',
      status: 'delivered',
      tracking: 'EK456789123',
      estimatedDelivery: '2024-01-23',
      weight: '2.0kg'
    },
    {
      id: 'SH004',
      orderId: 'ORD-2024-004',
      customer: 'Sneha Singh',
      destination: 'Chennai, Tamil Nadu',
      courier: 'XpressBees',
      status: 'rto',
      tracking: 'XB789123456',
      estimatedDelivery: '2024-01-22',
      weight: '0.8kg'
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      in_transit: { variant: 'secondary' as const, label: 'In Transit' },
      out_for_delivery: { variant: 'default' as const, label: 'Out for Delivery' },
      delivered: { variant: 'outline' as const, label: 'Delivered' },
      rto: { variant: 'destructive' as const, label: 'RTO' },
      cancelled: { variant: 'destructive' as const, label: 'Cancelled' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.in_transit
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredShipments = shipments.filter(shipment => {
    const matchesSearch = shipment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         shipment.tracking.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const courierPartners = [
    { name: 'BlueDart', rate: '₹45/kg', coverage: 'Pan India', rating: 4.2 },
    { name: 'Delhivery', rate: '₹38/kg', coverage: 'Pan India', rating: 4.0 },
    { name: 'Ekart', rate: '₹35/kg', coverage: 'Metro Cities', rating: 3.8 },
    { name: 'XpressBees', rate: '₹42/kg', coverage: 'Pan India', rating: 3.9 }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Delivery & RTO</h1>
          <p className="text-muted-foreground">Manage shipments and reduce return to origin</p>
        </div>
        <Button>
          <Package className="h-4 w-4 mr-2" />
          Ship New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {deliveryStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from yesterday
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="shipments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
          <TabsTrigger value="courier">Courier Partners</TabsTrigger>
          <TabsTrigger value="rto">RTO Management</TabsTrigger>
          <TabsTrigger value="analytics">Delivery Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="shipments">
          <Card>
            <CardHeader>
              <CardTitle>Shipment Tracking</CardTitle>
              <CardDescription>Track and manage all your shipments in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID, customer, or tracking number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="out_for_delivery">Out for Delivery</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="rto">RTO</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Shipment ID</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tracking</TableHead>
                      <TableHead>ETA</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredShipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">{shipment.id}</TableCell>
                        <TableCell>{shipment.orderId}</TableCell>
                        <TableCell>{shipment.customer}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                            {shipment.destination}
                          </div>
                        </TableCell>
                        <TableCell>{shipment.courier}</TableCell>
                        <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                        <TableCell className="font-mono text-sm">{shipment.tracking}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                            {new Date(shipment.estimatedDelivery).toLocaleDateString('en-IN')}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">Track</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="courier">
          <Card>
            <CardHeader>
              <CardTitle>Courier Partners</CardTitle>
              <CardDescription>Manage your delivery partners and rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {courierPartners.map((courier, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold">{courier.name}</h4>
                      <Badge variant="secondary">Rating: {courier.rating}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Rate: <span className="font-medium">{courier.rate}</span>
                    </p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Coverage: {courier.coverage}
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Configure</Button>
                      <Button variant="outline" size="sm">View Rates</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rto">
          <Card>
            <CardHeader>
              <CardTitle>RTO Management</CardTitle>
              <CardDescription>Reduce return-to-origin shipments and improve delivery success</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">3.2%</div>
                        <p className="text-sm text-muted-foreground">Current RTO Rate</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">₹12,450</div>
                        <p className="text-sm text-muted-foreground">Saved This Month</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">23</div>
                        <p className="text-sm text-muted-foreground">RTO Orders</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">RTO Reduction Strategies</h4>
                  <div className="grid gap-3">
                    <label className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <div>
                        <span className="font-medium">Pre-delivery Verification</span>
                        <p className="text-sm text-muted-foreground">Call customers before delivery attempt</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input type="checkbox" className="rounded" />
                      <div>
                        <span className="font-medium">SMS Delivery Updates</span>
                        <p className="text-sm text-muted-foreground">Send real-time delivery notifications</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 p-3 border rounded-lg">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <div>
                        <span className="font-medium">Address Verification</span>
                        <p className="text-sm text-muted-foreground">Verify delivery addresses before shipping</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Analytics</CardTitle>
              <CardDescription>Track delivery performance and identify improvement areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <TrendingDown className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Dashboard</h3>
                <p className="text-muted-foreground">
                  Detailed delivery analytics and performance metrics coming soon
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}