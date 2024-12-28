import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const simulateLinkedInData = () => {
  // Données simulées pour le test
  return {
    engagement: Math.random() * 0.3 + 0.1,
    profiles: Array(10).fill(null).map((_, i) => ({
      id: `simulated-${i}`,
      firstName: `Propriétaire ${i}`,
      lastName: `Test`,
      headline: 'Propriétaire immobilier',
      location: 'Alpes-Maritimes',
      industry: 'Immobilier'
    })),
    metrics: {
      reachEstimate: Math.floor(Math.random() * 1000) + 500,
      potentialLeads: Math.floor(Math.random() * 50) + 20
    }
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, data } = await req.json()
    console.log('LinkedIn integration called with:', { action, data })

    // Simulation mode - pas besoin de vraie connexion LinkedIn
    if (action === 'analyze_profiles') {
      const simulatedData = simulateLinkedInData()
      console.log('Returning simulated data:', simulatedData)
      
      return new Response(
        JSON.stringify(simulatedData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Pour les autres actions, retourner une réponse par défaut
    return new Response(
      JSON.stringify({ message: 'Action non supportée en mode simulation' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in linkedin-integration:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})