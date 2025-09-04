import { useState } from 'react'
import { Sparkles, Lightbulb, Loader2, Wand2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { AISuggestion } from '@/hooks/useThemeBuilder'

interface AISuggestionsProps {
  suggestions: AISuggestion[]
  onGetSuggestions: (businessType: string) => Promise<any>
  onApplySuggestion: (suggestionId: string, changes: any) => void
  loading?: boolean
}

export const AISuggestions = ({
  suggestions,
  onGetSuggestions,
  onApplySuggestion,
  loading
}: AISuggestionsProps) => {
  const [businessType, setBusinessType] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const businessTypes = [
    'fashion', 'electronics', 'food', 'beauty', 'sports', 'home', 'art', 'jewelry',
    'books', 'toys', 'automotive', 'health', 'education', 'technology', 'travel'
  ]

  const handleGenerateSuggestions = async () => {
    if (!businessType.trim()) return

    setIsGenerating(true)
    try {
      await onGetSuggestions(businessType)
    } catch (error) {
      console.error('Error generating suggestions:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const parseSuggestionToChanges = (suggestion: string) => {
    // Simple parsing logic to convert AI suggestion text into theme changes
    const changes: any = {}

    // Font suggestions
    if (suggestion.toLowerCase().includes('font') || suggestion.toLowerCase().includes('typography')) {
      if (suggestion.toLowerCase().includes('inter')) {
        changes.typography = { primaryFont: 'Inter' }
      } else if (suggestion.toLowerCase().includes('roboto')) {
        changes.typography = { primaryFont: 'Roboto' }
      } else if (suggestion.toLowerCase().includes('poppins')) {
        changes.typography = { primaryFont: 'Poppins' }
      }
    }

    // Color suggestions
    if (suggestion.toLowerCase().includes('color') || suggestion.toLowerCase().includes('palette')) {
      if (suggestion.toLowerCase().includes('blue')) {
        changes.colors = { primary: '#3b82f6' }
      } else if (suggestion.toLowerCase().includes('green')) {
        changes.colors = { primary: '#10b981' }
      } else if (suggestion.toLowerCase().includes('purple')) {
        changes.colors = { primary: '#8b5cf6' }
      } else if (suggestion.toLowerCase().includes('red')) {
        changes.colors = { primary: '#ef4444' }
      }
    }

    // Spacing suggestions
    if (suggestion.toLowerCase().includes('spacing') || suggestion.toLowerCase().includes('padding')) {
      if (suggestion.toLowerCase().includes('more') || suggestion.toLowerCase().includes('larger')) {
        changes.spacing = { sectionPadding: 60, elementSpacing: 30 }
      } else if (suggestion.toLowerCase().includes('less') || suggestion.toLowerCase().includes('smaller')) {
        changes.spacing = { sectionPadding: 20, elementSpacing: 10 }
      }
    }

    // Layout suggestions
    if (suggestion.toLowerCase().includes('layout') || suggestion.toLowerCase().includes('width')) {
      if (suggestion.toLowerCase().includes('full')) {
        changes.layout = { fullWidth: true }
      } else if (suggestion.toLowerCase().includes('narrow') || suggestion.toLowerCase().includes('compact')) {
        changes.layout = { maxWidth: 1000 }
      }
    }

    return changes
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Theme Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="business-type">What type of business is this for?</Label>
            <div className="flex gap-2">
              <Select value={businessType} onValueChange={setBusinessType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button 
                onClick={handleGenerateSuggestions}
                disabled={!businessType || isGenerating}
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Wand2 className="h-4 w-4 mr-2" />
                )}
                Generate
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Our AI will analyze your business type and current theme to suggest improvements
            for fonts, colors, layout, and overall design.
          </div>
        </CardContent>
      </Card>

      {/* Recent Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Recent Suggestions
          </h3>
          
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-base">
                      Suggestions for {suggestion.business_type}
                    </CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {new Date(suggestion.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {suggestion.applied && (
                      <Badge variant="secondary" className="text-green-600">
                        <Check className="h-3 w-3 mr-1" />
                        Applied
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {suggestion.suggestions.items.map((item, index) => (
                  <div key={index} className="flex items-start justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm">{item}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const changes = parseSuggestionToChanges(item)
                        onApplySuggestion(suggestion.id, changes)
                      }}
                      disabled={suggestion.applied}
                    >
                      Apply
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {suggestions.length === 0 && !loading && (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center text-muted-foreground">
              <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No suggestions yet. Generate some AI suggestions to get started!</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}