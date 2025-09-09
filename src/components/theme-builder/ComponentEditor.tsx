import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Type, 
  Layout, 
  Settings, 
  Image as ImageIcon,
  Link,
  Mail,
  Star,
  Grid,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Underline
} from 'lucide-react'

interface Component {
  id: string
  type: string
  name: string
  content: any
  styles: any
}

interface ComponentEditorProps {
  component: Component | null
  onUpdate: (component: Component) => void
  onClose: () => void
}

export const ComponentEditor: React.FC<ComponentEditorProps> = ({
  component,
  onUpdate,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'layout'>('content')

  if (!component) return null

  const handleContentUpdate = (field: string, value: any) => {
    const updatedComponent = {
      ...component,
      content: { ...component.content, [field]: value }
    }
    onUpdate(updatedComponent)
  }

  const handleStyleUpdate = (field: string, value: any) => {
    const updatedComponent = {
      ...component,
      styles: { ...component.styles, [field]: value }
    }
    onUpdate(updatedComponent)
  }

  const renderContentEditor = () => {
    switch (component.type) {
      case 'text':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Text Content</Label>
              <Textarea
                id="text"
                value={component.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Enter your text..."
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="tag">HTML Tag</Label>
              <Select 
                value={component.content.tag || 'p'} 
                onValueChange={(value) => handleContentUpdate('tag', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">H1 - Main Heading</SelectItem>
                  <SelectItem value="h2">H2 - Section Heading</SelectItem>
                  <SelectItem value="h3">H3 - Subsection</SelectItem>
                  <SelectItem value="h4">H4 - Minor Heading</SelectItem>
                  <SelectItem value="p">Paragraph</SelectItem>
                  <SelectItem value="span">Span</SelectItem>
                  <SelectItem value="div">Div</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="src">Image URL</Label>
              <Input
                id="src"
                value={component.content.src || ''}
                onChange={(e) => handleContentUpdate('src', e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={component.content.alt || ''}
                onChange={(e) => handleContentUpdate('alt', e.target.value)}
                placeholder="Describe the image..."
              />
            </div>
          </div>
        )

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Button Text</Label>
              <Input
                id="text"
                value={component.content.text || ''}
                onChange={(e) => handleContentUpdate('text', e.target.value)}
                placeholder="Click me"
              />
            </div>
            <div>
              <Label htmlFor="link">Link URL</Label>
              <Input
                id="link"
                value={component.content.link || ''}
                onChange={(e) => handleContentUpdate('link', e.target.value)}
                placeholder="https://example.com"
              />
            </div>
            <div>
              <Label htmlFor="variant">Button Style</Label>
              <Select 
                value={component.content.variant || 'default'} 
                onValueChange={(value) => handleContentUpdate('variant', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="destructive">Destructive</SelectItem>
                  <SelectItem value="outline">Outline</SelectItem>
                  <SelectItem value="secondary">Secondary</SelectItem>
                  <SelectItem value="ghost">Ghost</SelectItem>
                  <SelectItem value="link">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Hero Title</Label>
              <Input
                id="title"
                value={component.content.title || ''}
                onChange={(e) => handleContentUpdate('title', e.target.value)}
                placeholder="Welcome to our site"
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={component.content.subtitle || ''}
                onChange={(e) => handleContentUpdate('subtitle', e.target.value)}
                placeholder="Describe what you offer..."
              />
            </div>
            <div>
              <Label htmlFor="backgroundImage">Background Image URL</Label>
              <Input
                id="backgroundImage"
                value={component.content.backgroundImage || ''}
                onChange={(e) => handleContentUpdate('backgroundImage', e.target.value)}
                placeholder="https://example.com/hero-bg.jpg"
              />
            </div>
            <div>
              <Label htmlFor="ctaText">Call-to-Action Text</Label>
              <Input
                id="ctaText"
                value={component.content.ctaText || ''}
                onChange={(e) => handleContentUpdate('ctaText', e.target.value)}
                placeholder="Get Started"
              />
            </div>
            <div>
              <Label htmlFor="ctaLink">Call-to-Action Link</Label>
              <Input
                id="ctaLink"
                value={component.content.ctaLink || ''}
                onChange={(e) => handleContentUpdate('ctaLink', e.target.value)}
                placeholder="#contact"
              />
            </div>
          </div>
        )

      case 'form':
        return (
          <div className="space-y-4">
            <div>
              <Label>Form Fields</Label>
              <div className="space-y-2 mt-2">
                {component.content.fields?.map((field: any, index: number) => (
                  <div key={index} className="flex gap-2 items-center p-2 border rounded">
                    <Input
                      placeholder="Field name"
                      value={field.name || ''}
                      onChange={(e) => {
                        const newFields = [...component.content.fields]
                        newFields[index] = { ...field, name: e.target.value }
                        handleContentUpdate('fields', newFields)
                      }}
                    />
                    <Select
                      value={field.type || 'text'}
                      onValueChange={(value) => {
                        const newFields = [...component.content.fields]
                        newFields[index] = { ...field, type: value }
                        handleContentUpdate('fields', newFields)
                      }}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="tel">Phone</SelectItem>
                        <SelectItem value="textarea">Textarea</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const newFields = component.content.fields.filter((_: any, i: number) => i !== index)
                        handleContentUpdate('fields', newFields)
                      }}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() => {
                    const newFields = [...(component.content.fields || []), { type: 'text', name: 'new_field', label: 'New Field' }]
                    handleContentUpdate('fields', newFields)
                  }}
                >
                  Add Field
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="submitText">Submit Button Text</Label>
              <Input
                id="submitText"
                value={component.content.submitText || ''}
                onChange={(e) => handleContentUpdate('submitText', e.target.value)}
                placeholder="Submit"
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="text-center text-muted-foreground py-8">
            <Settings className="h-8 w-8 mx-auto mb-2" />
            <p>Content editor for {component.type} coming soon</p>
          </div>
        )
    }
  }

  const renderStyleEditor = () => (
    <div className="space-y-6">
      {/* Typography */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Type className="h-4 w-4" />
          Typography
        </h4>
        <div className="space-y-3">
          <div>
            <Label>Font Size (px)</Label>
            <Input
              type="number"
              value={parseInt(component.styles.fontSize) || 16}
              onChange={(e) => handleStyleUpdate('fontSize', `${e.target.value}px`)}
            />
          </div>
          <div>
            <Label>Font Weight</Label>
            <Select 
              value={component.styles.fontWeight || 'normal'} 
              onValueChange={(value) => handleStyleUpdate('fontWeight', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lighter">Lighter</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="semibold">Semibold</SelectItem>
                <SelectItem value="bold">Bold</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Text Alignment</Label>
            <div className="flex gap-1 mt-1">
              {['left', 'center', 'right'].map((align) => (
                <Button
                  key={align}
                  variant={component.styles.textAlign === align ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleStyleUpdate('textAlign', align)}
                >
                  {align === 'left' && <AlignLeft className="h-4 w-4" />}
                  {align === 'center' && <AlignCenter className="h-4 w-4" />}
                  {align === 'right' && <AlignRight className="h-4 w-4" />}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Colors
        </h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="color">Text Color</Label>
            <Input
              id="color"
              type="color"
              value={component.styles.color || '#000000'}
              onChange={(e) => handleStyleUpdate('color', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="backgroundColor">Background Color</Label>
            <Input
              id="backgroundColor"
              type="color"
              value={component.styles.backgroundColor || '#ffffff'}
              onChange={(e) => handleStyleUpdate('backgroundColor', e.target.value)}
            />
          </div>
        </div>
      </div>

      <Separator />

      {/* Spacing */}
      <div>
        <h4 className="font-medium mb-3 flex items-center gap-2">
          <Layout className="h-4 w-4" />
          Spacing
        </h4>
        <div className="space-y-3">
          <div>
            <Label>Padding</Label>
            <Input
              value={component.styles.padding || '0'}
              onChange={(e) => handleStyleUpdate('padding', e.target.value)}
              placeholder="16px or 1rem"
            />
          </div>
          <div>
            <Label>Margin</Label>
            <Input
              value={component.styles.margin || '0'}
              onChange={(e) => handleStyleUpdate('margin', e.target.value)}
              placeholder="16px or 1rem"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <Card className="w-80 h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Edit {component.name}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <Badge variant="secondary" className="w-fit">
          {component.type}
        </Badge>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="style">Style</TabsTrigger>
            <TabsTrigger value="layout">Layout</TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="mt-4">
            {renderContentEditor()}
          </TabsContent>
          
          <TabsContent value="style" className="mt-4">
            {renderStyleEditor()}
          </TabsContent>
          
          <TabsContent value="layout" className="mt-4">
            <div className="text-center text-muted-foreground py-8">
              <Grid className="h-8 w-8 mx-auto mb-2" />
              <p>Layout controls coming soon</p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}