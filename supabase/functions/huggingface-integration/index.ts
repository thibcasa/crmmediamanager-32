import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Configuration des limites
const RATE_LIMIT_WINDOW = 60000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3 // Limite HuggingFace
const requestTimestamps: number[] = []

function isRateLimited(): boolean {
  const now = Date.now()
  // Nettoyer les anciennes requêtes
  while (requestTimestamps.length > 0 && requestTimestamps[0] < now - RATE_LIMIT_WINDOW) {
    requestTimestamps.shift()
  }
  return requestTimestamps.length >= MAX_REQUESTS_PER_WINDOW
}

serve(async (req) => {
  // Gestion CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Vérification des limites
    if (isRateLimited()) {
      console.log('Limite de requêtes atteinte')
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          details: 'Veuillez patienter une minute',
          retryAfter: 60
        }),
        {
          status: 429,
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          }
        }
      )
    }

    const { prompt } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    try {
      console.log('Génération d\'image pour:', prompt)
      const image = await hf.textToImage({
        inputs: prompt,
        model: "stabilityai/stable-diffusion-xl-base-1.0",
      })

      // Ajout du timestamp pour le rate limiting
      requestTimestamps.push(Date.now())

      // Conversion en base64
      const arrayBuffer = await image.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))

      return new Response(
        JSON.stringify({ image: `data:image/png;base64,${base64}` }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )

    } catch (error) {
      console.error('Erreur HuggingFace:', error)
      
      if (error.message?.includes('Rate limit') || error.message?.includes('Max requests')) {
        return new Response(
          JSON.stringify({
            error: 'Rate limit exceeded',
            details: 'Limite HuggingFace atteinte',
            retryAfter: 60
          }),
          {
            status: 429,
            headers: { 
              ...corsHeaders, 
              'Content-Type': 'application/json',
              'Retry-After': '60'
            }
          }
        )
      }

      throw error
    }

  } catch (error) {
    console.error('Erreur générale:', error)
    return new Response(
      JSON.stringify({
        error: 'Erreur inattendue',
        details: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})