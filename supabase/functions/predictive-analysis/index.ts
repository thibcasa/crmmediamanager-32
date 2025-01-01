import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { campaignId, action } = await req.json()

    // Mock data for demonstration
    const mockData = {
      conversion: {
        rate: 0.15
      },
      roi: {
        predicted: 2.5
      },
      marketTrends: {
        demandIndex: 75
      },
      recommendations: [
        "Optimisez vos horaires de publication pour maximiser l'engagement",
        "Ajoutez plus de contenu visuel pour augmenter l'interaction",
        "Ciblez plus précisément votre audience dans les Alpes-Maritimes"
      ],
      insights: [
        {
          category: "Engagement",
          description: "Le taux d'engagement est plus élevé le soir",
          impact: 8,
          confidence: 0.85
        },
        {
          category: "Contenu",
          description: "Les posts avec des images de propriétés performent mieux",
          impact: 7,
          confidence: 0.92
        }
      ]
    }

    return new Response(
      JSON.stringify(mockData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})