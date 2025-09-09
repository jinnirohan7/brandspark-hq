import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  Tv,
  Eye, 
  Code,
  Fullscreen,
  RotateCcw,
  Share2
} from 'lucide-react'
import { EnhancedComponentRenderer } from './EnhancedComponentRenderer'

interface Section {
  id: string
  name: string
  components: any[]
  gridCols: number
  styles: any
}

interface ResponsivePreviewProps {
  layout: Section[]
  isPreview: boolean
  currentTheme?: any
  customizations?: any
  onPreviewModeChange?: (mode: 'desktop' | 'tablet' | 'mobile' | 'tv') => void
  onTogglePreview?: () => void
  onGenerateCode?: () => void
}

export const ResponsivePreview: React.FC<ResponsivePreviewProps> = ({
  layout,
  isPreview,
  currentTheme,
  customizations,
  onPreviewModeChange,
  onTogglePreview,
  onGenerateCode
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile' | 'tv'>('desktop')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  const getResponsiveStyles = (mode: string) => {
    const baseStyles = {
      transition: 'all 0.3s ease',
      margin: '0 auto',
      overflow: 'auto'
    }

    switch (mode) {
      case 'mobile':
        return {
          ...baseStyles,
          width: '375px',
          height: '812px',
          maxHeight: '600px'
        }
      case 'tablet':
        return {
          ...baseStyles,
          width: '768px',
          height: '1024px',
          maxHeight: '600px'
        }
      case 'tv':
        return {
          ...baseStyles,
          width: '1920px',
          height: '1080px',
          maxHeight: '600px',
          transform: 'scale(0.3)',
          transformOrigin: 'top center'
        }
      default: // desktop
        return {
          ...baseStyles,
          width: '100%',
          height: '600px'
        }
    }
  }

  const handleViewModeChange = (mode: 'desktop' | 'tablet' | 'mobile' | 'tv') => {
    setViewMode(mode)
    onPreviewModeChange?.(mode)
  }

  const generatePreviewHtml = () => {
    const sections = layout.map(section => {
      const components = section.components.map(component => {
        // Generate responsive CSS for each component
        const responsiveStyles = component.responsive ? {
          desktop: component.responsive.desktop || component.styles,
          tablet: component.responsive.tablet || component.styles,
          mobile: component.responsive.mobile || component.styles
        } : { desktop: component.styles, tablet: component.styles, mobile: component.styles }

        return `
          <div class="component-${component.id}" data-type="${component.type}">
            ${renderComponentHtml(component, responsiveStyles[viewMode])}
          </div>
        `
      }).join('')

      return `
        <section class="section-${section.id}" style="
          display: grid;
          grid-template-columns: repeat(${section.gridCols}, 1fr);
          gap: 1rem;
          padding: 1rem;
          ${section.styles ? Object.entries(section.styles).map(([key, value]) => `${key}: ${value}`).join('; ') : ''}
        ">
          ${components}
        </section>
      `
    }).join('')

    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Website Preview</title>
        <style>
          * { box-sizing: border-box; }
          body { 
            margin: 0; 
            padding: 0; 
            font-family: ${customizations?.typography?.fontFamily || 'Inter, sans-serif'};
            background-color: ${customizations?.colors?.background || '#ffffff'};
            color: ${customizations?.colors?.foreground || '#000000'};
          }
          
          /* Responsive breakpoints */
          @media (max-width: 768px) {
            .section-grid { grid-template-columns: 1fr !important; }
            .component { padding: 0.5rem !important; }
          }
          
          @media (min-width: 769px) and (max-width: 1024px) {
            .section-grid { grid-template-columns: repeat(2, 1fr) !important; }
          }
          
          @media (min-width: 1920px) {
            .container { max-width: 1800px; margin: 0 auto; }
          }
        </style>
      </head>
      <body>
        ${sections}
      </body>
      </html>
    `
  }

  const renderComponentHtml = (component: any, styles: any) => {
    switch (component.type) {
      case 'text':
        const tag = component.content.tag || 'p'
        return `<${tag} style="${Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ')}">${component.content.text || 'Text content'}</${tag}>`
      
      case 'image':
        return `<img src="${component.content.src || '/api/placeholder/400/300'}" alt="${component.content.alt || 'Image'}" style="${Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ')} width: 100%; height: auto;" />`
      
      case 'button':
        return `<button style="${Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ')} cursor: pointer; border: none; padding: 12px 24px; border-radius: 6px; background: ${customizations?.colors?.primary || '#3b82f6'}; color: white;">${component.content.text || 'Button'}</button>`
      
      case 'hero':
        return `
          <div style="${Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ')} position: relative; background-image: url(${component.content.backgroundImage || ''}); background-size: cover; background-position: center; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; color: white;">
            <div style="background: rgba(0,0,0,0.4); padding: 2rem; border-radius: 8px;">
              <h1 style="font-size: 3rem; margin-bottom: 1rem;">${component.content.title || 'Hero Title'}</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem;">${component.content.subtitle || 'Hero subtitle'}</p>
              <button style="padding: 12px 24px; background: ${customizations?.colors?.primary || '#3b82f6'}; color: white; border: none; border-radius: 6px; cursor: pointer;">${component.content.ctaText || 'Call to Action'}</button>
            </div>
          </div>
        `
      
      default:
        return `<div style="${Object.entries(styles).map(([key, value]) => `${key}: ${value}`).join('; ')} padding: 1rem; border: 1px dashed #ccc; text-align: center;">${component.type} component</div>`
    }
  }

  useEffect(() => {
    const html = generatePreviewHtml()
    setPreviewHtml(html)
  }, [layout, viewMode, customizations])

  const renderPreview = () => {
    if (!layout || layout.length === 0) {
      return (
        <div className="flex items-center justify-center h-96 bg-muted/30 rounded-lg border-2 border-dashed">
          <div className="text-center">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">Start Building Your Website</h3>
            <p className="text-muted-foreground">Drag components from the left panel to start creating your page</p>
          </div>
        </div>
      )
    }

    return (
      <div 
        className="border rounded-lg overflow-hidden bg-background shadow-sm"
        style={getResponsiveStyles(viewMode)}
      >
        {layout.map((section) => (
          <div
            key={section.id}
            className="section-container"
            style={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'mobile' ? '1fr' : 
                               viewMode === 'tablet' ? 'repeat(2, 1fr)' : 
                               `repeat(${section.gridCols}, 1fr)`,
              gap: '1rem',
              padding: '1rem',
              ...section.styles
            }}
          >
            {section.components.map((component) => {
              const responsiveContent = component.responsive?.[viewMode] || component.content
              const responsiveStyles = component.responsive?.[viewMode] || component.styles
              
              return (
                <EnhancedComponentRenderer
                  key={component.id}
                  component={{
                    ...component,
                    content: responsiveContent,
                    styles: responsiveStyles
                  }}
                  isPreview={true}
                  onClick={() => {}}
                  onDoubleClick={() => {}}
                />
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-background p-4' : ''}`}>
      {/* Responsive Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('desktop')}
          >
            <Monitor className="mr-1 h-3 w-3" />
            Desktop
          </Button>
          <Button
            variant={viewMode === 'tablet' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('tablet')}
          >
            <Tablet className="mr-1 h-3 w-3" />
            Tablet
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('mobile')}
          >
            <Smartphone className="mr-1 h-3 w-3" />
            Mobile
          </Button>
          <Button
            variant={viewMode === 'tv' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleViewModeChange('tv')}
          >
            <Tv className="mr-1 h-3 w-3" />
            TV
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)} View
          </Badge>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            <Fullscreen className="mr-1 h-3 w-3" />
            {isFullscreen ? 'Exit' : 'Fullscreen'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onTogglePreview}
          >
            <Eye className="mr-1 h-3 w-3" />
            {isPreview ? 'Edit' : 'Preview'}
          </Button>

          {onGenerateCode && (
            <Button
              variant="outline"
              size="sm"
              onClick={onGenerateCode}
            >
              <Code className="mr-1 h-3 w-3" />
              View Code
            </Button>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigator.share && navigator.share({ url: window.location.href })}
          >
            <Share2 className="mr-1 h-3 w-3" />
            Share
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Responsive Website Preview
            <Badge variant="outline">{layout.length} sections</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex justify-center bg-muted/20 p-4">
            {renderPreview()}
          </div>
        </CardContent>
      </Card>

      {/* Generated HTML (hidden, for code editor integration) */}
      <textarea
        style={{ display: 'none' }}
        value={previewHtml}
        readOnly
        data-preview-html
      />
    </div>
  )
}