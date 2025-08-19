import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  ShoppingBag, 
  TrendingUp, 
  Package, 
  DollarSign, 
  Users, 
  ArrowUpRight,
  AlertTriangle
} from 'lucide-react'

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+12%',
      changeType: 'positive' as const,
      icon: ShoppingBag,
    },
    {
      title: 'Revenue',
      value: '₹45,231',
      change: '+8%',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Products',
      value: '89',
      change: '+3',
      changeType: 'positive' as const,
      icon: Package,
    },
    {
      title: 'Conversion Rate',
      value: '3.2%',
      change: '+0.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
    },
  ]

  const recentOrders = [
    { id: '1001', customer: 'John Doe', amount: '₹2,499', status: 'Processing', date: '2024-01-15' },
    { id: '1002', customer: 'Jane Smith', amount: '₹1,299', status: 'Shipped', date: '2024-01-14' },
    { id: '1003', customer: 'Mike Johnson', amount: '₹3,599', status: 'Delivered', date: '2024-01-14' },
    { id: '1004', customer: 'Sarah Wilson', amount: '₹899', status: 'Pending', date: '2024-01-13' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <Button>
          <ArrowUpRight className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className={stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}>
                  {stat.change}
                </span>{' '}
                from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your latest customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Order #{order.id}</p>
                    <p className="text-sm text-muted-foreground">{order.customer}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-sm font-medium">{order.amount}</p>
                    <Badge 
                      variant={
                        order.status === 'Delivered' ? 'default' :
                        order.status === 'Shipped' ? 'secondary' :
                        order.status === 'Processing' ? 'outline' : 'destructive'
                      }
                    >
                      {order.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your store efficiently</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">
              <Package className="mr-2 h-4 w-4" />
              Add New Product
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="mr-2 h-4 w-4" />
              View Customer Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <TrendingUp className="mr-2 h-4 w-4" />
              Create Marketing Campaign
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <AlertTriangle className="mr-2 h-4 w-4" />
              Manage Returns
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="text-yellow-800">Action Required</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-yellow-700">• 3 products are low in stock</p>
            <p className="text-sm text-yellow-700">• 2 orders need processing</p>
            <p className="text-sm text-yellow-700">• GST documents pending verification</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard