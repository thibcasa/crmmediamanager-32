import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message } = await req.json()
    console.log('Analyzing campaign message:', message)

    const analysis = {
      engagement: 0.85,
      clickRate: 0.125,
      conversionRate: 0.032,
      cpa: 15,
      roi: 2.5,
      recommendations: [
        "Optimisez le ciblage géographique",
        "Précisez le type de bien immobilier",
        "Ajoutez des témoignages clients"
      ],
      risks: [
        "Coût par acquisition à surveiller",
        "Ciblage à affiner"
      ],
      opportunities: [
        "Fort potentiel d'engagement",
        "Zone géographique attractive"
      ],
      audienceInsights: {
        segments: [
          { name: "Propriétaires 45-65 ans", score: 0.85, potential: 0.92 },
          { name: "Investisseurs", score: 0.75, potential: 0.88 },
          { name: "Résidents locaux", score: 0.65, potential: 0.78 }
        ],
        demographics: {
          age: ["45-54", "55-65"],
          location: ["Nice", "Cannes", "Antibes"],
          interests: ["Immobilier", "Investissement", "Luxe"]
        }
      },
      predictedMetrics: {
        leadsPerWeek: 12,
        costPerLead: 45,
        totalBudget: 2000,
        revenueProjection: 15000
      },
      campaignDetails: {
        creatives: [
          { type: "image", content: "Vue mer panoramique", performance: 0.88 },
          { type: "video", content: "Visite virtuelle", performance: 0.92 },
          { type: "text", content: "Description détaillée", performance: 0.75 }
        ],
        content: {
          messages: [
            "Valorisez votre bien immobilier sur la Côte d'Azur",
            "Expertise locale pour une vente optimale"
          ],
          headlines: [
            "Estimation gratuite de votre propriété",
            "Vendez au meilleur prix"
          ],
          callsToAction: [
            "Demandez une estimation",
            "Contactez un expert"
          ]
        },
        workflow: {
          steps: [
            { name: "Analyse du marché", status: "completed" },
            { name: "Création des visuels", status: "in_progress" },
            { name: "Lancement campagne", status: "pending" }
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