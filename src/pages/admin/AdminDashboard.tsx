import { useEffect, useState } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Activity,
  UserCheck,
  Package,
  CreditCard,
  BarChart3,
  Download,
  Filter
} from 'lucide-react'

export const AdminDashboard = () => {
  const { fetchSellers, fetchOrders, fetchPayouts, sellers, orders, payouts, loading } = useAdminData()
  const [metrics, setMetrics] = useState({
    totalSellers: 0,
    activeSellers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingPayouts: 0,
    verificationsPending: 0,
    monthlyRevenue: 0,
    monthlyOrders: 0,
    conversionRate: 0,
    averageOrderValue: 0
  })

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchSellers(),
        fetchOrders(),
        fetchPayouts(),
      ])
    }
    loadData()
  }, [])

  useEffect(() => {
    if (sellers.length > 0 || orders.length > 0 || payouts.length > 0) {
      const totalSellers = sellers.length
      const activeSellers = sellers.filter(s => s.account_status === 'active').length
      const totalOrders = orders.length
      const totalRevenue = orders.reduce((sum, order) => sum + order.total_amount, 0)
      const pendingPayouts = payouts.filter(p => p.status === 'pending').length
      const verificationsPending = sellers.filter(s => !s.kyc_verified).length
      
      // Calculate monthly metrics (last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const monthlyOrders = orders.filter(order => new Date(order.created_at) > thirtyDaysAgo)
      const monthlyRevenue = monthlyOrders.reduce((sum, order) => sum + order.total_amount, 0)
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
      const conversionRate = activeSellers > 0 ? (totalOrders / activeSellers) * 100 : 0

      setMetrics({
        totalSellers,
        activeSellers,
        totalOrders,
        totalRevenue,
        pendingPayouts,
        verificationsPending,
        monthlyRevenue,
        monthlyOrders: monthlyOrders.length,
        conversionRate,
        averageOrderValue
      })
    }
  }, [sellers, orders, payouts])

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 120 },
    { month: 'Feb', revenue: 52000, orders: 135 },
    { month: 'Mar', revenue: 48000, orders: 128 },
    { month: 'Apr', revenue: 61000, orders: 152 },
    { month: 'May', revenue: 55000, orders: 145 },
    { month: 'Jun', revenue: 67000, orders: 168 },
  ]

  const sellerStatusData = [
    { name: 'Active', value: metrics.activeSellers, color: 'hsl(var(--primary))' },
    { name: 'Pending', value: metrics.verificationsPending, color: 'hsl(var(--destructive))' },
    { name: 'Inactive', value: metrics.totalSellers - metrics.activeSellers - metrics.verificationsPending, color: 'hsl(var(--muted-foreground))' },
  ]

  const orderStatusData = [
    { status: 'Pending', count: 45, color: 'hsl(45 93% 47%)' },
    { status: 'Processing', count: 38, color: 'hsl(207 90% 54%)' },
    { status: 'Shipped', count: 67, color: 'hsl(142 69% 58%)' },
    { status: 'Delivered', count: 125, color: 'hsl(120 100% 25%)' },
    { status: 'Cancelled', count: 12, color: 'hsl(0 84% 60%)' },
  ]

  const metricCards = [
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      description: `₹${metrics.monthlyRevenue.toLocaleString()} this month`,
      icon: DollarSign,
      change: '+12.5%',
      positive: true,
      gradient: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950 dark:to-emerald-900',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders.toLocaleString(),
      description: `${metrics.monthlyOrders} this month`,
      icon: ShoppingCart,
      change: '+8.2%',
      positive: true,
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Active Sellers',
      value: metrics.activeSellers.toLocaleString(),
      description: `${metrics.totalSellers} total sellers`,
      icon: Users,
      change: '+5.1%',
      positive: true,
      gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Avg Order Value',
      value: `₹${metrics.averageOrderValue.toFixed(0)}`,
      description: `${metrics.conversionRate.toFixed(1)}% conversion rate`,
      icon: TrendingUp,
      change: '+3.7%',
      positive: true,
      gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
  ]

  const alertCards = [
    {
      title: 'Pending Verifications',
      count: metrics.verificationsPending,
      icon: UserCheck,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50 dark:bg-amber-950',
      action: 'Review Now'
    },
    {
      title: 'Pending Payouts',
      count: metrics.pendingPayouts,
      icon: CreditCard,
      color: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-950',
      action: 'Process'
    },
    {
      title: 'Support Tickets',
      count: 8,
      icon: AlertTriangle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-950',
      action: 'View All'
    },
    {
      title: 'System Alerts',
      count: 3,
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-950',
      action: 'Check'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
            Super Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Complete overview of SellSphere platform performance and metrics
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.title} className="relative overflow-hidden border-0 shadow-lg">
            <div className={`absolute inset-0 ${metric.gradient}`} />
            <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-foreground/80">
                {metric.title}
              </CardTitle>
              <div className="p-3 rounded-xl bg-white/80 dark:bg-black/20 backdrop-blur-sm">
                <metric.icon className={`h-5 w-5 ${metric.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="text-2xl font-bold text-foreground">{metric.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-foreground/60">
                  {metric.description}
                </p>
                <div className={`flex items-center text-xs ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {metric.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
          <TabsTrigger value="sellers">Seller Insights</TabsTrigger>
          <TabsTrigger value="orders">Order Analytics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="col-span-1 lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue & Orders Trend
                </CardTitle>
                <CardDescription>Monthly revenue and order count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                      strokeWidth={2}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="orders" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      yAxisId="right"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seller Status Distribution</CardTitle>
                <CardDescription>Breakdown of seller verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={sellerStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {sellerStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-4">
                  {sellerStatusData.map((entry) => (
                    <div key={entry.name} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: entry.color }}
                      />
                      <span className="text-sm font-medium">{entry.name}: {entry.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seller Performance</CardTitle>
                <CardDescription>Top performing sellers by revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {sellers.slice(0, 5).map((seller, index) => (
                    <div key={seller.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{seller.company_name}</p>
                          <p className="text-sm text-muted-foreground">{seller.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{(Math.random() * 100000).toFixed(0)}</p>
                        <p className="text-sm text-muted-foreground">{Math.floor(Math.random() * 50)} orders</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
                <CardDescription>Current order status breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="status" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent High-Value Orders</CardTitle>
                <CardDescription>Orders above ₹10,000 in last 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 5).map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div>
                        <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                        <p className="text-sm text-muted-foreground">{order.customer_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.total_amount.toLocaleString()}</p>
                        <Badge variant={order.status === 'delivered' ? 'default' : 'secondary'}>
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Platform Health</CardTitle>
                <CardDescription>System performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Server Uptime</span>
                    <span className="text-emerald-600 font-medium">99.9%</span>
                  </div>
                  <Progress value={99.9} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>API Response Time</span>
                    <span className="text-green-600 font-medium">145ms</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Database Performance</span>
                    <span className="text-blue-600 font-medium">Good</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>CDN Performance</span>
                    <span className="text-purple-600 font-medium">Excellent</span>
                  </div>
                  <Progress value={98} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Action Items</CardTitle>
                <CardDescription>Tasks requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {alertCards.map((alert) => (
                    <div key={alert.title} className={`p-4 rounded-lg ${alert.bgColor} border border-border/50`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <alert.icon className={`h-4 w-4 ${alert.color}`} />
                          <span className="font-medium text-sm">{alert.title}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {alert.count}
                        </Badge>
                      </div>
                      <Button size="sm" variant="outline" className="w-full text-xs">
                        {alert.action}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}