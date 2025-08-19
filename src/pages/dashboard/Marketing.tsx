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
import { 
  TrendingUp, 
  Target, 
  Eye, 
  BarChart3,
  Plus,
  Settings,
  Facebook,
  Instagram,
  Search,
  Mail,
  Smartphone
} from 'lucide-react'

const Marketing = () => {
  const [campaigns] = useState([
    {
      id: 'camp-001',
      name: 'Summer Sale Campaign',
      platform: 'Meta Ads',
      status: 'Active',
      budget: '₹5,000',
      spent: '₹3,245',
      impressions: 45234,
      clicks: 1234,
      conversions: 89,
      ctr: '2.73%',
      cpa: '₹36.46',
    },
    {
      id: 'camp-002',
      name: 'Product Launch - Smart Watch',
      platform: 'Google Ads',
      status: 'Active',
      budget: '₹8,000',
      spent: '₹6,789',
      impressions: 78965,
      clicks: 2156,
      conversions: 134,
      ctr: '2.73%',
      cpa: '₹50.67',
    },
    {
      id: 'camp-003',
      name: 'Brand Awareness',
      platform: 'Instagram',
      status: 'Paused',
      budget: '₹3,000',
      spent: '₹2,890',
      impressions: 23456,
      clicks: 567,
      conversions: 23,
      ctr: '2.42%',
      cpa: '₹125.65',
    },
  ])

  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'default',
      'Paused': 'secondary',
      'Completed': 'outline',
    } as const

    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>
  }

  const totalSpent = campaigns.reduce((sum, camp) => sum + parseInt(camp.spent.replace('₹', '').replace(',', '')), 0)
  const totalConversions = campaigns.reduce((sum, camp) => sum + camp.conversions, 0)
  const avgCPA = totalSpent / totalConversions

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Marketing & Advertising</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="mr-2 h-4 w-4" />
            Pixel Setup
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Marketing Campaign</DialogTitle>
                <DialogDescription>
                  Set up a new advertising campaign
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign-name">Campaign Name</Label>
                    <Input id="campaign-name" placeholder="Enter campaign name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="meta">Meta Ads (Facebook/Instagram)</SelectItem>
                        <SelectItem value="google">Google Ads</SelectItem>
                        <SelectItem value="youtube">YouTube Ads</SelectItem>
                        <SelectItem value="tiktok">TikTok Ads</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget">Daily Budget</Label>
                    <Input id="budget" placeholder="₹1,000" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objective">Campaign Objective</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="conversions">Conversions</SelectItem>
                        <SelectItem value="traffic">Traffic</SelectItem>
                        <SelectItem value="awareness">Brand Awareness</SelectItem>
                        <SelectItem value="engagement">Engagement</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Campaign Description</Label>
                  <Textarea id="description" placeholder="Describe your campaign goals" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Save as Draft</Button>
                  <Button>Create Campaign</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ad Spend</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Conversions</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversions}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. CPA</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{avgCPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Cost per acquisition</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ROAS</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2x</div>
            <p className="text-xs text-muted-foreground">Return on ad spend</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Active Campaigns</TabsTrigger>
          <TabsTrigger value="audiences">Audiences</TabsTrigger>
          <TabsTrigger value="pixels">Tracking Setup</TabsTrigger>
          <TabsTrigger value="insights">Cost Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>
                Monitor and optimize your advertising campaigns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaigns.map((campaign) => (
                  <div key={campaign.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          {campaign.platform === 'Meta Ads' && <Facebook className="h-4 w-4" />}
                          {campaign.platform === 'Google Ads' && <Search className="h-4 w-4" />}
                          {campaign.platform === 'Instagram' && <Instagram className="h-4 w-4" />}
                        </div>
                        <div>
                          <h3 className="font-medium">{campaign.name}</h3>
                          <p className="text-sm text-muted-foreground">{campaign.platform}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(campaign.status)}
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Budget / Spent</p>
                        <p className="font-medium">{campaign.budget} / {campaign.spent}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Impressions</p>
                        <p className="font-medium">{campaign.impressions.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Clicks</p>
                        <p className="font-medium">{campaign.clicks.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Conversions</p>
                        <p className="font-medium">{campaign.conversions}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CTR</p>
                        <p className="font-medium">{campaign.ctr}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">CPA</p>
                        <p className="font-medium">{campaign.cpa}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audiences">
          <Card>
            <CardHeader>
              <CardTitle>Audience Management</CardTitle>
              <CardDescription>
                Create and manage your target audiences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Audience
                  </Button>
                  <Button variant="outline">Import Audience</Button>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-2">Custom Audiences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Website Visitors (30 days)</p>
                        <p className="text-sm text-muted-foreground">12,345 people</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Past Customers</p>
                        <p className="text-sm text-muted-foreground">4,567 people</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Abandoned Cart Users</p>
                        <p className="text-sm text-muted-foreground">1,234 people</p>
                      </div>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pixels">
          <Card>
            <CardHeader>
              <CardTitle>Tracking & Pixels</CardTitle>
              <CardDescription>
                Set up conversion tracking and analytics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Meta Pixel</h3>
                      <p className="text-sm text-muted-foreground">Track Facebook and Instagram conversions</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Google Analytics 4</h3>
                      <p className="text-sm text-muted-foreground">Enhanced ecommerce tracking</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Google Ads Conversion</h3>
                      <p className="text-sm text-muted-foreground">Track Google Ads performance</p>
                    </div>
                    <Switch />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">TikTok Pixel</h3>
                      <p className="text-sm text-muted-foreground">Track TikTok ad conversions</p>
                    </div>
                    <Switch />
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Conversion Events</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Purchase</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Add to Cart</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Initiate Checkout</span>
                      <Badge variant="secondary">Inactive</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">View Content</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <Card>
            <CardHeader>
              <CardTitle>Cost Per Order Insights</CardTitle>
              <CardDescription>
                Analyze your cost efficiency across different channels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Facebook className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                        <p className="font-medium">Meta Ads</p>
                        <p className="text-2xl font-bold">₹42.50</p>
                        <p className="text-sm text-muted-foreground">Cost per order</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Search className="h-8 w-8 mx-auto mb-2 text-green-600" />
                        <p className="font-medium">Google Ads</p>
                        <p className="text-2xl font-bold">₹38.75</p>
                        <p className="text-sm text-muted-foreground">Cost per order</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <Mail className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                        <p className="font-medium">Email Marketing</p>
                        <p className="text-2xl font-bold">₹15.25</p>
                        <p className="text-sm text-muted-foreground">Cost per order</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-3">Optimization Recommendations</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Email marketing shows the lowest cost per order</p>
                        <p className="text-sm text-muted-foreground">Consider increasing email campaign frequency</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Google Ads performing better than Meta</p>
                        <p className="text-sm text-muted-foreground">Shift more budget to Google Ads campaigns</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-red-500 mt-2" />
                      <div>
                        <p className="text-sm font-medium">Meta Ads CPA is above target</p>
                        <p className="text-sm text-muted-foreground">Review audience targeting and ad creative</p>
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

export default Marketing