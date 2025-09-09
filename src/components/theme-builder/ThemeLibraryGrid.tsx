import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Search, Grid, List, Star, Download, Eye } from 'lucide-react'

interface Theme {
  id: string
  name: string
  description: string
  preview_url?: string
  category: string
  price?: number
  downloads?: number
  rating?: number
  is_premium?: boolean
}

interface ThemeLibraryGridProps {
  themes: Theme[]
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  onApplyTheme: (themeId: string) => void
  onCustomizeTheme: (theme: Theme) => void
  loading: boolean
  favorites: string[]
  onToggleFavorite: (themeId: string) => void
}

const ThemeLibraryGrid: React.FC<ThemeLibraryGridProps> = ({
  themes,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onApplyTheme,
  onCustomizeTheme,
  loading,
  favorites,
  onToggleFavorite
}) => {
  const mockThemes: Theme[] = [
    {
      id: '1',
      name: 'Stylique',
      description: 'Accessories with Elegance. Perfect for fashion and lifestyle brands.',
      category: 'Fashion',
      downloads: 1250,
      rating: 4.8,
      is_premium: false
    },
    {
      id: '2', 
      name: 'Greentic',
      description: 'Nature Grooming. Ideal for eco-friendly and organic businesses.',
      category: 'Nature',
      downloads: 890,
      rating: 4.6,
      is_premium: false
    },
    {
      id: '3',
      name: 'Techzonix',
      description: 'Earbuds with Superior Sound Quality. Perfect for tech products.',
      category: 'Technology',
      downloads: 2100,
      rating: 4.9,
      is_premium: true
    }
  ]

  const filteredThemes = [...themes, ...mockThemes].filter(theme => {
    const matchesCategory = selectedCategory === 'All' || theme.category === selectedCategory
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Themes</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span className="text-primary">Home</span>
            <span>/</span>
            <span>Themes</span>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="Fashion">Fashion</TabsTrigger>
            <TabsTrigger value="Nature">Nature</TabsTrigger>
            <TabsTrigger value="Technology">Technology</TabsTrigger>
            <TabsTrigger value="Business">Business</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredThemes.map((theme) => (
          <Card key={theme.id} className="group hover:shadow-lg transition-all duration-300">
            <div className="relative">
              {/* Theme Preview */}
              <div className="h-48 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
                {theme.preview_url ? (
                  <img 
                    src={theme.preview_url} 
                    alt={theme.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Grid className="h-8 w-8 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Preview Available</p>
                  </div>
                )}
              </div>
              
              {/* Premium Badge */}
              {theme.is_premium && (
                <Badge className="absolute top-3 right-3 bg-yellow-500 text-yellow-900">
                  Premium
                </Badge>
              )}
              
              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onToggleFavorite(theme.id)}
              >
                <Star className={`h-4 w-4 ${favorites.includes(theme.id) ? 'fill-yellow-400 text-yellow-400' : 'text-white'}`} />
              </Button>
            </div>

            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{theme.name}</CardTitle>
              <CardDescription className="text-sm">
                {theme.description}
              </CardDescription>
              
              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                {theme.downloads && (
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{theme.downloads}</span>
                  </div>
                )}
                {theme.rating && (
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{theme.rating}</span>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  onClick={() => onCustomizeTheme(theme)}
                >
                  Customize
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                  onClick={() => onApplyTheme(theme.id)}
                >
                  Make Active
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading themes...</p>
        </div>
      )}

      {filteredThemes.length === 0 && !loading && (
        <div className="text-center py-12">
          <Grid className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No themes found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default ThemeLibraryGrid