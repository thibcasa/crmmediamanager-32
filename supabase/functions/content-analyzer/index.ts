import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { content } = await req.json()
    console.log('Analyzing content:', content)

    // Basic content analysis
    const analysis = {
      criteria: {
        propertyType: content.toLowerCase().includes('appartement') ? 'apartment' : 'house',
        budget: content.toLowerCase().includes('luxe') ? 'high' : 'medium',
        location: 'Alpes-Maritimes',
        sellerProfile: content.toLowerCase().includes('investissement') ? 'investor' : 'owner',
      },
      metrics: {
        clarity: 0.85,
        relevance: 0.9,
        engagement: 0.8
      },
      recommendations: [
        'Focus on property value appreciation',
        'Highlight local market expertise',
        'Emphasize personalized service'
      ]
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )

  } catch (error) {
    console.error('Error in content analysis:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})