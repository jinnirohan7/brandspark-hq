import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Eye, 
  Code, 
  Settings,
  Fullscreen,
  RotateCcw,
  Download,
  Share2
} from 'lucide-react'

interface ThemePreviewProps {
  theme: any
  customizations?: any
  layout?: any[]
  onApplyTheme?: (themeId: string) => void
  onCustomize?: () => void
}

export const ThemePreview: React.FC<ThemePreviewProps> = ({
  theme,
  customizations,
  layout,
  onApplyTheme,
  onCustomize
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState('preview')
  const [isFullscreen, setIsFullscreen] = useState(false)

  const getPreviewDimensions = () => {
    switch (viewMode) {
      case 'tablet':
        return { width: '768px', height: '1024px' }
      case 'mobile':
        return { width: '375px', height: '812px' }
      default:
        return { width: '100%', height: '600px' }
    }
  }

  const renderThemePreview = () => {
    const styles = {
      ...customizations,
      fontFamily: customizations?.typography?.fontFamily || 'Inter',
      backgroundColor: customizations?.colors?.background || '#ffffff',
      color: customizations?.colors?.foreground || '#000000'
    }

    return (
      <div 
        className="w-full h-full overflow-auto border rounded-lg"
        style={{ 
          ...getPreviewDimensions(),
          ...styles,
          maxHeight: isFullscreen ? '100vh' : '600px'
        }}
      >
        {/* Header */}
        <div 
          className="p-4 border-b"
          style={{ 
            backgroundColor: customizations?.colors?.primary || '#3b82f6',
            color: '#ffffff'
          }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">{theme?.name || 'Theme Preview'}</h1>
            <nav className="hidden md:flex gap-4">
              <a href="#" className="hover:underline">Home</a>
              <a href="#" className="hover:underline">About</a>
              <a href="#" className="hover:underline">Services</a>
              <a href="#" className="hover:underline">Contact</a>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div 
          className="p-8 text-center"
          style={{ 
            backgroundColor: customizations?.colors?.muted || '#f8fafc',
            minHeight: '300px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}
        >
          <h2 
            className="text-4xl font-bold mb-4"
            style={{ 
              fontSize: customizations?.typography?.headingFont?.size || '2.25rem',
              fontWeight: customizations?.typography?.fontWeights?.bold || 700
            }}
          >
            Welcome to Your Website
          </h2>
          <p 
            className="text-lg mb-6"
            style={{ 
              fontSize: customizations?.typography?.baseFontSize || '1rem',
              color: customizations?.colors?.foreground || '#666666'
            }}
          >
            {theme?.description || 'Create amazing experiences with our professional themes'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              style={{ 
                backgroundColor: customizations?.colors?.primary || '#3b82f6',
                color: '#ffffff',
                borderRadius: customizations?.borderRadius?.md || '6px'
              }}
            >
              Get Started
            </Button>
            <Button 
              variant="outline"
              style={{ 
                borderColor: customizations?.colors?.primary || '#3b82f6',
                color: customizations?.colors?.primary || '#3b82f6',
                borderRadius: customizations?.borderRadius?.md || '6px'
              }}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div className="p-8">
          <h3 className="text-2xl font-bold text-center mb-8">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="p-6 rounded-lg border text-center"
                style={{ 
                  borderColor: customizations?.colors?.border || '#e2e8f0',
                  borderRadius: customizations?.borderRadius?.lg || '8px'
                }}
              >
                <div 
                  className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: customizations?.colors?.accent || '#06b6d4' }}
                >
                  <div className="w-6 h-6 bg-white rounded"></div>
                </div>
                <h4 className="text-lg font-semibold mb-2">Feature {i}</h4>
                <p className="text-sm opacity-70">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div 
          className="p-6 border-t text-center"
          style={{ 
            backgroundColor: customizations?.colors?.muted || '#f8fafc',
            borderColor: customizations?.colors?.border || '#e2e8f0'
          }}
        >
          <p className="text-sm opacity-70">
            © 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    )
  }

  const renderCodePreview = () => {
    const generatedCSS = `
/* Generated Theme CSS */
:root {
  --primary: ${customizations?.colors?.primary || '#3b82f6'};
  --secondary: ${customizations?.colors?.secondary || '#1e40af'};
  --accent: ${customizations?.colors?.accent || '#06b6d4'};
  --background: ${customizations?.colors?.background || '#ffffff'};
  --foreground: ${customizations?.colors?.foreground || '#000000'};
  --muted: ${customizations?.colors?.muted || '#f8fafc'};
  --border: ${customizations?.colors?.border || '#e2e8f0'};
  
  --font-family: ${customizations?.typography?.fontFamily || 'Inter'};
  --font-size-base: ${customizations?.typography?.baseFontSize || 16}px;
  --line-height: ${customizations?.typography?.lineHeight || 1.5};
  
  --border-radius-sm: ${customizations?.borderRadius?.sm || '2px'};
  --border-radius-md: ${customizations?.borderRadius?.md || '6px'};
  --border-radius-lg: ${customizations?.borderRadius?.lg || '8px'};
  
  --spacing-sm: ${customizations?.spacing?.sm || '8px'};
  --spacing-md: ${customizations?.spacing?.md || '16px'};
  --spacing-lg: ${customizations?.spacing?.lg || '24px'};
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height);
  background-color: var(--background);
  color: var(--foreground);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
}
`

    return (
      <ScrollArea className="h-96">
        <pre className="text-xs bg-muted p-4 rounded">
          <code>{generatedCSS}</code>
        </pre>
      </ScrollArea>
    )
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="mr-1 h-3 w-3" />
            Desktop
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('tablet')}
          >
            <Tablet className="mr-1 h-3 w-3" />
            Tablet
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="mr-1 h-3 w-3" />
            Mobile
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Fullscreen className="mr-1 h-3 w-3" />
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
          
          {onCustomize && (
            <Button variant="outline" size="sm" onClick={onCustomize}>
              <Settings className="mr-1 h-3 w-3" />
              Customize
            </Button>
          )}
          
          {onApplyTheme && theme?.id && (
            <Button size="sm" onClick={() => onApplyTheme(theme.id)}>
              Apply Theme
            </Button>
          )}
        </div>
      </div>

      {/* Preview Content */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Theme Preview
                {theme?.name && <Badge variant="secondary">{theme.name}</Badge>}
              </CardTitle>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="preview" className="mt-0">
              <div className="flex justify-center">
                {renderThemePreview()}
              </div>
            </TabsContent>
            <TabsContent value="code" className="mt-0">
              {renderCodePreview()}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}