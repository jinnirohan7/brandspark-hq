import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header provided')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    )

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) {
      throw new Error(`Authentication failed: ${authError.message}`)
    }
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { message, currentTheme, chatHistory } = await req.json();

    // Build context for AI
    const systemPrompt = `You are a professional web design AI assistant specialized in theme customization and website building. 

Current Theme Context:
${currentTheme ? `
- Theme Name: ${currentTheme.theme?.name || 'Custom'}
- Category: ${currentTheme.theme?.category || 'general'}
- Current Customizations: ${JSON.stringify(currentTheme.customizations_json || {}, null, 2)}
` : 'No active theme selected'}

You help users with:
1. Theme customization (colors, fonts, spacing, layouts)
2. Design suggestions and best practices
3. CSS code generation and modifications
4. Component styling and responsive design
5. Business-specific design recommendations

Always provide:
- Specific, actionable advice
- Code examples when relevant
- Design reasoning
- Alternative suggestions

When suggesting changes, provide the exact CSS or JSON configuration that can be applied.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(chatHistory || []),
      { role: 'user', content: message }
    ];

    console.log('Calling OpenAI API with messages:', messages.length);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save chat interaction for future reference
    try {
      await supabase
        .from('ai_suggestions')
        .insert({
          user_id: user.id,
          business_type: 'chat',
          current_theme: currentTheme || {},
          suggestions: { 
            chat_message: message,
            ai_response: aiResponse
          },
          applied: false,
          type: 'content',
          title: 'AI Chat Interaction',
          description: message.substring(0, 100) + '...',
          impact: 'medium',
          effort: 'easy',
          confidence: 0.8,
          changes: {},
          reasoning: 'AI chat assistance',
          after: aiResponse
        });
    } catch (saveError) {
      console.warn('Failed to save chat interaction:', saveError);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-theme-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Internal server error',
      success: false
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});