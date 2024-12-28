import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, iterationCount = 1, previousResults } = await req.json()
    console.log('Analyzing campaign message:', message, 'Iteration:', iterationCount)

    // Simulate improvement based on iteration count
    const iterationMultiplier = 1 + (iterationCount * 0.15)
    const baseEngagement = previousResults ? previousResults.engagement : 0.5

    const analysis = {
      engagement: Math.min((baseEngagement + 0.1) * iterationMultiplier, 1),
      clickRate: Math.min(0.125 * iterationMultiplier, 0.25),
      conversionRate: Math.min(0.032 * iterationMultiplier, 0.08),
      cpa: Math.max(15 / iterationMultiplier, 8),
      roi: Math.min(2.5 * iterationMultiplier, 5),
      recommendations: [
        "Optimisez le ciblage géographique sur les Alpes-Maritimes",
        "Ajoutez des témoignages de propriétaires satisfaits",
        "Incluez des statistiques sur le marché local"
      ],
      risks: [
        "Coût par acquisition à optimiser",
        "Ciblage à affiner pour les propriétaires premium"
      ],
      opportunities: [
        "Fort potentiel d'engagement sur LinkedIn",
        "Zone géographique attractive pour l'immobilier"
      ],
      audienceInsights: {
        segments: [
          { 
            name: "Propriétaires 45-65 ans", 
            score: Math.min(0.85 * iterationMultiplier, 1), 
            potential: Math.min(0.92 * iterationMultiplier, 1) 
          },
          { 
            name: "Investisseurs", 
            score: Math.min(0.75 * iterationMultiplier, 1), 
            potential: Math.min(0.88 * iterationMultiplier, 1) 
          }
        ],
        demographics: {
          age: ["45-54", "55-65"],
          location: ["Nice", "Cannes", "Antibes"],
          interests: ["Immobilier", "Investissement", "Luxe"]
        }
      },
      predictedMetrics: {
        leadsPerWeek: Math.floor(12 * iterationMultiplier),
        costPerLead: Math.max(45 / iterationMultiplier, 25),
        totalBudget: 2000,
        revenueProjection: Math.floor(15000 * iterationMultiplier)
      },
      campaignDetails: {
        creatives: [
          { 
            type: "image", 
            content: "Vue mer panoramique", 
            performance: Math.min(0.88 * iterationMultiplier, 1) 
          },
          { 
            type: "video", 
            content: "Visite virtuelle", 
            performance: Math.min(0.92 * iterationMultiplier, 1) 
          }
        ],
        content: {
          messages: [
            "Valorisez votre bien immobilier sur la Côte d'Azur",
            "Expertise locale pour une vente optimale",
            "Webinaire gratuit : Maximisez votre investissement immobilier"
          ],
          headlines: [
            "Webinaire Immobilier Alpes-Maritimes",
            "Optimisez votre Patrimoine"
          ],
          callsToAction: [
            "Inscrivez-vous au webinaire",
            "Réservez votre place"
          ]
        }
      }
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
    console.error('Error analyzing campaign:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    )
  }
})