import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeBuilder } from '@/hooks/useThemeBuilder'
import { EnhancedThemeLibrary } from '@/components/theme-builder/EnhancedThemeLibrary'
import { AdvancedDragDropBuilder } from '@/components/theme-builder/AdvancedDragDropBuilder'
import { ThemePreview } from '@/components/theme-builder/ThemePreview'
import { MultiFrameworkCodeEditor } from '@/components/theme-builder/MultiFrameworkCodeEditor'
import { EnhancedCodeEditor } from '@/components/theme-builder/EnhancedCodeEditor'
import { CustomComponentBuilder } from '@/components/theme-builder/CustomComponentBuilder'
import { AIIntegration } from '@/components/theme-builder/AIIntegration'
import { 
  Eye, 
  Settings, 
  Palette, 
  Code, 
  Wand2,
  Layout,
  Download,
  Save,
  Smartphone,
  Bot
} from 'lucide-react'

const Themes = () => {
  const [activeTab, setActiveTab] = useState('library')
  const [previewTheme, setPreviewTheme] = useState(null)
  
  const {
    themes,
    currentTheme,
    aiSuggestions,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    categories,
    applyTheme,
    updateCustomizations,
    generateAITheme,
    applyAISuggestion
  } = useThemeBuilder()

  // Mock data for advanced features
  const [layoutData, setLayoutData] = useState([])
  const [customCode, setCustomCode] = useState({
    globalCSS: '',
    globalJS: '',
    headCode: '',
    bodyStartCode: '',
    bodyEndCode: ''
  })
  const [codeSnippets, setCodeSnippets] = useState([])
  const [integrations, setIntegrations] = useState([])
  const [customComponents, setCustomComponents] = useState([])
  const [generatedHtml, setGeneratedHtml] = useState('')
  
  const defaultCustomizations = {
    colors: {
      primary: '#3b82f6',
      secondary: '#1e40af',
      accent: '#06b6d4',
      background: '#ffffff',
      foreground: '#000000',
      muted: '#f8fafc',
      destructive: '#ef4444',
      border: '#e2e8f0'
    },
    typography: {
      fontFamily: 'Inter',
      headingFont: 'Inter',
      bodyFont: 'Inter',
      baseFontSize: 16,
      lineHeight: 1.5,
      letterSpacing: 0,
      fontWeights: {
        light: 300,
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700
      }
    },
    spacing: {
      xs: '4px',
      sm: '8px',
      md: '16px',
      lg: '24px',
      xl: '32px',
      '2xl': '48px'
    },
    borderRadius: {
      none: '0',
      sm: '2px',
      md: '6px',
      lg: '8px',
      xl: '12px',
      full: '9999px'
    },
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
      none: 'none'
    },
    animation: {
      duration: '300ms',
      easing: 'ease-in-out',
      hover: true,
      transitions: true
    },
    layout: {
      maxWidth: '1200px',
      columns: 12,
      gutter: '24px'
    },
    customCSS: '',
    customJS: '',
    darkMode: false
  }

  const handlePreviewTheme = (theme) => {
    setPreviewTheme(theme)
  }

  const generateBuilderHtml = (layout) => {
    if (!layout || layout.length === 0) return

    const sections = layout.map(section => {
      const components = section.components?.map((component) => {
        return renderComponentAsHtml(component)
      }).join('') || ''

      return `
        <section style="display: grid; grid-template-columns: repeat(${section.gridCols || 12}, 1fr); gap: 1rem; padding: 1rem; ${section.styles ? Object.entries(section.styles).map(([k, v]) => `${k}: ${v}`).join('; ') : ''}">
          ${components}
        </section>
      `
    }).join('')

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Generated Website</title>
        <style>
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { 
            font-family: ${defaultCustomizations?.typography?.fontFamily || 'Inter, sans-serif'};
            background-color: ${defaultCustomizations?.colors?.background || '#ffffff'};
            color: ${defaultCustomizations?.colors?.foreground || '#000000'};
            line-height: 1.6;
          }
          @media (max-width: 768px) {
            section { grid-template-columns: 1fr !important; }
          }
        </style>
      </head>
      <body>
        ${sections}
      </body>
      </html>
    `
    
    setGeneratedHtml(html)
  }

  const renderComponentAsHtml = (component) => {
    const styles = component.styles || {}
    const content = component.content || {}
    
    switch (component.type) {
      case 'text':
        return `<${content.tag || 'p'} style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')}">${content.text || 'Text content'}</${content.tag || 'p'}>`
      
      case 'image':
        return `<img src="${content.src || '/api/placeholder/400/300'}" alt="${content.alt || 'Image'}" style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} max-width: 100%; height: auto;" />`
      
      case 'button':
        return `<button style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} cursor: pointer; border: none; padding: 12px 24px; border-radius: 6px; background: ${defaultCustomizations?.colors?.primary || '#3b82f6'}; color: white;">${content.text || 'Button'}</button>`
      
      case 'hero':
        return `
          <div style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} position: relative; background-image: url('${content.backgroundImage || ''}'); background-size: cover; background-position: center; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; color: white;">
            <div style="background: rgba(0,0,0,0.4); padding: 2rem; border-radius: 8px; max-width: 800px;">
              <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">${content.title || 'Hero Title'}</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">${content.subtitle || 'Hero subtitle'}</p>
              <button style="padding: 15px 30px; background: ${defaultCustomizations?.colors?.primary || '#3b82f6'}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1.1rem;">${content.ctaText || 'Call to Action'}</button>
            </div>
          </div>
        `
      
      default:
        return `<div style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} padding: 1rem; border: 1px dashed #ccc; text-align: center; background: #f9f9f9;">${component.type} component</div>`
    }
  }

  const handleAISuggestionFeedback = (suggestionId, liked, feedback) => {
    console.log('AI Feedback:', { suggestionId, liked, feedback })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Advanced Theme Builder</h1>
          <p className="text-muted-foreground">
            Build and customize professional themes with AI assistance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Current Theme Overview */}
      {currentTheme && (
        <Card className="border-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Current Theme: {currentTheme.theme?.name || 'Custom Theme'}
                  <Badge>Active</Badge>
                </CardTitle>
                <CardDescription>
                  {currentTheme.theme?.description || 'Custom themed website'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button 
                  size="sm"
                  onClick={() => setActiveTab('builder')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Builder
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="custom" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            Custom
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="preview" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="library">
          <EnhancedThemeLibrary
            themes={themes}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onApplyTheme={applyTheme}
            onPreviewTheme={handlePreviewTheme}
            loading={loading}
            favorites={[]}
            onToggleFavorite={() => {}}
          />
        </TabsContent>

        <TabsContent value="builder">
          <AdvancedDragDropBuilder
            layout={layoutData}
            onLayoutUpdate={(layout) => {
              setLayoutData(layout)
              generateBuilderHtml(layout)
            }}
            currentTheme={currentTheme}
          />
        </TabsContent>

        <TabsContent value="custom">
          <CustomComponentBuilder
            onSaveComponent={(component) => {
              setCustomComponents(prev => [...prev, component])
            }}
            onLoadComponent={(component) => {
              console.log('Loading custom component:', component.name)
            }}
            existingComponents={customComponents}
          />
        </TabsContent>

        <TabsContent value="ai-chat">
          <AIIntegration
            currentTheme={currentTheme}
            onApplyChanges={(changes) => {
              if (currentTheme) {
                const newCustomizations = {
                  ...currentTheme.customizations_json,
                  ...changes
                }
                updateCustomizations(newCustomizations)
              }
            }}
            onGenerateSuggestions={(type) => {
              generateAITheme('general', type)
            }}
          />
        </TabsContent>

        <TabsContent value="code">
          <EnhancedCodeEditor
            onCodeUpdate={(code, filename) => {
              console.log('Code updated:', { code, filename })
            }}
            onPreviewUpdate={(html) => {
              setGeneratedHtml(html)
            }}
            theme={currentTheme?.theme?.template_data || defaultCustomizations}
          />
        </TabsContent>


        <TabsContent value="preview">
          <ThemePreview 
            theme={currentTheme?.theme}
            customizations={currentTheme?.customizations_json || defaultCustomizations}
            layout={layoutData}
            previewHtml={generatedHtml}
            onApplyTheme={applyTheme}
            onCustomize={() => setActiveTab('builder')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Themes