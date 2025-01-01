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

    if (!campaignId || !action) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters: campaignId or action' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        },
      )
    }

    // Mock data that matches our complete PredictionResponse interface
    const mockData = {
      conversion: {
        rate: 15,
        confidence: 0.85
      },
      roi: {
        predicted: 2.5,
        bestCase: 3.2,
        worstCase: 1.8
      },
      marketTrends: {
        demandIndex: 0.75,
        seasonalityImpact: 0.12
      },
      trends: [
        { date: '2024-01', value: 120 },
        { date: '2024-02', value: 150 },
        { date: '2024-03', value: 180 }
      ],
      engagement: {
        rate: 22,
        confidence: 0.9,
        trends: [
          { date: '2024-01', value: 85 },
          { date: '2024-02', value: 92 },
          { date: '2024-03', value: 98 }
        ]
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

    switch (action) {
      case 'analyze_performance':
        return new Response(
          JSON.stringify(mockData),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      case 'generate_suggestions':
        return new Response(
          JSON.stringify({ ...mockData, recommendations: mockData.recommendations }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          },
        )
      default:
        return new Response(
          JSON.stringify({ error: 'Invalid action specified' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          },
        )
    }
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