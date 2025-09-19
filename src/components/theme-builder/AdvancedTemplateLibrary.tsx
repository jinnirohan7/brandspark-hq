import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Star, Download, Eye, Filter, Grid, List } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  is_premium: boolean;
  price: number;
  downloads: number;
  rating: number;
  preview_image_url: string;
  template_data: any;
}

interface TemplateLibraryProps {
  onSelectTemplate: (template: Template) => void;
}

export default function AdvancedTemplateLibrary({ onSelectTemplate }: TemplateLibraryProps) {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStack, setSelectedStack] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'business', label: 'Business' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'blog', label: 'Blog' },
    { value: 'landing', label: 'Landing Page' },
  ];

  const stacks = [
    { value: 'all', label: 'All Stacks' },
    { value: 'react', label: 'React' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'nextjs', label: 'Next.js' },
    { value: 'bootstrap', label: 'Bootstrap' },
    { value: 'tailwind', label: 'Tailwind CSS' },
  ];

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [templates, searchTerm, selectedCategory, selectedStack]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('website_themes')
        .select('*')
        .order('downloads', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const filterTemplates = () => {
    let filtered = templates;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    // Filter by stack
    if (selectedStack !== 'all') {
      filtered = filtered.filter(template => 
        template.template_data?.stack === selectedStack
      );
    }

    setFilteredTemplates(filtered);
  };

  const handleSelectTemplate = async (template: Template) => {
    try {
      // Increment download count
      await supabase
        .from('website_themes')
        .update({ downloads: template.downloads + 1 })
        .eq('id', template.id);

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          seller_id: (await supabase.auth.getUser()).data.user?.id,
          template_id: template.id,
          action: 'template_selected',
          details: { template_name: template.name }
        });

      onSelectTemplate(template);
      toast.success(`Selected template: ${template.name}`);
    } catch (error) {
      console.error('Error selecting template:', error);
      toast.error('Failed to select template');
    }
  };

  const TemplateCard = ({ template }: { template: Template }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={template.preview_image_url || '/placeholder.svg'}
          alt={template.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setSelectedTemplate(template)}
            >
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={() => handleSelectTemplate(template)}
            >
              <Download className="w-4 h-4 mr-1" />
              Select
            </Button>
          </div>
        </div>
        {template.is_premium && (
          <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
            Premium
          </Badge>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg truncate">{template.name}</h3>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-muted-foreground">{template.rating}</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Badge variant="outline">{template.category}</Badge>
            {template.template_data?.stack && (
              <Badge variant="secondary" className="text-xs">
                {template.template_data.stack}
              </Badge>
            )}
          </div>
          
          <div className="text-right">
            {template.is_premium ? (
              <span className="font-semibold text-green-600">${template.price}</span>
            ) : (
              <span className="font-semibold text-blue-600">Free</span>
            )}
            <div className="text-xs text-muted-foreground">
              {template.downloads} downloads
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Template Library</h2>
          <p className="text-muted-foreground">Choose from our collection of professional templates</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedStack} onValueChange={setSelectedStack}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Technology" />
          </SelectTrigger>
          <SelectContent>
            {stacks.map(stack => (
              <SelectItem key={stack.value} value={stack.value}>
                {stack.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredTemplates.length} of {templates.length} templates
      </div>

      {/* Templates Grid */}
      <div className={`grid gap-6 ${
        viewMode === 'grid' 
          ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
          : 'grid-cols-1'
      }`}>
        {filteredTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No templates found matching your criteria</p>
        </div>
      )}

      {/* Template Preview Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedTemplate && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  {selectedTemplate.name}
                  <Badge variant={selectedTemplate.is_premium ? 'default' : 'secondary'}>
                    {selectedTemplate.is_premium ? `$${selectedTemplate.price}` : 'Free'}
                  </Badge>
                </DialogTitle>
                <DialogDescription>{selectedTemplate.description}</DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <img
                  src={selectedTemplate.preview_image_url || '/placeholder.svg'}
                  alt={selectedTemplate.name}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-muted-foreground">{selectedTemplate.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Stack:</span>
                    <p className="text-muted-foreground">{selectedTemplate.template_data?.stack || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Downloads:</span>
                    <p className="text-muted-foreground">{selectedTemplate.downloads}</p>
                  </div>
                  <div>
                    <span className="font-medium">Rating:</span>
                    <p className="text-muted-foreground flex items-center">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                      {selectedTemplate.rating}
                    </p>
                  </div>
                </div>
                
                {selectedTemplate.tags && selectedTemplate.tags.length > 0 && (
                  <div>
                    <span className="font-medium text-sm">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedTemplate.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    handleSelectTemplate(selectedTemplate);
                    setSelectedTemplate(null);
                  }}>
                    <Download className="w-4 h-4 mr-2" />
                    Select Template
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}