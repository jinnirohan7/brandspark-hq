import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { 
  Wand2, 
  Sparkles, 
  Brain, 
  Palette, 
  Type, 
  Layout, 
  Zap,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Target,
  Lightbulb,
  RefreshCw,
  Download,
  Share2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Check,
  Loader2
} from 'lucide-react'

interface GeneratedTheme {
  id: string
  type: 'color' | 'typography' | 'layout' | 'content' | 'performance' | 'accessibility' | 'seo' | 'conversion'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  effort: 'easy' | 'moderate' | 'complex'
  confidence: number
  changes: any
  reasoning: string
  examples?: string[]
  before?: string
  after?: string
  applied: boolean
  liked?: boolean
  feedback?: string
  created_at: string
  preview_data?: any
}

interface AIThemeGeneratorProps {
  themes: GeneratedTheme[]
  onGenerateTheme: (businessType: string, themeStyle?: string, customPrompt?: string) => Promise<void>
  onApplyTheme: (themeId: string, themeData: any) => Promise<void>
  onFeedback: (themeId: string, liked: boolean, feedback?: string) => void
  loading?: boolean
}

export const AIThemeGenerator: React.FC<AIThemeGeneratorProps> = ({
  themes,
  onGenerateTheme,
  onApplyTheme,
  onFeedback,
  loading = false
}) => {
  const [selectedBusinessType, setSelectedBusinessType] = useState('')
  const [selectedThemeStyle, setSelectedThemeStyle] = useState('modern')
  const [selectedTheme, setSelectedTheme] = useState<GeneratedTheme | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const businessTypes = [
    'e-commerce',
    'restaurant',
    'technology',
    'healthcare',
    'education',
    'real-estate',
    'creative-agency',
    'non-profit',
    'travel',
    'fashion',
    'fitness',
    'entertainment',
    'automotive',
    'manufacturing',
    'consulting'
  ]

  const themeStyles = [
    'modern',
    'minimalist', 
    'corporate',
    'creative',
    'e-commerce',
    'blog',
    'portfolio',
    'landing-page'
  ]

  const impactColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-green-500'
  }

  const effortColors = {
    easy: 'bg-green-500',
    moderate: 'bg-yellow-500',
    complex: 'bg-red-500'
  }

  const typeIcons = {
    color: <Palette className="h-4 w-4" />,
    typography: <Type className="h-4 w-4" />,
    layout: <Layout className="h-4 w-4" />,
    content: <MessageSquare className="h-4 w-4" />,
    performance: <Zap className="h-4 w-4" />,
    accessibility: <TrendingUp className="h-4 w-4" />,
    seo: <TrendingUp className="h-4 w-4" />,
    conversion: <Target className="h-4 w-4" />
  }

  const handleGenerateTheme = useCallback(async () => {
    if (!selectedBusinessType) {
      return
    }
    
    setIsGenerating(true)
    try {
      await onGenerateTheme(selectedBusinessType, selectedThemeStyle, customPrompt)
    } catch (error) {
      console.error('Theme generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [selectedBusinessType, selectedThemeStyle, customPrompt, onGenerateTheme])

  const handleCustomGeneration = useCallback(async () => {
    if (!customPrompt.trim()) {
      return
    }
    
    setIsGenerating(true)
    try {
      await onGenerateTheme(selectedBusinessType || 'custom', 'custom', customPrompt)
    } catch (error) {
      console.error('Custom theme generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }, [customPrompt, selectedBusinessType, onGenerateTheme])

  const getThemesByStyle = (style: string) => {
    return themes.filter(t => t.type === style)
  }

  const getAppliedThemes = () => {
    return themes.filter(t => t.applied)
  }

  const appliedCount = getAppliedThemes().length
  const highImpactCount = themes.filter(t => t.impact === 'high').length
  const avgConfidence = themes.length > 0 ? 
    themes.reduce((acc, t) => acc + t.confidence, 0) / themes.length : 0

  const ThemeCard: React.FC<{ theme: GeneratedTheme }> = ({ theme }) => {
    return (
      <Card className={`transition-all duration-200 hover:shadow-md ${theme.applied ? 'border-green-500 bg-green-50' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {typeIcons[theme.type]}
                <h3 className="font-medium">{theme.title}</h3>
                {theme.applied && (
                  <Badge className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Applied
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-white ${impactColors[theme.impact]}`}>
                  {theme.impact} quality
                </Badge>
                <Badge variant="outline" className={`text-white ${effortColors[theme.effort]}`}>
                  {theme.effort}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{theme.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>{Math.round(theme.confidence * 100)}% quality score</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(theme.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTheme(theme)}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Preview
                </Button>
                {!theme.applied && (
                  <Button
                    size="sm"
                    onClick={() => onApplyTheme(theme.id, theme.changes)}
                    disabled={loading}
                  >
                    <Check className="mr-1 h-3 w-3" />
                    Apply Theme
                  </Button>
                )}
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(theme.id, true)}
                  className={theme.liked === true ? 'text-green-600' : ''}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(theme.id, false)}
                  className={theme.liked === false ? 'text-red-600' : ''}
                >
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">AI Theme Generator</h2>
          <p className="text-muted-foreground">
            Generate complete, professional themes automatically based on your business type and style preferences. No coding required!
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Themes
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Generate New Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Generate New Theme
          </CardTitle>
          <CardDescription>
            Create a complete, professional theme with AI - no coding required
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="business-type">Business Type</Label>
              <Select
                value={selectedBusinessType}
                onValueChange={setSelectedBusinessType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select business type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="theme-style">Theme Style</Label>
              <Select
                value={selectedThemeStyle}
                onValueChange={setSelectedThemeStyle}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select theme style" />
                </SelectTrigger>
                <SelectContent>
                  {themeStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style.charAt(0).toUpperCase() + style.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="custom-prompt">Custom Requirements (Optional)</Label>
            <Textarea
              id="custom-prompt"
              placeholder="Describe your specific design requirements, colors, features, etc..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateTheme}
              disabled={!selectedBusinessType || isGenerating}
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating Theme...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Complete Theme
                </>
              )}
            </Button>
            
            {customPrompt && (
              <Button 
                variant="outline"
                onClick={handleCustomGeneration}
                disabled={isGenerating}
              >
                Custom Theme
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                Generating your custom theme...
              </div>
              <Progress value={75} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Generated Themes Overview */}
      {themes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Themes Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{themes.length}</div>
                <div className="text-sm text-muted-foreground">Generated Themes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{appliedCount}</div>
                <div className="text-sm text-muted-foreground">Applied</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{highImpactCount}</div>
                <div className="text-sm text-muted-foreground">Professional Quality</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{Math.round(avgConfidence * 100)}%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Themes Display */}
      {themes.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Themes</TabsTrigger>
            <TabsTrigger value="priority">Recommended</TabsTrigger>
            <TabsTrigger value="applied">Applied</TabsTrigger>
            <TabsTrigger value="type">By Style</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {themes.map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="priority" className="space-y-4">
            <div className="grid gap-4">
              {themes.filter(t => t.impact === 'high').map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applied" className="space-y-4">
            <div className="grid gap-4">
              {getAppliedThemes().map((theme) => (
                <ThemeCard key={theme.id} theme={theme} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="type" className="space-y-6">
            {themeStyles.map((style) => {
              const styleThemes = getThemesByStyle(style)
              if (styleThemes.length === 0) return null

              return (
                <div key={style}>
                  <h3 className="text-lg font-semibold mb-3 capitalize">
                    {style.replace('-', ' ')} ({styleThemes.length})
                  </h3>
                  <div className="grid gap-4">
                    {styleThemes.map((theme) => (
                      <ThemeCard key={theme.id} theme={theme} />
                    ))}
                  </div>
                </div>
              )
            })}
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-muted-foreground" />
              </div>
              <CardDescription className="text-center">
                No themes generated yet. Use the AI Theme Generator to create professional themes automatically.
              </CardDescription>
              <div className="flex justify-center">
                <Button onClick={handleGenerateTheme} disabled={!selectedBusinessType}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Your First Theme
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Theme Preview Dialog */}
      <Dialog open={!!selectedTheme} onOpenChange={() => setSelectedTheme(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedTheme && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Badge variant={
                    selectedTheme.impact === 'high' ? 'destructive' :
                    selectedTheme.impact === 'medium' ? 'default' : 'secondary'
                  }>
                    {selectedTheme.impact} quality
                  </Badge>
                  <Badge variant="outline">
                    {selectedTheme.effort} complexity
                  </Badge>
                  <Badge variant="secondary">
                    {Math.round(selectedTheme.confidence * 100)}% score
                  </Badge>
                </DialogTitle>
                <DialogDescription>
                  {selectedTheme.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {selectedTheme.description}
                </p>

                {/* Theme Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Theme Features</h4>
                    <p className="text-sm">{selectedTheme.reasoning}</p>
                  </div>

                  {/* Theme Components */}
                  {selectedTheme.examples && selectedTheme.examples.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Included Components</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {selectedTheme.examples.map((component, index) => (
                          <li key={index} className="text-sm">{component}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Theme Preview */}
                  <div className="space-y-4">
                    <h4 className="font-semibold mb-2">Theme Preview</h4>
                    <div className="bg-muted p-4 rounded-lg">
                      <div className="aspect-video bg-background rounded border-2 border-dashed border-border flex items-center justify-center">
                        <p className="text-muted-foreground">Theme Preview (Coming Soon)</p>
                      </div>
                    </div>
                    {selectedTheme.after && (
                      <div>
                        <h4 className="font-semibold mb-2">Generated CSS</h4>
                        <pre className="bg-muted p-3 rounded text-xs overflow-x-auto max-h-48">
                          {selectedTheme.after}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button 
                    onClick={() => onApplyTheme(selectedTheme.id, selectedTheme.changes)}
                    className="flex-1"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Apply Theme
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onFeedback(selectedTheme.id, true)}
                  >
                    <ThumbsUp className="w-4 h-4 mr-2" />
                    Like
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => onFeedback(selectedTheme.id, false)}
                  >
                    <ThumbsDown className="w-4 h-4 mr-2" />
                    Dislike
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}