import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Globe, 
  Plus, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  Server,
  Eye
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { toast } from 'sonner'

interface Domain {
  id: string
  domain: string
  sellerId: string
  sellerName: string
  status: 'active' | 'pending' | 'failed' | 'suspended'
  sslStatus: 'active' | 'pending' | 'failed'
  verificationStatus: 'verified' | 'pending' | 'failed'
  createdAt: string
  lastChecked: string
  cdnEnabled: boolean
  autoRenewal: boolean
}

interface DNSRecord {
  type: string
  name: string
  value: string
  ttl: number
  required: boolean
}

export const AdminDomains = () => {
  const { user } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [domains, setDomains] = useState<Domain[]>([
    {
      id: '1',
      domain: 'seller1.com',
      sellerId: 'SKR-123',
      sellerName: 'TechStore India',
      status: 'active',
      sslStatus: 'active',
      verificationStatus: 'verified',
      createdAt: '2024-01-10',
      lastChecked: '2024-01-15 14:30:00',
      cdnEnabled: true,
      autoRenewal: true
    },
    {
      id: '2',
      domain: 'fashionhub.store',
      sellerId: 'SKR-456',
      sellerName: 'Fashion Hub',
      status: 'pending',
      sslStatus: 'pending',
      verificationStatus: 'pending',
      createdAt: '2024-01-14',
      lastChecked: '2024-01-15 12:00:00',
      cdnEnabled: false,
      autoRenewal: true
    },
    {
      id: '3',
      domain: 'electronics.shop',
      sellerId: 'SKR-789',
      sellerName: 'Electronics World',
      status: 'failed',
      sslStatus: 'failed',
      verificationStatus: 'failed',
      createdAt: '2024-01-12',
      lastChecked: '2024-01-15 10:15:00',
      cdnEnabled: false,
      autoRenewal: false
    }
  ])

  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [newDomain, setNewDomain] = useState('')

  const dnsRecords: DNSRecord[] = [
    {
      type: 'A',
      name: '@',
      value: '185.158.133.1',
      ttl: 3600,
      required: true
    },
    {
      type: 'A',
      name: 'www',
      value: '185.158.133.1',
      ttl: 3600,
      required: true
    },
    {
      type: 'CNAME',
      name: 'cdn',
      value: 'cdn.sellsphere.app',
      ttl: 3600,
      required: false
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Active</Badge>
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Failed</Badge>
      case 'suspended':
        return <Badge variant="outline"><AlertCircle className="h-3 w-3 mr-1" />Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    setLoading(true)
    try {
      // Add domain logic here
      toast.success('Domain verification initiated')
      setNewDomain('')
    } catch (error) {
      toast.error('Failed to add domain')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyDomain = async (domainId: string) => {
    setLoading(true)
    try {
      // Verify domain logic here
      toast.success('Domain verification completed')
    } catch (error) {
      toast.error('Domain verification failed')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Domain Management</h1>
          <p className="text-muted-foreground">
            Manage seller domains and hosting configuration
          </p>
        </div>
        <Button onClick={() => setSelectedDomain(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Domain
        </Button>
      </div>

      {/* Domain Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Domains</p>
                <p className="text-lg font-semibold">{domains.length}</p>
              </div>
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Domains</p>
                <p className="text-lg font-semibold text-green-600">
                  {domains.filter(d => d.status === 'active').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">SSL Certificates</p>
                <p className="text-lg font-semibold">
                  {domains.filter(d => d.sslStatus === 'active').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">CDN Enabled</p>
                <p className="text-lg font-semibold">
                  {domains.filter(d => d.cdnEnabled).length}
                </p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="domains" className="space-y-4">
        <TabsList>
          <TabsTrigger value="domains">Domain List</TabsTrigger>
          <TabsTrigger value="dns">DNS Configuration</TabsTrigger>
          <TabsTrigger value="ssl">SSL Management</TabsTrigger>
          <TabsTrigger value="hosting">Hosting Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Domain Management</CardTitle>
              <CardDescription>
                Manage all seller domains and their configurations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Add New Domain */}
                <div className="flex gap-4 p-4 border rounded-lg bg-muted/50">
                  <Input
                    placeholder="Enter domain name (e.g., seller.com)"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleAddDomain} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Domain
                  </Button>
                </div>

                {/* Domain List */}
                <div className="space-y-4">
                  {domains.map(domain => (
                    <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">{domain.domain}</p>
                            <p className="text-sm text-muted-foreground">
                              {domain.sellerName} • {domain.sellerId}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            {getStatusBadge(domain.status)}
                            {domain.sslStatus === 'active' && (
                              <Badge variant="outline" className="text-green-600">
                                <Shield className="h-3 w-3 mr-1" />
                                SSL
                              </Badge>
                            )}
                            {domain.cdnEnabled && (
                              <Badge variant="outline" className="text-blue-600">
                                <Server className="h-3 w-3 mr-1" />
                                CDN
                              </Badge>
                            )}
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Last checked: {domain.lastChecked}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        {domain.status === 'pending' && (
                          <Button size="sm" onClick={() => handleVerifyDomain(domain.id)}>
                            Verify
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>DNS Configuration</CardTitle>
              <CardDescription>
                DNS records required for domain setup
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong> Add these DNS records at your domain registrar to point your domain to SellSphere.
                  </p>
                </div>

                <div className="space-y-3">
                  {dnsRecords.map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1 grid grid-cols-4 gap-4">
                        <div>
                          <Label className="text-xs text-muted-foreground">Type</Label>
                          <p className="font-mono text-sm">{record.type}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Name</Label>
                          <p className="font-mono text-sm">{record.name}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Value</Label>
                          <p className="font-mono text-sm">{record.value}</p>
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">TTL</Label>
                          <p className="font-mono text-sm">{record.ttl}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {record.required && (
                          <Badge variant="destructive" className="text-xs">Required</Badge>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(record.value)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssl" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SSL Certificate Management</CardTitle>
              <CardDescription>
                Manage SSL certificates for all domains
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {domains.map(domain => (
                  <div key={domain.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{domain.domain}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {getStatusBadge(domain.sslStatus)}
                        {domain.autoRenewal && (
                          <Badge variant="outline" className="text-xs">Auto-Renewal</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        View Certificate
                      </Button>
                      {domain.sslStatus === 'failed' && (
                        <Button size="sm">
                          Retry SSL
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hosting" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hosting Configuration</CardTitle>
              <CardDescription>
                Configure hosting settings and performance optimizations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">CDN Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Global CDN</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Image Optimization</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Cache TTL</span>
                      <Badge variant="outline">24 hours</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Performance</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Compression</span>
                      <Badge className="bg-green-100 text-green-800">Gzip + Brotli</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>HTTP/2</span>
                      <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <span>Load Balancing</span>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
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