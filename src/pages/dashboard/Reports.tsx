import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Download, FileText, TrendingUp, DollarSign, Package, Users, AlertCircle, CheckCircle, Clock, Eye, Loader2 } from 'lucide-react'
import { useReportsData } from '@/hooks/useReportsData'
import { useToast } from '@/hooks/use-toast'

export default function Reports() {
  const { toast } = useToast()
  const { reports, loading, generateReport, downloadReport } = useReportsData()
  
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [reportType, setReportType] = useState('sales')
  const [timeframe, setTimeframe] = useState('monthly')
  const [format, setFormat] = useState<'csv' | 'excel' | 'pdf'>('csv')
  const [includeFields, setIncludeFields] = useState<string[]>(['sales_summary', 'product_performance'])
  const [generating, setGenerating] = useState(false)

  const reportTypes = [
    { value: 'sales', label: 'Sales Performance Report', description: 'Revenue, orders, and performance metrics' },
    { value: 'inventory', label: 'Inventory Analysis Report', description: 'Stock levels, turnover, and reorder alerts' },
    { value: 'customer', label: 'Customer Analytics Report', description: 'Customer behavior, retention, and demographics' },
    { value: 'financial', label: 'Financial Summary Report', description: 'Payments, refunds, and financial breakdown' },
    { value: 'product', label: 'Product Performance Report', description: 'Top products, categories, and trends' },
    { value: 'marketing', label: 'Marketing Campaign Report', description: 'Campaign performance and ROI analysis' }
  ]

  const reportFields = [
    { id: 'sales_summary', label: 'Sales Summary', description: 'Total revenue, orders, and basic metrics' },
    { id: 'product_performance', label: 'Product Performance', description: 'Best/worst performing products' },
    { id: 'customer_analytics', label: 'Customer Analytics', description: 'Customer behavior and insights' },
    { id: 'financial_breakdown', label: 'Financial Breakdown', description: 'Detailed financial analysis' },
    { id: 'inventory_status', label: 'Inventory Status', description: 'Current stock levels and alerts' },
    { id: 'order_details', label: 'Order Details', description: 'Detailed order information' },
    { id: 'payment_analysis', label: 'Payment Analysis', description: 'Payment methods and status' },
    { id: 'geographical_data', label: 'Geographical Data', description: 'Sales by location and region' }
  ]

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Date Range Required",
        description: "Please select both start and end dates for the report.",
        variant: "destructive"
      })
      return
    }

    if (startDate >= endDate) {
      toast({
        title: "Invalid Date Range",
        description: "End date must be after start date.",
        variant: "destructive"
      })
      return
    }

    if (includeFields.length === 0) {
      toast({
        title: "Report Fields Required",
        description: "Please select at least one field to include in the report.",
        variant: "destructive"
      })
      return
    }

    try {
      setGenerating(true)
      await generateReport({
        reportType,
        startDate,
        endDate,
        timeframe,
        includeFields,
        format
      })

      toast({
        title: "Report Generation Started",
        description: "Your report is being generated. You'll be notified when it's ready.",
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Failed to generate report",
        variant: "destructive"
      })
    } finally {
      setGenerating(false)
    }
  }

  const handleDownload = async (reportId: string) => {
    try {
      await downloadReport(reportId)
      toast({
        title: "Download Started",
        description: "Your report download has started.",
      })
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error instanceof Error ? error.message : "Failed to download report",
        variant: "destructive"
      })
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'processing':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return <Clock className="h-4 w-4 text-orange-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Ready</Badge>
      case 'processing':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Processing</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Queued</Badge>
    }
  }

  const mockReports = [
    {
      id: 1,
      name: 'Sales Summary - December 2024',
      type: 'Sales',
      date: '2024-12-15',
      status: 'Ready',
      size: '2.3 MB'
    },
    {
      id: 2,
      name: 'Inventory Analysis - November 2024',
      type: 'Inventory',
      date: '2024-11-30',
      status: 'Ready',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'Customer Insights - Q4 2024',
      type: 'Customer',
      date: '2024-12-01',
      status: 'Processing',
      size: '-'
    }
  ]

  const quickStats = [
    {
      title: 'Total Sales',
      value: '₹2,45,690',
      change: '+12.5%',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+8.2%',
      icon: Package,
      color: 'text-blue-600'
    },
    {
      title: 'Customers',
      value: '892',
      change: '+15.3%',
      icon: Users,
      color: 'text-purple-600'
    },
    {
      title: 'Growth Rate',
      value: '23.8%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'text-orange-600'
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and download business reports</p>
        </div>
        <Button onClick={handleGenerateReport} disabled={generating}>
          {generating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Download className="h-4 w-4 mr-2" />
          )}
          {generating ? 'Generating...' : 'Generate Report'}
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="generate" className="space-y-4">
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Create custom reports based on your requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6">
                {/* Report Type Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Report Type</label>
                  <div className="grid gap-3 md:grid-cols-2">
                    {reportTypes.map((type) => (
                      <div
                        key={type.value}
                        className={cn(
                          "p-4 border rounded-lg cursor-pointer transition-colors",
                          reportType === type.value 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => setReportType(type.value)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium text-sm">{type.label}</h4>
                            <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                          </div>
                          <div className={cn(
                            "w-4 h-4 rounded-full border-2 mt-1",
                            reportType === type.value 
                              ? "border-primary bg-primary" 
                              : "border-muted-foreground"
                          )} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Date Range and Format */}
                <div className="grid gap-4 md:grid-cols-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "MMM dd, yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timeframe</label>
                    <Select value={timeframe} onValueChange={setTimeframe}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select value={format} onValueChange={(value: 'csv' | 'excel' | 'pdf') => setFormat(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="excel">Excel</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Report Contents */}
                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Report Contents</h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    {reportFields.map((field) => (
                      <div key={field.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                        <Checkbox
                          id={field.id}
                          checked={includeFields.includes(field.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setIncludeFields([...includeFields, field.id])
                            } else {
                              setIncludeFields(includeFields.filter(id => id !== field.id))
                            }
                          }}
                        />
                        <div className="flex-1">
                          <label htmlFor={field.id} className="text-sm font-medium cursor-pointer">
                            {field.label}
                          </label>
                          <p className="text-xs text-muted-foreground mt-1">{field.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleGenerateReport} disabled={generating}>
                    {generating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    {generating ? 'Generating...' : 'Generate Report'}
                  </Button>
                  <Button variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>View and download previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border rounded-lg animate-pulse">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg" />
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded w-48" />
                          <div className="h-3 bg-muted rounded w-64" />
                        </div>
                      </div>
                      <div className="h-8 bg-muted rounded w-20" />
                    </div>
                  ))}
                </div>
              ) : reports.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Reports Generated</h3>
                  <p className="text-muted-foreground mb-4">
                    Generate your first report to see it here
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-medium flex items-center gap-2">
                            {report.name}
                            {getStatusIcon(report.status)}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {report.type.charAt(0).toUpperCase() + report.type.slice(1)} • 
                            Generated on {new Date(report.created_at).toLocaleDateString('en-IN')}
                            {report.file_size && ` • ${(report.file_size / (1024 * 1024)).toFixed(1)} MB`}
                            {report.error_message && (
                              <span className="text-destructive"> • {report.error_message}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(report.status)}
                        {report.status === 'completed' && report.file_url && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDownload(report.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Set up automatic report generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Scheduled Reports</h3>
                <p className="text-muted-foreground mb-4">
                  Set up automatic reports to be generated and delivered to your email
                </p>
                <Button>Schedule Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}