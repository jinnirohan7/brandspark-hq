import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useAdminData } from '@/hooks/useAdminData'
import { useToast } from '@/hooks/use-toast'
import { 
  UserCheck, 
  Clock, 
  CheckCircle, 
  XCircle, 
  FileText, 
  Eye, 
  Download,
  AlertTriangle,
  Shield,
  Building,
  CreditCard
} from 'lucide-react'
import { supabase } from '@/integrations/supabase/client'

interface SellerDocument {
  id: string
  seller_id: string
  document_type: string
  document_name: string
  file_path: string
  verification_status: string
  uploaded_at: string
  verified_at?: string
  expires_at?: string
  remarks?: string
}

export const AdminVerification = () => {
  const { sellers, loading } = useAdminData()
  const { toast } = useToast()
  const [documents, setDocuments] = useState<SellerDocument[]>([])
  const [selectedDocument, setSelectedDocument] = useState<SellerDocument | null>(null)
  const [verificationNotes, setVerificationNotes] = useState('')

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    const { data } = await supabase
      .from('seller_documents')
      .select('*')
      .order('uploaded_at', { ascending: false })
    
    if (data) {
      setDocuments(data)
    }
  }

  const handleVerifyDocument = async (documentId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('seller_documents')
      .update({
        verification_status: status,
        verified_at: new Date().toISOString(),
        remarks: verificationNotes
      })
      .eq('id', documentId)

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update verification status",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Success",
      description: `Document ${status} successfully`,
    })

    fetchDocuments()
    setSelectedDocument(null)
    setVerificationNotes('')
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'gst':
      case 'tax':
        return <CreditCard className="h-4 w-4" />
      case 'pan':
      case 'aadhar':
        return <Shield className="h-4 w-4" />
      case 'shop_license':
      case 'business_license':
        return <Building className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const pendingVerifications = sellers.filter(seller => 
    seller.account_status === 'pending_verification' || 
    seller.kyc_verified === false
  )

  const documentsToReview = documents.filter(doc => doc.verification_status === 'pending')

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
          <h1 className="text-3xl font-bold">Verification Center</h1>
          <p className="text-muted-foreground">Review and verify seller documents and applications</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-orange-600">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {documentsToReview.length} Pending Reviews
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verifications</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingVerifications.length}</div>
            <p className="text-xs text-muted-foreground">Sellers awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Documents to Review</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{documentsToReview.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting verification</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Documents processed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">Approval rate this month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="documents">Document Review</TabsTrigger>
          <TabsTrigger value="sellers">Seller Applications</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Documents Pending Review</CardTitle>
              <CardDescription>Review and verify uploaded seller documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Uploaded Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documentsToReview.map((document) => {
                    const seller = sellers.find(s => s.id === document.seller_id)
                    return (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{seller?.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{seller?.full_name}</div>
                              <div className="text-sm text-muted-foreground">{seller?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentIcon(document.document_type)}
                            <span className="font-medium">{document.document_type.toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(document.uploaded_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(document.verification_status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDocument(document)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sellers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Seller Applications</CardTitle>
              <CardDescription>Review new seller registration applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller Info</TableHead>
                    <TableHead>Business Details</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingVerifications.map((seller) => (
                    <TableRow key={seller.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>{seller.full_name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{seller.full_name}</div>
                            <div className="text-sm text-muted-foreground">{seller.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{seller.company_name}</div>
                          <div className="text-sm text-muted-foreground">{seller.business_type}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(seller.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(seller.account_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Approved Documents</CardTitle>
              <CardDescription>Recently approved seller documents</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Approved Date</TableHead>
                    <TableHead>Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.filter(doc => doc.verification_status === 'approved').slice(0, 10).map((document) => {
                    const seller = sellers.find(s => s.id === document.seller_id)
                    return (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{seller?.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{seller?.full_name}</div>
                              <div className="text-sm text-muted-foreground">{seller?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentIcon(document.document_type)}
                            <span className="font-medium">{document.document_type.toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {document.verified_at ? new Date(document.verified_at).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>Admin</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Rejected Documents</CardTitle>
              <CardDescription>Documents that were rejected with reasons</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Document Type</TableHead>
                    <TableHead>Rejected Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.filter(doc => doc.verification_status === 'rejected').slice(0, 10).map((document) => {
                    const seller = sellers.find(s => s.id === document.seller_id)
                    return (
                      <TableRow key={document.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{seller?.full_name?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{seller?.full_name}</div>
                              <div className="text-sm text-muted-foreground">{seller?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getDocumentIcon(document.document_type)}
                            <span className="font-medium">{document.document_type.toUpperCase()}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {document.verified_at ? new Date(document.verified_at).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{document.remarks || 'No reason provided'}</div>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Document Review Dialog */}
      <Dialog open={!!selectedDocument} onOpenChange={() => setSelectedDocument(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Document</DialogTitle>
            <DialogDescription>
              Review and verify the uploaded document
            </DialogDescription>
          </DialogHeader>
          {selectedDocument && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  {getDocumentIcon(selectedDocument.document_type)}
                  <span className="font-medium">{selectedDocument.document_type.toUpperCase()}</span>
                </div>
                <Badge variant="outline">
                  Uploaded: {new Date(selectedDocument.uploaded_at).toLocaleDateString()}
                </Badge>
              </div>
              
              <div className="border rounded-lg p-4 bg-muted/50">
                <p className="text-sm text-center text-muted-foreground">
                  Document preview would be shown here
                </p>
                <div className="mt-2 flex justify-center">
                  <Button variant="outline" size="sm">
                    <Download className="h-3 w-3 mr-1" />
                    Download Document
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Verification Notes</label>
                <Textarea
                  placeholder="Add notes about the verification decision..."
                  value={verificationNotes}
                  onChange={(e) => setVerificationNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDocument(null)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => handleVerifyDocument(selectedDocument.id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => handleVerifyDocument(selectedDocument.id, 'approved')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}