import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Plus, Edit, Trash2, Eye, Download, Star, TrendingUp, Users, Globe, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_premium: boolean;
  is_featured: boolean;
  price: number;
  downloads: number;
  rating: number;
  preview_image_url: string;
  template_data: any;
  created_at: string;
  updated_at: string;
}

interface TemplateStats {
  totalTemplates: number;
  totalDownloads: number;
  activeUsers: number;
  avgRating: number;
}

export default function AdminTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [stats, setStats] = useState<TemplateStats>({
    totalTemplates: 0,
    totalDownloads: 0,
    activeUsers: 0,
    avgRating: 0
  });
  const [loading, setLoading] = useState(true);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    description: '',
    category: '',
    stack: '',
    version: '',
    tags: '',
    is_premium: false,
    price: 0
  });

  useEffect(() => {
    fetchTemplates();
    fetchStats();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('website_themes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Get total templates
      const { count: templateCount } = await supabase
        .from('website_themes')
        .select('*', { count: 'exact', head: true });

      // Get total downloads
      const { data: downloadData } = await supabase
        .from('website_themes')
        .select('downloads');

      // Get active users count
      const { count: userCount } = await supabase
        .from('user_themes')
        .select('*', { count: 'exact', head: true });

      // Calculate average rating
      const { data: ratingData } = await supabase
        .from('website_themes')
        .select('rating');

      const totalDownloads = downloadData?.reduce((sum, item) => sum + (item.downloads || 0), 0) || 0;
      const avgRating = ratingData?.reduce((sum, item) => sum + (item.rating || 0), 0) / (ratingData?.length || 1) || 0;

      setStats({
        totalTemplates: templateCount || 0,
        totalDownloads,
        activeUsers: userCount || 0,
        avgRating: Math.round(avgRating * 10) / 10
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.zip')) {
      toast.error('Please upload a ZIP file');
      return;
    }

    setSelectedFile(file);
  };

  const uploadTemplate = async () => {
    if (!selectedFile || !newTemplate.name) {
      toast.error('Please fill all required fields and select a file');
      return;
    }

    try {
      setUploadProgress(10);

      // Upload file to Supabase Storage
      const fileName = `${Date.now()}-${selectedFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('templates')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      setUploadProgress(50);

      // Create template record
          const { error: insertError } = await supabase
        .from('website_themes')
        .insert({
          name: newTemplate.name,
          description: newTemplate.description,
          category: newTemplate.category,
          tags: newTemplate.tags.split(',').map(tag => tag.trim()),
          is_premium: newTemplate.is_premium,
          price: newTemplate.price,
          template_data: {
            stack: newTemplate.stack,
            version: newTemplate.version,
            file_path: uploadData.path
          }
        });

      if (insertError) throw insertError;

      setUploadProgress(100);
      toast.success('Template uploaded successfully!');
      
      // Reset form
      setNewTemplate({
        name: '',
        description: '',
        category: '',
        stack: '',
        version: '',
        tags: '',
        is_premium: false,
        price: 0
      });
      setSelectedFile(null);
      setUploadProgress(0);
      
      fetchTemplates();
      fetchStats();
    } catch (error) {
      console.error('Error uploading template:', error);
      toast.error('Failed to upload template');
      setUploadProgress(0);
    }
  };

  const deleteTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('website_themes')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast.success('Template deleted successfully');
      fetchTemplates();
      fetchStats();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template');
    }
  };

  const toggleTemplateStatus = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('website_themes')
        .update({ is_featured: !isActive })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Template ${!isActive ? 'featured' : 'unfeatured'}`);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template status:', error);
      toast.error('Failed to update template status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Template Management</h1>
          <p className="text-muted-foreground">Upload and manage website templates</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Upload Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Upload New Template</DialogTitle>
              <DialogDescription>
                Upload a ZIP file containing your website template
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Template Name *</Label>
                  <Input
                    id="name"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter template name"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newTemplate.category} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="ecommerce">E-commerce</SelectItem>
                      <SelectItem value="portfolio">Portfolio</SelectItem>
                      <SelectItem value="blog">Blog</SelectItem>
                      <SelectItem value="landing">Landing Page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stack">Technology Stack</Label>
                  <Select value={newTemplate.stack} onValueChange={(value) => setNewTemplate(prev => ({ ...prev, stack: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select stack" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="bootstrap">Bootstrap</SelectItem>
                      <SelectItem value="tailwind">Tailwind CSS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="version">Version</Label>
                  <Input
                    id="version"
                    value={newTemplate.version}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, version: e.target.value }))}
                    placeholder="1.0.0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your template..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="tags">Tags (comma-separated)</Label>
                <Input
                  id="tags"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="responsive, modern, business"
                />
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="premium"
                    checked={newTemplate.is_premium}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, is_premium: e.target.checked }))}
                  />
                  <Label htmlFor="premium">Premium Template</Label>
                </div>
                {newTemplate.is_premium && (
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newTemplate.price}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="file">Template File (ZIP) *</Label>
                <Input
                  id="file"
                  type="file"
                  accept=".zip"
                  onChange={handleFileUpload}
                />
                {selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>

              {uploadProgress > 0 && (
                <div>
                  <Label>Upload Progress</Label>
                  <Progress value={uploadProgress} className="mt-2" />
                </div>
              )}

              <Button onClick={uploadTemplate} disabled={uploadProgress > 0} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                {uploadProgress > 0 ? 'Uploading...' : 'Upload Template'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Templates</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTemplates}</div>
            <p className="text-xs text-muted-foreground">Available templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDownloads.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Template downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Using templates</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgRating}</div>
            <p className="text-xs text-muted-foreground">Out of 5 stars</p>
          </CardContent>
        </Card>
      </div>

      {/* Templates Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Templates</CardTitle>
          <CardDescription>Manage your website templates</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stack</TableHead>
                <TableHead>Downloads</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {templates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{template.name}</div>
                      <div className="text-sm text-muted-foreground">{template.description}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{template.category}</Badge>
                  </TableCell>
                  <TableCell>{template.template_data?.stack || 'N/A'}</TableCell>
                  <TableCell>{template.downloads}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {template.rating}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={template.is_featured ? 'default' : 'secondary'}>
                      {template.is_featured ? 'Featured' : 'Normal'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleTemplateStatus(template.id, template.is_featured)}
                      >
                        {template.is_featured ? 'Unfeature' : 'Feature'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTemplate(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}