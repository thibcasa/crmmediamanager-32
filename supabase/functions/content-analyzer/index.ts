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
    const { content } = await req.json()
    console.log('Analyzing content:', content)

    // Analyze with OpenAI
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en marketing immobilier sur la Côte d'Azur.
            Analyse le contenu fourni et retourne un objet JSON avec:
            - Un score de sentiment (0-1)
            - Une prédiction d'engagement (0-1)
            - Un score de correspondance avec l'audience cible (0-1)
            - Des recommandations d'amélioration`
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.7,
      }),
    })

    const aiResponse = await openAIResponse.json()
    const analysis = JSON.parse(aiResponse.choices[0].message.content)

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in content analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})