import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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
    const { action, objective, domain, target_audience, count = 3 } = await req.json()
    
    if (action !== 'generate_subjects') {
      throw new Error('Invalid action')
    }

    console.log('Generating subjects for:', { objective, domain, target_audience })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Tu es un expert en marketing immobilier de luxe sur la Côte d'Azur.
            Ta mission est de générer des sujets de contenu marketing ciblés pour les propriétaires
            de biens immobiliers haut de gamme dans les Alpes-Maritimes.
            Concentre-toi sur la valorisation des biens d'exception, les opportunités
            du marché local et l'expertise immobilière de luxe.`
          },
          {
            role: "user",
            content: `Génère ${count} sujets de contenu pour :
            - Objectif: ${objective}
            - Domaine: ${domain}
            - Cible: ${target_audience}
            
            Format de réponse souhaité en JSON:
            {
              "subjects": ["sujet 1", "sujet 2", "sujet 3"]
            }`
          }
        ],
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const subjects = JSON.parse(data.choices[0].message.content).subjects

    return new Response(
      JSON.stringify({ subjects }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in subject generation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})