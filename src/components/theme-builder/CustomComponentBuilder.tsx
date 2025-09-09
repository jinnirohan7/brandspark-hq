import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import { 
  Plus,
  Save,
  Trash2,
  Copy,
  Edit,
  Palette,
  Code,
  Layers,
  Wand2,
  Download,
  Upload,
  Star,
  Settings
} from 'lucide-react'

interface CustomComponent {
  id: string
  name: string
  description: string
  category: string
  icon: string
  template: string
  properties: any[]
  styles: any
  tags: string[]
  author: string
  version: string
  isPublic: boolean
}

interface CustomComponentBuilderProps {
  onSaveComponent: (component: CustomComponent) => void
  onLoadComponent: (component: CustomComponent) => void
  existingComponents: CustomComponent[]
}

export const CustomComponentBuilder: React.FC<CustomComponentBuilderProps> = ({
  onSaveComponent,
  onLoadComponent,
  existingComponents
}) => {
  const [isBuilding, setIsBuilding] = useState(false)
  const [currentComponent, setCurrentComponent] = useState<Partial<CustomComponent>>({
    name: '',
    description: '',
    category: 'custom',
    icon: 'Box',
    template: '',
    properties: [],
    styles: {},
    tags: [],
    author: 'You',
    version: '1.0.0',
    isPublic: false
  })

  const [htmlTemplate, setHtmlTemplate] = useState('')
  const [cssStyles, setCssStyles] = useState('')
  const [jsLogic, setJsLogic] = useState('')
  const [properties, setProperties] = useState<any[]>([])

  const categories = [
    'layout', 'content', 'navigation', 'form', 'media', 
    'ecommerce', 'social', 'utility', 'animation', 'custom'
  ]

  const iconOptions = [
    'Box', 'Component', 'Layers', 'Grid', 'Type', 'Image', 
    'Video', 'Button', 'Form', 'Card', 'Star', 'Heart'
  ]

  const handleAddProperty = () => {
    const newProperty = {
      id: `prop-${Date.now()}`,
      name: 'newProperty',
      type: 'text',
      label: 'New Property',
      defaultValue: '',
      required: false,
      options: []
    }
    setProperties([...properties, newProperty])
  }

  const handleUpdateProperty = (index: number, field: string, value: any) => {
    const updatedProperties = [...properties]
    updatedProperties[index] = { ...updatedProperties[index], [field]: value }
    setProperties(updatedProperties)
  }

  const handleRemoveProperty = (index: number) => {
    setProperties(properties.filter((_, i) => i !== index))
  }

  const generateComponentCode = () => {
    const template = `
// Custom Component: ${currentComponent.name}
const ${currentComponent.name?.replace(/\s+/g, '')} = ({ ${properties.map(p => p.name).join(', ')}, ...props }) => {
  return (
    <div className="custom-component ${currentComponent.name?.toLowerCase().replace(/\s+/g, '-')}" {...props}>
      ${htmlTemplate || '<div>Custom component content</div>'}
    </div>
  )
}

// Styles
const styles = \`
.${currentComponent.name?.toLowerCase().replace(/\s+/g, '-')} {
  ${cssStyles || '/* Add your styles here */'}
}
\`

// Properties Schema
const properties = ${JSON.stringify(properties, null, 2)}

export { ${currentComponent.name?.replace(/\s+/g, '')}, styles, properties }
    `
    return template
  }

  const handleSaveComponent = () => {
    if (!currentComponent.name) {
      toast.error('Please enter a component name')
      return
    }

    const newComponent: CustomComponent = {
      id: `custom-${Date.now()}`,
      name: currentComponent.name,
      description: currentComponent.description || '',
      category: currentComponent.category || 'custom',
      icon: currentComponent.icon || 'Box',
      template: generateComponentCode(),
      properties,
      styles: {
        css: cssStyles,
        html: htmlTemplate,
        js: jsLogic
      },
      tags: currentComponent.tags || [],
      author: currentComponent.author || 'You',
      version: currentComponent.version || '1.0.0',
      isPublic: currentComponent.isPublic || false
    }

    onSaveComponent(newComponent)
    toast.success('Custom component saved successfully!')
    
    // Reset form
    setCurrentComponent({
      name: '',
      description: '',
      category: 'custom',
      icon: 'Box',
      template: '',
      properties: [],
      styles: {},
      tags: [],
      author: 'You',
      version: '1.0.0',
      isPublic: false
    })
    setHtmlTemplate('')
    setCssStyles('')
    setJsLogic('')
    setProperties([])
    setIsBuilding(false)
  }

  const handleLoadComponent = (component: CustomComponent) => {
    onLoadComponent(component)
    toast.success(`Loaded component: ${component.name}`)
  }

  const exportComponent = (component: CustomComponent) => {
    const blob = new Blob([JSON.stringify(component, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${component.name.replace(/\s+/g, '-')}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Component exported successfully!')
  }

  const importComponent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const component = JSON.parse(e.target?.result as string)
          onSaveComponent({ ...component, id: `custom-${Date.now()}` })
          toast.success('Component imported successfully!')
        } catch (error) {
          toast.error('Invalid component file')
        }
      }
      reader.readAsText(file)
    }
  }

  if (isBuilding) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Create Custom Component</h3>
            <p className="text-sm text-muted-foreground">Build your own reusable component</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsBuilding(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveComponent}>
              <Save className="mr-1 h-3 w-3" />
              Save Component
            </Button>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="template">Template</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Component Name</Label>
                    <Input
                      id="name"
                      value={currentComponent.name}
                      onChange={(e) => setCurrentComponent({ ...currentComponent, name: e.target.value })}
                      placeholder="My Custom Component"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={currentComponent.category} 
                      onValueChange={(value) => setCurrentComponent({ ...currentComponent, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={currentComponent.description}
                    onChange={(e) => setCurrentComponent({ ...currentComponent, description: e.target.value })}
                    placeholder="Describe what this component does..."
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="icon">Icon</Label>
                    <Select 
                      value={currentComponent.icon} 
                      onValueChange={(value) => setCurrentComponent({ ...currentComponent, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(icon => (
                          <SelectItem key={icon} value={icon}>{icon}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={currentComponent.version}
                      onChange={(e) => setCurrentComponent({ ...currentComponent, version: e.target.value })}
                      placeholder="1.0.0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={currentComponent.author}
                      onChange={(e) => setCurrentComponent({ ...currentComponent, author: e.target.value })}
                      placeholder="Your name"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template" className="space-y-4">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <Label htmlFor="html">HTML Template</Label>
                  <Textarea
                    id="html"
                    value={htmlTemplate}
                    onChange={(e) => setHtmlTemplate(e.target.value)}
                    placeholder="<div>Your HTML template here...</div>"
                    className="min-h-[100px] font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="css">CSS Styles</Label>
                  <Textarea
                    id="css"
                    value={cssStyles}
                    onChange={(e) => setCssStyles(e.target.value)}
                    placeholder="/* Your CSS styles here */"
                    className="min-h-[100px] font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="js">JavaScript Logic (Optional)</Label>
                  <Textarea
                    id="js"
                    value={jsLogic}
                    onChange={(e) => setJsLogic(e.target.value)}
                    placeholder="// Your JavaScript logic here"
                    className="min-h-[100px] font-mono"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Component Properties</CardTitle>
                  <Button size="sm" onClick={handleAddProperty}>
                    <Plus className="mr-1 h-3 w-3" />
                    Add Property
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {properties.map((property, index) => (
                  <div key={property.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">{property.type}</Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveProperty(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Property Name</Label>
                        <Input
                          value={property.name}
                          onChange={(e) => handleUpdateProperty(index, 'name', e.target.value)}
                          placeholder="propertyName"
                        />
                      </div>
                      <div>
                        <Label>Display Label</Label>
                        <Input
                          value={property.label}
                          onChange={(e) => handleUpdateProperty(index, 'label', e.target.value)}
                          placeholder="Property Label"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label>Type</Label>
                        <Select 
                          value={property.type} 
                          onValueChange={(value) => handleUpdateProperty(index, 'type', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="color">Color</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                            <SelectItem value="textarea">Textarea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Default Value</Label>
                        <Input
                          value={property.defaultValue}
                          onChange={(e) => handleUpdateProperty(index, 'defaultValue', e.target.value)}
                          placeholder="Default value"
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {properties.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Settings className="h-8 w-8 mx-auto mb-2" />
                    <p>No properties defined yet</p>
                    <p className="text-sm">Add properties to make your component customizable</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Component Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div 
                    dangerouslySetInnerHTML={{ 
                      __html: htmlTemplate || '<div class="p-4 text-center text-muted-foreground">No template defined yet</div>' 
                    }}
                  />
                </div>
                
                {cssStyles && (
                  <div className="mt-4">
                    <Label>Generated CSS:</Label>
                    <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                      <code>{cssStyles}</code>
                    </pre>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Custom Components</h3>
          <p className="text-sm text-muted-foreground">Create and manage your custom components</p>
        </div>
        <div className="flex gap-2">
          <input
            type="file"
            accept=".json"
            onChange={importComponent}
            style={{ display: 'none' }}
            id="import-component"
          />
          <Button variant="outline" onClick={() => document.getElementById('import-component')?.click()}>
            <Upload className="mr-1 h-3 w-3" />
            Import
          </Button>
          <Button onClick={() => setIsBuilding(true)}>
            <Plus className="mr-1 h-3 w-3" />
            Create Component
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {existingComponents.map((component) => (
          <Card key={component.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-sm font-medium">{component.name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">{component.description}</p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {component.category}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>v{component.version}</span>
                <span>•</span>
                <span>by {component.author}</span>
                {component.isPublic && <Star className="h-3 w-3 fill-current text-yellow-500" />}
              </div>
              
              <div className="flex gap-1 flex-wrap">
                {component.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => handleLoadComponent(component)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Use
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportComponent(component)}
                >
                  <Download className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentComponent(component)
                    setHtmlTemplate(component.styles.html || '')
                    setCssStyles(component.styles.css || '')
                    setJsLogic(component.styles.js || '')
                    setProperties(component.properties || [])
                    setIsBuilding(true)
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {existingComponents.length === 0 && (
          <div className="col-span-full text-center py-12">
            <div className="text-4xl mb-4">🎨</div>
            <h3 className="text-lg font-semibold mb-2">No Custom Components Yet</h3>
            <p className="text-muted-foreground mb-4">Create your first custom component to get started</p>
            <Button onClick={() => setIsBuilding(true)}>
              <Plus className="mr-1 h-3 w-3" />
              Create Your First Component
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}