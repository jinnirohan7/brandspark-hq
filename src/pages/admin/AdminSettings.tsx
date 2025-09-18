import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { 
  Settings, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard, 
  Bell,
  Save,
  Database,
  Zap
} from 'lucide-react'

export const AdminSettings = () => {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    platform: {
      platformName: 'SellSphere',
      maintenanceMode: false,
      allowNewRegistrations: true,
      maxSellersPerPlan: 1000
    },
    themes: {
      allowCustomThemes: true,
      maxThemesPerSeller: 10,
      approveThemesManually: true
    },
    payments: {
      commissionRate: 2.5,
      payoutFrequency: 'weekly',
      minimumPayout: 1000
    },
    security: {
      enableTwoFactor: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5
    }
  })

  const handleSave = () => {
    toast({
      title: "Settings Saved",
      description: "Platform settings have been updated successfully.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Platform Settings</h1>
          <p className="text-muted-foreground">Configure global platform settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="platform" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="platform">Platform</TabsTrigger>
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="platform" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Platform Configuration</CardTitle>
              <CardDescription>General platform settings and configurations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Name</label>
                <Input value={settings.platform.platformName} readOnly />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Maintenance Mode</div>
                  <div className="text-sm text-muted-foreground">Put platform in maintenance mode</div>
                </div>
                <Switch checked={settings.platform.maintenanceMode} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Allow New Registrations</div>
                  <div className="text-sm text-muted-foreground">Allow new sellers to register</div>
                </div>
                <Switch checked={settings.platform.allowNewRegistrations} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Management</CardTitle>
              <CardDescription>Control theme creation and approval processes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Allow Custom Themes</div>
                  <div className="text-sm text-muted-foreground">Let sellers create custom themes</div>
                </div>
                <Switch checked={settings.themes.allowCustomThemes} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Manual Theme Approval</div>
                  <div className="text-sm text-muted-foreground">Require admin approval for new themes</div>
                </div>
                <Switch checked={settings.themes.approveThemesManually} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>Configure payment processing and payout settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Platform Commission Rate (%)</label>
                <Input type="number" value={settings.payments.commissionRate} step="0.1" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Minimum Payout Amount (₹)</label>
                <Input type="number" value={settings.payments.minimumPayout} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure platform security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Enable Two-Factor Authentication</div>
                  <div className="text-sm text-muted-foreground">Require 2FA for all admin users</div>
                </div>
                <Switch checked={settings.security.enableTwoFactor} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Gateways</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Razorpay</span>
                  <Badge className="bg-green-100 text-green-800">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Stripe</span>
                  <Badge variant="outline">Inactive</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Integration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>WhatsApp Business API</span>
                  <Badge className="bg-green-100 text-green-800">Connected</Badge>
                </div>
                <Button size="sm" variant="outline">Configure</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Database</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage</span>
                  <Badge className="bg-green-100 text-green-800">85% Used</Badge>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span>Response Time</span>
                  <Badge className="bg-green-100 text-green-800">150ms</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Uptime</span>
                  <Badge className="bg-green-100 text-green-800">99.9%</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}