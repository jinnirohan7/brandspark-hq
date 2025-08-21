import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  Truck,
  TrendingUp,
  Target
} from 'lucide-react'
import { OrderStats } from '@/hooks/useAdvancedOrders'

interface OrderStatsCardsProps {
  stats: OrderStats
  loading?: boolean
}

export const OrderStatsCards = ({ stats, loading }: OrderStatsCardsProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders.toLocaleString(),
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '-3.1%',
      changeType: 'negative' as const,
    },
    {
      title: 'Shipped Orders',
      value: stats.shippedOrders.toLocaleString(),
      icon: Truck,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+15.7%',
      changeType: 'positive' as const,
    },
    {
      title: 'Avg Order Value',
      value: formatCurrency(stats.averageOrderValue),
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+4.3%',
      changeType: 'positive' as const,
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate}%`,
      icon: Target,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      change: '+0.8%',
      changeType: 'positive' as const,
    },
  ]

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded w-3/4" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-1/2 mb-2" />
              <div className="h-3 bg-muted rounded w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statsCards.map((stat) => (
        <Card key={stat.title} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center mt-1">
              <Badge 
                variant={stat.changeType === 'positive' ? 'default' : 'destructive'}
                className="text-xs"
              >
                {stat.change}
              </Badge>
              <span className="text-xs text-muted-foreground ml-2">
                vs last month
              </span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}