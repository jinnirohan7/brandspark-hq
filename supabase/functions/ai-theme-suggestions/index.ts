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

    const { business_type, current_theme } = await req.json()

    // Create prompt for AI suggestions
    const prompt = `
      Suggest 3 design improvements for a website theme.
      Business Type: ${business_type}
      Current Theme: ${JSON.stringify(current_theme)}
      Focus on fonts, colors, layout, and style.
      
      Return specific suggestions about:
      1. Font combinations (font families and sizes)
      2. Color palettes (primary, secondary, accent colors)
      3. Layout improvements (spacing, alignment, sections)
      
      Format as numbered list with actionable suggestions.
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

    // Parse suggestions from AI response
    let suggestions = []
    if (data && data[0] && data[0].generated_text) {
      suggestions = data[0].generated_text
        .split('\n')
        .filter((line: string) => line.trim().length > 0)
        .slice(0, 3) // Limit to 3 suggestions
    }

    // Fallback suggestions if AI doesn't provide good ones
    if (suggestions.length === 0) {
      suggestions = [
        `For ${business_type} business, consider using modern sans-serif fonts like Inter or Roboto`,
        `Use a complementary color scheme with your brand colors as primary and neutral grays`,
        `Implement better spacing with consistent margins and padding throughout sections`
      ]
    }

    // Save suggestions to database
    const { data: savedSuggestion, error: saveError } = await supabase
      .from('ai_suggestions')
      .insert({
        user_id: user.id,
        business_type,
        current_theme,
        suggestions: { items: suggestions },
        applied: false
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving suggestions:', saveError)
      throw saveError
    }

    console.log('Suggestions saved successfully:', savedSuggestion.id)

    return new Response(JSON.stringify({
      suggestions: suggestions,
      suggestion_id: savedSuggestion.id
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status: 200 
    })

  } catch (error) {
    console.error('Error in ai-theme-suggestions function:', error)
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      suggestions: []
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }, 
      status: 500,
    })
  }
})