import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  MessageCircle, 
  Plus, 
  Settings, 
  Play,
  Pause,
  Users,
  ShoppingCart,
  Heart,
  Star,
  Clock,
  Send,
  Smartphone
} from 'lucide-react'

const WhatsApp = () => {
  const [automations] = useState([
    {
      id: 'auto-001',
      name: 'Abandoned Cart Recovery',
      trigger: 'Cart Abandoned',
      status: 'Active',
      sent: 234,
      delivered: 228,
      replied: 45,
      recovered: 23,
      recovery_rate: '19.8%',
    },
    {
      id: 'auto-002',
      name: 'Post-Purchase Upsell',
      trigger: 'Order Completed',
      status: 'Active',
      sent: 189,
      delivered: 185,
      replied: 67,
      recovered: 34,
      recovery_rate: '36.4%',
    },
    {
      id: 'auto-003',
      name: 'Order Tracking Updates',
      trigger: 'Order Status Change',
      status: 'Active',
      sent: 456,
      delivered: 451,
      replied: 12,
      recovered: 0,
      recovery_rate: 'N/A',
    },
    {
      id: 'auto-004',
      name: 'Feedback Collection',
      trigger: 'Order Delivered',
      status: 'Paused',
      sent: 78,
      delivered: 76,
      replied: 34,
      recovered: 0,
      recovery_rate: 'N/A',
    },
  ])

  const templates = [
    {
      id: 'temp-001',
      name: 'Cart Abandonment',
      category: 'Recovery',
      language: 'English',
      status: 'Approved',
    },
    {
      id: 'temp-002',
      name: 'Order Confirmation',
      category: 'Transactional',
      language: 'English',
      status: 'Approved',
    },
    {
      id: 'temp-003',
      name: 'Shipping Notification',
      category: 'Transactional',
      language: 'English',
      status: 'Pending',
    },
    {
      id: 'temp-004',
      name: 'Feedback Request',
      category: 'Engagement',
      language: 'Hindi',
      status: 'Approved',
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Paused': 'secondary',
      'Draft': 'outline',
      'Approved': 'default',
      'Pending': 'secondary',
      'Rejected': 'destructive',
    } as const

    return <Badge variant={variants[status as keyof typeof variants] || 'outline'}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">WhatsApp Automation</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Automation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create WhatsApp Automation</DialogTitle>
                <DialogDescription>
                  Set up automated WhatsApp messages for your customers
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="automation-name">Automation Name</Label>
                    <Input id="automation-name" placeholder="Enter automation name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Trigger Event</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cart-abandoned">Cart Abandoned</SelectItem>
                        <SelectItem value="checkout-abandoned">Checkout Abandoned</SelectItem>
                        <SelectItem value="order-placed">Order Placed</SelectItem>
                        <SelectItem value="order-shipped">Order Shipped</SelectItem>
                        <SelectItem value="order-delivered">Order Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="delay">Delay (minutes)</Label>
                    <Input id="delay" type="number" placeholder="30" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template">Message Template</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select template" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cart-abandonment">Cart Abandonment</SelectItem>
                        <SelectItem value="order-confirmation">Order Confirmation</SelectItem>
                        <SelectItem value="shipping-update">Shipping Update</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="conditions">Conditions (Optional)</Label>
                  <Textarea id="conditions" placeholder="Add any specific conditions for this automation" />
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="active" />
                  <Label htmlFor="active">Activate immediately</Label>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Automation</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Setup Alert */}
      <Alert>
        <Smartphone className="h-4 w-4" />
        <AlertDescription>
          WhatsApp Business API is connected. Your automations are ready to go! 
          <Button variant="link" className="p-0 h-auto ml-2">Configure settings</Button>
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {automations.reduce((sum, auto) => sum + auto.sent, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
            <Send className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">98.5%</div>
            <p className="text-xs text-muted-foreground">Messages delivered</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.8%</div>
            <p className="text-xs text-muted-foreground">Customer responses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recovery Revenue</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1,23,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+18%</span> from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="automations" className="space-y-4">
        <TabsList>
          <TabsTrigger value="automations">Automations</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="automations">
          <Card>
            <CardHeader>
              <CardTitle>Active Automations</CardTitle>
              <CardDescription>
                Manage your WhatsApp automation workflows
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {automations.map((automation) => (
                  <div key={automation.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-green-100">
                          {automation.name.includes('Cart') && <ShoppingCart className="h-4 w-4 text-green-600" />}
                          {automation.name.includes('Upsell') && <Heart className="h-4 w-4 text-green-600" />}
                          {automation.name.includes('Tracking') && <Clock className="h-4 w-4 text-green-600" />}
                          {automation.name.includes('Feedback') && <Star className="h-4 w-4 text-green-600" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{automation.name}</h3>
                          <p className="text-sm text-muted-foreground">Trigger: {automation.trigger}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(automation.status)}
                        <Button variant="outline" size="sm">
                          {automation.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sent</p>
                        <p className="font-medium">{automation.sent}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Delivered</p>
                        <p className="font-medium">{automation.delivered}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Replied</p>
                        <p className="font-medium">{automation.replied}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recovered</p>
                        <p className="font-medium">{automation.recovered}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Recovery Rate</p>
                        <p className="font-medium text-green-600">{automation.recovery_rate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Message Templates</CardTitle>
                  <CardDescription>
                    Manage your WhatsApp Business message templates
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Template
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {templates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">{template.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline">{template.category}</Badge>
                          <Badge variant="outline">{template.language}</Badge>
                          {getStatusBadge(template.status)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Preview</Button>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contacts">
          <Card>
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
              <CardDescription>
                Manage your WhatsApp contacts and opt-ins
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Users className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="text-2xl font-bold">2,345</p>
                        <p className="text-sm text-muted-foreground">Total Contacts</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="text-2xl font-bold">2,198</p>
                        <p className="text-sm text-muted-foreground">Opted In</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-yellow-600" />
                        <p className="text-2xl font-bold">147</p>
                        <p className="text-sm text-muted-foreground">Opted Out</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Recent Opt-ins</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">+91 98765 43210</p>
                        <p className="text-sm text-muted-foreground">john.doe@example.com</p>
                      </div>
                      <span className="text-sm text-muted-foreground">2 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">+91 87654 32109</p>
                        <p className="text-sm text-muted-foreground">jane.smith@example.com</p>
                      </div>
                      <span className="text-sm text-muted-foreground">5 hours ago</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">+91 76543 21098</p>
                        <p className="text-sm text-muted-foreground">mike.wilson@example.com</p>
                      </div>
                      <span className="text-sm text-muted-foreground">1 day ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>WhatsApp Analytics</CardTitle>
              <CardDescription>
                Track performance of your WhatsApp campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Top Performing Automation</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Post-Purchase Upsell</span>
                          <span className="font-medium text-green-600">36.4% recovery</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Abandoned Cart Recovery</span>
                          <span className="font-medium text-green-600">19.8% recovery</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Message Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span>Average Open Rate</span>
                          <span className="font-medium">95.2%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Average Response Rate</span>
                          <span className="font-medium">24.8%</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Opt-out Rate</span>
                          <span className="font-medium">2.1%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Attribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Cart Recovery Revenue</p>
                          <p className="text-sm text-muted-foreground">From abandoned cart messages</p>
                        </div>
                        <span className="text-lg font-bold">₹45,678</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Upsell Revenue</p>
                          <p className="text-sm text-muted-foreground">From post-purchase upsells</p>
                        </div>
                        <span className="text-lg font-bold">₹67,890</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Repeat Purchase Revenue</p>
                          <p className="text-sm text-muted-foreground">From loyalty campaigns</p>
                        </div>
                        <span className="text-lg font-bold">₹23,456</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default WhatsApp