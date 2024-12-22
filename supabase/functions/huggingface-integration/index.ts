import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10
const requestTimestamps: number[] = []

function isRateLimited(): boolean {
  const now = Date.now()
  // Remove timestamps older than the window
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW) {
    requestTimestamps.shift()
  }
  // Check if we're over the limit
  if (requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return true
  }
  // Add current timestamp
  requestTimestamps.push(now)
  return false
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Check rate limit
    if (isRateLimited()) {
      console.log('Rate limit exceeded')
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          details: 'Please wait a minute before trying again'
        }),
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const { action, data } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    console.log('Processing request:', { action, data })

    if (action === 'generate-image') {
      try {
        console.log('Generating image with prompt:', data.prompt)
        const image = await hf.textToImage({
          inputs: data.prompt,
          model: 'black-forest-labs/FLUX.1-schnell',
          parameters: {
            num_inference_steps: 30,
            guidance_scale: 7.5
          }
        })

        // Convert the blob to a base64 string
        const arrayBuffer = await image.arrayBuffer()
        const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

        console.log('Image generated successfully')
        return new Response(
          JSON.stringify({ image: `data:image/png;base64,${base64}` }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      } catch (error) {
        console.error('Error generating image:', error)
        
        if (error.message?.includes('Rate limit')) {
          return new Response(
            JSON.stringify({
              error: 'Rate limit exceeded',
              details: 'Please wait a minute before trying again'
            }),
            {
              status: 429,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        throw error
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action' }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({
        error: 'An unexpected error occurred',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})