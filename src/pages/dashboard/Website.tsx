import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Globe, Palette, Code, Eye, Settings, Activity, Download, 
  Upload, ExternalLink, Copy, Trash2, Edit, Play, Pause
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AdvancedTemplateLibrary from "@/components/theme-builder/AdvancedTemplateLibrary";
import AdvancedVisualBuilder from "@/components/theme-builder/AdvancedVisualBuilder";

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

interface SellerTheme {
  id: string;
  theme_name: string;
  status: string;
  subdomain: string;
  custom_domain: string;
  created_at: string;
  last_published: string;
  hosting_config: any;
}

export default function Website() {
  const [activeTab, setActiveTab] = useState('library');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [myThemes, setMyThemes] = useState<SellerTheme[]>([]);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState('');
  const [showDeploymentDialog, setShowDeploymentDialog] = useState(false);

  useEffect(() => {
    fetchMyThemes();
  }, []);

  const fetchMyThemes = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('seller_themes')
        .select(`
          *,
          templates:template_id (
            name,
            preview_image_url
          )
        `)
        .eq('seller_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyThemes(data || []);
    } catch (error) {
      console.error('Error fetching themes:', error);
      toast.error('Failed to fetch your themes');
    }
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setActiveTab('builder');
  };

  const handleSaveCustomizations = async (customizations: any) => {
    if (!selectedTemplate) return;

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      // Save as draft first
      const { data, error } = await supabase
        .from('seller_themes')
        .upsert({
          seller_id: user.user.id,
          template_id: selectedTemplate.id,
          theme_name: `${selectedTemplate.name} - Draft`,
          customizations,
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Customizations saved as draft');
      fetchMyThemes();
    } catch (error) {
      console.error('Error saving customizations:', error);
      toast.error('Failed to save customizations');
    }
  };

  const handleDeploy = async (themeId: string) => {
    try {
      setIsDeploying(true);
      setDeploymentProgress(0);
      setShowDeploymentDialog(true);
      setDeploymentStatus('Starting deployment...');

      const { data, error } = await supabase.functions.invoke('deploy-template', {
        body: {
          templateId: selectedTemplate?.id,
          sellerId: (await supabase.auth.getUser()).data.user?.id,
          customizations: {},
          subdomain: `theme-${themeId}-${Date.now()}`.substring(0, 30)
        }
      });

      if (error) throw error;

      // Simulate deployment progress
      const steps = data.deploymentSteps || [];
      for (let i = 0; i < steps.length; i++) {
        setTimeout(() => {
          setDeploymentProgress(steps[i].progress);
          setDeploymentStatus(steps[i].message);
          
          if (i === steps.length - 1) {
            setIsDeploying(false);
            toast.success('Theme deployed successfully!');
            fetchMyThemes();
          }
        }, i * 1000);
      }

    } catch (error) {
      console.error('Error deploying theme:', error);
      toast.error('Failed to deploy theme');
      setIsDeploying(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const deleteTheme = async (themeId: string) => {
    try {
      const { error } = await supabase
        .from('seller_themes')
        .delete()
        .eq('id', themeId);

      if (error) throw error;

      toast.success('Theme deleted successfully');
      fetchMyThemes();
    } catch (error) {
      console.error('Error deleting theme:', error);
      toast.error('Failed to delete theme');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Website Builder</h1>
          <p className="text-muted-foreground">Create and manage your websites with our advanced theme builder</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center">
            <Activity className="w-4 h-4 mr-1" />
            {myThemes.filter(t => t.status === 'live').length} Live Sites
          </Badge>
          <Badge variant="secondary" className="flex items-center">
            <Globe className="w-4 h-4 mr-1" />
            {myThemes.length} Total Themes
          </Badge>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="library" className="flex items-center space-x-2">
            <Palette className="w-4 h-4" />
            <span>Template Library</span>
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            <span>Visual Builder</span>
          </TabsTrigger>
          <TabsTrigger value="my-themes" className="flex items-center space-x-2">
            <Globe className="w-4 h-4" />
            <span>My Websites</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library" className="mt-6">
          <AdvancedTemplateLibrary onSelectTemplate={handleSelectTemplate} />
        </TabsContent>

        <TabsContent value="builder" className="mt-6">
          {selectedTemplate ? (
            <AdvancedVisualBuilder 
              selectedTemplate={selectedTemplate}
              onSave={handleSaveCustomizations}
            />
          ) : (
            <Card className="p-12 text-center">
              <div className="space-y-4">
                <Palette className="w-16 h-16 mx-auto text-muted-foreground" />
                <div>
                  <h3 className="text-lg font-semibold">No Template Selected</h3>
                  <p className="text-muted-foreground">Choose a template from the library to start building</p>
                </div>
                <Button onClick={() => setActiveTab('library')}>
                  Browse Templates
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-themes" className="mt-6">
          <div className="space-y-6">
            {myThemes.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <Globe className="w-16 h-16 mx-auto text-muted-foreground" />
                  <div>
                    <h3 className="text-lg font-semibold">No Websites Yet</h3>
                    <p className="text-muted-foreground">Create your first website by selecting a template</p>
                  </div>
                  <Button onClick={() => setActiveTab('library')}>
                    Get Started
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>My Websites</CardTitle>
                  <CardDescription>Manage your created websites and themes</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Theme Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Domain</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {myThemes.map((theme) => (
                        <TableRow key={theme.id}>
                          <TableCell>
                            <div className="font-medium">{theme.theme_name}</div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                theme.status === 'live' ? 'default' : 
                                theme.status === 'published' ? 'secondary' : 
                                'outline'
                              }
                            >
                              {theme.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {theme.custom_domain ? (
                                <span className="text-sm">{theme.custom_domain}</span>
                              ) : theme.subdomain ? (
                                <span className="text-sm text-muted-foreground">
                                  {theme.subdomain}.sellsphere.app
                                </span>
                              ) : (
                                <span className="text-sm text-muted-foreground">Not deployed</span>
                              )}
                              {(theme.custom_domain || theme.subdomain) && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(
                                    theme.custom_domain || `${theme.subdomain}.sellsphere.app`
                                  )}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-muted-foreground">
                              {new Date(theme.created_at).toLocaleDateString()}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {theme.status === 'draft' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeploy(theme.id)}
                                >
                                  <Upload className="w-4 h-4 mr-1" />
                                  Deploy
                                </Button>
                              )}
                              
                              {(theme.custom_domain || theme.subdomain) && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(
                                    `https://${theme.custom_domain || `${theme.subdomain}.sellsphere.app`}`,
                                    '_blank'
                                  )}
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </Button>
                              )}
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  // Load theme in builder
                                  setActiveTab('builder');
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteTheme(theme.id)}
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
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Deployment Progress Dialog */}
      <Dialog open={showDeploymentDialog} onOpenChange={setShowDeploymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Deploying Website</DialogTitle>
            <DialogDescription>
              Your website is being deployed. This may take a few moments.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Progress value={deploymentProgress} className="w-full" />
            
            <div className="text-sm text-muted-foreground">
              {deploymentStatus}
            </div>
            
            {deploymentProgress === 100 && (
              <Alert>
                <Activity className="h-4 w-4" />
                <AlertDescription>
                  Deployment completed successfully! Your website is now live.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}