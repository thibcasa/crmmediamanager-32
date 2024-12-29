import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { objective, type } = await req.json()
    console.log(`Analyzing workflow of type ${type}:`, objective)

    let analysis
    switch (type) {
      case 'nurturing_strategy':
        analysis = {
          recommendedSteps: [
            {
              stage: 'awareness',
              content: ['market_insights', 'educational_content'],
              timing: { delay: '0d', frequency: 'weekly' }
            },
            {
              stage: 'consideration',
              content: ['success_stories', 'property_valuations'],
              timing: { delay: '14d', frequency: 'bi-weekly' }
            },
            {
              stage: 'decision',
              content: ['personalized_offers', 'market_analysis'],
              timing: { delay: '30d', frequency: 'weekly' }
            }
          ],
          optimizationRules: {
            engagement_threshold: 0.4,
            acceleration_triggers: ['high_engagement', 'property_search'],
            deceleration_triggers: ['low_engagement', 'unsubscribe_risk']
          }
        }
        break

      case 'timing_optimization':
        analysis = {
          bestTimes: {
            email: ['10:00', '15:00', '18:00'],
            social: ['09:00', '12:00', '17:00'],
            retargeting: ['19:00', '20:00']
          },
          frequencyAdjustments: {
            high_engagement: 'increase',
            low_engagement: 'decrease',
            neutral: 'maintain'
          }
        }
        break

      default:
        throw new Error('Unknown analysis type')
    }

    return new Response(
      JSON.stringify(analysis),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in workflow analysis:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})