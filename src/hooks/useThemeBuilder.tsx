import { useState, useEffect } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface Theme {
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
}

export interface UserTheme {
  id: string
  user_id: string
  theme_id: string
  customizations_json: any
  is_active: boolean
  theme?: Theme
}

export interface AISuggestion {
  id: string
  user_id?: string
  business_type: string
  current_theme: any
  suggestions: { items: string[] }
  applied: boolean
  created_at: string
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
  liked?: boolean
  feedback?: string
  preview_data?: any
}

export const useThemeBuilder = () => {
  const [themes, setThemes] = useState<Theme[]>([])
  const [userThemes, setUserThemes] = useState<UserTheme[]>([])
  const [currentTheme, setCurrentTheme] = useState<UserTheme | null>(null)
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  // Fetch all themes
  const fetchThemes = async () => {
    try {
      const { data, error } = await supabase
        .from('website_themes')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('rating', { ascending: false })

      if (error) throw error
      setThemes(data || [])
    } catch (error) {
      console.error('Error fetching themes:', error)
      toast({
        title: 'Error',
        description: 'Failed to load themes',
        variant: 'destructive'
      })
    }
  }

  // Fetch user's themes
  const fetchUserThemes = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('user_themes')
        .select(`
          *,
          theme:website_themes(*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      const userThemes = data || []
      setUserThemes(userThemes)
      
      // Set active theme as current
      const active = userThemes.find(ut => ut.is_active)
      setCurrentTheme(active || null)
    } catch (error) {
      console.error('Error fetching user themes:', error)
    }
  }

  // Apply a theme
  const applyTheme = async (themeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      // Deactivate all current themes
      await supabase
        .from('user_themes')
        .update({ is_active: false })
        .eq('user_id', user.id)

      // Check if user already has this theme
      const existingUserTheme = userThemes.find(ut => ut.theme_id === themeId)
      
      if (existingUserTheme) {
        // Activate existing theme
        const { error } = await supabase
          .from('user_themes')
          .update({ is_active: true })
          .eq('id', existingUserTheme.id)
        
        if (error) throw error
      } else {
        // Create new user theme
        const { error } = await supabase
          .from('user_themes')
          .insert({
            user_id: user.id,
            theme_id: themeId,
            customizations_json: {},
            is_active: true
          })
        
        if (error) throw error
      }

      // Increment theme downloads
      await supabase.rpc('increment_downloads', { theme_id: themeId })

      await fetchUserThemes()
      
      toast({
        title: 'Success',
        description: 'Theme applied successfully'
      })
    } catch (error) {
      console.error('Error applying theme:', error)
      toast({
        title: 'Error',
        description: 'Failed to apply theme',
        variant: 'destructive'
      })
    }
  }

  // Update theme customizations
  const updateCustomizations = async (customizations: any) => {
    try {
      if (!currentTheme) throw new Error('No active theme')

      const { error } = await supabase
        .from('user_themes')
        .update({ 
          customizations_json: customizations,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentTheme.id)

      if (error) throw error

      // Create version backup
      await supabase
        .from('theme_versions')
        .insert({
          user_theme_id: currentTheme.id,
          customizations_json: customizations,
          version_number: Date.now() // Simple versioning
        })

      // Update local state
      setCurrentTheme({
        ...currentTheme,
        customizations_json: customizations
      })

      toast({
        title: 'Success',
        description: 'Customizations saved'
      })
    } catch (error) {
      console.error('Error updating customizations:', error)
      toast({
        title: 'Error',
        description: 'Failed to save customizations',
        variant: 'destructive'
      })
    }
  }

  // Get AI suggestions
  const getAISuggestions = async (businessType: string) => {
    try {
      if (!currentTheme) throw new Error('No active theme')

      const { data, error } = await supabase.functions.invoke('ai-theme-suggestions', {
        body: {
          business_type: businessType,
          current_theme: {
            theme: currentTheme.theme,
            customizations: currentTheme.customizations_json
          }
        }
      })

      if (error) throw error

      await fetchAISuggestions()
      
      toast({
        title: 'Success',
        description: 'AI suggestions generated'
      })

      return data
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
      toast({
        title: 'Error',
        description: 'Failed to get AI suggestions',
        variant: 'destructive'
      })
      return null
    }
  }

  // Fetch AI suggestions
  const fetchAISuggestions = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('ai_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) throw error
      
      // Transform data to match AISuggestion interface
      const transformedData = (data || []).map((item: any) => ({
        id: item.id,
        user_id: item.user_id,
        business_type: item.business_type,
        current_theme: item.current_theme,
        suggestions: item.suggestions,
        applied: item.applied,
        created_at: item.created_at,
        type: (item.type || 'content') as 'color' | 'typography' | 'layout' | 'content' | 'performance' | 'accessibility' | 'seo' | 'conversion',
        title: item.title || 'AI Suggestion',
        description: item.description || 'Generated suggestion',
        impact: (item.impact || 'medium') as 'low' | 'medium' | 'high',
        effort: (item.effort || 'moderate') as 'easy' | 'moderate' | 'complex',
        confidence: item.confidence || 0.8,
        changes: item.changes || {},
        reasoning: item.reasoning || 'AI-generated optimization suggestion',
        examples: item.examples,
        before: item.before,
        after: item.after,
        liked: item.liked,
        feedback: item.feedback,
        preview_data: item.preview_data
      }))
      
      setAiSuggestions(transformedData)
    } catch (error) {
      console.error('Error fetching AI suggestions:', error)
    }
  }

  // Apply AI suggestion
  const applyAISuggestion = async (suggestionId: string, customizationChanges: any) => {
    try {
      if (!currentTheme) throw new Error('No active theme')

      // Merge suggestion changes with current customizations
      const newCustomizations = {
        ...currentTheme.customizations_json,
        ...customizationChanges
      }

      await updateCustomizations(newCustomizations)

      // Mark suggestion as applied
      await supabase
        .from('ai_suggestions')
        .update({ applied: true })
        .eq('id', suggestionId)

      await fetchAISuggestions()
    } catch (error) {
      console.error('Error applying AI suggestion:', error)
      toast({
        title: 'Error',
        description: 'Failed to apply suggestion',
        variant: 'destructive'
      })
    }
  }

  // Filter themes
  const filteredThemes = themes.filter(theme => {
    const matchesCategory = selectedCategory === 'all' || theme.category === selectedCategory
    const matchesSearch = theme.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         theme.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSearch
  })

  // Get unique categories
  const categories = ['all', ...Array.from(new Set(themes.map(theme => theme.category)))]

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true)
      await Promise.all([
        fetchThemes(),
        fetchUserThemes(),
        fetchAISuggestions()
      ])
      setLoading(false)
    }

    initializeData()
  }, [])

  return {
    themes: filteredThemes,
    userThemes,
    currentTheme,
    aiSuggestions,
    loading,
    selectedCategory,
    setSelectedCategory,
    searchTerm,
    setSearchTerm,
    categories,
    applyTheme,
    updateCustomizations,
    getAISuggestions,
    applyAISuggestion,
    refetch: () => Promise.all([fetchThemes(), fetchUserThemes(), fetchAISuggestions()])
  }
}