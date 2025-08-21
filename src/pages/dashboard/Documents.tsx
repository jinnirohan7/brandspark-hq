import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { DocumentUpload } from '@/components/DocumentUpload'
import { useSellerProfile } from '@/hooks/useSellerProfile'
import { 
  FileText, 
  Upload, 
  Download, 
  Eye, 
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Shield,
  Award,
  Building,
  CreditCard,
  FileCheck,
  Briefcase
} from 'lucide-react'

const Documents = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  
  const { documents, loading, refreshDocuments } = useSellerProfile()

  // Mock data for demonstration - replace with actual document categories
  const documentCategories = [
    {
      id: 'identity',
      name: 'Identity Documents',
      icon: Shield,
      description: 'Personal identification documents',
      required: true,
      documents: ['PAN Card', 'Aadhaar Card', 'Passport', 'Driving License']
    },
    {
      id: 'business',
      name: 'Business Documents',
      icon: Building,
      description: 'Business registration and licenses',
      required: true,
      documents: ['GST Certificate', 'Shop Establishment License', 'Trade License', 'Partnership Deed']
    },
    {
      id: 'financial',
      name: 'Financial Documents',
      icon: CreditCard,
      description: 'Banking and financial information',
      required: true,
      documents: ['Bank Statement', 'Cancelled Cheque', 'ITR', 'Audited Financial Statements']
    },
    {
      id: 'compliance',
      name: 'Compliance Documents',
      icon: FileCheck,
      description: 'Regulatory compliance documents',
      required: false,
      documents: ['FSSAI License', 'BIS Certificate', 'Export License', 'Import License']
    },
    {
      id: 'product',
      name: 'Product Certificates',
      icon: Award,
      description: 'Product quality and brand certificates',
      required: false,
      documents: ['Brand Certificate', 'Quality Certificate', 'ISO Certificate', 'CE Certificate']
    },
    {
      id: 'others',
      name: 'Other Documents',
      icon: Briefcase,
      description: 'Additional supporting documents',
      required: false,
      documents: ['Power of Attorney', 'Board Resolution', 'MOA/AOA', 'Other']
    }
  ]

  // Mock document data - replace with actual data from Supabase
  const mockDocuments = [
    {
      id: 'DOC-001',
      document_type: 'pan_card',
      document_name: 'PAN Card',
      file_path: '/docs/pan-card.pdf',
      verification_status: 'verified',
      uploaded_at: '2024-01-15T10:30:00Z',
      expires_at: null,
      document_number: 'ABCDE1234F',
      category: 'identity',
      file_size: 245760,
      mime_type: 'application/pdf'
    },
    {
      id: 'DOC-002',
      document_type: 'gst_certificate',
      document_name: 'GST Certificate',
      file_path: '/docs/gst-certificate.pdf',
      verification_status: 'pending',
      uploaded_at: '2024-01-14T15:45:00Z',
      expires_at: '2025-03-31',
      document_number: '27ABCDE1234F1Z5',
      category: 'business',
      file_size: 512000,
      mime_type: 'application/pdf'
    },
    {
      id: 'DOC-003',
      document_type: 'bank_statement',
      document_name: 'Bank Statement',
      file_path: '/docs/bank-statement.pdf',
      verification_status: 'rejected',
      uploaded_at: '2024-01-13T09:20:00Z',
      expires_at: null,
      document_number: null,
      category: 'financial',
      file_size: 1048576,
      mime_type: 'application/pdf'
    },
    {
      id: 'DOC-004',
      document_type: 'fssai_license',
      document_name: 'FSSAI License',
      file_path: '/docs/fssai-license.jpg',
      verification_status: 'verified',
      uploaded_at: '2024-01-12T14:15:00Z',
      expires_at: '2025-12-31',
      document_number: '12345678901234',
      category: 'compliance',
      file_size: 327680,
      mime_type: 'image/jpeg'
    }
  ]

  const allDocuments = documents || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
      case 'rejected':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.document_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (doc.document_number && doc.document_number.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || 
                           documentCategories.find(cat => cat.id === selectedCategory)?.documents.includes(doc.document_name)
    const matchesStatus = selectedStatus === 'all' || doc.verification_status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const getComplianceScore = () => {
    const totalRequired = documentCategories.filter(cat => cat.required).length * 2 // Assuming 2 key docs per category
    const verifiedDocs = allDocuments.filter(doc => doc.verification_status === 'verified').length
    return Math.min(Math.round((verifiedDocs / totalRequired) * 100), 100)
  }

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
    return expiry <= thirtyDaysFromNow
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Document Management</h1>
          <p className="text-muted-foreground mt-2">Upload and manage your business documents</p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-2xl font-bold">{getComplianceScore()}%</p>
              </div>
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <Progress value={getComplianceScore()} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Documents</p>
                <p className="text-2xl font-bold">{allDocuments.length}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold text-green-600">
                  {allDocuments.filter(doc => doc.verification_status === 'verified').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {allDocuments.filter(doc => doc.expires_at && isExpiringSoon(doc.expires_at)).length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList>
          <TabsTrigger value="documents">All Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="upload">Upload Documents</TabsTrigger>
          <TabsTrigger value="compliance">Compliance Status</TabsTrigger>
        </TabsList>

        <TabsContent value="documents" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {documentCategories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-full sm:w-[150px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-muted rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{document.document_name}</h3>
                          {document.expires_at && isExpiringSoon(document.expires_at) && (
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              Expires Soon
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Uploaded: {formatDate(document.uploaded_at)}</span>
                          <span>Size: {formatFileSize((document as any).file_size || 0)}</span>
                          {document.document_number && (
                            <span>Number: {document.document_number}</span>
                          )}
                          {document.expires_at && (
                            <span>Expires: {formatDate(document.expires_at)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(document.verification_status)}
                        <Badge className={getStatusColor(document.verification_status)}>
                          {document.verification_status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {documentCategories.map((category) => (
              <Card key={category.id} className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <category.icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <CardDescription>{category.description}</CardDescription>
                    </div>
                    {category.required && (
                      <Badge variant="outline" className="text-red-600 border-red-600">Required</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {category.documents.map((docType) => {
                      const uploaded = allDocuments.find(doc => doc.document_name === docType)
                      return (
                        <div key={docType} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <span className="text-sm">{docType}</span>
                          {uploaded ? (
                            <div className="flex items-center gap-2">
                              {getStatusIcon(uploaded.verification_status)}
                              <Badge className={getStatusColor(uploaded.verification_status)}>
                                {uploaded.verification_status}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="outline">Not Uploaded</Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Document</CardTitle>
              <CardDescription>
                Upload your business documents for verification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Documents</h3>
                <p className="text-muted-foreground mb-4">
                  Drag and drop your files here or click to browse
                </p>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Files
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Supported: PDF, JPG, PNG (Max 10MB)
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Document Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">File Requirements</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                    <li>• Supported formats: PDF, JPG, PNG</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• Documents should be clear and readable</li>
                    <li>• All information should be visible</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <h4 className="font-semibold text-green-800 dark:text-green-200 mb-2">Verification Process</h4>
                  <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                    <li>• Documents are reviewed within 24-48 hours</li>
                    <li>• You'll receive email notifications for status updates</li>
                    <li>• Rejected documents can be re-uploaded with corrections</li>
                    <li>• Contact support if you need assistance</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Status Overview</CardTitle>
              <CardDescription>Track your document verification progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{getComplianceScore()}%</div>
                  <p className="text-muted-foreground">Overall Compliance Score</p>
                  <Progress value={getComplianceScore()} className="mt-4" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Document Status Summary</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Verified Documents</span>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300">
                          {allDocuments.filter(doc => doc.verification_status === 'verified').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending Verification</span>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                          {allDocuments.filter(doc => doc.verification_status === 'pending').length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Rejected Documents</span>
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300">
                          {allDocuments.filter(doc => doc.verification_status === 'rejected').length}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Next Steps</h4>
                    <div className="space-y-2">
                      {allDocuments.filter(doc => doc.verification_status === 'rejected').length > 0 && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                          <p className="text-sm text-red-800 dark:text-red-200">
                            Re-upload rejected documents
                          </p>
                        </div>
                      )}
                      {documentCategories.filter(cat => cat.required).some(cat => 
                        !cat.documents.some(docType => 
                          allDocuments.some(doc => doc.document_name === docType && doc.verification_status === 'verified')
                        )
                      ) && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                          <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            Upload required documents
                          </p>
                        </div>
                      )}
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="text-sm text-green-800 dark:text-green-200">
                          Monitor expiry dates
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Documents