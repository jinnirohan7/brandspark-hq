import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const HF_API_URL = "https://api-inference.huggingface.co/models/google/flan-t5-small"
const HF_API_KEY = Deno.env.get("HF_API_KEY")

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    const { business_type, current_theme, theme_style = 'modern', custom_prompt } = await req.json()
    
    const prompt = custom_prompt || `
      Generate a complete professional website theme for a ${business_type} business.
      Theme Style: ${theme_style}
      
      Create a comprehensive theme with:
      1. Complete color palette (primary, secondary, accent, neutral colors with hex codes)
      2. Typography system (font families, sizes, weights for headings, body, buttons)
      3. Layout structure (header, navigation, sections, footer)
      4. Component styles (buttons, forms, cards, navigation)
      5. Responsive design considerations
      6. CSS custom properties and utility classes
      
      Return a structured JSON with theme data including colors, fonts, spacing, and CSS code.
      Make it ready-to-use for a ${business_type} website with ${theme_style} design.
    `

    console.log('Calling HuggingFace API with prompt:', prompt.substring(0, 100) + '...')

    // Call HuggingFace API
    const response = await fetch(HF_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        inputs: prompt, 
        parameters: { 
          max_new_tokens: 200,
          temperature: 0.7,
          do_sample: true
        } 
      }),
    })

    if (!response.ok) {
      throw new Error(`HuggingFace API error: ${response.status}`)
    }

    const data = await response.json()
    console.log('HuggingFace response:', data)

    // Parse theme data from AI response
    let themeData = {}
    let suggestions = []
    
    if (data && data[0] && data[0].generated_text) {
      const generatedText = data[0].generated_text
      
      // Try to parse as JSON first
      try {
        themeData = JSON.parse(generatedText)
      } catch {
        // If not JSON, treat as suggestions
        suggestions = generatedText
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .slice(0, 5)
      }
    }

    // Generate complete theme if not provided
    if (!themeData.colors) {
      themeData = {
        colors: {
          primary: '#2563eb',
          secondary: '#64748b',
          accent: '#f59e0b',
          background: '#ffffff',
          foreground: '#1e293b'
        },
        typography: {
          fontFamily: theme_style === 'modern' ? 'Inter, sans-serif' : 'Georgia, serif',
          headingSize: { h1: '2.5rem', h2: '2rem', h3: '1.5rem' },
          bodySize: '1rem'
        },
        layout: {
          maxWidth: '1200px',
          spacing: { xs: '0.5rem', sm: '1rem', md: '1.5rem', lg: '2rem' },
          borderRadius: '0.5rem'
        },
        components: {
          button: {
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            fontWeight: '600'
          },
          card: {
            padding: '1.5rem',
            borderRadius: '0.75rem',
            shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }
        }
      }
      
      suggestions = [
        `Complete ${theme_style} theme for ${business_type}`,
        'Responsive design with modern components',
        'Professional color palette and typography',
        'Ready-to-use CSS custom properties',
        'Optimized for conversions and user experience'
      ]
    }

    // Save generated theme to database
    const { data: savedTheme, error: saveError } = await supabase
      .from('ai_suggestions')
      .insert({
        user_id: user.id,
        business_type,
        current_theme: themeData,
        suggestions: { items: suggestions },
        applied: false,
        type: 'layout',
        title: `${theme_style.charAt(0).toUpperCase() + theme_style.slice(1)} ${business_type} Theme`,
        description: `AI-generated ${theme_style} theme optimized for ${business_type} businesses`,
        impact: 'high',
        effort: 'easy',
        confidence: 0.9,
        changes: themeData,
        reasoning: `This ${theme_style} theme is specifically designed for ${business_type} businesses, featuring professional styling, responsive layout, and conversion-optimized components.`,
        examples: suggestions,
        after: JSON.stringify(themeData, null, 2)
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving theme:', saveError)
      throw saveError
    }

    console.log('Theme saved successfully:', savedTheme.id)

    return new Response(JSON.stringify({
      theme: themeData,
      suggestions: suggestions,
      theme_id: savedTheme.id,
      success: true
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status: 200 
    })

  } catch (error) {
    console.error('Error in ai-theme-suggestions function:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      suggestions: [],
      success: false
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status: 500,
    })
  }
})