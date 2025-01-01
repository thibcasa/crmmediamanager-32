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
    const { action, subject, tone, targetAudience, propertyType, count = 3 } = await req.json()
    
    if (action !== 'generate_titles' && action !== 'generate_subjects') {
      throw new Error('Invalid action')
    }

    if (action === 'generate_titles') {
      console.log('Generating titles for:', { subject, tone, targetAudience, propertyType })

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
              Ta mission est de générer des titres accrocheurs pour du contenu marketing
              ciblant les propriétaires de biens immobiliers haut de gamme dans les Alpes-Maritimes.
              Les titres doivent être optimisés SEO et adaptés au ton et à l'audience cible.`
            },
            {
              role: "user",
              content: `Génère ${count} titres accrocheurs pour :
              - Sujet: ${subject}
              - Ton: ${tone}
              - Public cible: ${targetAudience}
              - Type de bien: ${propertyType}
              
              Format de réponse souhaité en JSON:
              {
                "titles": ["titre 1", "titre 2", "titre 3"]
              }`
            }
          ],
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      const titles = JSON.parse(data.choices[0].message.content).titles

      return new Response(
        JSON.stringify({ titles }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Subject generation logic
    if (action === 'generate_subjects') {
      console.log('Generating subjects for:', { subject })

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
              de biens immobiliers haut de gamme dans les Alpes-Maritimes.`
            },
            {
              role: "user",
              content: `Génère 3 sujets de contenu pour le sujet suivant : ${subject}`
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
    }
  } catch (error) {
    console.error('Error in content generation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
