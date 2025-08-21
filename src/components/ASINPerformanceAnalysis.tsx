import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Star, 
  Eye, 
  ShoppingCart,
  DollarSign,
  Users
} from 'lucide-react'

interface ASINData {
  asin: string
  productName: string
  category: string
  currentSales: number
  previousSales: number
  salesChange: number
  currentTraffic: number
  previousTraffic: number
  trafficChange: number
  conversionRate: number
  marketAverage: number
  ranking: number
  revenue: number
}

export function ASINPerformanceAnalysis() {
  // Mock data for different ASIN performance categories
  const asinData: ASINData[] = [
    {
      asin: 'B08N5WRWNW',
      productName: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      currentSales: 245,
      previousSales: 198,
      salesChange: 23.7,
      currentTraffic: 3420,
      previousTraffic: 2890,
      trafficChange: 18.3,
      conversionRate: 7.2,
      marketAverage: 6.8,
      ranking: 12,
      revenue: 85680
    },
    {
      asin: 'B09JQKN3X1',
      productName: 'Smart Fitness Tracker',
      category: 'Health & Fitness',
      currentSales: 189,
      previousSales: 234,
      salesChange: -19.2,
      currentTraffic: 2890,
      previousTraffic: 3120,
      trafficChange: -7.4,
      conversionRate: 6.5,
      marketAverage: 7.2,
      ranking: 28,
      revenue: 52340
    },
    {
      asin: 'B07ZPKL9K4',
      productName: 'Organic Coffee Beans',
      category: 'Grocery',
      currentSales: 156,
      previousSales: 189,
      salesChange: -17.5,
      currentTraffic: 1890,
      previousTraffic: 2340,
      trafficChange: -19.2,
      conversionRate: 8.3,
      marketAverage: 9.1,
      ranking: 45,
      revenue: 28920
    },
    {
      asin: 'B08HLZH5QJ',
      productName: 'Gaming Mechanical Keyboard',
      category: 'Electronics',
      currentSales: 98,
      previousSales: 145,
      salesChange: -32.4,
      currentTraffic: 1560,
      previousTraffic: 1890,
      trafficChange: -17.5,
      conversionRate: 6.3,
      marketAverage: 7.8,
      ranking: 78,
      revenue: 19600
    },
    {
      asin: 'B09DGS7VPN',
      productName: 'Yoga Mat with Alignment Lines',
      category: 'Sports',
      currentSales: 312,
      previousSales: 278,
      salesChange: 12.2,
      currentTraffic: 4560,
      previousTraffic: 4120,
      trafficChange: 10.7,
      conversionRate: 6.8,
      marketAverage: 5.9,
      ranking: 8,
      revenue: 62400
    }
  ]

  const increasingSales = asinData.filter(item => item.salesChange > 0)
  const decliningSales = asinData.filter(item => item.salesChange < 0)
  const decliningTraffic = asinData.filter(item => item.trafficChange < 0)
  const belowMarketAverage = asinData.filter(item => item.conversionRate < item.marketAverage)

  const getPerformanceIcon = (change: number) => {
    return change > 0 ? 
      <TrendingUp className="h-4 w-4 text-green-600" /> : 
      <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getPerformanceBadge = (change: number) => {
    if (change > 15) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>
    if (change > 5) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>
    if (change > -5) return <Badge className="bg-yellow-100 text-yellow-800">Stable</Badge>
    if (change > -15) return <Badge className="bg-orange-100 text-orange-800">Declining</Badge>
    return <Badge className="bg-red-100 text-red-800">Critical</Badge>
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { 
      style: 'currency', 
      currency: 'INR',
      maximumFractionDigits: 0 
    }).format(amount)
  }

  const renderASINTable = (data: ASINData[], title: string, icon: React.ReactNode) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
          <Badge variant="secondary">{data.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ASIN / Product</TableHead>
              <TableHead>Sales Change</TableHead>
              <TableHead>Traffic Change</TableHead>
              <TableHead>Conversion Rate</TableHead>
              <TableHead>Revenue</TableHead>
              <TableHead>Ranking</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.asin}>
                <TableCell>
                  <div>
                    <div className="font-medium">{item.asin}</div>
                    <div className="text-sm text-muted-foreground">{item.productName}</div>
                    <Badge variant="outline" className="text-xs">{item.category}</Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(item.salesChange)}
                    <span className={item.salesChange > 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.salesChange > 0 ? '+' : ''}{item.salesChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.currentSales} vs {item.previousSales}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getPerformanceIcon(item.trafficChange)}
                    <span className={item.trafficChange > 0 ? 'text-green-600' : 'text-red-600'}>
                      {item.trafficChange > 0 ? '+' : ''}{item.trafficChange.toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {item.currentTraffic.toLocaleString()} views
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.conversionRate}%</span>
                      {item.conversionRate >= item.marketAverage ? (
                        <Badge className="bg-green-100 text-green-800 text-xs">Above Market</Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 text-xs">Below Market</Badge>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Market avg: {item.marketAverage}%
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  {formatCurrency(item.revenue)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">#{item.ranking}</span>
                    {item.ranking <= 20 && <Star className="h-4 w-4 text-yellow-500" />}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performing ASINs</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{asinData.filter(item => item.ranking <= 20).length}</div>
            <p className="text-xs text-muted-foreground">In top 20 rankings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Increasing Sales</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{increasingSales.length}</div>
            <p className="text-xs text-muted-foreground">ASINs with growth</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Needs Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{decliningSales.length + decliningTraffic.length}</div>
            <p className="text-xs text-muted-foreground">ASINs declining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Below Market Average</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{belowMarketAverage.length}</div>
            <p className="text-xs text-muted-foreground">Low conversion rates</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="increasing-sales" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="increasing-sales">Increasing Sales</TabsTrigger>
          <TabsTrigger value="declining-sales">Declining Sales</TabsTrigger>
          <TabsTrigger value="declining-traffic">Declining Traffic</TabsTrigger>
          <TabsTrigger value="below-market">Below Market Avg</TabsTrigger>
        </TabsList>

        <TabsContent value="increasing-sales">
          {renderASINTable(
            increasingSales, 
            "ASINs with Increasing Sales", 
            <TrendingUp className="h-5 w-5 text-green-600" />
          )}
        </TabsContent>

        <TabsContent value="declining-sales">
          {renderASINTable(
            decliningSales, 
            "ASINs with Declining Sales", 
            <TrendingDown className="h-5 w-5 text-red-600" />
          )}
        </TabsContent>

        <TabsContent value="declining-traffic">
          {renderASINTable(
            decliningTraffic, 
            "ASINs with Declining Traffic", 
            <Eye className="h-5 w-5 text-orange-600" />
          )}
        </TabsContent>

        <TabsContent value="below-market">
          {renderASINTable(
            belowMarketAverage, 
            "ASINs Performing Below Market Average", 
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}