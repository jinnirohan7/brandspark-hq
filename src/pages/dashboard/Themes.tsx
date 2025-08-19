import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Search, Eye, Settings, Download, Star, Palette, Smartphone, Monitor } from 'lucide-react'

const Themes = () => {
  const [searchTerm, setSearchTerm] = useState('')

  const themes = [
    {
      id: 'theme-001',
      name: 'Modern Minimal',
      category: 'Business',
      price: 'Free',
      rating: 4.8,
      downloads: 1250,
      image: '/placeholder.svg',
      description: 'Clean, professional design perfect for modern businesses',
      features: ['Responsive', 'SEO Optimized', 'Fast Loading'],
      colors: ['#2563eb', '#1f2937', '#f8fafc'],
      isActive: true,
    },
    {
      id: 'theme-002',
      name: 'E-commerce Pro',
      category: 'E-commerce',
      price: '₹999',
      rating: 4.9,
      downloads: 856,
      image: '/placeholder.svg',
      description: 'Feature-rich theme designed for online stores',
      features: ['Product Showcase', 'Cart Integration', 'Payment Ready'],
      colors: ['#059669', '#1f2937', '#ffffff'],
      isActive: false,
    },
    {
      id: 'theme-003',
      name: 'Creative Portfolio',
      category: 'Portfolio',
      price: '₹1,499',
      rating: 4.7,
      downloads: 634,
      image: '/placeholder.svg',
      description: 'Showcase your work with this stunning portfolio theme',
      features: ['Gallery Layouts', 'Animation Effects', 'Contact Forms'],
      colors: ['#7c3aed', '#1e1b4b', '#f1f5f9'],
      isActive: false,
    },
    {
      id: 'theme-004',
      name: 'Tech Startup',
      category: 'Business',
      price: '₹799',
      rating: 4.6,
      downloads: 423,
      image: '/placeholder.svg',
      description: 'Perfect for tech companies and startups',
      features: ['Landing Pages', 'Team Sections', 'Pricing Tables'],
      colors: ['#f59e0b', '#374151', '#ffffff'],
      isActive: false,
    },
  ]

  const customizations = [
    {
      section: 'Header',
      options: ['Logo Upload', 'Navigation Menu', 'Search Bar', 'Contact Info']
    },
    {
      section: 'Colors & Fonts',
      options: ['Primary Colors', 'Typography', 'Button Styles', 'Link Colors']
    },
    {
      section: 'Layout',
      options: ['Homepage Layout', 'Product Pages', 'Category Pages', 'Footer Design']
    },
    {
      section: 'Features',
      options: ['WhatsApp Chat', 'Reviews Section', 'Newsletter', 'Social Media']
    }
  ]

  const filteredThemes = themes.filter(theme =>
    theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    theme.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Theme Builder</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Theme
          </Button>
          <Button>
            <Palette className="mr-2 h-4 w-4" />
            Customize Active
          </Button>
        </div>
      </div>

      {/* Current Theme */}
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                Current Theme: Modern Minimal
                <Badge>Active</Badge>
              </CardTitle>
              <CardDescription>Clean, professional design perfect for modern businesses</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
              <Button size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Customize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <img 
                src="/placeholder.svg" 
                alt="Current theme preview"
                className="rounded-lg border w-full h-48 object-cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Theme Features</h4>
                <div className="flex flex-wrap gap-2">
                  {themes[0].features.map((feature) => (
                    <Badge key={feature} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Color Scheme</h4>
                <div className="flex gap-2">
                  {themes[0].colors.map((color) => (
                    <div 
                      key={color}
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Monitor className="mr-2 h-4 w-4" />
                  Desktop Preview
                </Button>
                <Button variant="outline" size="sm">
                  <Smartphone className="mr-2 h-4 w-4" />
                  Mobile Preview
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="themes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="themes">Browse Themes</TabsTrigger>
          <TabsTrigger value="customize">Customize</TabsTrigger>
          <TabsTrigger value="preview">Preview Changes</TabsTrigger>
        </TabsList>

        <TabsContent value="themes">
          <div className="space-y-4">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search themes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">Filter by Category</Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredThemes.map((theme) => (
                <Card key={theme.id} className={theme.isActive ? 'border-primary' : ''}>
                  <CardHeader className="p-0">
                    <div className="relative">
                      <img 
                        src={theme.image} 
                        alt={theme.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {theme.isActive && (
                        <Badge className="absolute top-2 right-2">Current</Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{theme.name}</h3>
                        <Badge variant="outline">{theme.category}</Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{theme.description}</p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{theme.rating}</span>
                        </div>
                        <span className="text-muted-foreground">{theme.downloads} downloads</span>
                      </div>

                      <div className="flex flex-wrap gap-1">
                        {theme.features.slice(0, 2).map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">{feature}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <span className="font-semibold text-lg">{theme.price}</span>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="mr-1 h-3 w-3" />
                            Preview
                          </Button>
                          {!theme.isActive && (
                            <Button size="sm">
                              Activate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="customize">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Theme Customization</CardTitle>
                <CardDescription>
                  Personalize your theme to match your brand
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  {customizations.map((section) => (
                    <Card key={section.section}>
                      <CardHeader>
                        <CardTitle className="text-lg">{section.section}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {section.options.map((option) => (
                            <div key={option} className="flex items-center justify-between">
                              <span className="text-sm">{option}</span>
                              <Button variant="outline" size="sm">Edit</Button>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Reset to Default</Button>
              <Button>Save Changes</Button>
              <Button>Publish Changes</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your changes look before publishing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Theme preview will appear here</p>
              </div>
              <div className="flex justify-between mt-4">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Monitor className="mr-2 h-4 w-4" />
                    Desktop
                  </Button>
                  <Button variant="outline" size="sm">
                    <Smartphone className="mr-2 h-4 w-4" />
                    Mobile
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">Back to Edit</Button>
                  <Button>Publish Theme</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Themes