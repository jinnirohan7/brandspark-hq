import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
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
  Eye,
  Edit,
  Trash2,
  RefreshCw,
  Download,
  Upload
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
  sslExpiryDate?: string
  provider?: string
}

interface DNSRecord {
  id: string
  type: string
  name: string
  value: string
  ttl: number
  required: boolean
  domainId?: string
}

interface SSLCertificate {
  id: string
  domainId: string
  issuer: string
  expiryDate: string
  status: 'active' | 'pending' | 'expired' | 'failed'
  autoRenewal: boolean
}

interface HostingSettings {
  id: string
  domainId: string
  cdnEnabled: boolean
  compressionEnabled: boolean
  http2Enabled: boolean
  loadBalancingEnabled: boolean
  cacheTtl: number
  imageOptimization: boolean
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
      autoRenewal: true,
      sslExpiryDate: '2024-12-15',
      provider: 'Cloudflare'
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
      autoRenewal: true,
      provider: 'Let\'s Encrypt'
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
      autoRenewal: false,
      provider: 'Custom'
    }
  ])

  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null)
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null)
  const [newDomain, setNewDomain] = useState('')
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([
    {
      id: '1',
      type: 'A',
      name: '@',
      value: '185.158.133.1',
      ttl: 3600,
      required: true
    },
    {
      id: '2',
      type: 'A',
      name: 'www',
      value: '185.158.133.1',
      ttl: 3600,
      required: true
    },
    {
      id: '3',
      type: 'CNAME',
      name: 'cdn',
      value: 'cdn.sellsphere.app',
      ttl: 3600,
      required: false
    }
  ])
  const [editingDnsRecord, setEditingDnsRecord] = useState<DNSRecord | null>(null)
  const [hostingSettings, setHostingSettings] = useState<HostingSettings[]>([
    {
      id: '1',
      domainId: '1',
      cdnEnabled: true,
      compressionEnabled: true,
      http2Enabled: true,
      loadBalancingEnabled: true,
      cacheTtl: 86400,
      imageOptimization: true
    }
  ])
  const [editingHosting, setEditingHosting] = useState<HostingSettings | null>(null)

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

  // Domain CRUD Operations
  const handleAddDomain = async () => {
    if (!newDomain.trim()) {
      toast.error('Please enter a domain name')
      return
    }

    setLoading(true)
    try {
      const newDomainObj: Domain = {
        id: Date.now().toString(),
        domain: newDomain.trim(),
        sellerId: 'SKR-' + Math.random().toString(36).substr(2, 3).toUpperCase(),
        sellerName: 'New Seller',
        status: 'pending',
        sslStatus: 'pending',
        verificationStatus: 'pending',
        createdAt: new Date().toISOString().split('T')[0],
        lastChecked: new Date().toLocaleString(),
        cdnEnabled: false,
        autoRenewal: true,
        provider: 'Let\'s Encrypt'
      }
      setDomains([...domains, newDomainObj])
      toast.success('Domain added successfully')
      setNewDomain('')
    } catch (error) {
      toast.error('Failed to add domain')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateDomain = async () => {
    if (!editingDomain) return

    setLoading(true)
    try {
      setDomains(domains.map(d => d.id === editingDomain.id ? editingDomain : d))
      toast.success('Domain updated successfully')
      setEditingDomain(null)
    } catch (error) {
      toast.error('Failed to update domain')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDomain = async (domainId: string) => {
    setLoading(true)
    try {
      setDomains(domains.filter(d => d.id !== domainId))
      toast.success('Domain deleted successfully')
    } catch (error) {
      toast.error('Failed to delete domain')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyDomain = async (domainId: string) => {
    setLoading(true)
    try {
      setDomains(domains.map(d => 
        d.id === domainId 
          ? { ...d, verificationStatus: 'verified', status: 'active' }
          : d
      ))
      toast.success('Domain verification completed')
    } catch (error) {
      toast.error('Domain verification failed')
    } finally {
      setLoading(false)
    }
  }

  // DNS CRUD Operations
  const handleAddDnsRecord = () => {
    const newRecord: DNSRecord = {
      id: Date.now().toString(),
      type: 'A',
      name: '',
      value: '',
      ttl: 3600,
      required: false
    }
    setEditingDnsRecord(newRecord)
  }

  const handleSaveDnsRecord = () => {
    if (!editingDnsRecord) return

    if (editingDnsRecord.id && dnsRecords.find(r => r.id === editingDnsRecord.id)) {
      setDnsRecords(dnsRecords.map(r => r.id === editingDnsRecord.id ? editingDnsRecord : r))
      toast.success('DNS record updated')
    } else {
      setDnsRecords([...dnsRecords, { ...editingDnsRecord, id: Date.now().toString() }])
      toast.success('DNS record added')
    }
    setEditingDnsRecord(null)
  }

  const handleDeleteDnsRecord = (recordId: string) => {
    setDnsRecords(dnsRecords.filter(r => r.id !== recordId))
    toast.success('DNS record deleted')
  }

  // SSL Operations
  const handleRenewSSL = async (domainId: string) => {
    setLoading(true)
    try {
      setDomains(domains.map(d => 
        d.id === domainId 
          ? { ...d, sslStatus: 'active', sslExpiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }
          : d
      ))
      toast.success('SSL certificate renewed')
    } catch (error) {
      toast.error('Failed to renew SSL certificate')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleAutoRenewal = (domainId: string) => {
    setDomains(domains.map(d => 
      d.id === domainId 
        ? { ...d, autoRenewal: !d.autoRenewal }
        : d
    ))
    toast.success('Auto-renewal setting updated')
  }

  // Hosting Operations
  const handleUpdateHosting = async () => {
    if (!editingHosting) return

    setLoading(true)
    try {
      const existingIndex = hostingSettings.findIndex(h => h.id === editingHosting.id)
      if (existingIndex >= 0) {
        setHostingSettings(hostingSettings.map(h => h.id === editingHosting.id ? editingHosting : h))
      } else {
        setHostingSettings([...hostingSettings, { ...editingHosting, id: Date.now().toString() }])
      }
      toast.success('Hosting settings updated')
      setEditingHosting(null)
    } catch (error) {
      toast.error('Failed to update hosting settings')
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Domain
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Domain</DialogTitle>
              <DialogDescription>
                Add a new domain to the platform
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="domain">Domain Name</Label>
                <Input
                  id="domain"
                  placeholder="example.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleAddDomain} disabled={loading}>
                {loading ? 'Adding...' : 'Add Domain'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`https://${domain.domain}`, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          Visit
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingDomain(domain)}>
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Domain</DialogTitle>
                              <DialogDescription>
                                Update domain settings and configuration
                              </DialogDescription>
                            </DialogHeader>
                            {editingDomain && (
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="editDomain">Domain Name</Label>
                                  <Input
                                    id="editDomain"
                                    value={editingDomain.domain}
                                    onChange={(e) => setEditingDomain({...editingDomain, domain: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="editStatus">Status</Label>
                                  <Select
                                    value={editingDomain.status}
                                    onValueChange={(value: 'active' | 'pending' | 'failed' | 'suspended') => 
                                      setEditingDomain({...editingDomain, status: value})
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Active</SelectItem>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="failed">Failed</SelectItem>
                                      <SelectItem value="suspended">Suspended</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingDomain.cdnEnabled}
                                    onCheckedChange={(checked) => setEditingDomain({...editingDomain, cdnEnabled: checked})}
                                  />
                                  <Label>CDN Enabled</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingDomain.autoRenewal}
                                    onCheckedChange={(checked) => setEditingDomain({...editingDomain, autoRenewal: checked})}
                                  />
                                  <Label>Auto Renewal</Label>
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={handleUpdateDomain} disabled={loading}>
                                {loading ? 'Updating...' : 'Update Domain'}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteDomain(domain.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                        {domain.status === 'pending' && (
                          <Button size="sm" onClick={() => handleVerifyDomain(domain.id)}>
                            <CheckCircle className="h-4 w-4 mr-1" />
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
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>DNS Configuration</CardTitle>
                <CardDescription>
                  Manage DNS records for all domains
                </CardDescription>
              </div>
              <Button onClick={handleAddDnsRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Add DNS Record
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Instructions:</strong> Add these DNS records at your domain registrar to point your domain to SellSphere.
                  </p>
                </div>

                <div className="space-y-3">
                  {dnsRecords.map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setEditingDnsRecord(record)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        {!record.required && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDeleteDnsRecord(record.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* DNS Record Edit Dialog */}
          <Dialog open={!!editingDnsRecord} onOpenChange={() => setEditingDnsRecord(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingDnsRecord?.id ? 'Edit DNS Record' : 'Add DNS Record'}</DialogTitle>
                <DialogDescription>
                  Configure DNS record settings
                </DialogDescription>
              </DialogHeader>
              {editingDnsRecord && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="dnsType">Record Type</Label>
                    <Select
                      value={editingDnsRecord.type}
                      onValueChange={(value) => setEditingDnsRecord({...editingDnsRecord, type: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="AAAA">AAAA</SelectItem>
                        <SelectItem value="CNAME">CNAME</SelectItem>
                        <SelectItem value="MX">MX</SelectItem>
                        <SelectItem value="TXT">TXT</SelectItem>
                        <SelectItem value="NS">NS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="dnsName">Name</Label>
                    <Input
                      id="dnsName"
                      value={editingDnsRecord.name}
                      onChange={(e) => setEditingDnsRecord({...editingDnsRecord, name: e.target.value})}
                      placeholder="@ or subdomain"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dnsValue">Value</Label>
                    <Input
                      id="dnsValue"
                      value={editingDnsRecord.value}
                      onChange={(e) => setEditingDnsRecord({...editingDnsRecord, value: e.target.value})}
                      placeholder="IP address or domain"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dnsTtl">TTL (seconds)</Label>
                    <Input
                      id="dnsTtl"
                      type="number"
                      value={editingDnsRecord.ttl}
                      onChange={(e) => setEditingDnsRecord({...editingDnsRecord, ttl: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={editingDnsRecord.required}
                      onCheckedChange={(checked) => setEditingDnsRecord({...editingDnsRecord, required: checked})}
                    />
                    <Label>Required Record</Label>
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button onClick={handleSaveDnsRecord}>
                  {editingDnsRecord?.id ? 'Update Record' : 'Add Record'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{domain.domain}</p>
                          <p className="text-sm text-muted-foreground">
                            Provider: {domain.provider || 'Let\'s Encrypt'}
                            {domain.sslExpiryDate && ` • Expires: ${domain.sslExpiryDate}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-2">
                        {getStatusBadge(domain.sslStatus)}
                        {domain.autoRenewal && (
                          <Badge variant="outline" className="text-xs">Auto-Renewal</Badge>
                        )}
                        {domain.sslExpiryDate && new Date(domain.sslExpiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                          <Badge variant="outline" className="text-orange-600 text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Expiring Soon
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View Certificate
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>SSL Certificate Details</DialogTitle>
                            <DialogDescription>
                              Certificate information for {domain.domain}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label className="text-sm font-medium">Domain</Label>
                                <p className="text-sm">{domain.domain}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Status</Label>
                                <p className="text-sm">{domain.sslStatus}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Issuer</Label>
                                <p className="text-sm">{domain.provider || 'Let\'s Encrypt'}</p>
                              </div>
                              <div>
                                <Label className="text-sm font-medium">Expiry Date</Label>
                                <p className="text-sm">{domain.sslExpiryDate || 'N/A'}</p>
                              </div>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm font-mono">
                                -----BEGIN CERTIFICATE-----<br/>
                                MIIFXTCCBEWgAwIBAgISA... (certificate content)<br/>
                                -----END CERTIFICATE-----
                              </p>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={() => copyToClipboard('Certificate content')}>
                              <Download className="h-4 w-4 mr-1" />
                              Download Certificate
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleToggleAutoRenewal(domain.id)}
                      >
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {domain.autoRenewal ? 'Disable' : 'Enable'} Auto-Renewal
                      </Button>
                      {(domain.sslStatus === 'failed' || domain.sslStatus === 'pending') && (
                        <Button size="sm" onClick={() => handleRenewSSL(domain.id)}>
                          <Shield className="h-4 w-4 mr-1" />
                          {domain.sslStatus === 'failed' ? 'Retry SSL' : 'Generate SSL'}
                        </Button>
                      )}
                      {domain.sslStatus === 'active' && (
                        <Button size="sm" onClick={() => handleRenewSSL(domain.id)}>
                          <RefreshCw className="h-4 w-4 mr-1" />
                          Renew SSL
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
            <CardContent>
              <div className="space-y-6">
                {domains.map(domain => {
                  const hosting = hostingSettings.find(h => h.domainId === domain.id)
                  return (
                    <div key={domain.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold">{domain.domain}</h3>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingHosting(hosting || {
                                id: '',
                                domainId: domain.id,
                                cdnEnabled: false,
                                compressionEnabled: false,
                                http2Enabled: false,
                                loadBalancingEnabled: false,
                                cacheTtl: 3600,
                                imageOptimization: false
                              })}
                            >
                              <Settings className="h-4 w-4 mr-1" />
                              Configure
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Hosting Settings for {domain.domain}</DialogTitle>
                              <DialogDescription>
                                Configure performance and hosting options
                              </DialogDescription>
                            </DialogHeader>
                            {editingHosting && (
                              <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingHosting.cdnEnabled}
                                    onCheckedChange={(checked) => setEditingHosting({...editingHosting, cdnEnabled: checked})}
                                  />
                                  <Label>Enable CDN</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingHosting.compressionEnabled}
                                    onCheckedChange={(checked) => setEditingHosting({...editingHosting, compressionEnabled: checked})}
                                  />
                                  <Label>Enable Compression (Gzip + Brotli)</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingHosting.http2Enabled}
                                    onCheckedChange={(checked) => setEditingHosting({...editingHosting, http2Enabled: checked})}
                                  />
                                  <Label>Enable HTTP/2</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingHosting.loadBalancingEnabled}
                                    onCheckedChange={(checked) => setEditingHosting({...editingHosting, loadBalancingEnabled: checked})}
                                  />
                                  <Label>Enable Load Balancing</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={editingHosting.imageOptimization}
                                    onCheckedChange={(checked) => setEditingHosting({...editingHosting, imageOptimization: checked})}
                                  />
                                  <Label>Enable Image Optimization</Label>
                                </div>
                                <div>
                                  <Label htmlFor="cacheTtl">Cache TTL (seconds)</Label>
                                  <Input
                                    id="cacheTtl"
                                    type="number"
                                    value={editingHosting.cacheTtl}
                                    onChange={(e) => setEditingHosting({...editingHosting, cacheTtl: parseInt(e.target.value)})}
                                  />
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button onClick={handleUpdateHosting}>
                                Save Hosting Settings
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <h4 className="font-medium">CDN & Performance</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Global CDN</span>
                              <Badge variant={hosting?.cdnEnabled ? "default" : "secondary"}>
                                {hosting?.cdnEnabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Image Optimization</span>
                              <Badge variant={hosting?.imageOptimization ? "default" : "secondary"}>
                                {hosting?.imageOptimization ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Cache TTL</span>
                              <Badge variant="outline">
                                {hosting?.cacheTtl ? `${hosting.cacheTtl}s` : '3600s'}
                              </Badge>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h4 className="font-medium">Security & Protocols</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Compression</span>
                              <Badge variant={hosting?.compressionEnabled ? "default" : "secondary"}>
                                {hosting?.compressionEnabled ? 'Gzip + Brotli' : 'Disabled'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">HTTP/2</span>
                              <Badge variant={hosting?.http2Enabled ? "default" : "secondary"}>
                                {hosting?.http2Enabled ? 'Enabled' : 'Disabled'}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                              <span className="text-sm">Load Balancing</span>
                              <Badge variant={hosting?.loadBalancingEnabled ? "default" : "secondary"}>
                                {hosting?.loadBalancingEnabled ? 'Active' : 'Disabled'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}