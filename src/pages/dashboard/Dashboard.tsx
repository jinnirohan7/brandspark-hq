import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users, 
  ArrowUpRight,
  AlertTriangle,
  Target,
  ShoppingCart,
  Eye,
  Star,
  Clock,
  Truck,
  RefreshCw,
  Filter,
  Download,
  Calendar,
  BarChart3
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,45,890',
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      subValue: '₹8,196 avg/day',
    },
    {
      title: 'Orders',
      value: '1,847',
      change: '+12.3%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      subValue: '892 this month',
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: Target,
      subValue: '2.1% vs industry',
    },
    {
      title: 'Page Views',
      value: '38,492',
      change: '+6.7%',
      changeType: 'positive' as const,
      icon: Eye,
      subValue: '1,283 today',
    },
    {
      title: 'Active Products',
      value: '127',
      change: '+8',
      changeType: 'positive' as const,
      icon: Package,
      subValue: '12 low stock',
    },
    {
      title: 'Return Rate',
      value: '2.1%',
      change: '-0.3%',
      changeType: 'positive' as const,
      icon: RefreshCw,
      subValue: '3.2% industry avg',
    },
  ]

  const salesData = [
    { date: '01/01', revenue: 12000, orders: 45 },
    { date: '01/02', revenue: 15000, orders: 62 },
    { date: '01/03', revenue: 18000, orders: 71 },
    { date: '01/04', revenue: 14000, orders: 58 },
    { date: '01/05', revenue: 22000, orders: 89 },
    { date: '01/06', revenue: 25000, orders: 95 },
    { date: '01/07', revenue: 28000, orders: 112 },
  ]

  const trafficSources = [
    { name: 'Direct', value: 35, color: 'hsl(var(--primary))' },
    { name: 'Google Ads', value: 25, color: 'hsl(var(--secondary))' },
    { name: 'Social Media', value: 20, color: 'hsl(var(--accent))' },
    { name: 'Referrals', value: 15, color: 'hsl(var(--muted))' },
    { name: 'Other', value: 5, color: 'hsl(var(--border))' },
  ]

  const topProducts = [
    { name: 'Wireless Headphones Pro', sales: 245, revenue: '₹1,22,500', trend: '+12%', stock: 45 },
    { name: 'Smart Watch Series X', sales: 189, revenue: '₹94,500', trend: '+8%', stock: 23 },
    { name: 'Bluetooth Speaker', sales: 156, revenue: '₹62,400', trend: '+15%', stock: 67 },
    { name: 'Phone Case Premium', sales: 134, revenue: '₹26,800', trend: '+5%', stock: 12 },
    { name: 'Charging Cable Set', sales: 98, revenue: '₹19,600', trend: '-2%', stock: 89 },
  ]

  const recentOrders = [
    { id: '#ORD-2024-1001', customer: 'Rahul Sharma', amount: '₹2,499', status: 'Processing', date: '2 hrs ago', items: 3 },
    { id: '#ORD-2024-1002', customer: 'Priya Patel', amount: '₹1,299', status: 'Shipped', date: '4 hrs ago', items: 1 },
    { id: '#ORD-2024-1003', customer: 'Amit Kumar', amount: '₹3,599', status: 'Delivered', date: '6 hrs ago', items: 2 },
    { id: '#ORD-2024-1004', customer: 'Sneha Singh', amount: '₹899', status: 'Pending', date: '8 hrs ago', items: 1 },
    { id: '#ORD-2024-1005', customer: 'Vikash Gupta', amount: '₹1,899', status: 'Processing', date: '12 hrs ago', items: 4 },
  ]

  const chartConfig = {
    revenue: {
      label: "Revenue",
      color: "hsl(var(--primary))",
    },
    orders: {
      label: "Orders",
      color: "hsl(var(--secondary))",
    },
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
          <p className="text-muted-foreground">Track your business performance and manage operations</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <BarChart3 className="mr-2 h-4 w-4" />
            View Reports
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center text-xs">
                    <span className={`${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'} font-medium`}>
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground ml-1">vs last month</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                </div>
                <div className="p-2 bg-primary/10 rounded-full">
                  <stat.icon className="h-4 w-4 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sales Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Sales Performance</CardTitle>
            <CardDescription>Revenue and order trends over the last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={trafficSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {trafficSources.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {trafficSources.map((source) => (
                <div key={source.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: source.color }} />
                    {source.name}
                  </div>
                  <span className="font-medium">{source.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tables Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Performing Products</CardTitle>
              <CardDescription>Your best sellers this month</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              View All
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topProducts.map((product) => (
                  <TableRow key={product.name}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{product.name}</p>
                        <p className={`text-xs ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                          {product.trend} vs last month
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{product.sales}</TableCell>
                    <TableCell className="text-right font-medium">{product.revenue}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={product.stock < 20 ? 'destructive' : 'secondary'}>
                        {product.stock}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders requiring attention</CardDescription>
            </div>
            <Button variant="ghost" size="sm">
              Manage Orders
              <ArrowUpRight className="ml-1 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{order.id}</p>
                      <Badge 
                        variant={
                          order.status === 'Delivered' ? 'default' :
                          order.status === 'Shipped' ? 'secondary' :
                          order.status === 'Processing' ? 'outline' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">{order.amount}</p>
                    <Button variant="ghost" size="sm" className="h-auto p-1 text-xs">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Items */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800 dark:text-orange-200">12 Low Stock Items</p>
                <p className="text-sm text-orange-600 dark:text-orange-300">Need immediate restock</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-800 dark:text-blue-200">8 Pending Orders</p>
                <p className="text-sm text-blue-600 dark:text-blue-300">Awaiting processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800 dark:text-green-200">3 New Reviews</p>
                <p className="text-sm text-green-600 dark:text-green-300">Average 4.8 stars</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50 dark:bg-purple-950/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-medium text-purple-800 dark:text-purple-200">15 In Transit</p>
                <p className="text-sm text-purple-600 dark:text-purple-300">Expected delivery today</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard