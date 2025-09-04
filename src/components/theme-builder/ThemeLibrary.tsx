import { useState } from 'react'
import { Search, Filter, Star, Download, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Theme } from '@/hooks/useThemeBuilder'

interface ThemeLibraryProps {
  themes: Theme[]
  categories: string[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  onApplyTheme: (themeId: string) => void
  loading?: boolean
}

export const ThemeLibrary = ({
  themes,
  categories,
  selectedCategory,
  setSelectedCategory,
  searchTerm,
  setSearchTerm,
  onApplyTheme,
  loading
}: ThemeLibraryProps) => {
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null)

  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `$${price}`
  }

  const ThemePreview = ({ theme }: { theme: Theme }) => (
    <div className="space-y-4">
      <div className="aspect-video bg-muted rounded-lg overflow-hidden">
        {theme.preview_image_url ? (
          <img 
            src={theme.preview_image_url} 
            alt={theme.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            Preview Image
          </div>
        )}
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">{theme.name}</h3>
        <p className="text-sm text-muted-foreground">{theme.description}</p>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{theme.rating}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{theme.downloads}</span>
          </div>
          <Badge variant="secondary" className="capitalize">
            {theme.category}
          </Badge>
        </div>

        {theme.tags && theme.tags.length > 0 && (
          <div className="flex items-center gap-1 flex-wrap">
            <Tag className="h-3 w-3 text-muted-foreground" />
            {theme.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search themes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Theme Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <CardHeader className="space-y-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {themes.map((theme) => (
            <Card key={theme.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader className="p-0">
                <div className="aspect-video bg-muted rounded-t-lg overflow-hidden">
                  {theme.preview_image_url ? (
                    <img 
                      src={theme.preview_image_url} 
                      alt={theme.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <div className="text-center">
                        <div className="h-12 w-12 bg-muted-foreground/10 rounded-lg mx-auto mb-2"></div>
                        <span className="text-sm">Preview Image</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{theme.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {theme.description}
                    </p>
                  </div>
                  {theme.is_featured && (
                    <Badge className="shrink-0">Featured</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{theme.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3 text-muted-foreground" />
                      <span>{theme.downloads}</span>
                    </div>
                  </div>
                  
                  <Badge variant="secondary" className="capitalize">
                    {theme.category}
                  </Badge>
                </div>

                <div className="text-lg font-semibold text-primary">
                  {formatPrice(theme.price)}
                </div>
              </CardContent>

              <CardFooter className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={() => setPreviewTheme(theme)}
                >
                  Preview
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1"
                  onClick={() => onApplyTheme(theme.id)}
                >
                  Apply Theme
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {themes.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold mb-2">No themes found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!previewTheme} onOpenChange={() => setPreviewTheme(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Theme Preview</DialogTitle>
          </DialogHeader>
          
          {previewTheme && (
            <div className="space-y-4">
              <ThemePreview theme={previewTheme} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setPreviewTheme(null)}>
                  Close
                </Button>
                <Button onClick={() => {
                  onApplyTheme(previewTheme.id)
                  setPreviewTheme(null)
                }}>
                  Apply This Theme
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}