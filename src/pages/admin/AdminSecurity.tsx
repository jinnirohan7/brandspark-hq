import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Shield, 
  Lock, 
  AlertTriangle, 
  Activity, 
  FileText, 
  Users, 
  CreditCard,
  Globe,
  Eye,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import { toast } from 'sonner'

interface SecuritySetting {
  id: string
  name: string
  description: string
  enabled: boolean
  category: 'fraud' | 'access' | 'monitoring' | 'compliance'
}

interface SecurityAlert {
  id: string
  type: 'high' | 'medium' | 'low'
  title: string
  description: string
  timestamp: string
  resolved: boolean
}

export const AdminSecurity = () => {
  const { user } = useAdmin()
  const [loading, setLoading] = useState(false)
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    {
      id: '1',
      name: 'Two-Factor Authentication',
      description: 'Require 2FA for all seller accounts',
      enabled: true,
      category: 'access'
    },
    {
      id: '2',
      name: 'Fraud Detection',
      description: 'AI-powered fraud detection for orders',
      enabled: true,
      category: 'fraud'
    },
    {
      id: '3',
      name: 'IP Whitelisting',
      description: 'Restrict access to specific IP ranges',
      enabled: false,
      category: 'access'
    },
    {
      id: '4',
      name: 'Transaction Monitoring',
      description: 'Monitor suspicious transaction patterns',
      enabled: true,
      category: 'monitoring'
    },
    {
      id: '5',
      name: 'PCI Compliance',
      description: 'Ensure PCI DSS compliance for payments',
      enabled: true,
      category: 'compliance'
    },
    {
      id: '6',
      name: 'GDPR Compliance',
      description: 'Data protection and privacy compliance',
      enabled: true,
      category: 'compliance'
    }
  ])

  const [securityAlerts] = useState<SecurityAlert[]>([
    {
      id: '1',
      type: 'high',
      title: 'Suspicious Login Activity',
      description: 'Multiple failed login attempts from seller ID: SKR-789',
      timestamp: '2024-01-15 14:30:00',
      resolved: false
    },
    {
      id: '2',
      type: 'medium',
      title: 'Unusual Transaction Pattern',
      description: 'High-value orders detected from new customer',
      timestamp: '2024-01-15 12:15:00',
      resolved: true
    },
    {
      id: '3',
      type: 'low',
      title: 'Password Policy Violation',
      description: 'Seller using weak password detected',
      timestamp: '2024-01-15 10:45:00',
      resolved: false
    }
  ])

  const toggleSetting = async (settingId: string) => {
    setLoading(true)
    try {
      setSecuritySettings(prev => 
        prev.map(setting => 
          setting.id === settingId 
            ? { ...setting, enabled: !setting.enabled }
            : setting
        )
      )
      toast.success('Security setting updated successfully')
    } catch (error) {
      toast.error('Failed to update security setting')
    } finally {
      setLoading(false)
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high': return <AlertTriangle className="h-4 w-4 text-red-500" />
      case 'medium': return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default: return <AlertTriangle className="h-4 w-4 text-blue-500" />
    }
  }

  const getAlertBadgeVariant = (type: string) => {
    switch (type) {
      case 'high': return 'destructive'
      case 'medium': return 'secondary'
      default: return 'outline'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fraud': return <CreditCard className="h-4 w-4" />
      case 'access': return <Lock className="h-4 w-4" />
      case 'monitoring': return <Activity className="h-4 w-4" />
      case 'compliance': return <FileText className="h-4 w-4" />
      default: return <Shield className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Security Management</h1>
          <p className="text-muted-foreground">
            Monitor and manage platform security settings
          </p>
        </div>
        <Button>
          <Shield className="h-4 w-4 mr-2" />
          Security Report
        </Button>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Level</p>
                <p className="text-lg font-semibold text-green-600">Low</p>
              </div>
              <Shield className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Alerts</p>
                <p className="text-lg font-semibold">3</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Blocked IPs</p>
                <p className="text-lg font-semibold">156</p>
              </div>
              <Globe className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Compliance Score</p>
                <p className="text-lg font-semibold text-green-600">98%</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="settings" className="space-y-4">
        <TabsList>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
          <TabsTrigger value="alerts">Security Alerts</TabsTrigger>
          <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Configuration</CardTitle>
              <CardDescription>
                Configure platform-wide security settings and policies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {['fraud', 'access', 'monitoring', 'compliance'].map(category => (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold capitalize">{category} Settings</h3>
                  <div className="space-y-4">
                    {securitySettings.filter(s => s.category === category).map(setting => (
                      <div key={setting.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {getCategoryIcon(setting.category)}
                          <div>
                            <p className="font-medium">{setting.name}</p>
                            <p className="text-sm text-muted-foreground">{setting.description}</p>
                          </div>
                        </div>
                        <Switch
                          checked={setting.enabled}
                          onCheckedChange={() => toggleSetting(setting.id)}
                          disabled={loading}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Alerts</CardTitle>
              <CardDescription>
                Monitor and respond to security incidents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">{alert.title}</p>
                          <Badge variant={getAlertBadgeVariant(alert.type) as any}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          {alert.resolved && (
                            <Badge variant="outline" className="text-green-600">
                              Resolved
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{alert.description}</p>
                        <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {!alert.resolved && (
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Security Monitoring</CardTitle>
              <CardDescription>
                Real-time security monitoring and threat detection
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Active Sessions</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Total Active Sessions</span>
                      <Badge>1,234</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Suspicious Sessions</span>
                      <Badge variant="destructive">3</Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Fraud Detection</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Orders Screened Today</span>
                      <Badge>892</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                      <span>Flagged Transactions</span>
                      <Badge variant="secondary">12</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Management</CardTitle>
              <CardDescription>
                Ensure platform compliance with regulations and standards
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">PCI DSS Compliance</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Compliance Status</span>
                    <Badge className="bg-green-100 text-green-800">Compliant</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Report
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">GDPR Compliance</h3>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Data Protection Score</span>
                    <Badge className="bg-green-100 text-green-800">98%</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    <FileText className="h-4 w-4 mr-2" />
                    Privacy Audit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}