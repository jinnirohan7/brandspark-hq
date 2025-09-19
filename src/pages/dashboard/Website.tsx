import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Globe, 
  Palette, 
  Settings, 
  Eye, 
  Edit, 
  Plus, 
  Trash2, 
  Monitor,
  Smartphone,
  Share2,
  BarChart3,
  ShoppingCart,
  Users,
  TrendingUp,
  Star,
  Download,
  Search,
  Filter,
  Layout,
  Zap,
  Image as ImageIcon,
  Type,
  MousePointer,
  Megaphone,
  Heart,
  MessageSquare
} from 'lucide-react';
import { useWebsiteManagement, type Website as WebsiteType, WebsiteTheme, WebsiteWidget } from '@/hooks/useWebsiteManagement';
import { toast } from 'sonner';

const Website = () => {
  const {
    websites,
    themes,
    widgets,
    currentWebsite,
    loading,
    createWebsite,
    updateWebsite,
    deleteWebsite,
    publishWebsite,
    unpublishWebsite,
    applyTheme,
    setCurrentWebsite
  } = useWebsiteManagement();

  const [selectedTab, setSelectedTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showThemeDialog, setShowThemeDialog] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [searchThemes, setSearchThemes] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [newWebsite, setNewWebsite] = useState({
    site_name: '',
    subdomain: '',
    seo_title: '',
    seo_description: '',
    contact_email: '',
    contact_phone: ''
  });

  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchThemes.toLowerCase()) ||
                         theme.description?.toLowerCase().includes(searchThemes.toLowerCase());
    const matchesCategory = filterCategory === 'all' || theme.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateWebsite = async () => {
    try {
      await createWebsite(newWebsite);
      setShowCreateDialog(false);
      setNewWebsite({
        site_name: '',
        subdomain: '',
        seo_title: '',
        seo_description: '',
        contact_email: '',
        contact_phone: ''
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleApplyTheme = async (themeId: string) => {
    if (!currentWebsite) return;
    await applyTheme(currentWebsite.id, themeId);
    setShowThemeDialog(false);
  };

  if (loading && websites.length === 0) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <Globe className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No websites yet</h3>
          <p className="text-muted-foreground mb-6">Create your first branded D2C website to start selling online.</p>
          
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Create Website
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Website</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={newWebsite.site_name}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, site_name: e.target.value }))}
                    placeholder="My Awesome Store"
                  />
                </div>
                <div>
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      value={newWebsite.subdomain}
                      onChange={(e) => setNewWebsite(prev => ({ ...prev, subdomain: e.target.value }))}
                      placeholder="mystore"
                      className="rounded-r-none"
                    />
                    <div className="bg-muted border border-l-0 px-3 py-2 rounded-r-md text-sm text-muted-foreground">
                      .sellsphere.com
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newWebsite.contact_email}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contact@mystore.com"
                  />
                </div>
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={newWebsite.seo_title}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="My Awesome Store - Best Products Online"
                  />
                </div>
                <div>
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={newWebsite.seo_description}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Discover amazing products at great prices..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateWebsite} className="w-full">
                  Create Website
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Website Builder</h1>
          <p className="text-muted-foreground">Build and manage your branded D2C website</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={currentWebsite?.id || ''}
            onValueChange={(value) => setCurrentWebsite(websites.find(w => w.id === value) || null)}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select website" />
            </SelectTrigger>
            <SelectContent>
              {websites.map(website => (
                <SelectItem key={website.id} value={website.id}>
                  {website.site_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                New Site
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Website</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="site_name">Site Name</Label>
                  <Input
                    id="site_name"
                    value={newWebsite.site_name}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, site_name: e.target.value }))}
                    placeholder="My Awesome Store"
                  />
                </div>
                <div>
                  <Label htmlFor="subdomain">Subdomain</Label>
                  <div className="flex">
                    <Input
                      id="subdomain"
                      value={newWebsite.subdomain}
                      onChange={(e) => setNewWebsite(prev => ({ ...prev, subdomain: e.target.value }))}
                      placeholder="mystore"
                      className="rounded-r-none"
                    />
                    <div className="bg-muted border border-l-0 px-3 py-2 rounded-r-md text-sm text-muted-foreground">
                      .sellsphere.com
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="contact_email">Contact Email</Label>
                  <Input
                    id="contact_email"
                    type="email"
                    value={newWebsite.contact_email}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, contact_email: e.target.value }))}
                    placeholder="contact@mystore.com"
                  />
                </div>
                <div>
                  <Label htmlFor="seo_title">SEO Title</Label>
                  <Input
                    id="seo_title"
                    value={newWebsite.seo_title}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, seo_title: e.target.value }))}
                    placeholder="My Awesome Store - Best Products Online"
                  />
                </div>
                <div>
                  <Label htmlFor="seo_description">SEO Description</Label>
                  <Textarea
                    id="seo_description"
                    value={newWebsite.seo_description}
                    onChange={(e) => setNewWebsite(prev => ({ ...prev, seo_description: e.target.value }))}
                    placeholder="Discover amazing products at great prices..."
                    rows={3}
                  />
                </div>
                <Button onClick={handleCreateWebsite} className="w-full">
                  Create Website
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {currentWebsite && (
            <Button
              onClick={() => currentWebsite.is_active ? unpublishWebsite(currentWebsite.id) : publishWebsite(currentWebsite.id)}
              variant={currentWebsite.is_active ? "destructive" : "default"}
            >
              {currentWebsite.is_active ? 'Unpublish' : 'Publish'}
            </Button>
          )}
        </div>
      </div>

      {currentWebsite && (
        <>
          {/* Website Status */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{currentWebsite.site_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentWebsite.subdomain}.sellsphere.com
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Badge variant={currentWebsite.is_active ? "default" : "secondary"}>
                    {currentWebsite.is_active ? 'Live' : 'Draft'}
                  </Badge>
                  
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4 mr-1" />
                      Share
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Content */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="pages">Pages</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Visitors</p>
                        <p className="text-2xl font-bold">1,234</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Orders</p>
                        <p className="text-2xl font-bold">89</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold">₹45,678</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-orange-500" />
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion</p>
                        <p className="text-2xl font-bold">2.4%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <Palette className="h-6 w-6" />
                      <span>Change Theme</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <Layout className="h-6 w-6" />
                      <span>Add Widget</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <Settings className="h-6 w-6" />
                      <span>SEO Settings</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <Eye className="h-6 w-6" />
                      <span>Preview Site</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Design & Themes</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                    className={previewMode === 'desktop' ? 'bg-muted' : ''}
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                    className={previewMode === 'mobile' ? 'bg-muted' : ''}
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Theme */}
                <Card className="lg:col-span-1">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="h-5 w-5" />
                      Current Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-muted-foreground">Theme Preview</span>
                    </div>
                    <div>
                      <h4 className="font-medium">Modern Store</h4>
                      <p className="text-sm text-muted-foreground">Clean and modern ecommerce theme</p>
                    </div>
                    
                    <Dialog open={showThemeDialog} onOpenChange={setShowThemeDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full">
                          <Palette className="h-4 w-4 mr-2" />
                          Browse Themes
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Choose a Theme</DialogTitle>
                        </DialogHeader>
                        
                        {/* Theme Filters */}
                        <div className="flex items-center gap-4 mb-6">
                          <div className="flex-1">
                            <Input
                              placeholder="Search themes..."
                              value={searchThemes}
                              onChange={(e) => setSearchThemes(e.target.value)}
                              className="w-full"
                            />
                          </div>
                          <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-48">
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              <SelectItem value="ecommerce">E-commerce</SelectItem>
                              <SelectItem value="fashion">Fashion</SelectItem>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Themes Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredThemes.map((theme) => (
                            <Card key={theme.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                                  <span className="text-muted-foreground text-sm">Preview</span>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{theme.name}</h4>
                                    {theme.is_premium && (
                                      <Badge variant="secondary">Premium</Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {theme.description}
                                  </p>
                                  <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      <span>{theme.rating}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Download className="h-3 w-3" />
                                      <span>{theme.downloads}</span>
                                    </div>
                                  </div>
                                  <Button 
                                    onClick={() => handleApplyTheme(theme.id)}
                                    className="w-full"
                                    size="sm"
                                  >
                                    Apply Theme
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Website Preview */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Website Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className={`mx-auto bg-muted rounded-lg flex items-center justify-center ${
                      previewMode === 'desktop' ? 'aspect-video' : 'aspect-[9/16] max-w-sm'
                    }`}>
                      <span className="text-muted-foreground">Live Preview</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Widget Library */}
              <Card>
                <CardHeader>
                  <CardTitle>Widget Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {widgets.slice(0, 12).map((widget) => (
                      <Card key={widget.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className="h-12 w-12 bg-muted rounded-lg mx-auto mb-2 flex items-center justify-center">
                            {widget.category === 'banner' && <ImageIcon className="h-6 w-6" />}
                            {widget.category === 'products' && <ShoppingCart className="h-6 w-6" />}
                            {widget.category === 'social' && <Heart className="h-6 w-6" />}
                            {widget.category === 'marketing' && <Megaphone className="h-6 w-6" />}
                            {widget.category === 'promotion' && <Zap className="h-6 w-6" />}
                            {widget.category === 'media' && <ImageIcon className="h-6 w-6" />}
                            {widget.category === 'content' && <MessageSquare className="h-6 w-6" />}
                          </div>
                          <h4 className="font-medium text-sm">{widget.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{widget.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="pages">
              <Card>
                <CardHeader>
                  <CardTitle>Website Pages</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Page management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Website Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Order management coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Website Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Analytics dashboard coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Website Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Settings panel coming soon...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default Website;