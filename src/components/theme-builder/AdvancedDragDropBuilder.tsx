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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
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
  Users
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
  const [activeTab, setActiveTab] = useState<'components' | 'templates' | 'publishing'>('components')
  const [customDomain, setCustomDomain] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

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

  // Pre-built templates with complete layouts
  const templates = [
    {
      id: 'portfolio',
      name: 'Portfolio',
      description: 'Perfect for showcasing creative work',
      preview: '/templates/portfolio.jpg',
      category: 'creative',
      sections: [
        {
          id: 'hero-portfolio',
          name: 'Hero Section',
          components: [
            {
              id: 'portfolio-hero',
              type: 'hero' as const,
              name: 'Portfolio Hero',
              icon: <Layers className="h-4 w-4" />,
              content: {
                title: 'Creative Portfolio',
                subtitle: 'Showcasing my best work',
                backgroundImage: '/api/placeholder/1200/600',
                ctaText: 'View Projects',
                ctaLink: '#projects'
              },
              styles: {
                width: '100%',
                padding: '80px 20px',
                margin: '0',
                backgroundColor: 'transparent',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'normal',
                textAlign: 'center' as const
              }
            }
          ],
          gridCols: 12,
          styles: { padding: '0', backgroundColor: 'transparent' }
        }
      ]
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Professional business website',
      preview: '/templates/business.jpg',
      category: 'business',
      sections: [
        {
          id: 'hero-business',
          name: 'Hero Section',
          components: [
            {
              id: 'business-hero',
              type: 'hero' as const,
              name: 'Business Hero',
              icon: <Layers className="h-4 w-4" />,
              content: {
                title: 'Your Business Solution',
                subtitle: 'Professional services you can trust',
                backgroundImage: '/api/placeholder/1200/600',
                ctaText: 'Learn More',
                ctaLink: '#services'
              },
              styles: {
                width: '100%',
                padding: '100px 20px',
                margin: '0',
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'normal',
                textAlign: 'center' as const
              }
            }
          ],
          gridCols: 12,
          styles: { padding: '0', backgroundColor: 'transparent' }
        }
      ]
    },
    {
      id: 'blog',
      name: 'Blog',
      description: 'Clean blog layout for writers',
      preview: '/templates/blog.jpg',
      category: 'content',
      sections: [
        {
          id: 'hero-blog',
          name: 'Blog Header',
          components: [
            {
              id: 'blog-header',
              type: 'text' as const,
              name: 'Blog Title',
              icon: <Type className="h-4 w-4" />,
              content: {
                text: 'My Blog',
                tag: 'h1'
              },
              styles: {
                width: '100%',
                padding: '60px 20px',
                margin: '0',
                backgroundColor: 'hsl(var(--muted))',
                color: 'hsl(var(--foreground))',
                fontSize: '48px',
                fontWeight: 'bold',
                textAlign: 'center' as const
              }
            }
          ],
          gridCols: 12,
          styles: { padding: '0', backgroundColor: 'transparent' }
        }
      ]
    },
    {
      id: 'ecommerce',
      name: 'E-commerce',
      description: 'Online store template',
      preview: '/templates/ecommerce.jpg',
      category: 'ecommerce',
      sections: [
        {
          id: 'hero-shop',
          name: 'Shop Hero',
          components: [
            {
              id: 'shop-hero',
              type: 'hero' as const,
              name: 'Shop Hero',
              icon: <Layers className="h-4 w-4" />,
              content: {
                title: 'Online Store',
                subtitle: 'Discover amazing products',
                backgroundImage: '/api/placeholder/1200/600',
                ctaText: 'Shop Now',
                ctaLink: '#products'
              },
              styles: {
                width: '100%',
                padding: '80px 20px',
                margin: '0',
                backgroundColor: 'hsl(var(--accent))',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'normal',
                textAlign: 'center' as const
              }
            }
          ],
          gridCols: 12,
          styles: { padding: '0', backgroundColor: 'transparent' }
        }
      ]
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      description: 'Food and dining template',
      preview: '/templates/restaurant.jpg',
      category: 'food',
      sections: [
        {
          id: 'hero-restaurant',
          name: 'Restaurant Hero',
          components: [
            {
              id: 'restaurant-hero',
              type: 'hero' as const,
              name: 'Restaurant Hero',
              icon: <Layers className="h-4 w-4" />,
              content: {
                title: 'Fine Dining Experience',
                subtitle: 'Exceptional cuisine awaits you',
                backgroundImage: '/api/placeholder/1200/600',
                ctaText: 'Book Table',
                ctaLink: '#booking'
              },
              styles: {
                width: '100%',
                padding: '100px 20px',
                margin: '0',
                backgroundColor: '#92400e',
                color: 'white',
                fontSize: '16px',
                fontWeight: 'normal',
                textAlign: 'center' as const
              }
            }
          ],
          gridCols: 12,
          styles: { padding: '0', backgroundColor: 'transparent' }
        }
      ]
    }
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

  const onDragEnd = useCallback((result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result

    // Handle dragging from component palette to sections
    if (source.droppableId === 'component-palette') {
      const componentType = componentTypes[source.index].type
      addComponent(destination.droppableId, componentType)
      toast.success(`${componentTypes[source.index].name} added to section`)
      return
    }

    // Handle reordering within the same section
    if (source.droppableId === destination.droppableId) {
      const sectionId = source.droppableId
      const section = layout.find(s => s.id === sectionId)
      if (!section) return

      const newComponents = Array.from(section.components)
      const [reorderedItem] = newComponents.splice(source.index, 1)
      newComponents.splice(destination.index, 0, reorderedItem)

      const newLayout = layout.map(s => 
        s.id === sectionId 
          ? { ...s, components: newComponents }
          : s
      )
      
      onLayoutUpdate(newLayout)
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1)
      newHistory.push(newLayout)
      setHistory(newHistory)
      setHistoryIndex(newHistory.length - 1)
      return
    }

    // Handle moving components between sections
    const sourceSection = layout.find(s => s.id === source.droppableId)
    const destSection = layout.find(s => s.id === destination.droppableId)
    
    if (!sourceSection || !destSection) return

    const sourceComponents = Array.from(sourceSection.components)
    const [movedComponent] = sourceComponents.splice(source.index, 1)
    
    const destComponents = Array.from(destSection.components)
    destComponents.splice(destination.index, 0, movedComponent)

    const newLayout = layout.map(section => {
      if (section.id === source.droppableId) {
        return { ...section, components: sourceComponents }
      }
      if (section.id === destination.droppableId) {
        return { ...section, components: destComponents }
      }
      return section
    })
    
    onLayoutUpdate(newLayout)
    toast.success('Component moved successfully')
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newLayout)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [layout, onLayoutUpdate, componentTypes, addComponent, history, historyIndex])

  const applyTemplate = useCallback((template: typeof templates[0]) => {
    onLayoutUpdate(template.sections)
    toast.success(`${template.name} template applied!`)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(template.sections)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [onLayoutUpdate, history, historyIndex])

  const publishWebsite = useCallback(async () => {
    setIsPublishing(true)
    try {
      // Simulate publishing process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const siteName = `site-${Date.now()}`
      const publishedUrl = `https://${siteName}.sellsphere.app`
      
      toast.success(`Website published successfully! Live at: ${publishedUrl}`)
      
      // Here you would normally make an API call to publish the website
      console.log('Publishing website with layout:', layout)
    } catch (error) {
      toast.error('Failed to publish website')
    } finally {
      setIsPublishing(false)
    }
  }, [layout])

  const connectDomain = useCallback(async () => {
    if (!customDomain) {
      toast.error('Please enter a domain name')
      return
    }
    
    try {
      // Simulate domain connection
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success(`Domain ${customDomain} connected successfully!`)
      setCustomDomain('')
    } catch (error) {
      toast.error('Failed to connect domain')
    }
  }, [customDomain])

  const ComponentRenderer: React.FC<{ component: Component; isPreview: boolean }> = ({ 
    component, 
    isPreview 
  }) => {
    const currentStyles = component.responsive?.[previewMode] || component.styles

    if (isPreview) {
      // Render actual functional components in preview mode
      switch (component.type) {
        case 'text':
          const TextTag = component.content.tag || 'p'
          return (
            <TextTag 
              style={{
                ...currentStyles,
                fontSize: currentStyles.fontSize || '16px',
                color: currentStyles.color || 'hsl(var(--foreground))',
                fontWeight: currentStyles.fontWeight || 'normal',
                textAlign: currentStyles.textAlign || 'left'
              }}
              className="w-full"
            >
              {component.content.text}
            </TextTag>
          )

        case 'image':
          return (
            <img 
              src={component.content.src} 
              alt={component.content.alt}
              style={{
                ...currentStyles,
                maxWidth: '100%',
                height: 'auto'
              }}
              className="w-full object-cover"
            />
          )

        case 'button':
          return (
            <Button 
              variant={component.content.variant || 'default'}
              style={{
                ...currentStyles,
                backgroundColor: currentStyles.backgroundColor || undefined
              }}
              className="transition-all duration-200 hover:scale-105"
              onClick={() => {
                if (component.content.link && component.content.link !== '#') {
                  window.open(component.content.link, '_blank')
                }
              }}
            >
              {component.content.text}
            </Button>
          )

        case 'product-card':
          return (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square overflow-hidden">
                <img 
                  src={component.content.image}
                  alt={component.content.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{component.content.title}</h3>
                <p className="text-muted-foreground mb-2">{component.content.description}</p>
                <p className="text-xl font-bold text-primary">{component.content.price}</p>
              </CardContent>
            </Card>
          )

        case 'hero':
          return (
            <div 
              className="relative w-full min-h-[400px] flex items-center justify-center bg-cover bg-center"
              style={{
                backgroundImage: component.content.backgroundImage ? `url(${component.content.backgroundImage})` : undefined,
                backgroundColor: currentStyles.backgroundColor || 'hsl(var(--primary))',
                color: currentStyles.color || 'white',
                padding: currentStyles.padding || '80px 20px'
              }}
            >
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">
                  {component.content.title}
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  {component.content.subtitle}
                </p>
                {component.content.ctaText && (
                  <Button size="lg" variant="secondary" className="text-lg px-8 py-3">
                    {component.content.ctaText}
                  </Button>
                )}
              </div>
            </div>
          )

        case 'form':
          return (
            <Card className="p-6">
              <form className="space-y-4">
                {component.content.fields?.map((field: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={field.name}>{field.label}</Label>
                    <Input 
                      id={field.name}
                      type={field.type}
                      required={field.required}
                      placeholder={field.placeholder || field.label}
                    />
                  </div>
                ))}
                <Button type="submit" className="w-full">
                  {component.content.submitText}
                </Button>
              </form>
            </Card>
          )

        case 'gallery':
          return (
            <div 
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${component.content.columns || 3}, 1fr)`
              }}
            >
              {component.content.images?.map((src: string, index: number) => (
                <img 
                  key={index}
                  src={src}
                  alt={`Gallery image ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                />
              ))}
            </div>
          )

        case 'testimonial':
          return (
            <Card className="p-6 text-center">
              <blockquote className="text-lg italic mb-4">
                "{component.content.quote}"
              </blockquote>
              <div className="flex items-center justify-center gap-3">
                <img 
                  src={component.content.avatar}
                  alt={component.content.author}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{component.content.author}</p>
                  <p className="text-sm text-muted-foreground">{component.content.position}</p>
                </div>
              </div>
            </Card>
          )

        case 'pricing':
          return (
            <div className="grid md:grid-cols-2 gap-6">
              {component.content.plans?.map((plan: any, index: number) => (
                <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold text-primary mb-4">{plan.price}</p>
                  <ul className="space-y-2 mb-6">
                    {plan.features?.map((feature: string, featureIndex: number) => (
                      <li key={featureIndex} className="text-muted-foreground">
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">Choose Plan</Button>
                </Card>
              ))}
            </div>
          )

        default:
          return (
            <div 
              style={currentStyles}
              className="p-4 bg-muted/50 border border-dashed border-muted-foreground/25 rounded-lg"
            >
              <p className="text-center text-muted-foreground">
                {component.type} component
              </p>
            </div>
          )
      }
    }

    // Edit mode - show component cards with controls
    return (
      <Card 
        className={`p-3 border-2 transition-all cursor-pointer hover:shadow-md ${
          selectedComponent?.id === component.id 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
        }`}
        onClick={() => setSelectedComponent(component)}
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {component.icon}
            <span className="font-medium text-sm">{component.name}</span>
          </div>
          <div className="flex gap-1">
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0"
              onClick={(e) => {
                e.stopPropagation()
                // Handle settings
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
                const sectionId = layout.find(s => 
                  s.components.some(c => c.id === component.id)
                )?.id
                if (sectionId) duplicateComponent(sectionId, component.id)
              }}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation()
                const sectionId = layout.find(s => 
                  s.components.some(c => c.id === component.id)
                )?.id
                if (sectionId) deleteComponent(sectionId, component.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        <div className="text-xs text-muted-foreground">
          {component.type} • Click to edit
        </div>
      </Card>
    )
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex h-screen bg-background">
        {/* Sidebar with tabs */}
        <div className="w-80 border-r bg-muted/30 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as typeof activeTab)} className="h-full">
            <TabsList className="grid w-full grid-cols-3 m-4 mb-0">
              <TabsTrigger value="components" className="text-xs">
                <Grid3X3 className="h-3 w-3 mr-1" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs">
                <Layout className="h-3 w-3 mr-1" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="publishing" className="text-xs">
                <Globe className="h-3 w-3 mr-1" />
                Publish
              </TabsTrigger>
            </TabsList>

            <TabsContent value="components" className="space-y-4">
              {/* Component Palette */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Palette className="h-4 w-4" />
                  Drag Components
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Drag any component below into your website sections
                </p>
                <Droppable droppableId="component-palette" isDropDisabled={true}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="grid grid-cols-2 gap-3"
                    >
                      {componentTypes.map((component, index) => (
                        <Draggable
                          key={component.type}
                          draggableId={component.type}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`p-3 border border-border rounded-lg cursor-grab active:cursor-grabbing hover:shadow-md transition-all flex flex-col items-center gap-2 text-center ${
                                snapshot.isDragging 
                                  ? 'shadow-lg border-primary bg-primary/5 rotate-3 scale-105' 
                                  : 'hover:border-primary/50 hover:scale-105'
                              }`}
                            >
                              <div className="text-primary">
                                {component.icon}
                              </div>
                              <span className="text-xs font-medium">{component.name}</span>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="p-4 space-y-4 mt-0">
              <div>
                <h3 className="font-semibold mb-3">Ready-to-Use Templates</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Choose a template to get started quickly
                </p>
                <div className="space-y-3">
                  {templates.map((template) => (
                    <Card key={template.id} className="hover:bg-muted/50 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg flex items-center justify-center">
                            <Layout className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm">{template.name}</h4>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            <Badge variant="secondary" className="mt-2 text-xs">
                              {template.category}
                            </Badge>
                          </div>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-3"
                          onClick={() => applyTemplate(template)}
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Apply Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="publishing" className="p-4 space-y-6 mt-0">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Publish & Host
                </h3>
                
                {/* Free Hosting */}
                <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-green-600" />
                      <span className="font-medium text-green-700 dark:text-green-300">Free Hosting</span>
                    </div>
                    <p className="text-xs text-green-600 dark:text-green-400 mb-3">
                      Your site will be hosted for free on sellsphere.app
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Globe className="h-3 w-3 mr-2" />
                          Quick Publish
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Publish Your Website</DialogTitle>
                          <DialogDescription>
                            Your website will be live instantly with free hosting
                          </DialogDescription>
                        </DialogHeader>
                        <Button 
                          onClick={publishWebsite}
                          disabled={isPublishing}
                        >
                          {isPublishing ? (
                            <>
                              <Upload className="h-3 w-3 mr-2 animate-spin" />
                              Publishing...
                            </>
                          ) : (
                            <>
                              <Globe className="h-3 w-3 mr-2" />
                              Publish Now
                            </>
                          )}
                        </Button>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>

                {/* Custom Domain */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-amber-600" />
                      <span className="font-medium">Custom Domain</span>
                      <Badge variant="secondary" className="text-xs">Premium</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Connect your own domain for a professional look
                    </p>
                    <div className="space-y-2">
                      <Input
                        placeholder="yourdomain.com"
                        value={customDomain}
                        onChange={(e) => setCustomDomain(e.target.value)}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={connectDomain}
                      >
                        <Link className="h-3 w-3 mr-2" />
                        Connect Domain
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 space-y-4">
          {/* Toolbar */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Preview Mode Toggle */}
                <div className="flex items-center gap-2">
                  <Button
                    variant={isPreview ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    {isPreview ? 'Exit Preview' : 'Preview'}
                  </Button>
                </div>

                {/* Device Preview */}
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant={previewMode === 'desktop' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('desktop')}
                    className="rounded-r-none"
                  >
                    <Monitor className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'tablet' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('tablet')}
                    className="rounded-none"
                  >
                    <Tablet className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={previewMode === 'mobile' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setPreviewMode('mobile')}
                    className="rounded-l-none"
                  >
                    <Smartphone className="h-4 w-4" />
                  </Button>
                </div>

                {/* Grid Settings */}
                <div className="flex items-center gap-2">
                  <Label className="text-sm">Grid:</Label>
                  <Select value={gridSize.toString()} onValueChange={(value) => setGridSize(Number(value))}>
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12</SelectItem>
                      <SelectItem value="16">16</SelectItem>
                      <SelectItem value="24">24</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (historyIndex > 0) {
                      setHistoryIndex(historyIndex - 1)
                      onLayoutUpdate(history[historyIndex - 1])
                    }
                  }}
                  disabled={historyIndex === 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (historyIndex < history.length - 1) {
                      setHistoryIndex(historyIndex + 1)
                      onLayoutUpdate(history[historyIndex + 1])
                    }
                  }}
                  disabled={historyIndex === history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSection}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>
            </div>
          </Card>

          {/* Website Canvas */}
          <div 
            className={`mx-auto transition-all duration-300 ${
              previewMode === 'desktop' ? 'max-w-full' :
              previewMode === 'tablet' ? 'max-w-3xl' :
              'max-w-sm'
            }`}
          >
            <div className="bg-background border border-border rounded-lg overflow-hidden shadow-lg">
              {layout.length === 0 ? (
                <div className="h-96 flex items-center justify-center bg-muted/20">
                  <div className="text-center">
                    <Layout className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Start Building</h3>
                    <p className="text-muted-foreground mb-4">
                      Add your first section to begin creating your website
                    </p>
                    <Button onClick={addSection}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {layout.map((section, sectionIndex) => (
                    <div key={section.id} className="relative group">
                      <Droppable droppableId={section.id}>
                        {(provided, snapshot) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className={`min-h-[100px] transition-all ${
                              snapshot.isDraggingOver 
                                ? 'bg-primary/10 border-2 border-primary border-dashed' 
                                : 'border-transparent border-2'
                            }`}
                            style={{
                              ...section.styles,
                              backgroundColor: section.styles?.backgroundColor || 'transparent'
                            }}
                          >
                            {!isPreview && (
                              <div className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Badge variant="secondary" className="text-xs">
                                  {section.name}
                                </Badge>
                              </div>
                            )}
                            
                            {!isPreview && (
                              <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-6 w-6 p-0"
                                  onClick={() => {
                                    const newLayout = layout.filter(s => s.id !== section.id)
                                    onLayoutUpdate(newLayout)
                                    toast.success('Section deleted')
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            )}

                            {section.components.length === 0 ? (
                              <div className={`h-24 flex items-center justify-center border-2 border-dashed mx-4 my-4 rounded-lg transition-all ${
                                snapshot.isDraggingOver 
                                  ? 'border-primary bg-primary/5 border-solid' 
                                  : 'border-muted-foreground/25'
                              }`}>
                                <p className="text-muted-foreground text-sm">
                                  {snapshot.isDraggingOver ? 'Drop component here' : 'Drop components here'}
                                </p>
                              </div>
                            ) : (
                              <div 
                                className={`grid gap-4 p-4 ${
                                  section.gridCols === 1 ? 'grid-cols-1' :
                                  section.gridCols === 2 ? 'grid-cols-1 md:grid-cols-2' :
                                  section.gridCols === 3 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' :
                                  section.gridCols === 4 ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' :
                                  'grid-cols-1'
                                }`}
                              >
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
                                        className={`transition-all ${
                                          snapshot.isDragging 
                                            ? 'shadow-lg rotate-2 scale-105 z-50' 
                                            : ''
                                        }`}
                                      >
                                        <ComponentRenderer 
                                          component={component} 
                                          isPreview={isPreview}
                                        />
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DragDropContext>
  )
}