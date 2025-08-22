import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertTriangle, Phone, MessageSquare, MapPin, Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { useOrderManagement, NDR } from '@/hooks/useOrderManagement'

export const NDRManagement = () => {
  const { ndrs, resolveNDR, autoResolveNDRs, loading } = useOrderManagement()
  const [selectedNDR, setSelectedNDR] = useState<NDR | null>(null)
  const [resolutionNotes, setResolutionNotes] = useState('')
  const [customerResponse, setCustomerResponse] = useState('')

  const getNDRIcon = (reason: string) => {
    const iconMap: { [key: string]: any } = {
      'Customer not available': Clock,
      'Address not found': MapPin,
      'Customer refused delivery': XCircle,
      'Incomplete address': MapPin,
      'Phone not reachable': Phone,
      'Rescheduled by customer': RotateCcw
    }
    const IconComponent = iconMap[reason] || AlertTriangle
    return <IconComponent className="h-4 w-4" />
  }

  const getNDRSeverity = (reason: string, ndrCount: number) => {
    if (ndrCount >= 3) return 'critical'
    if (reason.includes('refused') || reason.includes('not reachable')) return 'high'
    return 'medium'
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      default: return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
  }

  const pendingNDRs = ndrs.filter(ndr => ndr.resolution_status === 'pending')
  const resolvedNDRs = ndrs.filter(ndr => ndr.resolution_status === 'resolved')

  return (
    <div className="space-y-6">
      {/* Header with Auto Resolution */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">NDR Management</h2>
          <p className="text-muted-foreground">Manage non-delivery reports and automated resolutions</p>
        </div>
        <div className="flex gap-3">
          <Button 
            onClick={autoResolveNDRs}
            disabled={loading || pendingNDRs.length === 0}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Auto-Resolve NDRs ({pendingNDRs.length})
          </Button>
        </div>
      </div>

      {/* NDR Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total NDRs</p>
                <h3 className="text-2xl font-bold">{ndrs.length}</h3>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Resolution</p>
                <h3 className="text-2xl font-bold text-red-600">{pendingNDRs.length}</h3>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved Today</p>
                <h3 className="text-2xl font-bold text-green-600">{resolvedNDRs.length}</h3>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Auto-Resolved</p>
                <h3 className="text-2xl font-bold text-blue-600">
                  {ndrs.filter(ndr => ndr.auto_resolution_attempted).length}
                </h3>
              </div>
              <RotateCcw className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* NDR Lists */}
      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending">Pending NDRs ({pendingNDRs.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved NDRs ({resolvedNDRs.length})</TabsTrigger>
          <TabsTrigger value="analytics">NDR Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingNDRs.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CheckCircle className="h-12 w-12 mx-auto text-green-600 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Pending NDRs</h3>
                <p className="text-muted-foreground">All NDRs have been resolved or are being processed.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingNDRs.map((ndr) => {
                const severity = getNDRSeverity(ndr.ndr_reason, 1) // We'll get NDR count from order
                return (
                  <Card key={ndr.id} className={`border-l-4 ${getSeverityColor(severity)}`}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-muted">
                            {getNDRIcon(ndr.ndr_reason)}
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <h4 className="font-semibold">Order #{ndr.order_id.slice(-8)}</h4>
                              <Badge variant={severity === 'critical' ? 'destructive' : 'secondary'}>
                                {severity.toUpperCase()}
                              </Badge>
                              {ndr.auto_resolution_attempted && (
                                <Badge variant="outline" className="text-blue-600">
                                  Auto-Processed
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <strong>Reason:</strong> {ndr.ndr_reason}
                            </p>
                            {ndr.next_action && (
                              <p className="text-sm">
                                <strong>Suggested Action:</strong> {ndr.next_action}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                              Reported: {new Date(ndr.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedNDR(ndr)}
                              >
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Resolve NDR</DialogTitle>
                                <DialogDescription>
                                  Provide resolution details for this NDR
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Resolution Action</label>
                                  <Select onValueChange={setResolutionNotes}>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select resolution action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="retry_delivery">Retry Delivery</SelectItem>
                                      <SelectItem value="contact_customer">Contact Customer</SelectItem>
                                      <SelectItem value="update_address">Update Address</SelectItem>
                                      <SelectItem value="reschedule">Reschedule Delivery</SelectItem>
                                      <SelectItem value="return_to_origin">Return to Origin</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Customer Response (Optional)</label>
                                  <Textarea 
                                    placeholder="Customer feedback or response"
                                    value={customerResponse}
                                    onChange={(e) => setCustomerResponse(e.target.value)}
                                  />
                                </div>
                                <Button 
                                  onClick={() => {
                                    if (selectedNDR && resolutionNotes) {
                                      resolveNDR(selectedNDR.id, resolutionNotes, customerResponse)
                                      setSelectedNDR(null)
                                      setResolutionNotes('')
                                      setCustomerResponse('')
                                    }
                                  }}
                                  className="w-full"
                                  disabled={!resolutionNotes}
                                >
                                  Resolve NDR
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        <TabsContent value="resolved" className="space-y-4">
          <div className="grid gap-4">
            {resolvedNDRs.map((ndr) => (
              <Card key={ndr.id} className="border-l-4 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-green-100">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold">Order #{ndr.order_id.slice(-8)}</h4>
                          <Badge variant="secondary" className="text-green-600">
                            RESOLVED
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Original Issue:</strong> {ndr.ndr_reason}
                        </p>
                        <p className="text-sm">
                          <strong>Resolution:</strong> {ndr.next_action}
                        </p>
                        {ndr.customer_response && (
                          <p className="text-sm">
                            <strong>Customer Response:</strong> {ndr.customer_response}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Resolved: {ndr.resolved_at ? new Date(ndr.resolved_at).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>NDR Reasons Breakdown</CardTitle>
                <CardDescription>Most common delivery issues</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(
                    ndrs.reduce((acc, ndr) => {
                      acc[ndr.ndr_reason] = (acc[ndr.ndr_reason] || 0) + 1
                      return acc
                    }, {} as { [key: string]: number })
                  ).map(([reason, count]) => (
                    <div key={reason} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getNDRIcon(reason)}
                        <span className="text-sm">{reason}</span>
                      </div>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resolution Performance</CardTitle>
                <CardDescription>NDR resolution statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Resolution Rate</span>
                    <span className="font-semibold">
                      {ndrs.length > 0 ? Math.round((resolvedNDRs.length / ndrs.length) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Auto-Resolution Rate</span>
                    <span className="font-semibold">
                      {ndrs.length > 0 
                        ? Math.round((ndrs.filter(ndr => ndr.auto_resolution_attempted).length / ndrs.length) * 100) 
                        : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Resolution Time</span>
                    <span className="font-semibold">2.3 hours</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Smart NDR Resolution:</strong> Our automated system analyzes NDR patterns and suggests optimal resolution strategies. 
              Auto-resolution helps reduce manual effort and improves delivery success rates.
            </AlertDescription>
          </Alert>
        </TabsContent>
      </Tabs>
    </div>
  )
}