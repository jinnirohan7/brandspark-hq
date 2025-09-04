import React, { useState, useCallback, useMemo } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
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
  Download
} from 'lucide-react'

interface Component {
  id: string
  type: 'text' | 'image' | 'video' | 'button' | 'product-card' | 'form' | 'gallery' | 'carousel' | 'hero' | 'testimonial' | 'pricing' | 'team' | 'feature' | 'newsletter' | 'footer'
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
    { type: 'testimonial', name: 'Testimonial', icon: <Type className="h-4 w-4" /> },
    { type: 'pricing', name: 'Pricing Table', icon: <Grid3X3 className="h-4 w-4" /> },
    { type: 'team', name: 'Team Member', icon: <Type className="h-4 w-4" /> },
    { type: 'feature', name: 'Feature Block', icon: <Type className="h-4 w-4" /> },
    { type: 'newsletter', name: 'Newsletter', icon: <Type className="h-4 w-4" /> },
    { type: 'footer', name: 'Footer', icon: <Type className="h-4 w-4" /> }
  ]

  const createNewComponent = useCallback((type: Component['type']): Component => {
    const baseComponent = componentTypes.find(c => c.type === type)
    const defaultContent = getDefaultContent(type)
    
    return {
      id: `${type}-${Date.now()}`,
      type,
      name: baseComponent?.name || type,
      icon: baseComponent?.icon || <Type className="h-4 w-4" />,
      content: defaultContent,
      styles: {
        width: '100%',
        padding: '16px',
        margin: '8px',
        backgroundColor: 'transparent',
        color: 'hsl(var(--foreground))',
        fontSize: '16px',
        fontWeight: 'normal',
        textAlign: 'left'
      },
      responsive: {
        desktop: defaultContent,
        tablet: defaultContent,
        mobile: defaultContent
      }
    }
  }, [componentTypes])

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
      case 'product-card':
        return { 
          title: 'Product Name', 
          price: '$99.99', 
          image: '/api/placeholder/300/300',
          description: 'Product description...'
        }
      case 'form':
        return { 
          fields: [
            { type: 'text', name: 'name', label: 'Name', required: true },
            { type: 'email', name: 'email', label: 'Email', required: true }
          ],
          submitText: 'Submit'
        }
      case 'gallery':
        return { 
          images: [
            '/api/placeholder/300/200',
            '/api/placeholder/300/200',
            '/api/placeholder/300/200'
          ],
          columns: 3
        }
      case 'carousel':
        return {
          slides: [
            { image: '/api/placeholder/800/400', title: 'Slide 1', description: 'Description 1' },
            { image: '/api/placeholder/800/400', title: 'Slide 2', description: 'Description 2' }
          ],
          autoplay: true
        }
      case 'hero':
        return {
          title: 'Welcome to Our Website',
          subtitle: 'We create amazing experiences',
          backgroundImage: '/api/placeholder/1200/600',
          ctaText: 'Get Started',
          ctaLink: '#'
        }
      case 'testimonial':
        return {
          quote: 'This is an amazing service!',
          author: 'John Doe',
          position: 'CEO, Company',
          avatar: '/api/placeholder/80/80'
        }
      case 'pricing':
        return {
          plans: [
            { name: 'Basic', price: '$9.99', features: ['Feature 1', 'Feature 2'] },
            { name: 'Pro', price: '$19.99', features: ['All Basic', 'Feature 3', 'Feature 4'] }
          ]
        }
      case 'team':
        return {
          name: 'Team Member',
          position: 'Position',
          bio: 'Brief bio...',
          image: '/api/placeholder/200/200',
          social: {}
        }
      case 'feature':
        return {
          title: 'Amazing Feature',
          description: 'Feature description...',
          icon: 'star'
        }
      case 'newsletter':
        return {
          title: 'Subscribe to our newsletter',
          description: 'Get the latest updates',
          placeholder: 'Enter your email'
        }
      case 'footer':
        return {
          sections: [
            { title: 'Company', links: ['About', 'Contact', 'Careers'] },
            { title: 'Support', links: ['Help', 'FAQ', 'Support'] }
          ],
          copyright: '© 2024 Your Company'
        }
      default:
        return { text: 'New component' }
    }
  }

  const addSection = useCallback(() => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: `Section ${layout.length + 1}`,
      components: [],
      gridCols: 12,
      styles: {
        padding: '40px 20px',
        backgroundColor: 'transparent'
      }
    }
    
    const newLayout = [...layout, newSection]
    onLayoutUpdate(newLayout)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newLayout)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [layout, onLayoutUpdate, history, historyIndex])

  const addComponent = useCallback((sectionId: string, componentType: Component['type']) => {
    const newComponent = createNewComponent(componentType)
    const newLayout = layout.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: [...section.components, newComponent]
        }
      }
      return section
    })
    
    onLayoutUpdate(newLayout)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newLayout)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [layout, onLayoutUpdate, createNewComponent, history, historyIndex])

  const deleteComponent = useCallback((sectionId: string, componentId: string) => {
    const newLayout = layout.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: section.components.filter(c => c.id !== componentId)
        }
      }
      return section
    })
    
    onLayoutUpdate(newLayout)
    setSelectedComponent(null)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newLayout)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [layout, onLayoutUpdate, history, historyIndex])

  const duplicateComponent = useCallback((sectionId: string, componentId: string) => {
    const newLayout = layout.map(section => {
      if (section.id === sectionId) {
        const componentToDuplicate = section.components.find(c => c.id === componentId)
        if (componentToDuplicate) {
          const duplicatedComponent = {
            ...componentToDuplicate,
            id: `${componentToDuplicate.type}-${Date.now()}`
          }
          return {
            ...section,
            components: [...section.components, duplicatedComponent]
          }
        }
      }
      return section
    })
    
    onLayoutUpdate(newLayout)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newLayout)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [layout, onLayoutUpdate, history, historyIndex])

  const updateComponent = useCallback((componentId: string, updates: Partial<Component>) => {
    const newLayout = layout.map(section => ({
      ...section,
      components: section.components.map(component => 
        component.id === componentId 
          ? { ...component, ...updates }
          : component
      )
    }))
    
    onLayoutUpdate(newLayout)
    
    if (selectedComponent?.id === componentId) {
      setSelectedComponent({ ...selectedComponent, ...updates })
    }
  }, [layout, onLayoutUpdate, selectedComponent])

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source, draggableId } = result

    if (!destination) return

    // Handle component palette drag
    if (source.droppableId === 'component-palette') {
      const componentType = draggableId as Component['type']
      const sectionId = destination.droppableId
      addComponent(sectionId, componentType)
      return
    }

    // Handle reordering within the same section
    if (source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId
      const newLayout = layout.map(section => {
        if (section.id === sectionId) {
          const newComponents = Array.from(section.components)
          const [reorderedItem] = newComponents.splice(source.index, 1)
          newComponents.splice(destination.index, 0, reorderedItem)
          
          return {
            ...section,
            components: newComponents
          }
        }
        return section
      })
      
      onLayoutUpdate(newLayout)
    }
    
    // Handle moving between sections
    if (source.droppableId !== destination.droppableId) {
      const newLayout = layout.map(section => {
        if (section.id === source.droppableId) {
          const newComponents = Array.from(section.components)
          newComponents.splice(source.index, 1)
          return {
            ...section,
            components: newComponents
          }
        }
        
        if (section.id === destination.droppableId) {
          const sourceSection = layout.find(s => s.id === source.droppableId)
          const componentToMove = sourceSection?.components[source.index]
          
          if (componentToMove) {
            const newComponents = Array.from(section.components)
            newComponents.splice(destination.index, 0, componentToMove)
            return {
              ...section,
              components: newComponents
            }
          }
        }
        
        return section
      })
      
      onLayoutUpdate(newLayout)
    }
  }, [layout, onLayoutUpdate, addComponent])

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1)
      onLayoutUpdate(history[historyIndex - 1])
    }
  }, [historyIndex, history, onLayoutUpdate])

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1)
      onLayoutUpdate(history[historyIndex + 1])
    }
  }, [historyIndex, history, onLayoutUpdate])

  const previewDimensions = useMemo(() => {
    switch (previewMode) {
      case 'tablet':
        return { width: '768px', maxWidth: '768px' }
      case 'mobile':
        return { width: '375px', maxWidth: '375px' }
      default:
        return { width: '100%', maxWidth: '1200px' }
    }
  }, [previewMode])

  const ComponentRenderer: React.FC<{ component: Component; isEditMode: boolean }> = ({ component, isEditMode }) => {
    if (isEditMode) {
      return (
        <Card className="border-dashed border-2 border-muted-foreground/20 hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {component.icon}
                <span className="text-sm font-medium">{component.name}</span>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedComponent(component)}
                >
                  <Settings className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const section = layout.find(s => s.components.some(c => c.id === component.id))
                    if (section) duplicateComponent(section.id, component.id)
                  }}
                >
                  <Copy className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const section = layout.find(s => s.components.some(c => c.id === component.id))
                    if (section) deleteComponent(section.id, component.id)
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <ComponentPreview component={component} />
          </CardContent>
        </Card>
      )
    }

    return <ComponentPreview component={component} />
  }

  const ComponentPreview: React.FC<{ component: Component }> = ({ component }) => {
    const currentContent = component.responsive?.[previewMode] || component.content
    
    switch (component.type) {
      case 'text':
        return (
          <div style={component.styles}>
            {React.createElement(
              currentContent.tag || 'p',
              { style: component.styles },
              currentContent.text
            )}
          </div>
        )
      case 'image':
        return (
          <img 
            src={currentContent.src} 
            alt={currentContent.alt}
            style={{ ...component.styles, display: 'block' }}
          />
        )
      case 'button':
        return (
          <Button 
            variant={currentContent.variant === 'primary' ? 'default' : 'outline'}
            style={component.styles}
          >
            {currentContent.text}
          </Button>
        )
      case 'hero':
        return (
          <div 
            className="relative bg-cover bg-center min-h-[400px] flex items-center justify-center text-white"
            style={{ 
              backgroundImage: `url(${currentContent.backgroundImage})`,
              ...component.styles 
            }}
          >
            <div className="text-center space-y-4 bg-black/50 p-8 rounded-lg">
              <h1 className="text-4xl font-bold">{currentContent.title}</h1>
              <p className="text-xl">{currentContent.subtitle}</p>
              <Button size="lg">{currentContent.ctaText}</Button>
            </div>
          </div>
        )
      default:
        return (
          <div style={component.styles} className="p-4 border rounded">
            <span className="text-muted-foreground">{component.name}</span>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Component Palette */}
      <div className="w-80 border-r bg-muted/30 p-4 overflow-y-auto">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-3">Components</h3>
            <DragDropContext onDragEnd={() => {}}>
              <Droppable droppableId="component-palette" isDropDisabled>
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    <div className="grid grid-cols-2 gap-2">
                      {componentTypes.map((component, index) => (
                        <Draggable
                          key={component.type}
                          draggableId={component.type}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`cursor-grab active:cursor-grabbing transition-transform ${
                                snapshot.isDragging ? 'scale-105 shadow-lg' : ''
                              }`}
                            >
                              <CardContent className="p-3">
                                <div className="flex flex-col items-center gap-2 text-center">
                                  {component.icon}
                                  <span className="text-xs font-medium">{component.name}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <Separator />

          {/* Settings Panel */}
          {selectedComponent && (
            <div>
              <h3 className="font-semibold mb-3">Component Settings</h3>
              <ComponentSettings 
                component={selectedComponent}
                onUpdate={updateComponent}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={undo}
                disabled={historyIndex <= 0}
              >
                <Undo className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={redo}
                disabled={historyIndex >= history.length - 1}
              >
                <Redo className="h-4 w-4" />
              </Button>
              
              <Separator orientation="vertical" className="h-6" />
              
              <div className="flex items-center gap-2">
                <Button
                  variant={previewMode === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('desktop')}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('tablet')}
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewMode('mobile')}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              
              <Separator orientation="vertical" className="h-6" />
              
              <Button
                variant={isPreview ? 'default' : 'outline'}
                size="sm"
                onClick={() => setIsPreview(!isPreview)}
              >
                <Eye className="mr-2 h-4 w-4" />
                {isPreview ? 'Edit' : 'Preview'}
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
              <Button onClick={addSection} size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Section
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4">
          <div 
            className="mx-auto transition-all duration-300"
            style={previewDimensions}
          >
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="space-y-4">
                {layout.map((section) => (
                  <Card key={section.id} className="border-2 border-dashed border-muted">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{section.name}</CardTitle>
                        <Badge variant="secondary">
                          {section.components.length} component{section.components.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Droppable droppableId={section.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`min-h-[100px] space-y-4 p-4 rounded-lg transition-colors ${
                              snapshot.isDraggingOver ? 'bg-primary/10' : 'bg-muted/30'
                            }`}
                          >
                            {section.components.length === 0 && (
                              <div className="text-center text-muted-foreground py-8">
                                <Type className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p>Drag components here</p>
                              </div>
                            )}
                            
                            {section.components.map((component, index) => (
                              <Draggable
                                key={component.id}
                                draggableId={component.id}
                                index={index}
                                isDragDisabled={isPreview}
                              >
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={`transition-transform ${
                                      snapshot.isDragging ? 'scale-105 shadow-lg' : ''
                                    }`}
                                  >
                                    <ComponentRenderer
                                      component={component}
                                      isEditMode={!isPreview}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </CardContent>
                  </Card>
                ))}
                
                {layout.length === 0 && (
                  <div className="text-center py-12">
                    <Type className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">Start Building</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first section to get started
                    </p>
                    <Button onClick={addSection}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Section
                    </Button>
                  </div>
                )}
              </div>
            </DragDropContext>
          </div>
        </div>
      </div>
    </div>
  )
}

const ComponentSettings: React.FC<{
  component: Component
  onUpdate: (componentId: string, updates: Partial<Component>) => void
}> = ({ component, onUpdate }) => {
  return (
    <div className="space-y-4">
      <Tabs defaultValue="content">
        <TabsList className="w-full">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="styles">Styles</TabsTrigger>
          <TabsTrigger value="responsive">Responsive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-3">
          {component.type === 'text' && (
            <>
              <div>
                <Label htmlFor="text">Text Content</Label>
                <Input
                  id="text"
                  value={component.content.text}
                  onChange={(e) => onUpdate(component.id, {
                    content: { ...component.content, text: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="tag">HTML Tag</Label>
                <Select
                  value={component.content.tag}
                  onValueChange={(value) => onUpdate(component.id, {
                    content: { ...component.content, tag: value }
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p">Paragraph</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                    <SelectItem value="h2">Heading 2</SelectItem>
                    <SelectItem value="h3">Heading 3</SelectItem>
                    <SelectItem value="span">Span</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          
          {component.type === 'button' && (
            <>
              <div>
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={component.content.text}
                  onChange={(e) => onUpdate(component.id, {
                    content: { ...component.content, text: e.target.value }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="buttonLink">Link URL</Label>
                <Input
                  id="buttonLink"
                  value={component.content.link}
                  onChange={(e) => onUpdate(component.id, {
                    content: { ...component.content, link: e.target.value }
                  })}
                />
              </div>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="styles" className="space-y-3">
          <div>
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              value={component.styles.width}
              onChange={(e) => onUpdate(component.id, {
                styles: { ...component.styles, width: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="padding">Padding</Label>
            <Input
              id="padding"
              value={component.styles.padding}
              onChange={(e) => onUpdate(component.id, {
                styles: { ...component.styles, padding: e.target.value }
              })}
            />
          </div>
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={component.styles.backgroundColor || '#ffffff'}
              onChange={(e) => onUpdate(component.id, {
                styles: { ...component.styles, backgroundColor: e.target.value }
              })}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="responsive">
          <p className="text-sm text-muted-foreground">
            Configure responsive behavior for different screen sizes
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}