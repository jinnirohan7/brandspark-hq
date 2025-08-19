import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Shield, FileText, Clock, CheckCircle, XCircle, Plus, Eye } from 'lucide-react'

export default function Claims() {
  const [newClaimOpen, setNewClaimOpen] = useState(false)

  const claims = [
    {
      id: 'CLM-001',
      type: 'Damage',
      orderId: 'ORD-2024-001',
      amount: 2500,
      status: 'pending',
      description: 'Product damaged during delivery',
      dateSubmitted: '2024-01-20',
      courier: 'BlueDart',
      evidence: ['photo1.jpg', 'invoice.pdf']
    },
    {
      id: 'CLM-002',
      type: 'Lost Package',
      orderId: 'ORD-2024-002', 
      amount: 1800,
      status: 'approved',
      description: 'Package lost in transit',
      dateSubmitted: '2024-01-18',
      courier: 'Delhivery',
      evidence: ['tracking.pdf']
    },
    {
      id: 'CLM-003',
      type: 'Wrong Delivery',
      orderId: 'ORD-2024-003',
      amount: 3200,
      status: 'rejected',
      description: 'Delivered to wrong address',
      dateSubmitted: '2024-01-15',
      courier: 'Ekart',
      evidence: ['delivery_proof.jpg']
    }
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: 'secondary' as const, label: 'Under Review' },
      approved: { variant: 'default' as const, label: 'Approved' },
      rejected: { variant: 'destructive' as const, label: 'Rejected' },
      paid: { variant: 'outline' as const, label: 'Paid' }
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const claimTypes = [
    'Damage in Transit',
    'Lost Package', 
    'Wrong Delivery',
    'Delayed Delivery',
    'Return to Origin',
    'Packaging Issue'
  ]

  const courierPartners = ['BlueDart', 'Delhivery', 'Ekart', 'XpressBees', 'DTDC']

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Claims Management</h1>
          <p className="text-muted-foreground">File and track claims for damages and losses</p>
        </div>
        <Dialog open={newClaimOpen} onOpenChange={setNewClaimOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              File New Claim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>File New Claim</DialogTitle>
              <DialogDescription>
                Submit a claim for damages, losses, or delivery issues
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="claimType">Claim Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    {claimTypes.map((type) => (
                      <SelectItem key={type} value={type.toLowerCase().replace(' ', '_')}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input id="orderId" placeholder="Enter order ID" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courier">Courier Partner</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select courier" />
                  </SelectTrigger>
                  <SelectContent>
                    {courierPartners.map((courier) => (
                      <SelectItem key={courier} value={courier.toLowerCase()}>
                        {courier}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Claim Amount (₹)</Label>
                <Input id="amount" type="number" placeholder="Enter claim amount" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Describe the issue in detail..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Evidence (Photos/Documents)</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                  <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag files here</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setNewClaimOpen(false)} className="flex-1">
                  Submit Claim
                </Button>
                <Button variant="outline" onClick={() => setNewClaimOpen(false)}>
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
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.length}</div>
            <p className="text-xs text-muted-foreground">All time claims</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {claims.filter(c => c.status === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">Under review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {claims.filter(c => c.status === 'approved').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for payout</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Recovery</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{claims.filter(c => c.status === 'approved').reduce((sum, c) => sum + c.amount, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Approved amount</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Claims</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>Claims History</CardTitle>
              <CardDescription>Track all your filed claims and their status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Claim ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Courier</TableHead>
                      <TableHead>Date Submitted</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {claims.map((claim) => (
                      <TableRow key={claim.id}>
                        <TableCell className="font-medium">{claim.id}</TableCell>
                        <TableCell>{claim.type}</TableCell>
                        <TableCell>{claim.orderId}</TableCell>
                        <TableCell>₹{claim.amount.toLocaleString()}</TableCell>
                        <TableCell>{getStatusBadge(claim.status)}</TableCell>
                        <TableCell>{claim.courier}</TableCell>
                        <TableCell>
                          {new Date(claim.dateSubmitted).toLocaleDateString('en-IN')}
                        </TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Claim Details - {claim.id}</DialogTitle>
                                <DialogDescription>
                                  Review claim information and status
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Type</label>
                                    <p>{claim.type}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Status</label>
                                    <div className="mt-1">{getStatusBadge(claim.status)}</div>
                                  </div>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Description</label>
                                  <p className="text-sm text-muted-foreground">{claim.description}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Evidence Files</label>
                                  <div className="flex gap-2 mt-1">
                                    {claim.evidence.map((file, index) => (
                                      <Badge key={index} variant="outline">{file}</Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
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
          <p className="text-center text-muted-foreground py-4">Pending claims view</p>
        </TabsContent>

        <TabsContent value="approved">
          <p className="text-center text-muted-foreground py-4">Approved claims view</p>
        </TabsContent>

        <TabsContent value="rejected">
          <p className="text-center text-muted-foreground py-4">Rejected claims view</p>
        </TabsContent>
      </Tabs>
    </div>
  )
}