import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Code,
  Wand2,
  Copy,
  Settings,
  Zap,
  Brain,
  Lightbulb,
  Target,
  TrendingUp,
  Loader2,
  Layout,
  Type,
  Palette
} from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  codeExample?: string
}

interface AIIntegrationProps {
  currentTheme?: any
  onApplyChanges?: (changes: any) => void
  onGenerateSuggestions?: (type: string) => void
}

export const AIIntegration: React.FC<AIIntegrationProps> = ({
  currentTheme,
  onApplyChanges,
  onGenerateSuggestions
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI design assistant. I can help you customize your theme, suggest improvements, and generate code. What would you like to work on today?',
      timestamp: new Date(),
      suggestions: [
        'Improve color scheme',
        'Optimize typography',
        'Enhance layout',
        'Add animations'
      ]
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [selectedProvider, setSelectedProvider] = useState<'grok' | 'chatgpt' | 'gemini'>('chatgpt')
  const { toast } = useToast()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const extractCodeFromResponse = (response: string): string | undefined => {
    // Extract code blocks from AI response
    const codeBlockRegex = /```[\s\S]*?```/g
    const matches = response.match(codeBlockRegex)
    return matches ? matches[0] : undefined
  }

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: currentMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const messageToSend = currentMessage
    setCurrentMessage('')
    setIsTyping(true)

    try {
      // Build chat history for context
      const chatHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.content
      }))

      const { data, error } = await supabase.functions.invoke('ai-theme-chat', {
        body: {
          message: messageToSend,
          currentTheme,
          chatHistory
        }
      })

      if (error) throw error

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: data.response || 'I apologize, but I couldn\'t process your request right now.',
        timestamp: new Date(),
        suggestions: generateSuggestions(messageToSend),
        codeExample: extractCodeFromResponse(data.response)
      }

      setMessages(prev => [...prev, aiResponse])
    } catch (error) {
      console.error('AI chat error:', error)
      toast({
        title: 'Error',
        description: 'Failed to get AI response. Please try again.',
        variant: 'destructive'
      })
      
      // Add error message
      const errorResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'I apologize, but I\'m having trouble responding right now. Please try again in a moment.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const generateSuggestions = (userMessage: string): string[] => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('color')) {
      return ['Apply modern blue palette', 'Use warm orange scheme', 'Try minimal gray colors']
    }
    
    if (message.includes('font') || message.includes('typography')) {
      return ['Switch to Inter font', 'Use Roboto for body text', 'Apply serif headers']
    }
    
    if (message.includes('layout')) {
      return ['Increase section spacing', 'Add grid layout', 'Optimize for mobile']
    }
    
    return ['Improve accessibility', 'Optimize performance', 'Enhance user experience']
  }

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion)
  }

  const handleQuickAction = (action: string) => {
    let message = ''
    
    switch (action) {
      case 'colors':
        message = 'Help me improve the color scheme for my theme'
        break
      case 'typography':
        message = 'Suggest better fonts and typography for my website'
        break
      case 'layout':
        message = 'How can I improve the layout and spacing?'
        break
      case 'performance':
        message = 'Give me suggestions to optimize theme performance'
        break
      default:
        message = action
    }
    
    setCurrentMessage(message)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: 'Copied!',
      description: 'Code copied to clipboard'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Design Assistant</h2>
          <p className="text-muted-foreground">
            Get personalized design advice and code suggestions powered by AI
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedProvider === 'chatgpt' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedProvider('chatgpt')}
          >
            <Brain className="mr-2 h-4 w-4" />
            ChatGPT
          </Button>
          <Button
            variant={selectedProvider === 'grok' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedProvider('grok')}
          >
            <Zap className="mr-2 h-4 w-4" />
            Grok
          </Button>
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4" />
            Quick Suggestions
          </TabsTrigger>
          <TabsTrigger value="analyze" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Theme Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          {/* Chat Interface */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <CardTitle>AI Design Chat</CardTitle>
                <Badge variant="secondary">{selectedProvider}</Badge>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      {message.type === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <Bot className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                      
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        
                        <div className="text-xs opacity-70 mt-2">
                          {message.timestamp.toLocaleTimeString()}
                        </div>

                        {/* Suggestions */}
                        {message.suggestions && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium opacity-70">Suggestions:</p>
                            <div className="flex flex-wrap gap-2">
                              {message.suggestions.map((suggestion, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs h-6"
                                  onClick={() => handleSuggestionClick(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Code Example */}
                        {message.codeExample && (
                          <div className="mt-3 p-2 bg-background rounded border">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-medium">Code Example</span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboard(message.codeExample!)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                            <pre className="text-xs overflow-x-auto">
                              <code>{message.codeExample}</code>
                            </pre>
                          </div>
                        )}
                      </div>
                      
                      {message.type === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-secondary-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask me about colors, fonts, layout, or anything design-related..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isTyping}
                  />
                  <Button onClick={handleSendMessage} disabled={isTyping || !currentMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="space-y-4">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Quick Design Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleQuickAction('colors')}
                >
                  <Palette className="h-6 w-6 text-primary" />
                  <span className="text-sm">Improve Colors</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleQuickAction('typography')}
                >
                  <Type className="h-6 w-6 text-primary" />
                  <span className="text-sm">Better Fonts</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleQuickAction('layout')}
                >
                  <Layout className="h-6 w-6 text-primary" />
                  <span className="text-sm">Fix Layout</span>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-2"
                  onClick={() => handleQuickAction('performance')}
                >
                  <Zap className="h-6 w-6 text-primary" />
                  <span className="text-sm">Performance</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Common Questions */}
          <Card>
            <CardHeader>
              <CardTitle>Common Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  'How do I make my website look more professional?',
                  'What colors work best for my business type?',
                  'How can I improve readability?',
                  'What spacing should I use?',
                  'How do I make it mobile-friendly?'
                ].map((question, idx) => (
                  <Button
                    key={idx}
                    variant="ghost"
                    className="w-full justify-start text-left h-auto p-3"
                    onClick={() => handleQuickAction(question)}
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analyze" className="space-y-4">
          {/* Theme Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Current Theme Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              {currentTheme ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">85%</div>
                      <div className="text-sm text-muted-foreground">Design Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">92%</div>
                      <div className="text-sm text-muted-foreground">Accessibility</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">78%</div>
                      <div className="text-sm text-muted-foreground">Performance</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">90%</div>
                      <div className="text-sm text-muted-foreground">Mobile Ready</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">Recommendations:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Consider using a more vibrant primary color</li>
                      <li>• Increase font size for better readability</li>
                      <li>• Add more whitespace between sections</li>
                      <li>• Optimize images for faster loading</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No active theme to analyze. Please select a theme first.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}