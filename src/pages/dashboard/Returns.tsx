import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { RotateCcw, CheckCircle, XCircle, Clock, Filter, Search, Eye } from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from '@/hooks/use-toast'

interface Return {
  id: string
  order_id: string
  reason: string
  status: 'requested' | 'approved' | 'rejected' | 'processed'
  refund_amount: number | null
  notes: string | null
  created_at: string
  updated_at: string
}

export default function Returns() {
  const { user } = useAuth()
  const [returns, setReturns] = useState<Return[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null)

  useEffect(() => {
    fetchReturns()
  }, [])

  const fetchReturns = async () => {
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
        .from('returns')
        .select('*')
        .eq('seller_id', seller.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReturns((data || []) as Return[])
    } catch (error) {
      console.error('Error fetching returns:', error)
      toast({
        title: "Error",
        description: "Failed to load returns",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (returnId: string, newStatus: string, notes?: string) => {
    try {
      const { error } = await supabase
        .from('returns')
        .update({ 
          status: newStatus,
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', returnId)

      if (error) throw error
      
      toast({
        title: "Success",
        description: "Return status updated successfully",
      })
      
      fetchReturns()
    } catch (error) {
      console.error('Error updating return:', error)
      toast({
        title: "Error", 
        description: "Failed to update return status",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { variant: 'secondary' as const, label: 'Requested' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      processed: { variant: 'outline' as const, label: 'Processed' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.requested
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const filteredReturns = returns.filter(returnItem => {
    const matchesSearch = returnItem.order_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         returnItem.reason.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const returnStats = {
    total: returns.length,
    pending: returns.filter(r => r.status === 'requested').length,
    approved: returns.filter(r => r.status === 'approved').length,
    processed: returns.filter(r => r.status === 'processed').length
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
          <h1 className="text-3xl font-bold">Returns & Refunds</h1>
          <p className="text-muted-foreground">Manage customer returns and process refunds</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnStats.total}</div>
            <p className="text-xs text-muted-foreground">All time returns</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnStats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting your action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnStats.approved}</div>
            <p className="text-xs text-muted-foreground">Ready for processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{returnStats.processed}</div>
            <p className="text-xs text-muted-foreground">Completed returns</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Returns</TabsTrigger>
          <TabsTrigger value="pending">Pending Review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="processed">Processed</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Return Requests</CardTitle>
              <CardDescription>Manage all customer return requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by order ID or reason..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="requested">Requested</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="processed">Processed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Refund Amount</TableHead>
                      <TableHead>Date Requested</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReturns.map((returnItem) => (
                      <TableRow key={returnItem.id}>
                        <TableCell className="font-medium">{returnItem.order_id}</TableCell>
                        <TableCell>{returnItem.reason}</TableCell>
                        <TableCell>{getStatusBadge(returnItem.status)}</TableCell>
                        <TableCell>
                          {returnItem.refund_amount ? `₹${returnItem.refund_amount.toLocaleString()}` : 'TBD'}
                        </TableCell>
                        <TableCell>
                          {new Date(returnItem.created_at).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setSelectedReturn(returnItem)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Return Request Details</DialogTitle>
                                  <DialogDescription>
                                    Review and manage this return request
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedReturn && (
                                  <div className="space-y-4">
                                    <div>
                                      <label className="text-sm font-medium">Order ID</label>
                                      <p>{selectedReturn.order_id}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Return Reason</label>
                                      <p>{selectedReturn.reason}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm font-medium">Current Status</label>
                                      <div className="mt-1">{getStatusBadge(selectedReturn.status)}</div>
                                    </div>
                                    {selectedReturn.notes && (
                                      <div>
                                        <label className="text-sm font-medium">Notes</label>
                                        <p className="text-sm text-muted-foreground">{selectedReturn.notes}</p>
                                      </div>
                                    )}
                                    {selectedReturn.status === 'requested' && (
                                      <div className="flex gap-2 pt-4">
                                        <Button 
                                          onClick={() => handleStatusUpdate(selectedReturn.id, 'approved')}
                                          className="flex-1"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve
                                        </Button>
                                        <Button 
                                          variant="destructive" 
                                          onClick={() => handleStatusUpdate(selectedReturn.id, 'rejected')}
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
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

        <TabsContent value="pending">
          <p className="text-center text-muted-foreground py-4">Pending returns view</p>
        </TabsContent>

        <TabsContent value="approved">
          <p className="text-center text-muted-foreground py-4">Approved returns view</p>
        </TabsContent>

        <TabsContent value="processed">
          <p className="text-center text-muted-foreground py-4">Processed returns view</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}