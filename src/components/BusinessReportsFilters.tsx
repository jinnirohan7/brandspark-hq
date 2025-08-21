import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { 
  Search, 
  Filter, 
  CalendarIcon, 
  Download, 
  Users, 
  Building, 
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Star
} from 'lucide-react'

interface BusinessReportsFiltersProps {
  onFilterChange: (filters: any) => void
  onExport: () => void
}

export function BusinessReportsFilters({ onFilterChange, onExport }: BusinessReportsFiltersProps) {
  const [asinSearch, setAsinSearch] = useState('')
  const [buyerType, setBuyerType] = useState('all')
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [performanceFilter, setPerformanceFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const handleAsinSearch = (value: string) => {
    setAsinSearch(value)
    onFilterChange({ asinSearch: value, buyerType, dateRange, performanceFilter, categoryFilter })
  }

  const handleBuyerTypeChange = (value: string) => {
    setBuyerType(value)
    onFilterChange({ asinSearch, buyerType: value, dateRange, performanceFilter, categoryFilter })
  }

  const mockASINSuggestions = [
    'B08N5WRWNW',
    'B09JQKN3X1',
    'B07ZPKL9K4',
    'B08HLZH5QJ',
    'B09DGS7VPN'
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Business Reports Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search by ASIN */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Search by ASIN</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Enter ASIN (e.g., B08N5WRWNW)"
              value={asinSearch}
              onChange={(e) => handleAsinSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {asinSearch && (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Suggestions:</p>
              <div className="flex flex-wrap gap-2">
                {mockASINSuggestions
                  .filter(asin => asin.toLowerCase().includes(asinSearch.toLowerCase()))
                  .map((asin) => (
                    <Badge 
                      key={asin} 
                      variant="outline" 
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      onClick={() => setAsinSearch(asin)}
                    >
                      {asin}
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Buyer Type Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Buyer Type</label>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={buyerType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleBuyerTypeChange('all')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              All Buyers
            </Button>
            <Button
              variant={buyerType === 'business' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleBuyerTypeChange('business')}
              className="flex items-center gap-2"
            >
              <Building className="h-4 w-4" />
              Business
            </Button>
            <Button
              variant={buyerType === 'individual' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleBuyerTypeChange('individual')}
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Individual
            </Button>
          </div>
        </div>

        {/* Performance Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Performance Category</label>
          <Select value={performanceFilter} onValueChange={setPerformanceFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select performance category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Performance</SelectItem>
              <SelectItem value="increasing-sales">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  Increasing Sales
                </div>
              </SelectItem>
              <SelectItem value="declining-sales">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  Declining Sales
                </div>
              </SelectItem>
              <SelectItem value="declining-traffic">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-orange-600" />
                  Declining Traffic
                </div>
              </SelectItem>
              <SelectItem value="below-market">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Below Market Average
                </div>
              </SelectItem>
              <SelectItem value="top-performers">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-blue-600" />
                  Top Performers
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Date Range</label>
          <div className="grid grid-cols-2 gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.from && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.from ? format(dateRange.from, "MMM dd") : "From"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.from}
                  onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !dateRange.to && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange.to ? format(dateRange.to, "MMM dd") : "To"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateRange.to}
                  onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Category Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Product Category</label>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="electronics">Electronics</SelectItem>
              <SelectItem value="clothing">Clothing & Accessories</SelectItem>
              <SelectItem value="home-garden">Home & Garden</SelectItem>
              <SelectItem value="books">Books</SelectItem>
              <SelectItem value="sports">Sports & Outdoors</SelectItem>
              <SelectItem value="health">Health & Beauty</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Export Button */}
        <Button onClick={onExport} className="w-full">
          <Download className="h-4 w-4 mr-2" />
          Export Filtered Report
        </Button>
      </CardContent>
    </Card>
  )
}