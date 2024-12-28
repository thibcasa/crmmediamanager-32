import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { prompt, n = 1, size = "1024x1024", quality = "standard", style = "natural" } = await req.json()
    
    console.log('Generating image with prompt:', prompt)
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
    if (!OPENAI_API_KEY) {
      throw new Error('OpenAI API key is missing')
    }

    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n: 1,
        size,
        quality,
        style,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error('Error generating image with OpenAI')
    }

    const data = await response.json()
    console.log('OpenAI response:', data)

    if (!data.data?.[0]?.url) {
      throw new Error('Invalid response format from OpenAI')
    }

    // Return a consistent format
    return new Response(
      JSON.stringify({ 
        images: [data.data[0].url],
        metadata: {
          model: "dall-e-3",
          size,
          quality,
          style
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in image generation:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred during image generation',
        status: 'error'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})