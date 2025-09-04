import { useState, useRef } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { 
  Type, Image, Video, CreditCard, 
  Grid, FormInput, Monitor, Tablet, Smartphone,
  Plus, Trash2, Settings, Copy, Eye, Layout as LayoutIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface Component {
  id: string
  type: string
  name: string
  icon: any
  content: any
  styles: any
}

interface Section {
  id: string
  name: string
  components: Component[]
}

interface DragDropBuilderProps {
  layout: Section[]
  onUpdateLayout: (layout: Section[]) => void
}

export const DragDropBuilder = ({ layout, onUpdateLayout }: DragDropBuilderProps) => {
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [isPreview, setIsPreview] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)

  const componentTypes = [
    { type: 'text', name: 'Text', icon: Type },
    { type: 'image', name: 'Image', icon: Image },
    { type: 'video', name: 'Video', icon: Video },
    { type: 'button', name: 'Button', icon: Type },
    { type: 'product-card', name: 'Product Card', icon: CreditCard },
    { type: 'form', name: 'Form', icon: FormInput },
    { type: 'gallery', name: 'Gallery', icon: Grid },
    { type: 'carousel', name: 'Carousel', icon: Grid },
  ]

  const createNewComponent = (type: string) => {
    const defaults = {
      text: { content: 'Edit this text', fontSize: '16px', color: '#000' },
      image: { src: 'https://via.placeholder.com/300x200', alt: 'Image' },
      video: { src: '', autoplay: false },
      button: { text: 'Button', link: '#', variant: 'primary' },
      'product-card': { title: 'Product Name', price: '$99', image: 'https://via.placeholder.com/200x200' },
      form: { fields: ['name', 'email'], submitText: 'Submit' },
      gallery: { images: [], columns: 3 },
      carousel: { slides: [], autoplay: true }
    }

    return {
      id: `${type}-${Date.now()}`,
      type,
      name: componentTypes.find(c => c.type === type)?.name || type,
      icon: componentTypes.find(c => c.type === type)?.icon || Type,
      content: defaults[type as keyof typeof defaults] || {},
      styles: {
        margin: '10px',
        padding: '10px',
        backgroundColor: 'transparent'
      }
    }
  }

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      name: `Section ${layout.length + 1}`,
      components: []
    }
    onUpdateLayout([...layout, newSection])
  }

  const addComponent = (sectionId: string, componentType: string) => {
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
    onUpdateLayout(updatedLayout)
  }

  const deleteComponent = (sectionId: string, componentId: string) => {
    const updatedLayout = layout.map(section => {
      if (section.id === sectionId) {
        return {
          ...section,
          components: section.components.filter(c => c.id !== componentId)
        }
      }
      return section
    })
    onUpdateLayout(updatedLayout)
  }

  const duplicateComponent = (sectionId: string, componentId: string) => {
    const updatedLayout = layout.map(section => {
      if (section.id === sectionId) {
        const component = section.components.find(c => c.id === componentId)
        if (component) {
          const duplicate = {
            ...component,
            id: `${component.type}-${Date.now()}`,
            name: `${component.name} (Copy)`
          }
          return {
            ...section,
            components: [...section.components, duplicate]
          }
        }
      }
      return section
    })
    onUpdateLayout(updatedLayout)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    // Handle dragging from component palette
    if (source.droppableId === 'component-palette') {
      const componentType = componentTypes[source.index].type
      addComponent(destination.droppableId, componentType)
      return
    }

    // Handle reordering within sections
    if (source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId
      const section = layout.find(s => s.id === sectionId)
      if (!section) return

      const components = Array.from(section.components)
      const [removed] = components.splice(source.index, 1)
      components.splice(destination.index, 0, removed)

      const updatedLayout = layout.map(s => 
        s.id === sectionId ? { ...s, components } : s
      )
      onUpdateLayout(updatedLayout)
    }

    // Handle moving between sections
    if (source.droppableId !== destination.droppableId) {
      const sourceSection = layout.find(s => s.id === source.droppableId)
      const destSection = layout.find(s => s.id === destination.droppableId)
      
      if (!sourceSection || !destSection) return

      const sourceComponents = Array.from(sourceSection.components)
      const destComponents = Array.from(destSection.components)
      const [removed] = sourceComponents.splice(source.index, 1)
      destComponents.splice(destination.index, 0, removed)

      const updatedLayout = layout.map(s => {
        if (s.id === source.droppableId) {
          return { ...s, components: sourceComponents }
        }
        if (s.id === destination.droppableId) {
          return { ...s, components: destComponents }
        }
        return s
      })
      onUpdateLayout(updatedLayout)
    }
  }

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'max-w-sm'
      case 'tablet': return 'max-w-2xl'
      default: return 'max-w-full'
    }
  }

  const ComponentRenderer = ({ component }: { component: Component }) => {
    const Icon = component.icon
    
    if (isPreview) {
      // Render actual component in preview mode
      switch (component.type) {
        case 'text':
          return (
            <div style={{ 
              fontSize: component.content.fontSize,
              color: component.content.color,
              ...component.styles 
            }}>
              {component.content.content}
            </div>
          )
        case 'image':
          return (
            <img 
              src={component.content.src} 
              alt={component.content.alt}
              className="max-w-full h-auto"
              style={component.styles}
            />
          )
        case 'button':
          return (
            <Button 
              variant={component.content.variant === 'primary' ? 'default' : 'outline'}
              style={component.styles}
            >
              {component.content.text}
            </Button>
          )
        default:
          return (
            <div className="p-4 border border-dashed border-muted-foreground/25 rounded text-center">
              <Icon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{component.name}</span>
            </div>
          )
      }
    }

    // Edit mode rendering
    return (
      <Card className={cn(
        "group relative cursor-pointer hover:shadow-md transition-shadow",
        selectedComponent?.id === component.id && "ring-2 ring-primary"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Icon className="h-4 w-4" />
            <span className="text-sm font-medium">{component.name}</span>
            <Badge variant="secondary" className="text-xs">{component.type}</Badge>
          </div>
          
          <div className="text-xs text-muted-foreground">
            {component.type === 'text' && component.content.content}
            {component.type === 'button' && `Button: ${component.content.text}`}
            {component.type === 'image' && 'Image component'}
            {!['text', 'button', 'image'].includes(component.type) && `${component.name} component`}
          </div>

          {/* Component actions */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                setSelectedComponent(component)
              }}
            >
              <Settings className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                duplicateComponent(
                  layout.find(s => s.components.some(c => c.id === component.id))?.id || '',
                  component.id
                )
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                deleteComponent(
                  layout.find(s => s.components.some(c => c.id === component.id))?.id || '',
                  component.id
                )
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex h-screen">
      {/* Component Palette */}
      {!isPreview && (
        <div className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-4">Components</h3>
          
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="component-palette" isDropDisabled>
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {componentTypes.map((component, index) => {
                    const Icon = component.icon
                    return (
                      <Draggable key={component.type} draggableId={component.type} index={index}>
                        {(provided, snapshot) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={cn(
                              "cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow",
                              snapshot.isDragging && "shadow-lg"
                            )}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span className="text-sm font-medium">{component.name}</span>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    )
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Main Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="border-b p-4 flex items-center justify-between">
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

          <div className="flex items-center gap-2">
            <Button
              variant={isPreview ? 'default' : 'outline'}
              size="sm"
              onClick={() => setIsPreview(!isPreview)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? 'Edit' : 'Preview'}
            </Button>
            {!isPreview && (
              <Button size="sm" onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto p-4 bg-muted/20">
          <div className={cn("mx-auto bg-white rounded-lg shadow-sm", getPreviewWidth())}>
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="min-h-96 p-6 space-y-6">
                {layout.map((section) => (
                  <div key={section.id} className="space-y-4">
                    {!isPreview && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{section.name}</h3>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const updatedLayout = layout.filter(s => s.id !== section.id)
                            onUpdateLayout(updatedLayout)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}

                    <Droppable droppableId={section.id}>
                      {(provided, snapshot) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={cn(
                            "min-h-24 rounded-lg border-2 border-dashed p-4 transition-colors",
                            snapshot.isDraggingOver 
                              ? "border-primary bg-primary/5" 
                              : "border-muted-foreground/25",
                            section.components.length === 0 && !isPreview && "bg-muted/30"
                          )}
                        >
                          {section.components.length === 0 && !isPreview ? (
                            <div className="text-center text-muted-foreground py-8">
                              <div className="text-sm">Drop components here or</div>
                              <div className="mt-2 flex flex-wrap gap-1 justify-center">
                                {componentTypes.slice(0, 4).map((component) => (
                                  <Button
                                    key={component.type}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => addComponent(section.id, component.type)}
                                  >
                                    <component.icon className="h-3 w-3 mr-1" />
                                    {component.name}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-4">
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
                                      className={cn(
                                        snapshot.isDragging && "opacity-50"
                                      )}
                                    >
                                      <ComponentRenderer component={component} />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                            </div>
                          )}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </div>
                ))}

                {layout.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground">
                      <LayoutIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                      <p className="mb-4">Add your first section to get started</p>
                      <Button onClick={addSection}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Section
                      </Button>
                    </div>
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