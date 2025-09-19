import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, EyeOff, Code, Smartphone, Tablet, Monitor, Save, Download, 
  Upload, Undo, Redo, Settings, Palette, Type, Layout, MousePointer,
  Move, RotateCcw, Trash2, Copy, Plus, Grid, Layers
} from "lucide-react";
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

interface AdvancedVisualBuilderProps {
  selectedTemplate: Template | null;
  onSave: (customizations: any) => void;
}

interface CustomizationHistory {
  id: number;
  timestamp: Date;
  action: string;
  customizations: any;
}

export default function AdvancedVisualBuilder({ selectedTemplate, onSave }: AdvancedVisualBuilderProps) {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [customizations, setCustomizations] = useState<any>({});
  const [history, setHistory] = useState<CustomizationHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isDragging, setIsDragging] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [customCSS, setCustomCSS] = useState('');
  const [customJS, setCustomJS] = useState('');
  
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedTemplate) {
      initializeBuilder();
    }
  }, [selectedTemplate]);

  const initializeBuilder = () => {
    const initialCustomizations = {
      colors: {
        primary: '#3b82f6',
        secondary: '#64748b',
        accent: '#f59e0b',
        background: '#ffffff',
        text: '#1f2937'
      },
      typography: {
        fontFamily: 'Inter',
        fontSize: '16px',
        lineHeight: '1.6',
        fontWeight: '400'
      },
      layout: {
        containerWidth: '1200px',
        spacing: '1rem',
        borderRadius: '0.5rem'
      },
      components: {}
    };

    setCustomizations(initialCustomizations);
    addToHistory('initialize', initialCustomizations);
  };

  const addToHistory = (action: string, newCustomizations: any) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({
      id: Date.now(),
      timestamp: new Date(),
      action,
      customizations: { ...newCustomizations }
    });
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCustomizations(history[historyIndex - 1].customizations);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCustomizations(history[historyIndex + 1].customizations);
    }
  };

  const updateCustomization = (section: string, key: string, value: any) => {
    const newCustomizations = {
      ...customizations,
      [section]: {
        ...customizations[section],
        [key]: value
      }
    };
    setCustomizations(newCustomizations);
    addToHistory(`update_${section}_${key}`, newCustomizations);
  };

  const handleSave = async () => {
    try {
      await onSave(customizations);
      
      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          seller_id: (await supabase.auth.getUser()).data.user?.id,
          template_id: selectedTemplate?.id,
          action: 'theme_customized',
          details: { customizations }
        });

      toast.success('Customizations saved successfully!');
    } catch (error) {
      console.error('Error saving customizations:', error);
      toast.error('Failed to save customizations');
    }
  };

  const handlePublish = async () => {
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user || !selectedTemplate) return;

      // Create seller theme
      const { data: sellerTheme, error } = await supabase
        .from('seller_themes')
        .insert({
          seller_id: user.data.user.id,
          template_id: selectedTemplate.id,
          theme_name: `${selectedTemplate.name} - Customized`,
          customizations,
          status: 'published',
          subdomain: `${user.data.user.id}-${Date.now()}`.substring(0, 20)
        })
        .select()
        .single();

      if (error) throw error;

      // Log activity
      await supabase
        .from('activity_logs')
        .insert({
          seller_id: user.data.user.id,
          template_id: selectedTemplate.id,
          seller_theme_id: sellerTheme.id,
          action: 'theme_published',
          details: { customizations }
        });

      toast.success('Theme published successfully!');
    } catch (error) {
      console.error('Error publishing theme:', error);
      toast.error('Failed to publish theme');
    }
  };

  const exportCode = () => {
    const exportData = {
      template: selectedTemplate,
      customizations,
      customCSS,
      customJS,
      exportDate: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.name || 'theme'}-customizations.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getDeviceFrameStyle = () => {
    switch (deviceMode) {
      case 'mobile':
        return { maxWidth: '375px', height: '667px' };
      case 'tablet':
        return { maxWidth: '768px', height: '1024px' };
      default:
        return { maxWidth: '100%', height: '800px' };
    }
  };

  if (!selectedTemplate) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Select a template to start customizing</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Toolbar */}
      <div className="border-b bg-background p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold">Visual Builder</h2>
            <Badge variant="outline">{selectedTemplate.name}</Badge>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <Button
                variant={deviceMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
              >
                <Monitor className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceMode('tablet')}
              >
                <Tablet className="w-4 h-4" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
              >
                <Smartphone className="w-4 h-4" />
              </Button>
            </div>
            
            <Separator orientation="vertical" className="h-6" />
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
            >
              {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCode(!showCode)}
            >
              <Code className="w-4 h-4" />
              Code
            </Button>
            
            <Button variant="outline" size="sm" onClick={exportCode}>
              <Download className="w-4 h-4" />
              Export
            </Button>
            
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            
            <Button size="sm" onClick={handlePublish}>
              <Upload className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Customization Panel */}
        {!isPreviewMode && (
          <div className="w-80 border-r bg-background overflow-y-auto">
            <div className="p-4">
              <Tabs defaultValue="design" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="design" className="text-xs">
                    <Palette className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="layout" className="text-xs">
                    <Layout className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="text" className="text-xs">
                    <Type className="w-4 h-4" />
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="text-xs">
                    <Settings className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="design" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Colors</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="primary-color" className="text-xs">Primary Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="primary-color"
                            type="color"
                            value={customizations.colors?.primary || '#3b82f6'}
                            onChange={(e) => updateCustomization('colors', 'primary', e.target.value)}
                            className="w-12 h-8 p-0 border rounded"
                          />
                          <Input
                            value={customizations.colors?.primary || '#3b82f6'}
                            onChange={(e) => updateCustomization('colors', 'primary', e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="secondary-color" className="text-xs">Secondary Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="secondary-color"
                            type="color"
                            value={customizations.colors?.secondary || '#64748b'}
                            onChange={(e) => updateCustomization('colors', 'secondary', e.target.value)}
                            className="w-12 h-8 p-0 border rounded"
                          />
                          <Input
                            value={customizations.colors?.secondary || '#64748b'}
                            onChange={(e) => updateCustomization('colors', 'secondary', e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="background-color" className="text-xs">Background Color</Label>
                        <div className="flex items-center space-x-2 mt-1">
                          <Input
                            id="background-color"
                            type="color"
                            value={customizations.colors?.background || '#ffffff'}
                            onChange={(e) => updateCustomization('colors', 'background', e.target.value)}
                            className="w-12 h-8 p-0 border rounded"
                          />
                          <Input
                            value={customizations.colors?.background || '#ffffff'}
                            onChange={(e) => updateCustomization('colors', 'background', e.target.value)}
                            className="text-xs"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="layout" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Layout Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="container-width" className="text-xs">Container Width</Label>
                        <Select
                          value={customizations.layout?.containerWidth || '1200px'}
                          onValueChange={(value) => updateCustomization('layout', 'containerWidth', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="100%">Full Width</SelectItem>
                            <SelectItem value="1200px">Large (1200px)</SelectItem>
                            <SelectItem value="1024px">Medium (1024px)</SelectItem>
                            <SelectItem value="768px">Small (768px)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="spacing" className="text-xs">Spacing</Label>
                        <Select
                          value={customizations.layout?.spacing || '1rem'}
                          onValueChange={(value) => updateCustomization('layout', 'spacing', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5rem">Tight</SelectItem>
                            <SelectItem value="1rem">Normal</SelectItem>
                            <SelectItem value="1.5rem">Relaxed</SelectItem>
                            <SelectItem value="2rem">Loose</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="border-radius" className="text-xs">Border Radius</Label>
                        <Select
                          value={customizations.layout?.borderRadius || '0.5rem'}
                          onValueChange={(value) => updateCustomization('layout', 'borderRadius', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">None</SelectItem>
                            <SelectItem value="0.25rem">Small</SelectItem>
                            <SelectItem value="0.5rem">Medium</SelectItem>
                            <SelectItem value="1rem">Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="text" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Typography</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="font-family" className="text-xs">Font Family</Label>
                        <Select
                          value={customizations.typography?.fontFamily || 'Inter'}
                          onValueChange={(value) => updateCustomization('typography', 'fontFamily', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Inter">Inter</SelectItem>
                            <SelectItem value="Roboto">Roboto</SelectItem>
                            <SelectItem value="Open Sans">Open Sans</SelectItem>
                            <SelectItem value="Poppins">Poppins</SelectItem>
                            <SelectItem value="Montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="font-size" className="text-xs">Base Font Size</Label>
                        <Select
                          value={customizations.typography?.fontSize || '16px'}
                          onValueChange={(value) => updateCustomization('typography', 'fontSize', value)}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="14px">Small</SelectItem>
                            <SelectItem value="16px">Medium</SelectItem>
                            <SelectItem value="18px">Large</SelectItem>
                            <SelectItem value="20px">Extra Large</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Custom Code</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="custom-css" className="text-xs">Custom CSS</Label>
                        <Textarea
                          id="custom-css"
                          value={customCSS}
                          onChange={(e) => setCustomCSS(e.target.value)}
                          placeholder="/* Custom CSS */&#10;.my-class {&#10;  color: red;&#10;}"
                          className="mt-1 font-mono text-xs"
                          rows={6}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="custom-js" className="text-xs">Custom JavaScript</Label>
                        <Textarea
                          id="custom-js"
                          value={customJS}
                          onChange={(e) => setCustomJS(e.target.value)}
                          placeholder="// Custom JavaScript&#10;console.log('Hello World');"
                          className="mt-1 font-mono text-xs"
                          rows={6}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Main Preview Area */}
        <div className="flex-1 bg-gray-100 p-4">
          <div className="h-full flex items-center justify-center">
            <div 
              className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300"
              style={getDeviceFrameStyle()}
            >
              <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                {/* Preview Content */}
                <div className="h-full bg-white p-6 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Header */}
                    <header 
                      className="p-6 rounded-lg"
                      style={{ 
                        backgroundColor: customizations.colors?.primary || '#3b82f6',
                        color: 'white'
                      }}
                    >
                      <h1 
                        className="text-3xl font-bold"
                        style={{ 
                          fontFamily: customizations.typography?.fontFamily || 'Inter' 
                        }}
                      >
                        {selectedTemplate.name}
                      </h1>
                      <p className="mt-2 opacity-90">{selectedTemplate.description}</p>
                    </header>

                    {/* Content Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div 
                        className="p-6 rounded-lg border-2"
                        style={{ 
                          borderColor: customizations.colors?.secondary || '#64748b',
                          borderRadius: customizations.layout?.borderRadius || '0.5rem'
                        }}
                      >
                        <h2 
                          className="text-xl font-semibold mb-4"
                          style={{ 
                            color: customizations.colors?.primary || '#3b82f6',
                            fontFamily: customizations.typography?.fontFamily || 'Inter'
                          }}
                        >
                          Section One
                        </h2>
                        <p 
                          className="text-gray-600"
                          style={{ 
                            fontSize: customizations.typography?.fontSize || '16px',
                            lineHeight: customizations.typography?.lineHeight || '1.6'
                          }}
                        >
                          This is a preview of your customized template. You can see how your changes affect the design in real-time.
                        </p>
                      </div>

                      <div 
                        className="p-6 rounded-lg"
                        style={{ 
                          backgroundColor: customizations.colors?.background || '#ffffff',
                          borderRadius: customizations.layout?.borderRadius || '0.5rem',
                          border: `1px solid ${customizations.colors?.secondary || '#64748b'}`
                        }}
                      >
                        <h2 
                          className="text-xl font-semibold mb-4"
                          style={{ 
                            color: customizations.colors?.primary || '#3b82f6',
                            fontFamily: customizations.typography?.fontFamily || 'Inter'
                          }}
                        >
                          Section Two
                        </h2>
                        <button 
                          className="px-6 py-2 rounded-lg text-white font-medium"
                          style={{ 
                            backgroundColor: customizations.colors?.primary || '#3b82f6',
                            borderRadius: customizations.layout?.borderRadius || '0.5rem'
                          }}
                        >
                          Call to Action
                        </button>
                      </div>
                    </div>

                    {/* Footer */}
                    <footer 
                      className="p-6 rounded-lg text-center"
                      style={{ 
                        backgroundColor: customizations.colors?.secondary || '#64748b',
                        color: 'white'
                      }}
                    >
                      <p>© 2024 Your Website. All rights reserved.</p>
                    </footer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Layers/Elements (optional) */}
        {!isPreviewMode && showCode && (
          <div className="w-80 border-l bg-background overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Generated Code</h3>
              <Tabs defaultValue="css" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                
                <TabsContent value="css" className="mt-4">
                  <Textarea
                    value={`/* Generated CSS */
:root {
  --primary-color: ${customizations.colors?.primary || '#3b82f6'};
  --secondary-color: ${customizations.colors?.secondary || '#64748b'};
  --background-color: ${customizations.colors?.background || '#ffffff'};
  --font-family: ${customizations.typography?.fontFamily || 'Inter'};
  --font-size: ${customizations.typography?.fontSize || '16px'};
  --border-radius: ${customizations.layout?.borderRadius || '0.5rem'};
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size);
  background-color: var(--background-color);
}

.header {
  background-color: var(--primary-color);
  border-radius: var(--border-radius);
}

${customCSS}`}
                    className="h-96 font-mono text-xs"
                    readOnly
                  />
                </TabsContent>
                
                <TabsContent value="html" className="mt-4">
                  <Textarea
                    value={`<!-- Generated HTML -->
<header class="header">
  <h1>${selectedTemplate.name}</h1>
  <p>${selectedTemplate.description}</p>
</header>

<main>
  <section>
    <h2>Section One</h2>
    <p>Content goes here...</p>
  </section>
</main>`}
                    className="h-96 font-mono text-xs"
                    readOnly
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}