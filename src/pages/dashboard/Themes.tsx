import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useThemeBuilder } from '@/hooks/useThemeBuilder'
import { EnhancedThemeLibrary } from '@/components/theme-builder/EnhancedThemeLibrary'
import { ProfessionalCustomizationPanel } from '@/components/theme-builder/ProfessionalCustomizationPanel'
import { AdvancedDragDropBuilder } from '@/components/theme-builder/AdvancedDragDropBuilder'
import { AIThemeGenerator } from '@/components/theme-builder/AIThemeGenerator'
import { CodeEmbedding } from '@/components/theme-builder/CodeEmbedding'
import { ThemePreview } from '@/components/theme-builder/ThemePreview'
import { MultiFrameworkCodeEditor } from '@/components/theme-builder/MultiFrameworkCodeEditor'
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

  const handleAISuggestionFeedback = (suggestionId, liked, feedback) => {
    // Implementation for AI feedback
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
                  onClick={() => setActiveTab('customize')}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Customize
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Customize
          </TabsTrigger>
          <TabsTrigger value="builder" className="flex items-center gap-2">
            <Layout className="h-4 w-4" />
            Builder
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            AI Generator
          </TabsTrigger>
          <TabsTrigger value="ai-chat" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="code" className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            Code Editor
          </TabsTrigger>
          <TabsTrigger value="embed" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Embed
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

        <TabsContent value="customize">
          <ProfessionalCustomizationPanel
            currentTheme={currentTheme}
            customizations={currentTheme?.customizations_json || defaultCustomizations}
            onUpdateCustomizations={updateCustomizations}
            onResetToDefault={() => updateCustomizations(defaultCustomizations)}
            onSave={() => console.log('Saving customizations...')}
            onExport={() => console.log('Exporting theme...')}
            onImport={(file) => console.log('Importing theme...', file)}
          />
        </TabsContent>

        <TabsContent value="builder">
          <AdvancedDragDropBuilder
            layout={layoutData}
            onLayoutUpdate={setLayoutData}
            currentTheme={currentTheme}
          />
        </TabsContent>

        <TabsContent value="ai">
          <AIThemeGenerator
            themes={aiSuggestions}
            onGenerateTheme={generateAITheme}
            onApplyTheme={applyAISuggestion}
            onFeedback={handleAISuggestionFeedback}
            loading={loading}
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
          <MultiFrameworkCodeEditor
            theme={currentTheme}
            onCodeUpdate={(code, framework, language) => {
              console.log('Code updated:', { code, framework, language })
            }}
          />
        </TabsContent>

        <TabsContent value="embed">
          <CodeEmbedding
            customCode={customCode}
            snippets={codeSnippets}
            integrations={integrations}
            onUpdateCustomCode={setCustomCode}
            onUpdateSnippets={setCodeSnippets}
            onUpdateIntegrations={setIntegrations}
          />
        </TabsContent>

        <TabsContent value="preview">
          <ThemePreview 
            theme={currentTheme?.theme}
            customizations={currentTheme?.customizations_json || defaultCustomizations}
            layout={layoutData}
            onApplyTheme={applyTheme}
            onCustomize={() => setActiveTab('customize')}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Themes