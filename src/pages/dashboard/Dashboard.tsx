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
  BarChart3,
  Settings,
  HelpCircle,
  FileText,
  Megaphone,
  MessageSquare,
  CreditCard,
  RotateCcw,
  Gift,
  TrendingDown,
  Plus,
  Activity
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  // Key Performance Indicators
  const kpiData = [
    {
      title: 'Total Revenue',
      value: '₹12,45,890',
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: DollarSign,
      subValue: 'Last 30 days',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      title: 'Total Orders',
      value: '2,847',
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
      subValue: '892 this month',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      title: 'Active Products',
      value: '127',
      change: '+5',
      changeType: 'positive' as const,
      icon: Package,
      subValue: '12 low stock',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      title: 'Conversion Rate',
      value: '4.8%',
      change: '+0.8%',
      changeType: 'positive' as const,
      icon: Target,
      subValue: '2.1% vs industry',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      title: 'Return Rate',
      value: '2.1%',
      change: '-0.3%',
      changeType: 'positive' as const,
      icon: RefreshCw,
      subValue: '3.2% industry avg',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    {
      title: 'Avg Order Value',
      value: '₹4,375',
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      subValue: 'Per transaction',
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      borderColor: 'border-teal-200'
    }
  ]

  // Sales data for charts
  const salesData = [
    { date: 'Jan', revenue: 32000, orders: 145, customers: 89 },
    { date: 'Feb', revenue: 45000, orders: 189, customers: 124 },
    { date: 'Mar', revenue: 38000, orders: 167, customers: 98 },
    { date: 'Apr', revenue: 52000, orders: 234, customers: 156 },
    { date: 'May', revenue: 61000, orders: 287, customers: 189 },
    { date: 'Jun', revenue: 58000, orders: 245, customers: 167 },
    { date: 'Jul', revenue: 72000, orders: 345, customers: 223 }
  ]

  // Top products data
  const topProducts = [
    { name: 'Wireless Headphones Pro', sales: 245, revenue: '₹1,22,500', trend: '+12%', stock: 45, status: 'In Stock' },
    { name: 'Smart Watch Series X', sales: 189, revenue: '₹94,500', trend: '+8%', stock: 23, status: 'Low Stock' },
    { name: 'Bluetooth Speaker', sales: 156, revenue: '₹62,400', trend: '+15%', stock: 67, status: 'In Stock' },
    { name: 'Phone Case Premium', sales: 134, revenue: '₹26,800', trend: '+5%', stock: 12, status: 'Low Stock' },
    { name: 'Charging Cable Set', sales: 98, revenue: '₹19,600', trend: '-2%', stock: 89, status: 'In Stock' },
  ]

  // Recent orders data
  const recentOrders = [
    { id: '#ORD-2024-1001', customer: 'Rahul Sharma', amount: '₹2,499', status: 'Processing', date: '2 hrs ago', items: 3 },
    { id: '#ORD-2024-1002', customer: 'Priya Patel', amount: '₹1,299', status: 'Shipped', date: '4 hrs ago', items: 1 },
    { id: '#ORD-2024-1003', customer: 'Amit Kumar', amount: '₹3,599', status: 'Delivered', date: '6 hrs ago', items: 2 },
    { id: '#ORD-2024-1004', customer: 'Sneha Singh', amount: '₹899', status: 'Pending', date: '8 hrs ago', items: 1 },
    { id: '#ORD-2024-1005', customer: 'Vikash Gupta', amount: '₹1,899', status: 'Processing', date: '12 hrs ago', items: 4 },
  ]

  // Quick actions
  const quickActions = [
    { title: 'Orders', icon: ShoppingBag, path: '/dashboard/orders', color: 'bg-blue-500', description: 'Manage orders' },
    { title: 'Inventory', icon: Package, path: '/dashboard/inventory', color: 'bg-green-500', description: 'Stock management' },
    { title: 'Analytics', icon: BarChart3, path: '/dashboard/analytics', color: 'bg-purple-500', description: 'View analytics' },
    { title: 'Reports', icon: FileText, path: '/dashboard/reports', color: 'bg-orange-500', description: 'Generate reports' },
    { title: 'Marketing', icon: Megaphone, path: '/dashboard/marketing', color: 'bg-red-500', description: 'Marketing tools' },
    { title: 'Reviews', icon: Star, path: '/dashboard/reviews', color: 'bg-yellow-500', description: 'Customer reviews' },
    { title: 'Support', icon: HelpCircle, path: '/dashboard/support', color: 'bg-indigo-500', description: 'Help center' },
    { title: 'Payments', icon: CreditCard, path: '/dashboard/payments', color: 'bg-teal-500', description: 'Payment settings' },
  ]

  const orderStatusDistribution = [
    { name: 'Delivered', value: 68, color: '#22c55e' },
    { name: 'Processing', value: 18, color: '#3b82f6' },
    { name: 'Shipped', value: 10, color: '#f59e0b' },
    { name: 'Cancelled', value: 4, color: '#ef4444' }
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

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'Processing': { variant: 'secondary' as const, color: 'text-blue-600' },
      'Shipped': { variant: 'default' as const, color: 'text-orange-600' },
      'Delivered': { variant: 'default' as const, color: 'text-green-600' },
      'Pending': { variant: 'destructive' as const, color: 'text-red-600' },
      'In Stock': { variant: 'default' as const, color: 'text-green-600' },
      'Low Stock': { variant: 'destructive' as const, color: 'text-orange-600' },
    }
    
    return statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary' as const, color: 'text-gray-600' }
  }

  return (
    <div className="space-y-6 p-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-muted-foreground mt-1">Welcome back! Here's what's happening with your store today.</p>
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
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className={`${kpi.bgColor} ${kpi.borderColor} border-2 hover:shadow-lg transition-shadow`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${kpi.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <div className={`flex items-center text-sm ${kpi.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {kpi.changeType === 'positive' ? (
                    <TrendingUp className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 mr-1" />
                  )}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-bold text-foreground">{kpi.value}</h3>
                <p className="text-sm text-muted-foreground mt-1">{kpi.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.subValue}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Revenue Trend Chart */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Revenue & Orders Trend
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </CardTitle>
            <CardDescription>
              Monthly performance overview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="date" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stackId="1"
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))"
                    fillOpacity={0.6}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="orders" 
                    stackId="1"
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))"
                    fillOpacity={0.6}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
            <CardDescription>
              Current order distribution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={orderStatusDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {orderStatusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {orderStatusDistribution.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}</span>
                  <span className="text-sm font-medium ml-auto">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used features and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {quickActions.map((action) => (
              <Button
                key={action.title}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 hover:bg-accent transition-colors"
                onClick={() => navigate(action.path)}
              >
                <div className={`p-2 rounded-lg ${action.color} text-white`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium block">{action.title}</span>
                  <span className="text-xs text-muted-foreground">{action.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Tables Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Products</CardTitle>
              <CardDescription>Best performing products this month</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/inventory')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm">{product.name}</h4>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{product.revenue}</p>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={getStatusBadge(product.status).variant}
                        className="text-xs"
                      >
                        {product.status}
                      </Badge>
                      <span className={`text-xs ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {product.trend}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/orders')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                  <div>
                    <h4 className="font-medium text-sm">{order.id}</h4>
                    <p className="text-xs text-muted-foreground">{order.customer}</p>
                    <p className="text-xs text-muted-foreground">{order.items} items • {order.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-sm">{order.amount}</p>
                    <Badge 
                      variant={getStatusBadge(order.status).variant}
                      className="text-xs"
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Important Alerts
          </CardTitle>
          <CardDescription>Items that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <Package className="h-8 w-8 text-orange-600" />
              <div>
                <h4 className="font-medium text-sm">Low Stock Items</h4>
                <p className="text-xs text-muted-foreground">5 products running low</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-orange-600">
                  Restock now
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <div>
                <h4 className="font-medium text-sm">Pending Reviews</h4>
                <p className="text-xs text-muted-foreground">12 reviews to respond</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
                  Respond now
                </Button>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-medium text-sm">Sales Target</h4>
                <p className="text-xs text-muted-foreground">85% of monthly goal reached</p>
                <Button variant="link" size="sm" className="p-0 h-auto text-green-600">
                  View details
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard