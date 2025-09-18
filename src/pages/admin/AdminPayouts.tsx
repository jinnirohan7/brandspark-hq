import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useAdminData } from '@/hooks/useAdminData'
import { useToast } from '@/hooks/use-toast'
import { 
  DollarSign, 
  Search, 
  Download, 
  Eye, 
  CheckCircle, 
  Clock, 
  XCircle,
  CreditCard,
  TrendingUp,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

export const AdminPayouts = () => {
  const { payouts, sellers, loading, processPayout } = useAdminData()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedPayout, setSelectedPayout] = useState<any>(null)
  const [processingPayout, setProcessingPayout] = useState<string | null>(null)
  const [transactionRef, setTransactionRef] = useState('')
  const [processingNotes, setProcessingNotes] = useState('')

  const filteredPayouts = payouts.filter(payout => {
    const seller = sellers.find(s => s.id === payout.seller_id)
    const matchesSearch = !searchTerm || 
      seller?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seller?.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.transaction_reference?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || payout.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const handleProcessPayout = async (payoutId: string, status: 'completed' | 'failed') => {
    if (!transactionRef && status === 'completed') {
      toast({
        title: "Error",
        description: "Transaction reference is required for completed payouts",
        variant: "destructive"
      })
      return
    }

    try {
      await processPayout(payoutId, status, transactionRef)
      toast({
        title: "Success",
        description: `Payout ${status} successfully`,
      })
      setProcessingPayout(null)
      setTransactionRef('')
      setProcessingNotes('')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process payout",
        variant: "destructive"
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'processing':
        return <Badge className="bg-blue-100 text-blue-800"><RefreshCw className="h-3 w-3 mr-1" />Processing</Badge>
      case 'failed':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const payoutStats = {
    total: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    totalAmount: payouts.reduce((sum, p) => sum + Number(p.amount), 0),
    pendingAmount: payouts.filter(p => p.status === 'pending').reduce((sum, p) => sum + Number(p.amount), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payout Management</h1>
          <p className="text-muted-foreground">Manage seller payouts and financial transactions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Payout Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutStats.total}</div>
            <p className="text-xs text-muted-foreground">
              ₹{(payoutStats.totalAmount / 100000).toFixed(1)}L total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              ₹{(payoutStats.pendingAmount / 100000).toFixed(1)}L pending
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payoutStats.completed}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">
              Payout success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payout Management */}
      <Card>
        <CardHeader>
          <CardTitle>Seller Payouts</CardTitle>
          <CardDescription>Process and manage seller payout requests</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search by seller name or transaction reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Seller</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Payout Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Transaction Ref</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayouts.map((payout) => {
                const seller = sellers.find(s => s.id === payout.seller_id)
                return (
                  <TableRow key={payout.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={seller?.profile_image_url} />
                          <AvatarFallback>{seller?.full_name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{seller?.full_name}</div>
                          <div className="text-sm text-muted-foreground">{seller?.company_name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">₹{Number(payout.amount).toLocaleString()}</div>
                        {payout.fees && Number(payout.fees) > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Fee: ₹{Number(payout.fees).toLocaleString()}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(payout.period_start).toLocaleDateString()} - 
                        {new Date(payout.period_end).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(payout.payout_date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(payout.status)}
                    </TableCell>
                    <TableCell>
                      {payout.transaction_reference ? (
                        <Badge variant="outline">{payout.transaction_reference}</Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedPayout(payout)}
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        {payout.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => setProcessingPayout(payout.id)}
                          >
                            <CreditCard className="h-3 w-3 mr-1" />
                            Process
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Payout Details Dialog */}
      <Dialog open={!!selectedPayout} onOpenChange={() => setSelectedPayout(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payout Details</DialogTitle>
            <DialogDescription>
              Complete payout information
            </DialogDescription>
          </DialogHeader>
          {selectedPayout && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Payout Information</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-medium">₹{Number(selectedPayout.amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fees:</span>
                      <span>₹{Number(selectedPayout.fees || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax Deducted:</span>
                      <span>₹{Number(selectedPayout.tax_deducted || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-1">
                      <span className="font-medium">Net Amount:</span>
                      <span className="font-bold">
                        ₹{(Number(selectedPayout.amount) - Number(selectedPayout.fees || 0) - Number(selectedPayout.tax_deducted || 0)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Period Details</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Period Start:</span>
                      <span>{new Date(selectedPayout.period_start).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Period End:</span>
                      <span>{new Date(selectedPayout.period_end).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payout Date:</span>
                      <span>{new Date(selectedPayout.payout_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      {getStatusBadge(selectedPayout.status)}
                    </div>
                  </div>
                </div>
              </div>

              {selectedPayout.bank_details && (
                <div className="space-y-2">
                  <h4 className="font-medium">Bank Details</h4>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    <p>Bank information available in system</p>
                  </div>
                </div>
              )}

              {selectedPayout.notes && (
                <div className="space-y-2">
                  <h4 className="font-medium">Notes</h4>
                  <div className="bg-muted/50 p-3 rounded text-sm">
                    {selectedPayout.notes}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Process Payout Dialog */}
      <Dialog open={!!processingPayout} onOpenChange={() => setProcessingPayout(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Payout</DialogTitle>
            <DialogDescription>
              Complete the payout process for this seller
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Transaction Reference</label>
              <Input
                placeholder="Enter transaction reference number"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Processing Notes (Optional)</label>
              <Textarea
                placeholder="Add any processing notes..."
                value={processingNotes}
                onChange={(e) => setProcessingNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setProcessingPayout(null)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => processingPayout && handleProcessPayout(processingPayout, 'failed')}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Mark as Failed
            </Button>
            <Button 
              onClick={() => processingPayout && handleProcessPayout(processingPayout, 'completed')}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Completed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}