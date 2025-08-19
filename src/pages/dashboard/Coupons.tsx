import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { CalendarIcon, Plus, Percent, DollarSign, Users, TrendingUp, Eye, Copy, Edit, Trash2 } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

interface Coupon {
  id: string
  code: string
  name: string
  type: 'percentage' | 'fixed_amount'
  value: number
  min_order_amount: number
  usage_limit: number | null
  used_count: number
  is_active: boolean
  start_date: string | null
  end_date: string | null
  created_at: string
}

export default function Coupons() {
  const { user } = useAuth()
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [newCouponOpen, setNewCouponOpen] = useState(false)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    name: '',
    type: 'percentage' as 'percentage' | 'fixed_amount',
    value: 0,
    min_order_amount: 0,
    usage_limit: null as number | null,
    start_date: null as Date | null,
    end_date: null as Date | null
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      if (!user) return

      // Get seller profile first
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!seller) return

      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setCoupons((data || []) as Coupon[])
    } catch (error) {
      console.error('Error fetching coupons:', error)
      toast({
        title: "Error",
        description: "Failed to load coupons",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCoupon = async () => {
    try {
      if (!user) return

      // Get seller profile first
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!seller) return

      const { error } = await supabase
        .from('coupons')
        .insert({
          seller_id: seller.id,
          code: newCoupon.code.toUpperCase(),
          name: newCoupon.name,
          type: newCoupon.type,
          value: newCoupon.value,
          min_order_amount: newCoupon.min_order_amount,
          usage_limit: newCoupon.usage_limit,
          start_date: newCoupon.start_date?.toISOString() || null,
          end_date: newCoupon.end_date?.toISOString() || null
        })

      if (error) throw error
      
      toast({
        title: "Success",
        description: "Coupon created successfully",
      })
      
      setNewCouponOpen(false)
      setNewCoupon({
        code: '',
        name: '',
        type: 'percentage',
        value: 0,
        min_order_amount: 0,
        usage_limit: null,
        start_date: null,
        end_date: null
      })
      fetchCoupons()
    } catch (error: any) {
      console.error('Error creating coupon:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create coupon",
        variant: "destructive",
      })
    }
  }

  const toggleCouponStatus = async (couponId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: isActive })
        .eq('id', couponId)

      if (error) throw error
      
      toast({
        title: "Success",
        description: `Coupon ${isActive ? 'activated' : 'deactivated'} successfully`,
      })
      
      fetchCoupons()
    } catch (error) {
      console.error('Error updating coupon:', error)
      toast({
        title: "Error",
        description: "Failed to update coupon status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (coupon: Coupon) => {
    if (!coupon.is_active) {
      return <Badge variant="destructive">Inactive</Badge>
    }
    
    const now = new Date()
    const endDate = coupon.end_date ? new Date(coupon.end_date) : null
    const startDate = coupon.start_date ? new Date(coupon.start_date) : null
    
    if (startDate && startDate > now) {
      return <Badge variant="secondary">Scheduled</Badge>
    }
    
    if (endDate && endDate < now) {
      return <Badge variant="destructive">Expired</Badge>
    }
    
    if (coupon.usage_limit && coupon.used_count >= coupon.usage_limit) {
      return <Badge variant="destructive">Limit Reached</Badge>
    }
    
    return <Badge variant="default">Active</Badge>
  }

  const couponStats = {
    total: coupons.length,
    active: coupons.filter(c => c.is_active).length,
    totalUsed: coupons.reduce((sum, c) => sum + c.used_count, 0),
    totalSavings: 1250 // Mock data - would be calculated from actual usage
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-8 bg-muted rounded w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Coupons & Discounts</h1>
          <p className="text-muted-foreground">Create and manage discount codes for your customers</p>
        </div>
        <Dialog open={newCouponOpen} onOpenChange={setNewCouponOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
              <DialogDescription>
                Set up a new discount code for your customers
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coupon-code">Coupon Code</Label>
                <Input
                  id="coupon-code"
                  placeholder="e.g., SAVE20"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="coupon-name">Display Name</Label>
                <Input
                  id="coupon-name"
                  placeholder="e.g., 20% Off Sale"
                  value={newCoupon.name}
                  onChange={(e) => setNewCoupon({ ...newCoupon, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Discount Type</Label>
                  <Select 
                    value={newCoupon.type} 
                    onValueChange={(value: 'percentage' | 'fixed_amount') => 
                      setNewCoupon({ ...newCoupon, type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="fixed_amount">Fixed Amount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discount-value">
                    Value {newCoupon.type === 'percentage' ? '(%)' : '(₹)'}
                  </Label>
                  <Input
                    id="discount-value"
                    type="number"
                    value={newCoupon.value || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, value: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="min-order">Min Order (₹)</Label>
                  <Input
                    id="min-order"
                    type="number"
                    value={newCoupon.min_order_amount || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, min_order_amount: Number(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usage-limit">Usage Limit</Label>
                  <Input
                    id="usage-limit"
                    type="number"
                    placeholder="Unlimited"
                    value={newCoupon.usage_limit || ''}
                    onChange={(e) => setNewCoupon({ ...newCoupon, usage_limit: e.target.value ? Number(e.target.value) : null })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newCoupon.start_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCoupon.start_date ? format(newCoupon.start_date, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCoupon.start_date || undefined}
                        onSelect={(date) => setNewCoupon({ ...newCoupon, start_date: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newCoupon.end_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCoupon.end_date ? format(newCoupon.end_date, "PPP") : <span>Pick date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCoupon.end_date || undefined}
                        onSelect={(date) => setNewCoupon({ ...newCoupon, end_date: date || null })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={handleCreateCoupon} className="flex-1">
                  Create Coupon
                </Button>
                <Button variant="outline" onClick={() => setNewCouponOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coupons</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponStats.total}</div>
            <p className="text-xs text-muted-foreground">Created coupons</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Coupons</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponStats.active}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Uses</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{couponStats.totalUsed}</div>
            <p className="text-xs text-muted-foreground">Times redeemed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customer Savings</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{couponStats.totalSavings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total discounts given</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Coupons</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Coupon Management</CardTitle>
              <CardDescription>Manage all your discount codes and promotions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Used/Limit</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coupons.map((coupon) => (
                      <TableRow key={coupon.id}>
                        <TableCell className="font-mono font-medium">{coupon.code}</TableCell>
                        <TableCell>{coupon.name}</TableCell>
                        <TableCell className="capitalize">{coupon.type.replace('_', ' ')}</TableCell>
                        <TableCell>
                          {coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}
                        </TableCell>
                        <TableCell>
                          {coupon.used_count}{coupon.usage_limit ? `/${coupon.usage_limit}` : '/∞'}
                        </TableCell>
                        <TableCell>{getStatusBadge(coupon)}</TableCell>
                        <TableCell>
                          {coupon.end_date ? new Date(coupon.end_date).toLocaleDateString('en-IN') : 'Never'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm">
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={coupon.is_active}
                              onCheckedChange={(checked) => toggleCouponStatus(coupon.id, checked)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active">
          <p className="text-center text-muted-foreground py-4">Active coupons view</p>
        </TabsContent>

        <TabsContent value="expired">
          <p className="text-center text-muted-foreground py-4">Expired coupons view</p>
        </TabsContent>

        <TabsContent value="scheduled">
          <p className="text-center text-muted-foreground py-4">Scheduled coupons view</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}