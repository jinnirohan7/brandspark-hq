import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAdminData } from '@/hooks/useAdminData'
import { BarChart3, TrendingUp, Users, ShoppingCart, DollarSign, Activity, Download, Filter } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts'

const mockAnalyticsData = {
  revenue: [
    { month: 'Jan', value: 125000 },
    { month: 'Feb', value: 132000 },
    { month: 'Mar', value: 147000 },
    { month: 'Apr', value: 158000 },
    { month: 'May', value: 175000 },
    { month: 'Jun', value: 189000 },
  ],
  orders: [
    { month: 'Jan', orders: 1250 },
    { month: 'Feb', orders: 1420 },
    { month: 'Mar', orders: 1380 },
    { month: 'Apr', orders: 1650 },
    { month: 'May', orders: 1890 },
    { month: 'Jun', orders: 2100 },
  ],
  categories: [
    { name: 'Electronics', value: 35, color: '#8884d8' },
    { name: 'Fashion', value: 28, color: '#82ca9d' },
    { name: 'Home & Garden', value: 20, color: '#ffc658' },
    { name: 'Books', value: 10, color: '#ff7300' },
    { name: 'Sports', value: 7, color: '#00ff88' },
  ]
}

export const AdminAnalytics = () => {
  const { sellers, orders, payouts, loading } = useAdminData()
  const [timeRange, setTimeRange] = useState('30d')

  // Calculate key metrics
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total_amount), 0)
  const totalOrders = orders.length
  const activeSellers = sellers.filter(seller => seller.account_status === 'active').length
  const pendingPayouts = payouts.filter(payout => payout.status === 'pending').length

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
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive platform analytics and insights</p>
        </div>
        <div className="flex gap-2">
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

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOrders.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +15.3% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeSellers}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPayouts}</div>
            <p className="text-xs text-muted-foreground">
              ₹{(payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0) / 100000).toFixed(1)}L total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="revenue">Revenue Trends</TabsTrigger>
          <TabsTrigger value="orders">Order Analytics</TabsTrigger>
          <TabsTrigger value="categories">Category Performance</TabsTrigger>
          <TabsTrigger value="sellers">Seller Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue trends for the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={mockAnalyticsData.revenue}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Order Volume</CardTitle>
              <CardDescription>Monthly order trends across the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={mockAnalyticsData.orders}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value}`, 'Orders']} />
                  <Bar dataKey="orders" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
                <CardDescription>Sales by product category</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mockAnalyticsData.categories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {mockAnalyticsData.categories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}%`, 'Share']} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
                <CardDescription>Performance by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockAnalyticsData.categories.map((category, index) => (
                    <div key={category.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary">{category.value}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Seller Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">+12%</div>
                <p className="text-sm text-muted-foreground">New sellers this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Revenue per Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">₹{Math.round(totalRevenue / sellers.length).toLocaleString()}</div>
                <p className="text-sm text-muted-foreground">Per active seller</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Top Performer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">TechStore Pro</div>
                <p className="text-sm text-muted-foreground">₹2.5L revenue this month</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}