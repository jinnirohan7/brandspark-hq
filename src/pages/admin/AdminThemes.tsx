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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Upload, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Star, 
  Download, 
  Users, 
  Activity, 
  Monitor,
  Palette,
  Layout,
  Globe,
  BarChart3,
  Settings,
  ExternalLink,
  Search,
  Filter,
  Image as ImageIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ThemeTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  preview_image_url: string;
  template_data: any;
  layout_json: any;
  tags: string[];
  price: number;
  is_featured: boolean;
  is_premium: boolean;
  rating: number;
  downloads: number;
  created_at: string;
  updated_at: string;
}

interface SellerActivity {
  id: string;
  seller_id: string;
  seller_name: string;
  theme_id: string;
  theme_name: string;
  activity_type: 'applied' | 'customized' | 'published';
  timestamp: string;
  details: any;
}

const AdminThemes = () => {
  const [themes, setThemes] = useState<ThemeTemplate[]>([]);
  const [sellerActivities, setSellerActivities] = useState<SellerActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('themes');
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<ThemeTemplate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { toast } = useToast();

  const [newTheme, setNewTheme] = useState({
    name: '',
    category: '',
    description: '',
    preview_image_url: '',
    template_data: '{}',
    layout_json: '{}',
    tags: '',
    price: 0,
    is_featured: false,
    is_premium: false
  });

  // Fetch themes
  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('website_themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setThemes(data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast({
        title: 'Error',
        description: 'Failed to load themes',
        variant: 'destructive'
      });
    }
  };

  // Fetch seller activities
  const fetchSellerActivities = async () => {
    try {
      const { data, error } = await supabase
        .from('user_themes')
        .select(`
          *,
          theme:website_themes(name)
        `)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      const activities: SellerActivity[] = (data || []).map(item => ({
        id: item.id,
        seller_id: item.user_id,
        seller_name: 'Unknown Seller', // Simulated for demo
        theme_id: item.theme_id,
        theme_name: item.theme?.name || 'Unknown Theme',
        activity_type: item.is_active ? 'applied' : 'customized',
        timestamp: item.updated_at,
        details: item.customizations_json
      }));

      setSellerActivities(activities);
    } catch (error) {
      console.error('Error fetching seller activities:', error);
    }
  };

  // Upload theme
  const handleUploadTheme = async () => {
    try {
      let templateData, layoutData;
      
      try {
        templateData = JSON.parse(newTheme.template_data);
        layoutData = JSON.parse(newTheme.layout_json);
      } catch (e) {
        toast({
          title: 'Error',
          description: 'Invalid JSON format in template or layout data',
          variant: 'destructive'
        });
        return;
      }

      const { error } = await supabase
        .from('website_themes')
        .insert({
          name: newTheme.name,
          category: newTheme.category,
          description: newTheme.description,
          preview_image_url: newTheme.preview_image_url,
          template_data: templateData,
          layout_json: layoutData,
          tags: newTheme.tags.split(',').map(tag => tag.trim()),
          price: newTheme.price,
          is_featured: newTheme.is_featured,
          is_premium: newTheme.is_premium
        });

      if (error) throw error;

      await fetchThemes();
      setShowUploadDialog(false);
      setNewTheme({
        name: '',
        category: '',
        description: '',
        preview_image_url: '',
        template_data: '{}',
        layout_json: '{}',
        tags: '',
        price: 0,
        is_featured: false,
        is_premium: false
      });

      toast({
        title: 'Success',
        description: 'Theme uploaded successfully'
      });
    } catch (error) {
      console.error('Error uploading theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to upload theme',
        variant: 'destructive'
      });
    }
  };

  // Update theme
  const handleUpdateTheme = async () => {
    if (!selectedTheme) return;

    try {
      const { error } = await supabase
        .from('website_themes')
        .update({
          is_featured: selectedTheme.is_featured,
          is_premium: selectedTheme.is_premium,
          price: selectedTheme.price
        })
        .eq('id', selectedTheme.id);

      if (error) throw error;

      await fetchThemes();
      setShowEditDialog(false);
      setSelectedTheme(null);

      toast({
        title: 'Success',
        description: 'Theme updated successfully'
      });
    } catch (error) {
      console.error('Error updating theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to update theme',
        variant: 'destructive'
      });
    }
  };

  // Delete theme
  const handleDeleteTheme = async (themeId: string) => {
    if (!confirm('Are you sure you want to delete this theme?')) return;

    try {
      const { error } = await supabase
        .from('website_themes')
        .delete()
        .eq('id', themeId);

      if (error) throw error;

      await fetchThemes();
      toast({
        title: 'Success',
        description: 'Theme deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete theme',
        variant: 'destructive'
      });
    }
  };

  // Navigate to seller dashboard
  const navigateToSellerDashboard = (sellerId: string) => {
    // In a real implementation, this would navigate to seller's dashboard
    window.open(`/dashboard?impersonate=${sellerId}`, '_blank');
  };

  // Filter themes
  const filteredThemes = themes.filter(theme => {
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || theme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(themes.map(theme => theme.category)))];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchThemes(), fetchSellerActivities()]);
      setLoading(false);
    };
    loadData();
  }, []);

  if (loading) {
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Theme Management</h1>
          <p className="text-muted-foreground">Upload, manage, and monitor theme usage</p>
        </div>
        
        <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
          <DialogTrigger asChild>
            <Button>
              <Upload className="h-4 w-4 mr-2" />
              Upload Theme
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Theme</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div>
                <Label htmlFor="name">Theme Name</Label>
                <Input
                  id="name"
                  value={newTheme.name}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Modern Business Theme"
                />
              </div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  value={newTheme.category}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="business, ecommerce, portfolio"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTheme.description}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="A modern, responsive theme perfect for businesses..."
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="preview_image">Preview Image URL</Label>
                <Input
                  id="preview_image"
                  value={newTheme.preview_image_url}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, preview_image_url: e.target.value }))}
                  placeholder="https://example.com/preview.jpg"
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newTheme.tags}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="modern, responsive, business"
                />
              </div>
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={newTheme.price}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, price: Number(e.target.value) }))}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="template_data">Template Data (JSON)</Label>
                <Textarea
                  id="template_data"
                  value={newTheme.template_data}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, template_data: e.target.value }))}
                  placeholder='{"colors": {"primary": "#000"}, "fonts": {...}}'
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="layout_json">Layout JSON</Label>
                <Textarea
                  id="layout_json"
                  value={newTheme.layout_json}
                  onChange={(e) => setNewTheme(prev => ({ ...prev, layout_json: e.target.value }))}
                  placeholder='{"header": {...}, "hero": {...}, "footer": {...}}'
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={newTheme.is_featured}
                    onCheckedChange={(checked) => setNewTheme(prev => ({ ...prev, is_featured: checked }))}
                  />
                  <Label htmlFor="featured">Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="premium"
                    checked={newTheme.is_premium}
                    onCheckedChange={(checked) => setNewTheme(prev => ({ ...prev, is_premium: checked }))}
                  />
                  <Label htmlFor="premium">Premium</Label>
                </div>
              </div>
              <Button onClick={handleUploadTheme} className="w-full">
                Upload Theme
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Themes</p>
                <p className="text-2xl font-bold">{themes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Download className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-2xl font-bold">{themes.reduce((sum, theme) => sum + theme.downloads, 0)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{sellerActivities.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">
                  {themes.length > 0 ? (themes.reduce((sum, theme) => sum + theme.rating, 0) / themes.length).toFixed(1) : '0.0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="themes">Theme Library</TabsTrigger>
          <TabsTrigger value="activity">Seller Activity</TabsTrigger>
          <TabsTrigger value="monitoring">Real-time Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-6">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search themes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Theme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredThemes.map(theme => (
              <Card key={theme.id} className="overflow-hidden">
                <div className="aspect-video bg-muted relative">
                  {theme.preview_image_url ? (
                    <img 
                      src={theme.preview_image_url} 
                      alt={theme.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    {theme.is_featured && (
                      <Badge variant="default">Featured</Badge>
                    )}
                    {theme.is_premium && (
                      <Badge variant="secondary">Premium</Badge>
                    )}
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{theme.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{theme.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span>{theme.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-4 w-4" />
                      <span>{theme.downloads}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedTheme(theme);
                        setShowEditDialog(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTheme(theme.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Seller Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Theme</TableHead>
                    <TableHead>Activity</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellerActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.seller_name}</TableCell>
                      <TableCell>{activity.theme_name}</TableCell>
                      <TableCell>
                        <Badge variant={activity.activity_type === 'applied' ? 'default' : 'secondary'}>
                          {activity.activity_type}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(activity.timestamp).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigateToSellerDashboard(activity.seller_id)}
                        >
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Dashboard
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Live Theme Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {themes.slice(0, 5).map(theme => (
                    <div key={theme.id} className="flex items-center justify-between">
                      <span className="font-medium">{theme.name}</span>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{theme.downloads} active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Theme Customizations Today</span>
                    <span className="font-bold">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>New Theme Applications</span>
                    <span className="font-bold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Active Builder Sessions</span>
                    <span className="font-bold">8</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Published Websites</span>
                    <span className="font-bold">156</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Theme Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Theme</DialogTitle>
          </DialogHeader>
          {selectedTheme && (
            <div className="space-y-4">
              <div>
                <Label>Theme Name</Label>
                <Input value={selectedTheme.name} disabled />
              </div>
              <div>
                <Label>Price</Label>
                <Input
                  type="number"
                  value={selectedTheme.price}
                  onChange={(e) => setSelectedTheme({ ...selectedTheme, price: Number(e.target.value) })}
                />
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedTheme.is_featured}
                    onCheckedChange={(checked) => setSelectedTheme({ ...selectedTheme, is_featured: checked })}
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={selectedTheme.is_premium}
                    onCheckedChange={(checked) => setSelectedTheme({ ...selectedTheme, is_premium: checked })}
                  />
                  <Label>Premium</Label>
                </div>
              </div>
              <Button onClick={handleUpdateTheme} className="w-full">
                Update Theme
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminThemes;