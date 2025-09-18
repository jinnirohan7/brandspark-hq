import { useEffect, useState } from 'react'
import { useAdminData } from '@/hooks/useAdminData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe
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

      setMetrics({
        totalSellers,
        activeSellers,
        totalOrders,
        totalRevenue,
        pendingPayouts,
        verificationsPending,
      })
    }
  }, [sellers, orders, payouts])

  const metricCards = [
    {
      title: 'Total Sellers',
      value: metrics.totalSellers,
      description: `${metrics.activeSellers} active`,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Total Orders',
      value: metrics.totalOrders,
      description: 'All time orders',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Revenue',
      value: `₹${metrics.totalRevenue.toLocaleString()}`,
      description: 'Platform revenue',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Pending Payouts',
      value: metrics.pendingPayouts,
      description: 'Require processing',
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
  ]

  const recentSellers = sellers.slice(0, 5)
  const recentOrders = orders.slice(0, 5)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of SellSphere platform metrics and activities
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricCards.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.title}
              </CardTitle>
              <div className={`p-2 rounded-md ${metric.bgColor}`}>
                <metric.icon className={`h-4 w-4 ${metric.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground">
                {metric.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Verifications</span>
              <Badge variant="destructive">{metrics.verificationsPending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Pending Payouts</span>
              <Badge variant="outline">{metrics.pendingPayouts}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">NDR Resolution</span>
              <Badge variant="secondary">3</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              Platform Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Active Sellers</span>
                <span>{Math.round((metrics.activeSellers / metrics.totalSellers) * 100)}%</span>
              </div>
              <Progress value={(metrics.activeSellers / metrics.totalSellers) * 100} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Order Success Rate</span>
                <span>95.2%</span>
              </div>
              <Progress value={95.2} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Platform Uptime</span>
                <span>99.9%</span>
              </div>
              <Progress value={99.9} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Sellers</CardTitle>
            <CardDescription>Latest seller registrations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSellers.map((seller) => (
                <div key={seller.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{seller.company_name}</p>
                    <p className="text-xs text-muted-foreground">{seller.email}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {seller.kyc_verified ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <Clock className="h-4 w-4 text-orange-500" />
                    )}
                    <Badge variant={seller.account_status === 'active' ? 'default' : 'secondary'}>
                      {seller.account_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest platform orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">₹{order.total_amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_name}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}