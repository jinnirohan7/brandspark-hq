import { useEffect, useState } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  ScatterChart,
  Scatter
} from 'recharts'
import { 
  TrendingUp, 
  Download, 
  Filter, 
  Calendar,
  DollarSign,
  Users,
  ShoppingCart,
  Globe,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react'

export const AdminAnalytics = () => {
  const { fetchSellers, fetchOrders, fetchPayouts, sellers, orders, payouts, loading } = useAdminData()
  
  const [dateRange, setDateRange] = useState('30d')

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

  // Advanced analytics data
  const revenueAnalytics = [
    { date: '2024-01', revenue: 125000, orders: 340, sellers: 45 },
    { date: '2024-02', revenue: 142000, orders: 385, sellers: 52 },
    { date: '2024-03', revenue: 158000, orders: 420, sellers: 58 },
    { date: '2024-04', revenue: 175000, orders: 465, sellers: 63 },
    { date: '2024-05', revenue: 192000, orders: 510, sellers: 68 },
    { date: '2024-06', revenue: 215000, orders: 575, sellers: 74 },
  ]

  const regionData = [
    { region: 'North India', revenue: 450000, sellers: 125, orders: 1250, color: 'hsl(232 94% 59%)' },
    { region: 'South India', revenue: 380000, sellers: 98, orders: 1080, color: 'hsl(243 88% 67%)' },
    { region: 'West India', revenue: 320000, sellers: 85, orders: 920, color: 'hsl(250 100% 85%)' },
    { region: 'East India', revenue: 180000, sellers: 52, orders: 580, color: 'hsl(260 85% 75%)' },
    { region: 'Central India', revenue: 120000, sellers: 35, orders: 420, color: 'hsl(270 70% 65%)' },
  ]

  const categoryData = [
    { category: 'Electronics', revenue: 380000, orders: 1200, growth: 12.5 },
    { category: 'Fashion', revenue: 320000, orders: 1800, growth: 8.3 },
    { category: 'Home & Garden', revenue: 280000, orders: 950, growth: 15.2 },
    { category: 'Health & Beauty', revenue: 220000, orders: 1100, growth: 6.8 },
    { category: 'Sports', revenue: 180000, orders: 750, growth: 9.1 },
    { category: 'Books', revenue: 120000, orders: 2200, growth: 4.5 },
  ]

  const sellerGrowthData = [
    { month: 'Jan', newSellers: 12, activeSellers: 145, churnRate: 2.1 },
    { month: 'Feb', newSellers: 18, activeSellers: 158, churnRate: 1.8 },
    { month: 'Mar', newSellers: 25, activeSellers: 175, churnRate: 2.5 },
    { month: 'Apr', newSellers: 32, activeSellers: 195, churnRate: 1.2 },
    { month: 'May', newSellers: 28, activeSellers: 215, churnRate: 1.9 },
    { month: 'Jun', newSellers: 35, activeSellers: 238, churnRate: 1.5 },
  ]

  const performanceMetrics = [
    { metric: 'Conversion Rate', value: 3.2, change: 0.4, unit: '%', positive: true },
    { metric: 'Avg Order Value', value: 1250, change: 85, unit: '₹', positive: true },
    { metric: 'Customer Retention', value: 67.8, change: -2.1, unit: '%', positive: false },
    { metric: 'Platform Commission', value: 8.5, change: 0.2, unit: '%', positive: true },
  ]

  const topSellerInsights = sellers.slice(0, 10).map((seller, index) => ({
    rank: index + 1,
    name: seller.company_name,
    revenue: Math.floor(Math.random() * 100000) + 50000,
    orders: Math.floor(Math.random() * 500) + 100,
    rating: (Math.random() * 2 + 3).toFixed(1),
    growth: (Math.random() * 30 - 5).toFixed(1)
  }))

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
  const totalOrders = orders.length
  const activeSellers = sellers.filter(seller => seller.account_status === 'active').length
  const pendingPayouts = payouts.filter(payout => payout.status === 'pending').length

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
            Advanced Analytics
          </h1>
          <p className="text-muted-foreground">
            Deep insights into platform performance and business metrics
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 lg:mt-0">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            Last 30 days
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Performance Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {performanceMetrics.map((metric) => (
          <Card key={metric.metric} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.metric}</CardTitle>
              <div className={`flex items-center text-xs ${metric.positive ? 'text-emerald-600' : 'text-red-600'}`}>
                <TrendingUp className="h-3 w-3 mr-1" />
                {metric.positive ? '+' : ''}{metric.change}{metric.unit}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metric.value}{metric.unit}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.positive ? 'Increased' : 'Decreased'} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="sellers">Sellers</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Revenue Growth Trend
                </CardTitle>
                <CardDescription>Monthly revenue, orders, and seller growth</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <AreaChart data={revenueAnalytics}>
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                      </linearGradient>
                      <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="date" className="text-xs" />
                    <YAxis yAxisId="left" orientation="left" className="text-xs" />
                    <YAxis yAxisId="right" orientation="right" className="text-xs" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Area 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="hsl(var(--primary))" 
                      fillOpacity={1} 
                      fill="url(#revenueGradient)" 
                      strokeWidth={3}
                    />
                    <Area 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="orders" 
                      stroke="hsl(var(--destructive))" 
                      fillOpacity={1} 
                      fill="url(#ordersGradient)" 
                      strokeWidth={2}
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
                <CardTitle>Seller Growth Analytics</CardTitle>
                <CardDescription>New sellers vs churn rate</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sellerGrowthData}>
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
                    <Bar dataKey="newSellers" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="churnRate" fill="hsl(var(--destructive))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performing Sellers</CardTitle>
                <CardDescription>Revenue leaders this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {topSellerInsights.map((seller) => (
                    <div key={seller.rank} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                          {seller.rank}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{seller.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {seller.orders} orders
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              ⭐ {seller.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{seller.revenue.toLocaleString()}</p>
                        <p className={`text-xs ${parseFloat(seller.growth) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                          {parseFloat(seller.growth) > 0 ? '+' : ''}{seller.growth}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Regional Performance
                </CardTitle>
                <CardDescription>Revenue and seller distribution across regions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={regionData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        innerRadius={40}
                        paddingAngle={5}
                        dataKey="revenue"
                      >
                        {regionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                    </PieChart>
                  </ResponsiveContainer>
                  
                  <div className="space-y-4">
                    {regionData.map((region, index) => (
                      <div key={region.region} className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: region.color }}
                          />
                          <div>
                            <p className="font-medium text-sm">{region.region}</p>
                            <p className="text-xs text-muted-foreground">{region.sellers} sellers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm">₹{region.revenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{region.orders} orders</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance Analysis</CardTitle>
              <CardDescription>Revenue and growth by product categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={categoryData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="category" type="category" width={100} className="text-xs" />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Key Insights
                </CardTitle>
                <CardDescription>AI-powered business insights</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-800">
                  <h4 className="font-semibold text-emerald-700 dark:text-emerald-300 mb-2">Revenue Growth</h4>
                  <p className="text-sm text-emerald-600 dark:text-emerald-400">
                    Platform revenue increased by 23% this quarter, driven primarily by electronics and home categories.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Seller Expansion</h4>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    35 new premium sellers joined this month, increasing our high-value seller base by 15%.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Opportunity</h4>
                  <p className="text-sm text-amber-600 dark:text-amber-400">
                    Customer retention in the South region is 8% below average. Consider targeted retention campaigns.
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-950 border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Market Trend</h4>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    Health & Beauty category showing 15% growth. Consider promoting this category to more sellers.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Orders Correlation</CardTitle>
                <CardDescription>Relationship between order volume and revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ScatterChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis dataKey="orders" type="number" name="Orders" className="text-xs" />
                    <YAxis dataKey="revenue" type="number" name="Revenue" className="text-xs" />
                    <Tooltip 
                      cursor={{ strokeDasharray: '3 3' }}
                      formatter={(value, name) => [
                        name === 'revenue' ? `₹${value.toLocaleString()}` : value,
                        name === 'revenue' ? 'Revenue' : 'Orders'
                      ]}
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Scatter dataKey="revenue" fill="hsl(var(--primary))" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}