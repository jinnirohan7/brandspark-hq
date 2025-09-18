import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useAdminData } from '@/hooks/useAdminData'
import { 
  Truck, 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Search,
  Plus,
  Edit,
  Eye
} from 'lucide-react'

interface CourierPartner {
  id: string
  name: string
  supported_regions: string[]
  performance_metrics: {
    delivery_success_rate: number
    average_delivery_time: number
    on_time_percentage: number
  }
  pricing_config: {
    base_rate: number
    per_km_rate: number
    weight_multiplier: number
  }
  is_active: boolean
  api_endpoint?: string
}

const mockCourierPartners: CourierPartner[] = [
  {
    id: '1',
    name: 'BlueData Express',
    supported_regions: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai'],
    performance_metrics: {
      delivery_success_rate: 98.5,
      average_delivery_time: 2.3,
      on_time_percentage: 95.2
    },
    pricing_config: {
      base_rate: 40,
      per_km_rate: 2.5,
      weight_multiplier: 1.2
    },
    is_active: true,
    api_endpoint: 'https://api.bluedart.com'
  },
  {
    id: '2',
    name: 'Delhivery',
    supported_regions: ['Delhi', 'Mumbai', 'Pune', 'Hyderabad'],
    performance_metrics: {
      delivery_success_rate: 97.8,
      average_delivery_time: 2.8,
      on_time_percentage: 92.1
    },
    pricing_config: {
      base_rate: 35,
      per_km_rate: 2.2,
      weight_multiplier: 1.1
    },
    is_active: true,
    api_endpoint: 'https://api.delhivery.com'
  }
]

export const AdminDelivery = () => {
  const { orders, loading } = useAdminData()
  const [courierPartners, setCourierPartners] = useState<CourierPartner[]>(mockCourierPartners)
  const [selectedPartner, setSelectedPartner] = useState<CourierPartner | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const deliveryStats = {
    totalDeliveries: orders.filter(o => o.status === 'delivered').length,
    inTransit: orders.filter(o => o.status === 'shipped').length,
    pending: orders.filter(o => o.status === 'pending' || o.status === 'processing').length,
    averageDeliveryTime: 2.5,
    onTimePercentage: 94.2
  }

  const recentDeliveries = orders
    .filter(o => o.status === 'delivered' || o.status === 'shipped')
    .slice(0, 10)

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
          <h1 className="text-3xl font-bold">Delivery Management</h1>
          <p className="text-muted-foreground">Manage delivery partners and track shipments</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Partner
          </Button>
        </div>
      </div>

      {/* Delivery Stats */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deliveries</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.totalDeliveries}</div>
            <p className="text-xs text-muted-foreground">Completed deliveries</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.inTransit}</div>
            <p className="text-xs text-muted-foreground">Currently shipping</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Package className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting shipment</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Delivery Time</CardTitle>
            <Clock className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.averageDeliveryTime} days</div>
            <p className="text-xs text-muted-foreground">Average delivery time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deliveryStats.onTimePercentage}%</div>
            <p className="text-xs text-muted-foreground">On-time delivery rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="partners" className="space-y-4">
        <TabsList>
          <TabsTrigger value="partners">Courier Partners</TabsTrigger>
          <TabsTrigger value="shipments">Active Shipments</TabsTrigger>
          <TabsTrigger value="analytics">Delivery Analytics</TabsTrigger>
          <TabsTrigger value="zones">Delivery Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="partners" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Courier Partners</CardTitle>
              <CardDescription>Manage your delivery partners and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="Search courier partners..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-md"
                />
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner Name</TableHead>
                    <TableHead>Coverage Areas</TableHead>
                    <TableHead>Success Rate</TableHead>
                    <TableHead>Avg Delivery Time</TableHead>
                    <TableHead>On-Time Rate</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {courierPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div className="font-medium">{partner.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {partner.supported_regions.slice(0, 2).map((region) => (
                            <Badge key={region} variant="outline" className="text-xs">
                              {region}
                            </Badge>
                          ))}
                          {partner.supported_regions.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{partner.supported_regions.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          {partner.performance_metrics.delivery_success_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {partner.performance_metrics.average_delivery_time} days
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          {partner.performance_metrics.on_time_percentage}%
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={partner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {partner.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedPartner(partner)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>
                          <Button size="sm" variant="outline">
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Shipments</CardTitle>
              <CardDescription>Track ongoing deliveries and shipments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Courier Partner</TableHead>
                    <TableHead>Tracking Number</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentDeliveries.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">#{order.id.slice(-8)}</div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{order.customer_email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm">
                            Delivery Location
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.courier_partner || 'Not assigned'}
                      </TableCell>
                      <TableCell>
                        {order.tracking_number ? (
                          <Badge variant="outline">{order.tracking_number}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          order.status === 'delivered' ? "bg-green-100 text-green-800" :
                          order.status === 'shipped' ? "bg-blue-100 text-blue-800" :
                          "bg-yellow-100 text-yellow-800"
                        }>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Delivery Time</span>
                  <span className="font-bold">2.5 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Success Rate</span>
                  <span className="font-bold text-green-600">98.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">On-Time Delivery</span>
                  <span className="font-bold text-blue-600">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Customer Satisfaction</span>
                  <span className="font-bold">4.7/5</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Regional Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Delhi NCR</span>
                  <Badge className="bg-green-100 text-green-800">98.5%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Mumbai</span>
                  <Badge className="bg-green-100 text-green-800">97.8%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Bangalore</span>
                  <Badge className="bg-green-100 text-green-800">96.2%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Chennai</span>
                  <Badge className="bg-yellow-100 text-yellow-800">92.1%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="zones" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Zones</CardTitle>
              <CardDescription>Manage delivery zones and coverage areas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Metro Cities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Delhi NCR</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Mumbai</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Bangalore</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tier 2 Cities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Pune</span>
                        <Badge className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Ahmedabad</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Jaipur</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Limited</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Rural Areas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">North India</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Expanding</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">South India</span>
                        <Badge className="bg-yellow-100 text-yellow-800">Expanding</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">East India</span>
                        <Badge className="bg-red-100 text-red-800">Limited</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Partner Details Dialog */}
      <Dialog open={!!selectedPartner} onOpenChange={() => setSelectedPartner(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Courier Partner Details</DialogTitle>
            <DialogDescription>
              Complete information about {selectedPartner?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedPartner && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Delivery Success Rate:</span>
                      <Badge className="bg-green-100 text-green-800">
                        {selectedPartner.performance_metrics.delivery_success_rate}%
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Average Delivery Time:</span>
                      <span className="font-medium">{selectedPartner.performance_metrics.average_delivery_time} days</span>
                    </div>
                    <div className="flex justify-between">
                      <span>On-Time Percentage:</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {selectedPartner.performance_metrics.on_time_percentage}%
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Pricing Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span>Base Rate:</span>
                      <span className="font-medium">₹{selectedPartner.pricing_config.base_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Per KM Rate:</span>
                      <span className="font-medium">₹{selectedPartner.pricing_config.per_km_rate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Weight Multiplier:</span>
                      <span className="font-medium">{selectedPartner.pricing_config.weight_multiplier}x</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Coverage Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedPartner.supported_regions.map((region) => (
                      <Badge key={region} variant="outline">
                        {region}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedPartner(null)}>
                  Close
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Partner
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}