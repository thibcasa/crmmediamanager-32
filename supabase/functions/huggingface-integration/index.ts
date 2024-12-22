import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    let result

    switch (action) {
      case 'generate-image':
        try {
          console.log('Generating image with prompt:', data.prompt)
          const image = await hf.textToImage({
            inputs: data.prompt,
            model: 'stabilityai/stable-diffusion-xl-base-1.0',
            parameters: {
              negative_prompt: "low quality, blurry",
            }
          })
          
          const arrayBuffer = await image.arrayBuffer()
          const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
          result = { image: `data:image/png;base64,${base64}` }
        } catch (imageError) {
          console.error('Image generation error:', imageError)
          if (imageError.message?.includes('Max requests')) {
            return new Response(
              JSON.stringify({ 
                error: 'Limite de requêtes atteinte',
                details: 'Veuillez patienter une minute avant de réessayer.',
                retry_after: 60
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
          throw imageError
        }
        break

      case 'analyze-sentiment':
        const sentiment = await hf.textClassification({
          model: 'SamLowe/roberta-base-go_emotions',
          inputs: data.text
        })
        result = { sentiment }
        break

      case 'classify-lead':
        const classification = await hf.textClassification({
          model: 'facebook/bart-large-mnli',
          inputs: data.description,
          parameters: {
            candidate_labels: [
              "propriétaire motivé",
              "investisseur potentiel",
              "recherche d'information",
              "pas intéressé"
            ]
          }
        })
        result = { classification }
        break

      case 'generate-content':
        const content = await hf.textGeneration({
          model: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
          inputs: `Génère du contenu marketing immobilier professionnel pour ${data.type} avec le message suivant: ${data.prompt}. 
                  Le contenu doit être adapté au marché immobilier des Alpes-Maritimes.`,
          parameters: {
            max_length: 500,
            temperature: 0.7
          }
        })
        result = { content }
        break

      default:
        throw new Error('Action non reconnue')
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Une erreur est survenue', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
