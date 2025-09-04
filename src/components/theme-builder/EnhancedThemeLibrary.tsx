import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  Eye, 
  Download, 
  Star, 
  Filter, 
  Grid3X3, 
  List, 
  Heart,
  Share2,
  SortAsc,
  SortDesc,
  Zap,
  Crown,
  Palette,
  Smartphone,
  Monitor,
  ShoppingBag,
  Briefcase,
  Camera,
  BookOpen,
  Gamepad2,
  Music,
  Heart as HeartIcon,
  Coffee,
  Car,
  Plane,
  Home,
  Dumbbell,
  GraduationCap
} from 'lucide-react'

interface Theme {
  id: string
  name: string
  category: string
  description: string
  preview_image_url: string
  template_data: any
  layout_json: any
  tags: string[]
  price: number
  is_featured: boolean
  rating: number
  downloads: number
  created_at: string
  is_premium?: boolean
  demo_url?: string
  responsive_preview?: {
    desktop: string
    tablet: string
    mobile: string
  }
}

interface EnhancedThemeLibraryProps {
  themes: Theme[]
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  onApplyTheme: (themeId: string) => void
  onPreviewTheme: (theme: Theme) => void
  loading?: boolean
  favorites?: string[]
  onToggleFavorite?: (themeId: string) => void
}

type SortBy = 'popularity' | 'rating' | 'newest' | 'price-low' | 'price-high' | 'name'
type ViewMode = 'grid' | 'list'

export const EnhancedThemeLibrary: React.FC<EnhancedThemeLibraryProps> = ({
  themes,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onApplyTheme,
  onPreviewTheme,
  loading = false,
  favorites = [],
  onToggleFavorite
}) => {
  const [sortBy, setSortBy] = useState<SortBy>('popularity')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [minRating, setMinRating] = useState(0)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [showPremiumOnly, setShowPremiumOnly] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')

  const categoryIcons = {
    business: <Briefcase className="h-4 w-4" />,
    ecommerce: <ShoppingBag className="h-4 w-4" />,
    portfolio: <Camera className="h-4 w-4" />,
    blog: <BookOpen className="h-4 w-4" />,
    health: <Dumbbell className="h-4 w-4" />,
    education: <GraduationCap className="h-4 w-4" />,
    restaurant: <Coffee className="h-4 w-4" />,
    travel: <Plane className="h-4 w-4" />,
    automotive: <Car className="h-4 w-4" />,
    realestate: <Home className="h-4 w-4" />,
    gaming: <Gamepad2 className="h-4 w-4" />,
    music: <Music className="h-4 w-4" />
  }

  // Get all unique tags from themes
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    themes.forEach(theme => {
      theme.tags?.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [themes])

  // Filter and sort themes
  const filteredAndSortedThemes = useMemo(() => {
    let filtered = themes.filter(theme => {
      // Category filter
      const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory
      
      // Search filter
      const matchesSearch = !searchTerm || 
        theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        theme.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      
      // Price filter
      const matchesPrice = theme.price >= priceRange[0] && theme.price <= priceRange[1]
      
      // Rating filter
      const matchesRating = theme.rating >= minRating
      
      // Tags filter
      const matchesTags = selectedTags.length === 0 || 
        selectedTags.some(tag => theme.tags?.includes(tag))
      
      // Favorites filter
      const matchesFavorites = !showFavoritesOnly || favorites.includes(theme.id)
      
      // Premium filter
      const matchesPremium = !showPremiumOnly || theme.is_premium
      
      return matchesCategory && matchesSearch && matchesPrice && 
             matchesRating && matchesTags && matchesFavorites && matchesPremium
    })

    // Sort themes
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.downloads - a.downloads
        case 'rating':
          return b.rating - a.rating
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

    return filtered
  }, [themes, selectedCategory, searchTerm, priceRange, minRating, selectedTags, showFavoritesOnly, showPremiumOnly, sortBy, favorites])

  const handleTagToggle = useCallback((tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }, [])

  const clearFilters = useCallback(() => {
    setSelectedCategory('all')
    setSearchTerm('')
    setPriceRange([0, 5000])
    setMinRating(0)
    setSelectedTags([])
    setShowFavoritesOnly(false)
    setShowPremiumOnly(false)
  }, [setSelectedCategory, setSearchTerm])

  const ThemeCard: React.FC<{ theme: Theme }> = ({ theme }) => {
    const isFavorite = favorites.includes(theme.id)
    
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 overflow-hidden">
        <div className="relative">
          <img 
            src={theme.preview_image_url} 
            alt={theme.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="sm" variant="secondary" onClick={() => onPreviewTheme(theme)}>
              <Eye className="mr-1 h-3 w-3" />
              Preview
            </Button>
            <Button size="sm" onClick={() => onApplyTheme(theme.id)}>
              Apply
            </Button>
          </div>
          
          {/* Theme badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {theme.is_featured && (
              <Badge className="bg-yellow-500">
                <Crown className="mr-1 h-3 w-3" />
                Featured
              </Badge>
            )}
            {theme.is_premium && (
              <Badge variant="secondary">
                <Zap className="mr-1 h-3 w-3" />
                Premium
              </Badge>
            )}
          </div>
          
          {/* Favorite button */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={() => onToggleFavorite?.(theme.id)}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {theme.name}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {categoryIcons[theme.category as keyof typeof categoryIcons]}
                    <span className="ml-1">{theme.category}</span>
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{theme.rating}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">
                  {theme.price === 0 ? 'Free' : `₹${theme.price}`}
                </div>
                <div className="text-xs text-muted-foreground">
                  {theme.downloads} downloads
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground line-clamp-2">
              {theme.description}
            </p>
            
            <div className="flex flex-wrap gap-1">
              {theme.tags?.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {theme.tags && theme.tags.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{theme.tags.length - 3}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const ThemeListItem: React.FC<{ theme: Theme }> = ({ theme }) => {
    const isFavorite = favorites.includes(theme.id)
    
    return (
      <Card className="group hover:shadow-md transition-all duration-200">
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="relative flex-shrink-0">
              <img 
                src={theme.preview_image_url} 
                alt={theme.name}
                className="w-24 h-16 object-cover rounded border"
              />
              {theme.is_featured && (
                <Badge className="absolute -top-1 -right-1 bg-yellow-500 text-xs">
                  <Crown className="h-2 w-2" />
                </Badge>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {theme.name}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                    {theme.description}
                  </p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      {theme.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {theme.downloads}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {theme.category}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="font-semibold">
                      {theme.price === 0 ? 'Free' : `₹${theme.price}`}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite?.(theme.id)}
                  >
                    <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onPreviewTheme(theme)}>
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </Button>
                  <Button size="sm" onClick={() => onApplyTheme(theme.id)}>
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search themes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.filter(cat => cat !== 'all').map((category) => (
                <SelectItem key={category} value={category}>
                  <div className="flex items-center gap-2">
                    {categoryIcons[category as keyof typeof categoryIcons]}
                    <span className="capitalize">{category}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Sort By */}
                <div>
                  <Label>Sort By</Label>
                  <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="popularity">Popularity</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label>Price Range</Label>
                  <div className="px-2 py-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={5000}
                      step={100}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Rating Filter */}
                <div>
                  <Label>Minimum Rating</Label>
                  <div className="px-2 py-2">
                    <Slider
                      value={[minRating]}
                      onValueChange={([value]) => setMinRating(value)}
                      max={5}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      {minRating}+ stars
                    </div>
                  </div>
                </div>

                {/* Quick Filters */}
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="favorites"
                      checked={showFavoritesOnly}
                      onCheckedChange={(checked) => setShowFavoritesOnly(!!checked)}
                    />
                    <Label htmlFor="favorites">Favorites Only</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="premium"
                      checked={showPremiumOnly}
                      onCheckedChange={(checked) => setShowPremiumOnly(!!checked)}
                    />
                    <Label htmlFor="premium">Premium Only</Label>
                  </div>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mt-4">
                <Label>Tags</Label>
                <ScrollArea className="h-24 mt-2">
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </div>

              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <div className="text-sm text-muted-foreground">
                  {filteredAndSortedThemes.length} theme{filteredAndSortedThemes.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* View Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredAndSortedThemes.length} of {themes.length} themes
          </div>
        </div>
      </div>

      {/* Themes Grid/List */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-muted"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedThemes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAndSortedThemes.map((theme) => (
                <ThemeListItem key={theme.id} theme={theme} />
              ))}
            </div>
          )}

          {filteredAndSortedThemes.length === 0 && (
            <div className="text-center py-12">
              <Palette className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No themes found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button onClick={clearFilters}>Clear Filters</Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string }> = ({ children, htmlFor }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium">
    {children}
  </label>
)