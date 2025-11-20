import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DollarSign, TrendingUp, Clock, AlertTriangle, Download, Filter, Plus, CreditCard, RefreshCw } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

interface Payment {
  id: string
  amount: number
  type: 'sale' | 'refund' | 'payout' | 'fee'
  status: 'pending' | 'completed' | 'failed'
  gateway: string | null
  transaction_id: string | null
  processed_at: string | null
  created_at: string
  order_id?: string | null
}

interface RazorpayWindow extends Window {
  Razorpay: any
}

export default function Payments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sellerId, setSellerId] = useState<string>('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [createAmount, setCreateAmount] = useState('')
  const [refundAmount, setRefundAmount] = useState('')
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    fetchPayments()
    loadRazorpayScript()
  }, [])

  const loadRazorpayScript = () => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)
  }

  const fetchPayments = async () => {
    try {
      if (!user) return

      // Get seller profile first
      const { data: seller } = await supabase
        .from('sellers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!seller) return

      setSellerId(seller.id)

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayments((data || []) as Payment[])
    } catch (error) {
      console.error('Error fetching payments:', error)
      toast({
        title: "Error",
        description: "Failed to load payments",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Pending' },
      completed: { variant: 'default' as const, label: 'Completed' },
      failed: { variant: 'destructive' as const, label: 'Failed' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getTypeColor = (type: string) => {
    const colors = {
      sale: 'text-green-600',
      refund: 'text-red-600', 
      payout: 'text-blue-600',
      fee: 'text-orange-600'
    }
    return colors[type as keyof typeof colors] || 'text-gray-600'
  }

  const createRazorpayOrder = async () => {
    if (!createAmount || parseFloat(createAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-create-order', {
        body: {
          amount: parseFloat(createAmount),
          currency: 'INR',
          notes: {
            seller_id: sellerId
          }
        }
      })

      if (error) throw error

      const { order, keyId } = data

      // Initialize Razorpay checkout
      const options = {
        key: keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'Payment Gateway',
        description: 'Test Payment',
        order_id: order.id,
        handler: async function (response: any) {
          await verifyPayment(response)
        },
        prefill: {
          email: user?.email
        },
        theme: {
          color: '#3399cc'
        }
      }

      const razorpay = new (window as any).Razorpay(options)
      razorpay.open()

      setIsCreateDialogOpen(false)
      setCreateAmount('')
    } catch (error: any) {
      console.error('Error creating order:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to create payment order",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const verifyPayment = async (response: any) => {
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-verify-payment', {
        body: {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          seller_id: sellerId,
          amount: parseFloat(createAmount)
        }
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Payment completed successfully",
      })

      await fetchPayments()
    } catch (error: any) {
      console.error('Error verifying payment:', error)
      toast({
        title: "Verification Failed",
        description: error.message || "Payment verification failed",
        variant: "destructive",
      })
    }
  }

  const initiateRefund = async () => {
    if (!selectedPayment || !refundAmount || parseFloat(refundAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid refund amount",
        variant: "destructive",
      })
      return
    }

    if (parseFloat(refundAmount) > Math.abs(selectedPayment.amount)) {
      toast({
        title: "Invalid Amount",
        description: "Refund amount cannot exceed payment amount",
        variant: "destructive",
      })
      return
    }

    setProcessing(true)
    try {
      const { data, error } = await supabase.functions.invoke('razorpay-refund', {
        body: {
          payment_id: selectedPayment.transaction_id,
          amount: parseFloat(refundAmount),
          seller_id: sellerId,
          notes: {
            refund_for: selectedPayment.id
          }
        }
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Refund processed successfully",
      })

      setIsRefundDialogOpen(false)
      setSelectedPayment(null)
      setRefundAmount('')
      await fetchPayments()
    } catch (error: any) {
      console.error('Error processing refund:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to process refund",
        variant: "destructive",
      })
    } finally {
      setProcessing(false)
    }
  }

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.gateway?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const completedAmount = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0)
  const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0)
  const razorpayPayments = payments.filter(p => p.gateway === 'razorpay').length

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">Manage Razorpay payments and transactions</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchPayments} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Payment
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Razorpay Payment</DialogTitle>
                <DialogDescription>
                  Create a new payment order with Razorpay
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={createAmount}
                    onChange={(e) => setCreateAmount(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={createRazorpayOrder} disabled={processing}>
                  {processing ? 'Processing...' : 'Create & Pay'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{completedAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Awaiting processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.length > 0 ? Math.round((payments.filter(p => p.status === 'completed').length / payments.length) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Payment success rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Transactions</CardTitle>
          <CardDescription>Complete history of all payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all">All Payments</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
              <TabsTrigger value="payouts">Payouts</TabsTrigger>
              <TabsTrigger value="refunds">Refunds</TabsTrigger>
            </TabsList>

            <div className="flex items-center space-x-2">
              <Input
                placeholder="Search by transaction ID or gateway..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <TabsContent value="all" className="space-y-4">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Gateway</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.map((payment) => (
                      <TableRow key={payment.id}>
                        <TableCell className="font-medium">
                          {payment.transaction_id || payment.id.slice(0, 8)}
                        </TableCell>
                        <TableCell className={getTypeColor(payment.type)}>
                          {payment.type.charAt(0).toUpperCase() + payment.type.slice(1)}
                        </TableCell>
                        <TableCell>₹{Math.abs(payment.amount).toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge variant={payment.gateway === 'razorpay' ? 'default' : 'secondary'}>
                            {payment.gateway || 'N/A'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(payment.status)}</TableCell>
                        <TableCell>
                          {new Date(payment.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          {payment.gateway === 'razorpay' && payment.type === 'sale' && payment.status === 'completed' && (
                            <Dialog open={isRefundDialogOpen && selectedPayment?.id === payment.id} onOpenChange={(open) => {
                              if (!open) {
                                setIsRefundDialogOpen(false)
                                setSelectedPayment(null)
                                setRefundAmount('')
                              }
                            }}>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedPayment(payment)
                                    setIsRefundDialogOpen(true)
                                    setRefundAmount(Math.abs(payment.amount).toString())
                                  }}
                                >
                                  Refund
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Process Refund</DialogTitle>
                                  <DialogDescription>
                                    Refund payment via Razorpay
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label>Payment ID</Label>
                                    <Input value={payment.transaction_id || ''} disabled />
                                  </div>
                                  <div className="space-y-2">
                                    <Label>Original Amount</Label>
                                    <Input value={`₹${Math.abs(payment.amount).toFixed(2)}`} disabled />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="refund-amount">Refund Amount (₹)</Label>
                                    <Input
                                      id="refund-amount"
                                      type="number"
                                      placeholder="Enter refund amount"
                                      value={refundAmount}
                                      onChange={(e) => setRefundAmount(e.target.value)}
                                    />
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button onClick={initiateRefund} disabled={processing} variant="destructive">
                                    {processing ? 'Processing...' : 'Process Refund'}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            <TabsContent value="sales">
              <p className="text-center text-muted-foreground py-4">Sales payments view</p>
            </TabsContent>

            <TabsContent value="payouts">
              <p className="text-center text-muted-foreground py-4">Payout history view</p>
            </TabsContent>

            <TabsContent value="refunds">
              <p className="text-center text-muted-foreground py-4">Refund transactions view</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}