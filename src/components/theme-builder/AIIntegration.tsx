import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { 
  Wand2, 
  Sparkles, 
  Bot, 
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Palette,
  Layout,
  Type,
  Eye,
  Zap,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Save,
  Play
} from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface AISuggestion {
  id: string
  type: 'color' | 'typography' | 'layout' | 'content' | 'performance' | 'accessibility' | 'seo' | 'conversion'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  effort: 'easy' | 'moderate' | 'complex'
  confidence: number
  reasoning: string
  changes: any
  examples?: string[]
  before?: string
  after?: string
  liked?: boolean
  applied?: boolean
}

interface AIIntegrationProps {
  currentTheme?: any
  onApplySuggestion?: (suggestion: AISuggestion) => void
  onGenerateTheme?: (prompt: string, provider: string) => Promise<any>
}

export const AIIntegration: React.FC<AIIntegrationProps> = ({
  currentTheme,
  onApplySuggestion,
  onGenerateTheme
}) => {
  const [activeProvider, setActiveProvider] = useState<'grok' | 'chatgpt' | 'gemini'>('chatgpt')
  const [prompt, setPrompt] = useState('')
  const [chatHistory, setChatHistory] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const { toast } = useToast()

  const aiProviders = [
    { 
      id: 'chatgpt', 
      name: 'ChatGPT', 
      icon: <Bot className="h-4 w-4" />,
      description: 'Advanced design suggestions and code generation'
    },
    { 
      id: 'grok', 
      name: 'Grok', 
      icon: <Zap className="h-4 w-4" />,
      description: 'Real-time web trends and cutting-edge design'
    },
    { 
      id: 'gemini', 
      name: 'Gemini', 
      icon: <Sparkles className="h-4 w-4" />,
      description: 'Multi-modal analysis and creative solutions'
    }
  ]

  const suggestionTypes = [
    { id: 'color', name: 'Colors', icon: <Palette className="h-4 w-4" /> },
    { id: 'typography', name: 'Typography', icon: <Type className="h-4 w-4" /> },
    { id: 'layout', name: 'Layout', icon: <Layout className="h-4 w-4" /> },
    { id: 'content', name: 'Content', icon: <MessageSquare className="h-4 w-4" /> },
    { id: 'performance', name: 'Performance', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'accessibility', name: 'Accessibility', icon: <Eye className="h-4 w-4" /> },
    { id: 'seo', name: 'SEO', icon: <TrendingUp className="h-4 w-4" /> },
    { id: 'conversion', name: 'Conversion', icon: <Zap className="h-4 w-4" /> }
  ]

  // Mock AI suggestions for demonstration
  const mockSuggestions: AISuggestion[] = [
    {
      id: '1',
      type: 'color',
      title: 'Improve Color Contrast',
      description: 'Enhance accessibility with better color contrast ratios',
      impact: 'high',
      effort: 'easy',
      confidence: 0.92,
      reasoning: 'Current color combination has a contrast ratio of 3.2:1, which falls below WCAG AA standards. Improving this will enhance readability and accessibility.',
      changes: {
        colors: {
          primary: '#2563eb',
          secondary: '#1e40af',
          foreground: '#1f2937'
        }
      },
      before: 'Contrast ratio: 3.2:1',
      after: 'Contrast ratio: 7.8:1 (WCAG AAA compliant)'
    },
    {
      id: '2',
      type: 'typography',
      title: 'Optimize Font Loading',
      description: 'Use system fonts fallback for better performance',
      impact: 'medium',
      effort: 'easy',
      confidence: 0.88,
      reasoning: 'Custom fonts can impact loading performance. Adding system font fallbacks will ensure fast rendering while custom fonts load.',
      changes: {
        typography: {
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif'
        }
      }
    },
    {
      id: '3',
      type: 'layout',
      title: 'Mobile-First Spacing',
      description: 'Adjust spacing for better mobile experience',
      impact: 'high',
      effort: 'moderate',
      confidence: 0.85,
      reasoning: 'Current spacing values are optimized for desktop. Mobile users (60% of traffic) would benefit from tighter spacing and larger touch targets.',
      changes: {
        spacing: {
          mobile: {
            sm: '4px',
            md: '8px',
            lg: '16px'
          }
        }
      }
    }
  ]

  useEffect(() => {
    // Load mock suggestions
    setSuggestions(mockSuggestions)
  }, [])

  const handleGenerateWithAI = async () => {
    if (!prompt.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a prompt for AI generation',
        variant: 'destructive'
      })
      return
    }

    setIsLoading(true)
    setAnalysisProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      // Add user message to chat
      const userMessage = {
        id: Date.now(),
        type: 'user',
        content: prompt,
        timestamp: new Date()
      }
      setChatHistory(prev => [...prev, userMessage])

      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      const aiResponse = {
        id: Date.now() + 1,
        type: 'ai',
        provider: activeProvider,
        content: `I've analyzed your request "${prompt}" and generated several suggestions for your theme. Here are the key improvements I recommend:

1. **Color Harmony**: I suggest adjusting your primary color to #2563eb for better brand consistency
2. **Typography Scale**: Implementing a modular scale will improve visual hierarchy
3. **Spacing System**: Using an 8px grid system for more consistent layouts
4. **Performance**: Optimizing font loading and CSS delivery

Would you like me to apply any of these suggestions to your theme?`,
        timestamp: new Date(),
        suggestions: [
          {
            id: `ai-${Date.now()}`,
            type: 'color' as const,
            title: 'Enhanced Color Palette',
            description: 'AI-optimized color scheme for better brand consistency',
            impact: 'high' as const,
            effort: 'easy' as const,
            confidence: 0.94,
            reasoning: 'Based on color theory and your brand identity',
            changes: {
              colors: {
                primary: '#2563eb',
                secondary: '#3b82f6',
                accent: '#06b6d4'
              }
            }
          }
        ]
      }

      setChatHistory(prev => [...prev, aiResponse])
      
      // Add AI suggestions to the suggestions list
      if (aiResponse.suggestions) {
        setSuggestions(prev => [...aiResponse.suggestions, ...prev])
      }

      setPrompt('')
      
      toast({
        title: 'Success',
        description: `${activeProvider.toUpperCase()} has generated new suggestions for your theme`
      })

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate AI suggestions',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
      setAnalysisProgress(0)
    }
  }

  const handleSuggestionFeedback = (suggestionId: string, liked: boolean) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestionId ? { ...s, liked } : s)
    )
  }

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    setSuggestions(prev => 
      prev.map(s => s.id === suggestion.id ? { ...s, applied: true } : s)
    )
    onApplySuggestion?.(suggestion)
    toast({
      title: 'Applied',
      description: `${suggestion.title} has been applied to your theme`
    })
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'complex': return 'bg-red-100 text-red-800'
      case 'moderate': return 'bg-yellow-100 text-yellow-800'
      case 'easy': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Provider Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {aiProviders.map((provider) => (
          <Card 
            key={provider.id}
            className={`cursor-pointer transition-all ${
              activeProvider === provider.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setActiveProvider(provider.id as any)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                {provider.icon}
                <CardTitle className="text-lg">{provider.name}</CardTitle>
                {activeProvider === provider.id && (
                  <Badge className="ml-auto">Active</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {provider.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
          <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
          <TabsTrigger value="analysis">Theme Analysis</TabsTrigger>
        </TabsList>

        {/* AI Chat Interface */}
        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat with {aiProviders.find(p => p.id === activeProvider)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 mb-4">
                <div className="space-y-4">
                  {chatHistory.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <Bot className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Start a conversation with AI to get theme suggestions</p>
                    </div>
                  ) : (
                    chatHistory.map((message) => (
                      <div 
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div 
                          className={`max-w-[80%] rounded-lg p-3 ${
                            message.type === 'user' 
                              ? 'bg-primary text-primary-foreground' 
                              : 'bg-muted'
                          }`}
                        >
                          <div className="text-sm">
                            {message.content}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {isLoading && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span className="text-sm">AI is analyzing your theme...</span>
                  </div>
                  <Progress value={analysisProgress} className="w-full" />
                </div>
              )}

              <div className="flex gap-2">
                <Textarea
                  placeholder={`Ask ${activeProvider.toUpperCase()} to improve your theme...`}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[60px]"
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleGenerateWithAI}
                  disabled={isLoading || !prompt.trim()}
                  className="shrink-0"
                >
                  <Wand2 className="mr-1 h-4 w-4" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Suggestions */}
        <TabsContent value="suggestions" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Suggestions</h3>
            <div className="flex items-center gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {suggestionTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      <div className="flex items-center gap-2">
                        {type.icon}
                        {type.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <RefreshCw className="mr-1 h-3 w-3" />
                Refresh
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suggestions.map((suggestion) => (
              <Card key={suggestion.id} className={suggestion.applied ? 'bg-green-50 border-green-200' : ''}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      {suggestionTypes.find(t => t.id === suggestion.type)?.icon}
                      <CardTitle className="text-base">{suggestion.title}</CardTitle>
                    </div>
                    <div className="flex gap-1">
                      <Badge 
                        variant="secondary" 
                        className={getImpactColor(suggestion.impact)}
                      >
                        {suggestion.impact} impact
                      </Badge>
                      <Badge 
                        variant="outline" 
                        className={getEffortColor(suggestion.effort)}
                      >
                        {suggestion.effort}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {suggestion.description}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h5 className="text-sm font-medium mb-1">AI Reasoning:</h5>
                    <p className="text-xs text-muted-foreground">
                      {suggestion.reasoning}
                    </p>
                  </div>

                  {suggestion.before && suggestion.after && (
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="font-medium text-red-600">Before:</span>
                        <div className="bg-red-50 p-2 rounded mt-1">{suggestion.before}</div>
                      </div>
                      <div>
                        <span className="font-medium text-green-600">After:</span>
                        <div className="bg-green-50 p-2 rounded mt-1">{suggestion.after}</div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        Confidence: {Math.round(suggestion.confidence * 100)}%
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuggestionFeedback(suggestion.id, true)}
                          className={suggestion.liked === true ? 'text-green-600' : ''}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSuggestionFeedback(suggestion.id, false)}
                          className={suggestion.liked === false ? 'text-red-600' : ''}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <Button 
                      size="sm"
                      onClick={() => handleApplySuggestion(suggestion)}
                      disabled={suggestion.applied}
                    >
                      {suggestion.applied ? (
                        <>Applied</>
                      ) : (
                        <>
                          <Play className="mr-1 h-3 w-3" />
                          Apply
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Theme Analysis */}
        <TabsContent value="analysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Theme Performance Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">92%</div>
                  <div className="text-sm text-muted-foreground">Performance Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">78%</div>
                  <div className="text-sm text-muted-foreground">Accessibility</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">85%</div>
                  <div className="text-sm text-muted-foreground">SEO Score</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-muted-foreground">Design Quality</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}