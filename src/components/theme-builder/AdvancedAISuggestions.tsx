import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Wand2, 
  Sparkles, 
  Brain, 
  Palette, 
  Type, 
  Layout, 
  Image, 
  Zap,
  CheckCircle,
  Clock,
  Star,
  TrendingUp,
  Target,
  Lightbulb,
  BarChart3,
  Users,
  Heart,
  RefreshCw,
  Download,
  Share2,
  Eye,
  ThumbsUp,
  ThumbsDown,
  MessageSquare
} from 'lucide-react'

interface AISuggestion {
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
}

interface AdvancedAISuggestionsProps {
  suggestions: AISuggestion[]
  currentTheme?: any
  businessType: string
  onGetSuggestions: (businessType: string, analysisType?: string) => Promise<void>
  onApplySuggestion: (suggestionId: string, changes: any) => Promise<void>
  onFeedback: (suggestionId: string, liked: boolean, feedback?: string) => void
  loading?: boolean
}

export const AdvancedAISuggestions: React.FC<AdvancedAISuggestionsProps> = ({
  suggestions,
  currentTheme,
  businessType,
  onGetSuggestions,
  onApplySuggestion,
  onFeedback,
  loading = false
}) => {
  const [selectedBusinessType, setSelectedBusinessType] = useState(businessType)
  const [analysisType, setAnalysisType] = useState<string>('comprehensive')
  const [selectedSuggestion, setSelectedSuggestion] = useState<AISuggestion | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [customPrompt, setCustomPrompt] = useState('')

  const businessTypes = [
    'E-commerce Store',
    'Professional Services',
    'Restaurant/Food',
    'Technology/SaaS',
    'Healthcare',
    'Education',
    'Real Estate',
    'Creative Agency',
    'Non-Profit',
    'Travel/Tourism',
    'Fashion/Beauty',
    'Sports/Fitness',
    'Entertainment',
    'Automotive',
    'Manufacturing'
  ]

  const analysisTypes = [
    { value: 'comprehensive', label: 'Comprehensive Analysis', description: 'Full theme analysis with all aspects' },
    { value: 'performance', label: 'Performance Focus', description: 'Speed and loading optimization' },
    { value: 'conversion', label: 'Conversion Optimization', description: 'Improve user actions and sales' },
    { value: 'accessibility', label: 'Accessibility Audit', description: 'WCAG compliance and usability' },
    { value: 'mobile', label: 'Mobile Optimization', description: 'Mobile-first improvements' },
    { value: 'seo', label: 'SEO Enhancement', description: 'Search engine optimization' },
    { value: 'branding', label: 'Brand Consistency', description: 'Visual identity and branding' }
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
    accessibility: <Users className="h-4 w-4" />,
    seo: <TrendingUp className="h-4 w-4" />,
    conversion: <Target className="h-4 w-4" />
  }

  const handleGenerateSuggestions = useCallback(async () => {
    setIsGenerating(true)
    try {
      await onGetSuggestions(selectedBusinessType, analysisType)
    } finally {
      setIsGenerating(false)
    }
  }, [selectedBusinessType, analysisType, onGetSuggestions])

  const handleCustomPrompt = useCallback(async () => {
    if (!customPrompt.trim()) return
    
    setIsGenerating(true)
    try {
      // This would send the custom prompt to the AI
      await onGetSuggestions(selectedBusinessType, `custom: ${customPrompt}`)
      setCustomPrompt('')
    } finally {
      setIsGenerating(false)
    }
  }, [customPrompt, selectedBusinessType, onGetSuggestions])

  const getSuggestionsByType = (type: string) => {
    return suggestions.filter(s => s.type === type)
  }

  const getAppliedSuggestions = () => {
    return suggestions.filter(s => s.applied)
  }

  const getSuggestionScore = (suggestion: AISuggestion) => {
    const impactScore = { low: 1, medium: 2, high: 3 }[suggestion.impact]
    const effortScore = { easy: 3, moderate: 2, complex: 1 }[suggestion.effort]
    return impactScore * effortScore * (suggestion.confidence / 100)
  }

  const sortedSuggestions = [...suggestions].sort((a, b) => getSuggestionScore(b) - getSuggestionScore(a))

  const SuggestionCard: React.FC<{ suggestion: AISuggestion }> = ({ suggestion }) => {
    return (
      <Card className={`transition-all duration-200 hover:shadow-md ${suggestion.applied ? 'border-green-500 bg-green-50' : ''}`}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                {typeIcons[suggestion.type]}
                <h3 className="font-medium">{suggestion.title}</h3>
                {suggestion.applied && (
                  <Badge className="bg-green-500">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Applied
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`text-white ${impactColors[suggestion.impact]}`}>
                  {suggestion.impact} impact
                </Badge>
                <Badge variant="outline" className={`text-white ${effortColors[suggestion.effort]}`}>
                  {suggestion.effort}
                </Badge>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">{suggestion.description}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>{suggestion.confidence}% confidence</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{new Date(suggestion.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedSuggestion(suggestion)
                    setShowDetails(true)
                  }}
                >
                  <Eye className="mr-1 h-3 w-3" />
                  Details
                </Button>
                {!suggestion.applied && (
                  <Button
                    size="sm"
                    onClick={() => onApplySuggestion(suggestion.id, suggestion.changes)}
                    disabled={loading}
                  >
                    <Zap className="mr-1 h-3 w-3" />
                    Apply
                  </Button>
                )}
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(suggestion.id, true)}
                  className={suggestion.liked === true ? 'text-green-600' : ''}
                >
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onFeedback(suggestion.id, false)}
                  className={suggestion.liked === false ? 'text-red-600' : ''}
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
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            AI Theme Suggestions
          </h2>
          <p className="text-muted-foreground">
            Get intelligent recommendations to improve your theme
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      {/* Generate Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Generate New Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Business Type</Label>
              <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Analysis Type</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <div className="font-medium">{type.label}</div>
                        <div className="text-xs text-muted-foreground">{type.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Custom Prompt (Optional)</Label>
            <Textarea
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Describe specific improvements you want suggestions for..."
              className="mt-1"
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleGenerateSuggestions} 
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              Generate Suggestions
            </Button>
            {customPrompt && (
              <Button 
                variant="outline"
                onClick={handleCustomPrompt} 
                disabled={isGenerating}
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                Custom Analysis
              </Button>
            )}
          </div>

          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                Analyzing your theme...
              </div>
              <Progress value={85} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Suggestions Overview */}
      {suggestions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded">
                  <Lightbulb className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{suggestions.length}</div>
                  <div className="text-sm text-muted-foreground">Total Suggestions</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{getAppliedSuggestions().length}</div>
                  <div className="text-sm text-muted-foreground">Applied</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 rounded">
                  <TrendingUp className="h-4 w-4 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {suggestions.filter(s => s.impact === 'high').length}
                  </div>
                  <div className="text-sm text-muted-foreground">High Impact</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-yellow-100 rounded">
                  <Star className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {Math.round(suggestions.reduce((acc, s) => acc + s.confidence, 0) / suggestions.length)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Confidence</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Suggestions Display */}
      {suggestions.length > 0 ? (
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Suggestions ({suggestions.length})</TabsTrigger>
            <TabsTrigger value="prioritized">Prioritized</TabsTrigger>
            <TabsTrigger value="applied">Applied ({getAppliedSuggestions().length})</TabsTrigger>
            <TabsTrigger value="by-type">By Type</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4">
              {suggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="prioritized" className="space-y-4">
            <div className="grid gap-4">
              {sortedSuggestions.slice(0, 5).map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="applied" className="space-y-4">
            <div className="grid gap-4">
              {getAppliedSuggestions().map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="by-type" className="space-y-6">
            {Object.entries(typeIcons).map(([type, icon]) => {
              const typeSuggestions = getSuggestionsByType(type)
              if (typeSuggestions.length === 0) return null

              return (
                <div key={type}>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 capitalize">
                    {icon}
                    {type} ({typeSuggestions.length})
                  </h3>
                  <div className="grid gap-4">
                    {typeSuggestions.map((suggestion) => (
                      <SuggestionCard key={suggestion.id} suggestion={suggestion} />
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
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No suggestions yet</h3>
            <p className="text-muted-foreground mb-4">
              Generate AI-powered suggestions to improve your theme's design, performance, and conversion rates.
            </p>
            <Button onClick={handleGenerateSuggestions} disabled={isGenerating}>
              <Wand2 className="mr-2 h-4 w-4" />
              Get Started with AI Suggestions
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Suggestion Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedSuggestion && typeIcons[selectedSuggestion.type]}
              {selectedSuggestion?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedSuggestion?.description}
            </DialogDescription>
          </DialogHeader>

          {selectedSuggestion && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`inline-block px-3 py-1 rounded text-white text-sm ${impactColors[selectedSuggestion.impact]}`}>
                    {selectedSuggestion.impact.toUpperCase()} IMPACT
                  </div>
                </div>
                <div className="text-center">
                  <div className={`inline-block px-3 py-1 rounded text-white text-sm ${effortColors[selectedSuggestion.effort]}`}>
                    {selectedSuggestion.effort.toUpperCase()} EFFORT
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedSuggestion.confidence}%
                  </div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-2">AI Reasoning</h4>
                <p className="text-muted-foreground">{selectedSuggestion.reasoning}</p>
              </div>

              {selectedSuggestion.examples && (
                <div>
                  <h4 className="font-semibold mb-2">Examples</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {selectedSuggestion.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
              )}

              {(selectedSuggestion.before || selectedSuggestion.after) && (
                <div className="grid grid-cols-2 gap-4">
                  {selectedSuggestion.before && (
                    <div>
                      <h4 className="font-semibold mb-2">Before</h4>
                      <div className="p-4 bg-muted rounded">
                        <code className="text-sm">{selectedSuggestion.before}</code>
                      </div>
                    </div>
                  )}
                  {selectedSuggestion.after && (
                    <div>
                      <h4 className="font-semibold mb-2">After</h4>
                      <div className="p-4 bg-green-50 border border-green-200 rounded">
                        <code className="text-sm">{selectedSuggestion.after}</code>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-4 border-t">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => onFeedback(selectedSuggestion.id, true)}
                    className={selectedSuggestion.liked === true ? 'text-green-600' : ''}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Helpful
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => onFeedback(selectedSuggestion.id, false)}
                    className={selectedSuggestion.liked === false ? 'text-red-600' : ''}
                  >
                    <ThumbsDown className="mr-2 h-4 w-4" />
                    Not Helpful
                  </Button>
                </div>

                {!selectedSuggestion.applied && (
                  <Button
                    onClick={() => {
                      onApplySuggestion(selectedSuggestion.id, selectedSuggestion.changes)
                      setShowDetails(false)
                    }}
                    disabled={loading}
                  >
                    <Zap className="mr-2 h-4 w-4" />
                    Apply This Suggestion
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}