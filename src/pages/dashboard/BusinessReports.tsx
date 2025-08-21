import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BusinessReportsFilters } from '@/components/BusinessReportsFilters'
import { ASINPerformanceAnalysis } from '@/components/ASINPerformanceAnalysis'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import {
  Building,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Eye,
  ShoppingCart,
  Download
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function BusinessReports() {
  const { toast } = useToast()
  const [activeFilters, setActiveFilters] = useState<any>({})

  // Mock data for business vs individual buyers
  const buyerTypeData = [
    { month: 'Jan', business: 45000, individual: 32000 },
    { month: 'Feb', business: 52000, individual: 38000 },
    { month: 'Mar', business: 48000, individual: 35000 },
    { month: 'Apr', business: 61000, individual: 42000 },
    { month: 'May', business: 55000, individual: 39000 },
    { month: 'Jun', business: 67000, individual: 48000 }
  ]

  const salesTrendData = [
    { week: 'Week 1', sales: 12500, traffic: 8900, conversion: 6.2 },
    { week: 'Week 2', sales: 14200, traffic: 9650, conversion: 6.8 },
    { week: 'Week 3', sales: 13800, traffic: 9200, conversion: 6.5 },
    { week: 'Week 4', sales: 15600, traffic: 10800, conversion: 7.1 }
  ]

  const categoryPerformance = [
    { name: 'Electronics', value: 35, color: '#8884d8' },
    { name: 'Clothing', value: 25, color: '#82ca9d' },
    { name: 'Home & Garden', value: 20, color: '#ffc658' },
    { name: 'Books', value: 12, color: '#ff7300' },
    { name: 'Sports', value: 8, color: '#00ff88' }
  ]

  const businessMetrics = [
    {
      title: 'Business Buyers Revenue',
      value: '₹3,42,000',
      change: '+18.5%',
      icon: Building,
      percentage: 68
    },
    {
      title: 'Individual Buyers Revenue',
      value: '₹1,64,000',
      change: '+12.3%',
      icon: Users,
      percentage: 32
    },
    {
      title: 'Average Order Value (Business)',
      value: '₹2,850',
      change: '+8.7%',
      icon: ShoppingCart,
      percentage: 85
    },
    {
      title: 'Conversion Rate Improvement',
      value: '7.2%',
      change: '+0.8%',
      icon: TrendingUp,
      percentage: 72
    }
  ]

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters)
    // In a real app, this would trigger data refetch
  }

  const handleExport = () => {
    toast({
      title: "Export Started",
      description: "Your business report is being prepared for download.",
    })
  }

  const handleDeepDiveExport = () => {
    toast({
      title: "Deep Dive Report Generated",
      description: "Comprehensive ASIN performance analysis has been exported.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Business Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis with business vs individual buyer insights
          </p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export Full Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3 space-y-6">
          {/* Business Metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {businessMetrics.map((metric, index) => {
              const Icon = metric.icon
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{metric.value}</div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-green-600">{metric.change} from last period</p>
                    </div>
                    <Progress value={metric.percentage} className="mt-2 h-2" />
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <Tabs defaultValue="sales-comparison" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sales-comparison">Sales Dashboard</TabsTrigger>
              <TabsTrigger value="deep-dive">Deep Dive ASIN Performance</TabsTrigger>
              <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
              <TabsTrigger value="categories">Category Analysis</TabsTrigger>
            </TabsList>

            <TabsContent value="sales-comparison">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Business vs Individual Buyers</CardTitle>
                      <div className="flex gap-2">
                        <Badge className="bg-blue-100 text-blue-800">Business</Badge>
                        <Badge className="bg-green-100 text-green-800">Individual</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={buyerTypeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value: any) => [
                            new Intl.NumberFormat('en-IN', { 
                              style: 'currency', 
                              currency: 'INR',
                              maximumFractionDigits: 0 
                            }).format(value), 
                            'Revenue'
                          ]}
                        />
                        <Bar dataKey="business" fill="#3b82f6" name="Business Buyers" />
                        <Bar dataKey="individual" fill="#10b981" name="Individual Buyers" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={categoryPerformance}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="deep-dive">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Deep Dive Your ASIN Performance</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        At-a-glance view of top-performing ASINs with weekly data updates
                      </p>
                    </div>
                    <Button onClick={handleDeepDiveExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export Analysis
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ASINPerformanceAnalysis />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trends">
              <Card>
                <CardHeader>
                  <CardTitle>Weekly Performance Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={salesTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="week" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Line 
                        yAxisId="left" 
                        type="monotone" 
                        dataKey="sales" 
                        stroke="#8884d8" 
                        strokeWidth={2}
                        name="Sales (₹)"
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="traffic" 
                        stroke="#82ca9d" 
                        strokeWidth={2}
                        name="Traffic"
                      />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="conversion" 
                        stroke="#ffc658" 
                        strokeWidth={2}
                        name="Conversion %"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Category Performance Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryPerformance.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm">{category.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={category.value * 2} className="w-20 h-2" />
                            <span className="text-sm font-medium">{category.value}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Business Buyer Insights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm">Average Order Size</span>
                        <span className="font-medium">2.8x larger</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm">Repeat Purchase Rate</span>
                        <span className="font-medium">65%</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm">Peak Buying Hours</span>
                        <span className="font-medium">9 AM - 5 PM</span>
                      </div>
                      <div className="flex justify-between items-center p-3 border rounded-lg">
                        <span className="text-sm">Preferred Categories</span>
                        <span className="font-medium">Electronics, Office</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="lg:col-span-1">
          <BusinessReportsFilters 
            onFilterChange={handleFilterChange}
            onExport={handleExport}
          />
        </div>
      </div>
    </div>
  )
}