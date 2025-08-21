import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Progress } from '@/components/ui/progress'
import { 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Package, 
  TrendingUp, 
  TrendingDown,
  Search,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function ShippingPerformance() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [timeRange, setTimeRange] = useState('7d')

  // Mock shipping performance data with daily updates
  const shippingMetrics = [
    {
      title: 'On-Time Delivery Rate',
      value: '94.2%',
      target: '95%',
      change: '+2.1%',
      trend: 'up',
      status: 'good'
    },
    {
      title: 'Average Shipping Time',
      value: '2.3 days',
      target: '2 days',
      change: '+0.2 days',
      trend: 'down',
      status: 'warning'
    },
    {
      title: 'Package Damage Rate',
      value: '0.8%',
      target: '< 1%',
      change: '-0.3%',
      trend: 'up',
      status: 'good'
    },
    {
      title: 'Customer Satisfaction',
      value: '4.7/5',
      target: '4.5/5',
      change: '+0.1',
      trend: 'up',
      status: 'excellent'
    }
  ]

  const dailyUpdates = [
    {
      date: '2024-01-20',
      ordersShipped: 156,
      onTimeDeliveries: 147,
      delayedPackages: 9,
      avgDeliveryTime: '2.1 days',
      customerComplaints: 3
    },
    {
      date: '2024-01-19',
      ordersShipped: 142,
      onTimeDeliveries: 134,
      delayedPackages: 8,
      avgDeliveryTime: '2.3 days',
      customerComplaints: 2
    },
    {
      date: '2024-01-18',
      ordersShipped: 198,
      onTimeDeliveries: 185,
      delayedPackages: 13,
      avgDeliveryTime: '2.4 days',
      customerComplaints: 5
    }
  ]

  const carrierPerformance = [
    {
      carrier: 'FastTrack Express',
      onTimeRate: 96.5,
      avgDeliveryTime: '1.8 days',
      cost: '₹45',
      volume: 2156,
      rating: 4.8
    },
    {
      carrier: 'SpeedPost Logistics',
      onTimeRate: 93.2,
      avgDeliveryTime: '2.1 days',
      cost: '₹38',
      volume: 1892,
      rating: 4.6
    },
    {
      carrier: 'QuickShip Solutions',
      onTimeRate: 91.8,
      avgDeliveryTime: '2.4 days',
      cost: '₹32',
      volume: 1654,
      rating: 4.4
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200'
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'warning': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'poor': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const refreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "Shipping performance data has been updated with the latest information.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Shipping Performance</h1>
          <p className="text-muted-foreground">Monitor your shipping metrics with daily updates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={refreshData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {shippingMetrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              {getTrendIcon(metric.trend)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-muted-foreground">Target: {metric.target}</p>
                <Badge className={getStatusColor(metric.status)}>
                  {metric.status}
                </Badge>
              </div>
              <p className={`text-xs mt-1 ${metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="daily-updates">Daily Updates</TabsTrigger>
          <TabsTrigger value="carrier-performance">Carrier Performance</TabsTrigger>
          <TabsTrigger value="shipping-zones">Shipping Zones</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Delivery Performance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">On-time Deliveries</span>
                    <span className="text-sm font-medium">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Late Deliveries</span>
                    <span className="text-sm font-medium">5.8%</span>
                  </div>
                  <Progress value={5.8} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Cost per Package</span>
                    <span className="font-medium">₹38.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Shipping Costs (7d)</span>
                    <span className="font-medium">₹24,680</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cost per Order</span>
                    <span className="font-medium">₹42.30</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="daily-updates">
          <Card>
            <CardHeader>
              <CardTitle>Daily Shipping Updates</CardTitle>
              <div className="flex gap-2">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 days</SelectItem>
                    <SelectItem value="30d">Last 30 days</SelectItem>
                    <SelectItem value="90d">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Orders Shipped</TableHead>
                    <TableHead>On-Time</TableHead>
                    <TableHead>Delayed</TableHead>
                    <TableHead>Avg Delivery Time</TableHead>
                    <TableHead>Complaints</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyUpdates.map((update, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{update.date}</TableCell>
                      <TableCell>{update.ordersShipped}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          {update.onTimeDeliveries}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-orange-600" />
                          {update.delayedPackages}
                        </div>
                      </TableCell>
                      <TableCell>{update.avgDeliveryTime}</TableCell>
                      <TableCell>
                        {update.customerComplaints > 0 ? (
                          <Badge variant="destructive">{update.customerComplaints}</Badge>
                        ) : (
                          <Badge variant="secondary">0</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="carrier-performance">
          <Card>
            <CardHeader>
              <CardTitle>Carrier Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Carrier</TableHead>
                    <TableHead>On-Time Rate</TableHead>
                    <TableHead>Avg Delivery Time</TableHead>
                    <TableHead>Cost per Package</TableHead>
                    <TableHead>Volume (7d)</TableHead>
                    <TableHead>Rating</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {carrierPerformance.map((carrier, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{carrier.carrier}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={carrier.onTimeRate} className="w-20 h-2" />
                          <span className="text-sm">{carrier.onTimeRate}%</span>
                        </div>
                      </TableCell>
                      <TableCell>{carrier.avgDeliveryTime}</TableCell>
                      <TableCell>{carrier.cost}</TableCell>
                      <TableCell>{carrier.volume.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className="text-sm">{carrier.rating}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping-zones">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Performance by Zone</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { zone: 'Metro Cities', performance: 96.2, color: 'bg-green-500' },
                    { zone: 'Tier 2 Cities', performance: 92.8, color: 'bg-blue-500' },
                    { zone: 'Rural Areas', performance: 88.4, color: 'bg-orange-500' },
                    { zone: 'Remote Areas', performance: 84.1, color: 'bg-red-500' }
                  ].map((zone, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm">{zone.zone}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={zone.performance} className="w-24 h-2" />
                        <span className="text-sm font-medium w-12">{zone.performance}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Delayed Shipments in Zone 3</p>
                      <p className="text-xs text-muted-foreground">12 packages delayed due to weather conditions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 border rounded-lg">
                    <Package className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">High Volume Day</p>
                      <p className="text-xs text-muted-foreground">Processing 25% more orders than usual</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}