import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { EnhancedComponentRenderer } from './EnhancedComponentRenderer'
import { ComponentEditor } from './ComponentEditor'
import { CustomComponentBuilder } from './CustomComponentBuilder'
import { 
  Type, 
  Image, 
  Video, 
  MousePointer, 
  ShoppingBag, 
  FileText, 
  ImageIcon, 
  RotateCw,
  Plus,
  Trash2,
  Copy,
  Settings,
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  Grid3X3,
  Layers,
  Code,
  Undo,
  Redo,
  Save,
  Download,
  Globe,
  Palette,
  Layout,
  Zap,
  Crown,
  Link,
  Upload,
  Star,
  Mail,
  Users,
  EyeOff
} from 'lucide-react'

interface Component {
  id: string
  type: 'text' | 'image' | 'video' | 'button' | 'product-card' | 'form' | 'gallery' | 'carousel' | 'hero' | 'testimonial' | 'pricing' | 'team' | 'feature' | 'newsletter' | 'footer' | 'custom'
  name: string
  icon: React.ReactNode
  content: any
  styles: {
    width?: string
    height?: string
    padding?: string
    margin?: string
    backgroundColor?: string
    color?: string
    fontSize?: string
    fontWeight?: string
    textAlign?: 'left' | 'center' | 'right' | 'justify'
    borderRadius?: string
    border?: string
    boxShadow?: string
  }
  responsive?: {
    desktop?: any
    tablet?: any
    mobile?: any
  }
}

interface Section {
  id: string
  name: string
  components: Component[]
  gridCols: number
  styles: any
}

interface AdvancedDragDropBuilderProps {
  layout: Section[]
  onLayoutUpdate: (layout: Section[]) => void
  currentTheme?: any
}

export const AdvancedDragDropBuilder: React.FC<AdvancedDragDropBuilderProps> = ({
  layout,
  onLayoutUpdate,
  currentTheme
}) => {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPreview, setIsPreview] = useState(false)
  const [gridSize, setGridSize] = useState(12)
  const [snapToGrid, setSnapToGrid] = useState(true)
  const [history, setHistory] = useState<Section[][]>([layout])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [activeTab, setActiveTab] = useState<'components' | 'templates' | 'custom' | 'publishing'>('components')
  const [showComponentEditor, setShowComponentEditor] = useState(false)
  const [customComponents, setCustomComponents] = useState<any[]>([])
  const [showCustomBuilder, setShowCustomBuilder] = useState(false)
  const [previewHtml, setPreviewHtml] = useState('')

  const componentTypes: Omit<Component, 'id' | 'content' | 'styles'>[] = [
    { type: 'text', name: 'Text Block', icon: <Type className="h-4 w-4" /> },
    { type: 'image', name: 'Image', icon: <Image className="h-4 w-4" /> },
    { type: 'video', name: 'Video', icon: <Video className="h-4 w-4" /> },
    { type: 'button', name: 'Button', icon: <MousePointer className="h-4 w-4" /> },
    { type: 'product-card', name: 'Product Card', icon: <ShoppingBag className="h-4 w-4" /> },
    { type: 'form', name: 'Form', icon: <FileText className="h-4 w-4" /> },
    { type: 'gallery', name: 'Gallery', icon: <ImageIcon className="h-4 w-4" /> },
    { type: 'carousel', name: 'Carousel', icon: <RotateCw className="h-4 w-4" /> },
    { type: 'hero', name: 'Hero Section', icon: <Layers className="h-4 w-4" /> },
    { type: 'testimonial', name: 'Testimonial', icon: <Star className="h-4 w-4" /> },
    { type: 'pricing', name: 'Pricing Table', icon: <Grid3X3 className="h-4 w-4" /> },
    { type: 'team', name: 'Team Member', icon: <Users className="h-4 w-4" /> },
    { type: 'feature', name: 'Feature Block', icon: <Zap className="h-4 w-4" /> },
    { type: 'newsletter', name: 'Newsletter', icon: <Mail className="h-4 w-4" /> },
    { type: 'footer', name: 'Footer', icon: <Layout className="h-4 w-4" /> }
  ]

  // Generate HTML for preview
  const generateBuilderHtml = useCallback((currentLayout: Section[]) => {
    if (!currentLayout || currentLayout.length === 0) return ''

    const sections = currentLayout.map(section => {
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
            font-family: ${currentTheme?.customizations?.typography?.fontFamily || 'Inter, sans-serif'};
            background-color: ${currentTheme?.customizations?.colors?.background || '#ffffff'};
            color: ${currentTheme?.customizations?.colors?.foreground || '#000000'};
            line-height: 1.6;
          }
          @media (max-width: 768px) {
            section { grid-template-columns: 1fr !important; }
          }
          @media (max-width: 1024px) and (min-width: 769px) {
            section { grid-template-columns: repeat(2, 1fr) !important; }
          }
        </style>
      </head>
      <body>
        ${sections}
      </body>
      </html>
    `
    
    setPreviewHtml(html)
    return html
  }, [currentTheme])

  const renderComponentAsHtml = (component: Component) => {
    const styles = component.styles || {}
    const content = component.content || {}
    
    switch (component.type) {
      case 'text':
        return `<${content.tag || 'p'} style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')}">${content.text || 'Text content'}</${content.tag || 'p'}>`
      
      case 'image':
        return `<img src="${content.src || '/api/placeholder/400/300'}" alt="${content.alt || 'Image'}" style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} max-width: 100%; height: auto;" />`
      
      case 'button':
        return `<button style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} cursor: pointer; border: none; padding: 12px 24px; border-radius: 6px; background: ${currentTheme?.customizations?.colors?.primary || '#3b82f6'}; color: white;">${content.text || 'Button'}</button>`
      
      case 'hero':
        return `
          <div style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} position: relative; background-image: url('${content.backgroundImage || ''}'); background-size: cover; background-position: center; min-height: 400px; display: flex; align-items: center; justify-content: center; text-align: center; color: white;">
            <div style="background: rgba(0,0,0,0.4); padding: 2rem; border-radius: 8px; max-width: 800px;">
              <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">${content.title || 'Hero Title'}</h1>
              <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">${content.subtitle || 'Hero subtitle'}</p>
              <button style="padding: 15px 30px; background: ${currentTheme?.customizations?.colors?.primary || '#3b82f6'}; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1.1rem;">${content.ctaText || 'Call to Action'}</button>
            </div>
          </div>
        `
      
      default:
        return `<div style="${Object.entries(styles).map(([k, v]) => `${k}: ${v}`).join('; ')} padding: 1rem; border: 1px dashed #ccc; text-align: center; background: #f9f9f9;">${component.type} component</div>`
    }
  }

  const createNewComponent = useCallback((type: Component['type']): Component => {
    const baseComponent = componentTypes.find(c => c.type === type)
    const defaultContent = getDefaultContent(type)
    const defaultStyles = getDefaultStyles(type)
    
    return {
      id: `${type}-${Date.now()}`,
      type,
      name: baseComponent?.name || type,
      icon: baseComponent?.icon || <Type className="h-4 w-4" />,
      content: defaultContent,
      styles: defaultStyles,
      responsive: {
        desktop: defaultContent,
        tablet: defaultContent,
        mobile: defaultContent
      }
    }
  }, [componentTypes])

  const getDefaultStyles = (type: Component['type']) => {
    const baseStyles = {
      width: '100%',
      margin: '0',
      backgroundColor: 'transparent',
      color: 'hsl(var(--foreground))',
      fontSize: '16px',
      fontWeight: 'normal',
      textAlign: 'left' as const
    }

    switch (type) {
      case 'text':
        return { ...baseStyles, padding: '16px 0' }
      case 'image':
        return { ...baseStyles, padding: '0', height: 'auto' }
      case 'video':
        return { ...baseStyles, padding: '0', height: '300px' }
      case 'button':
        return { ...baseStyles, padding: '12px 24px', width: 'auto', display: 'inline-block' }
      case 'hero':
        return { ...baseStyles, padding: '80px 20px', minHeight: '400px', backgroundColor: 'hsl(var(--primary))', color: 'white', textAlign: 'center' as const }
      default:
        return { ...baseStyles, padding: '16px' }
    }
  }

  const getDefaultContent = (type: Component['type']) => {
    switch (type) {
      case 'text':
        return { text: 'Your text here...', tag: 'p' }
      case 'image':
        return { src: '/api/placeholder/400/300', alt: 'Image description' }
      case 'video':
        return { src: '', poster: '/api/placeholder/400/300' }
      case 'button':
        return { text: 'Click me', link: '#', variant: 'primary' }
      case 'hero':
        return { title: 'Hero Title', subtitle: 'Hero subtitle', backgroundImage: '/api/placeholder/1200/600', ctaText: 'Get Started', ctaLink: '#' }
      default:
        return { text: 'Component content' }
    }
  }

  const handleAddSection = useCallback(() => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: `Section ${layout.length + 1}`,
      components: [],
      gridCols: 12,
      styles: {
        padding: '40px 20px',
        backgroundColor: 'transparent',
        minHeight: '200px'
      }
    }
    
    const updatedLayout = [...layout, newSection]
    onLayoutUpdate(updatedLayout)
    generateBuilderHtml(updatedLayout)
    toast.success('New section added')
  }, [layout, onLayoutUpdate, generateBuilderHtml])

  const handleAddComponentToSection = useCallback((sectionId: string, componentType: Component['type']) => {
    const newComponent = createNewComponent(componentType)
    const updatedLayout = layout.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: [...section.components, newComponent]
        }
      }
      return section
    })
    onLayoutUpdate(updatedLayout)
    generateBuilderHtml(updatedLayout)
    toast.success(`Added ${componentType} component`)
  }, [layout, createNewComponent, onLayoutUpdate, generateBuilderHtml])

  const handleDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === 'components-panel') {
      // Adding new component
      const componentType = result.draggableId as Component['type']
      const targetSectionId = destination.droppableId
      handleAddComponentToSection(targetSectionId, componentType)
    } else {
      // Moving existing component
      const updatedLayout = [...layout]
      const sourceSection = updatedLayout.find(s => s.id === source.droppableId)
      const destSection = updatedLayout.find(s => s.id === destination.droppableId)

      if (sourceSection && destSection) {
        const [movedComponent] = sourceSection.components.splice(source.index, 1)
        destSection.components.splice(destination.index, 0, movedComponent)
        
        onLayoutUpdate(updatedLayout)
        generateBuilderHtml(updatedLayout)
      }
    }
  }, [layout, onLayoutUpdate, handleAddComponentToSection, generateBuilderHtml])

  const handleComponentClick = useCallback((component: Component) => {
    setSelectedComponent(component)
  }, [])

  const handleComponentDoubleClick = useCallback((component: Component) => {
    setSelectedComponent(component)
    setShowComponentEditor(true)
  }, [])

  const handleComponentUpdate = useCallback((updatedComponent: Component) => {
    const updatedLayout = layout.map(section => ({
      ...section,
      components: section.components.map(comp => 
        comp.id === updatedComponent.id ? updatedComponent : comp
      )
    }))
    onLayoutUpdate(updatedLayout)
    generateBuilderHtml(updatedLayout)
    setSelectedComponent(updatedComponent)
  }, [layout, onLayoutUpdate, generateBuilderHtml])

  const handleDeleteComponent = useCallback((componentId: string) => {
    const updatedLayout = layout.map(section => ({
      ...section,
      components: section.components.filter(comp => comp.id !== componentId)
    }))
    onLayoutUpdate(updatedLayout)
    generateBuilderHtml(updatedLayout)
    setSelectedComponent(null)
    toast.success('Component deleted')
  }, [layout, onLayoutUpdate, generateBuilderHtml])

  const handleSaveCustomComponent = useCallback((component: any) => {
    setCustomComponents(prev => [...prev, component])
    setShowCustomBuilder(false)
    toast.success('Custom component saved!')
  }, [])

  // Generate HTML when layout changes
  useEffect(() => {
    if (layout.length > 0) {
      generateBuilderHtml(layout)
    }
  }, [layout, generateBuilderHtml])

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex h-[calc(100vh-200px)] gap-4">
        
        {/* Component Library Sidebar */}
        <div className="w-80 border-r bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Components</h3>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setIsPreview(!isPreview)}>
                  {isPreview ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                </Button>
                <Button size="sm" variant="outline" onClick={handleAddSection}>
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="flex gap-1 mb-4">
              <Button
                variant={previewMode === 'desktop' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('desktop')}
              >
                <Monitor className="h-3 w-3" />
              </Button>
              <Button
                variant={previewMode === 'tablet' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('tablet')}
              >
                <Tablet className="h-3 w-3" />
              </Button>
              <Button
                variant={previewMode === 'mobile' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setPreviewMode('mobile')}
              >
                <Smartphone className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'components' | 'templates' | 'custom' | 'publishing')} className="flex-1">
            <TabsList className="grid grid-cols-3 mx-4">
              <TabsTrigger value="components">Components</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="px-4 pb-4">
              <Droppable droppableId="components-panel" isDropDisabled={true}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-2">
                    <Label className="text-sm font-medium">Drag to Canvas</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
                      {componentTypes.map((componentType, index) => (
                        <Draggable
                          key={componentType.type}
                          draggableId={componentType.type}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 cursor-pointer hover:shadow-md transition-shadow border-2 ${
                                snapshot.isDragging ? 'border-primary shadow-lg' : 'border-transparent hover:border-primary/20'
                              }`}
                            >
                              <div className="flex flex-col items-center gap-2 text-center">
                                {componentType.icon}
                                <span className="text-xs font-medium">{componentType.name}</span>
                              </div>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </TabsContent>

            <TabsContent value="custom" className="px-4 pb-4">
              <div className="space-y-4">
                <Button
                  onClick={() => setShowCustomBuilder(true)}
                  className="w-full"
                  variant="outline"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Custom Component
                </Button>
                
                {customComponents.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Your Custom Components</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {customComponents.map((component) => (
                        <Card key={component.id} className="p-3 border-accent/20 bg-accent/5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4 text-accent" />
                              <span className="text-sm font-medium">{component.name}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => {
                                  if (layout.length > 0) {
                                    handleAddComponentToSection(layout[0].id, 'custom')
                                  } else {
                                    handleAddSection()
                                  }
                                }}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="templates" className="px-4 pb-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Quick Templates</Label>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => {
                      const heroSection: Section = {
                        id: `section-${Date.now()}`,
                        name: 'Hero Section',
                        components: [createNewComponent('hero')],
                        gridCols: 12,
                        styles: { padding: '0', backgroundColor: 'transparent' }
                      }
                      onLayoutUpdate([heroSection])
                      toast.success('Hero template applied!')
                    }}
                  >
                    <Layers className="mr-2 h-4 w-4" />
                    Hero Template
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 overflow-auto">
          <div className="h-full bg-background border rounded-lg">
            {layout.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-4xl mb-4">🎨</div>
                  <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                  <p className="text-muted-foreground mb-4">Add a section or drag components to start</p>
                  <Button onClick={handleAddSection}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Section
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {layout.map((section) => (
                  <div key={section.id} className="border rounded-lg bg-muted/20">
                    <div className="flex items-center justify-between p-3 border-b bg-muted/10">
                      <span className="font-medium">{section.name}</span>
                      <div className="flex gap-2">
                        <Badge variant="secondary">{section.gridCols} cols</Badge>
                        <Button size="sm" variant="ghost">
                          <Settings className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Droppable droppableId={section.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`min-h-32 p-4 transition-colors ${
                            snapshot.isDraggingOver ? 'bg-primary/5 border-primary/20' : ''
                          }`}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: previewMode === 'mobile' ? '1fr' : 
                                               previewMode === 'tablet' ? 'repeat(2, 1fr)' : 
                                               `repeat(${section.gridCols}, 1fr)`,
                            gap: '1rem',
                            ...section.styles
                          }}
                        >
                          {section.components.length === 0 ? (
                            <div className="col-span-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg p-8">
                              Drop components here or click + to add
                            </div>
                          ) : (
                            section.components.map((component, index) => (
                              <Draggable key={component.id} draggableId={component.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`relative ${
                                      snapshot.isDragging ? 'opacity-50' : ''
                                    } ${
                                      selectedComponent?.id === component.id ? 'ring-2 ring-primary' : ''
                                    }`}
                                  >
                                    <EnhancedComponentRenderer 
                                      component={component} 
                                      isPreview={isPreview}
                                      isSelected={selectedComponent?.id === component.id}
                                      onClick={() => handleComponentClick(component)}
                                      onDoubleClick={() => handleComponentDoubleClick(component)}
                                    />
                                    
                                    {!isPreview && selectedComponent?.id === component.id && (
                                      <div className="absolute -top-8 right-0 flex gap-1">
                                        <Button size="sm" variant="secondary" onClick={() => setShowComponentEditor(true)}>
                                          <Settings className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={() => handleDeleteComponent(component.id)}>
                                          <Trash2 className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            ))
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Component Editor Dialog */}
        {showComponentEditor && selectedComponent && (
          <Dialog open={showComponentEditor} onOpenChange={setShowComponentEditor}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Component</DialogTitle>
                <DialogDescription>
                  Customize the properties of your {selectedComponent.name}
                </DialogDescription>
              </DialogHeader>
              <ComponentEditor
                component={selectedComponent}
                onUpdate={handleComponentUpdate}
                onClose={() => {
                  setShowComponentEditor(false)
                  setSelectedComponent(null)
                }}
              />
            </DialogContent>
          </Dialog>
        )}

        {/* Custom Component Builder Dialog */}
        {showCustomBuilder && (
          <Dialog open={showCustomBuilder} onOpenChange={setShowCustomBuilder}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
              <DialogHeader>
                <DialogTitle>Create Custom Component</DialogTitle>
                <DialogDescription>
                  Build your own reusable component
                </DialogDescription>
              </DialogHeader>
              <CustomComponentBuilder
                onSaveComponent={handleSaveCustomComponent}
                onLoadComponent={() => {}}
                existingComponents={customComponents}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DragDropContext>
  )
}