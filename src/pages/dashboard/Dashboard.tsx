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
  Gift
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const navigate = useNavigate()

  // Order & Revenue Trend Data
  const orderRevenueData = [
    { month: 'August', orders: 20000, revenue: 3500000, orderRevenue: 2540000 },
    { month: 'September', orders: 26000, revenue: 3900000, orderRevenue: 3020000 },
    { month: 'October', orders: 35000, revenue: 4600000, orderRevenue: 4090000 },
  ]

  // RTO Trend Data
  const rtoData = [
    { month: 'August', rto: 18 },
    { month: 'September', rto: 14 },
    { month: 'October', rto: 16 },
  ]

  // Profit Trend Data
  const profitData = [
    {
      date: 'October',
      totalSales: '₹4,09,02,901',
      salesPercent: '100%',
      marketingCost: '₹1,02,58,448',
      marketingPercent: '25%',
      shippingCost: '₹87,32,769',
      shippingPercent: '21%',
      cogs: '₹1,24,05,850',
      cogsPercent: '30%',
      netProfit: '₹95,05,834',
      profitPercent: '23%',
      profitColor: 'text-green-400'
    },
    {
      date: 'September',
      totalSales: '₹3,02,10,711',
      salesPercent: '100%',
      marketingCost: '₹84,95,252',
      marketingPercent: '28%',
      shippingCost: '₹64,07,692',
      shippingPercent: '21%',
      cogs: '₹88,66,844',
      cogsPercent: '29%',
      netProfit: '₹64,40,924',
      profitPercent: '21%',
      profitColor: 'text-green-400'
    },
    {
      date: 'August',
      totalSales: '₹2,54,82,891',
      salesPercent: '100%',
      marketingCost: '₹76,47,416',
      marketingPercent: '30%',
      shippingCost: '₹52,52,024',
      shippingPercent: '21%',
      cogs: '₹77,28,961',
      cogsPercent: '30%',
      netProfit: '₹48,54,491',
      profitPercent: '19%',
      profitColor: 'text-green-400'
    },
  ]

  // Order Details Data
  const orderDetails = [
    {
      date: 'October',
      confirmed: '35,292',
      confirmedPercent: '100%',
      inTransit: '705',
      transitPercent: '2%',
      delivered: '30,350',
      deliveredPercent: '86%',
      rto: '4,235',
      rtoPercent: '12%'
    },
    {
      date: 'September',
      confirmed: '26,028',
      confirmedPercent: '100%',
      inTransit: '0',
      transitPercent: '0%',
      delivered: '21,863',
      deliveredPercent: '84%',
      rto: '4,165',
      rtoPercent: '16%'
    },
  ]

  // Quick Access Navigation
  const quickActions = [
    { title: 'Orders', icon: ShoppingBag, path: '/dashboard/orders', color: 'bg-blue-500' },
    { title: 'Inventory', icon: Package, path: '/dashboard/inventory', color: 'bg-green-500' },
    { title: 'Analytics', icon: BarChart3, path: '/dashboard/analytics', color: 'bg-purple-500' },
    { title: 'Reports', icon: FileText, path: '/dashboard/reports', color: 'bg-orange-500' },
    { title: 'Marketing', icon: Megaphone, path: '/dashboard/marketing', color: 'bg-red-500' },
    { title: 'Reviews', icon: Star, path: '/dashboard/reviews', color: 'bg-yellow-500' },
    { title: 'Support', icon: HelpCircle, path: '/dashboard/support', color: 'bg-indigo-500' },
    { title: 'Payments', icon: CreditCard, path: '/dashboard/payments', color: 'bg-teal-500' },
  ]

  const stats = [
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 bg-background min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Track your business performance and insights</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <HelpCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden xs:inline">Support</span>
          </Button>
          <Button variant="outline" size="sm" className="text-xs sm:text-sm">
            <span className="hidden xs:inline">Notices</span>
            <span className="xs:hidden">📢</span>
          </Button>
          <Button variant="outline" size="sm" className="rounded-full h-8 w-8 sm:h-10 sm:w-10 p-0 text-xs sm:text-sm">
            LY
          </Button>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 mb-6 sm:mb-8">
        {quickActions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className="h-12 sm:h-16 flex flex-col items-center justify-center gap-1 sm:gap-2 hover:bg-accent p-2"
            onClick={() => navigate(action.path)}
          >
            <div className={`p-1 sm:p-2 rounded-lg ${action.color} text-white`}>
              <action.icon className="h-3 w-3 sm:h-4 sm:w-4" />
            </div>
            <span className="text-xs font-medium truncate">{action.title}</span>
          </Button>
        ))}
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-4 sm:gap-6 xl:grid-cols-2">
        {/* Order & Revenue Trend */}
        <Card className="bg-card border border-border min-w-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">Order & Revenue Trend</CardTitle>
              <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Orders</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500"></div>
                  <span className="text-xs sm:text-sm text-muted-foreground">Order Revenue</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 self-start sm:self-center">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">📊</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">📋</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orderRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="orders" 
                    stroke="#22c55e" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="orderRevenue" 
                    stroke="#f97316" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4">
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">September</p>
                <p className="text-sm sm:text-lg font-bold text-green-500">₹5Cr</p>
                <p className="text-sm sm:text-lg font-bold">26K</p>
              </div>
              <div className="text-center">
                <p className="text-xs sm:text-sm text-muted-foreground">October</p>
                <p className="text-sm sm:text-lg font-bold text-orange-500">₹4Cr</p>
                <p className="text-sm sm:text-lg font-bold">₹2Cr</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RTO X Trend */}
        <Card className="bg-card border border-border min-w-0">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
            <div className="min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">RTO X Trend</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500"></div>
                <span className="text-xs sm:text-sm text-muted-foreground">RTO %</span>
              </div>
            </div>
            <div className="flex gap-2 self-start sm:self-center">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">📊</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">📋</Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ChartContainer config={chartConfig} className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={rtoData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tick={{ fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="rto" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
            <div className="text-center mt-4">
              <p className="text-xs sm:text-sm text-muted-foreground">September</p>
              <p className="text-lg sm:text-2xl font-bold text-blue-500">16%</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profit Trend Table */}
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
          <CardTitle className="text-base sm:text-lg">Profit Trend</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 self-start sm:self-center">📊</Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-left text-xs sm:text-sm whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Total Sales</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Marketing</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Shipping</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">COGS</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Net Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {profitData.map((item) => (
                  <TableRow key={item.date} className="border-border">
                    <TableCell className="font-medium text-xs sm:text-sm">{item.date}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.totalSales}</div>
                        <div className="text-xs text-blue-400">{item.salesPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.marketingCost}</div>
                        <div className="text-xs text-red-400">{item.marketingPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.shippingCost}</div>
                        <div className="text-xs text-red-400">{item.shippingPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.cogs}</div>
                        <div className="text-xs text-red-400">{item.cogsPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className={`font-medium text-xs sm:text-sm ${item.profitColor}`}>{item.netProfit}</div>
                        <div className={`text-xs ${item.profitColor}`}>{item.profitPercent}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Table */}
      <Card className="bg-card border border-border">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4">
          <CardTitle className="text-base sm:text-lg">Order Details</CardTitle>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 self-start sm:self-center">📊</Button>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-left text-xs sm:text-sm whitespace-nowrap">Date</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Confirmed</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">In-Transit</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">Delivered</TableHead>
                  <TableHead className="text-right text-xs sm:text-sm whitespace-nowrap">RTOed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.map((item) => (
                  <TableRow key={item.date} className="border-border">
                    <TableCell className="font-medium text-xs sm:text-sm">{item.date}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.confirmed}</div>
                        <div className="text-xs text-blue-400">{item.confirmedPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.inTransit}</div>
                        <div className="text-xs text-orange-400">{item.transitPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.delivered}</div>
                        <div className="text-xs text-green-400">{item.deliveredPercent}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div>
                        <div className="font-medium text-xs sm:text-sm">{item.rto}</div>
                        <div className="text-xs text-red-400">{item.rtoPercent}</div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

    </div>
  )
}

export default Dashboard