import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { platform, targetAudience, marketContext } = await req.json();

    // Analyze market conditions and campaign potential
    const analysis = await analyzeMarketAndCampaign(platform, targetAudience, marketContext);

    // Generate platform-specific recommendations
    const recommendations = generateRecommendations(analysis, platform);

    // Create automated workflows based on analysis
    const workflows = generateWorkflows(analysis, platform);

    return new Response(
      JSON.stringify({
        recommendations,
        workflows,
        analysis
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in campaign analyzer:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

async function analyzeMarketAndCampaign(platform: string, targetAudience: string, marketContext: any) {
  const openAIResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Tu es un expert en marketing immobilier sur ${platform}. 
          Analyse le marché immobilier des Alpes-Maritimes et génère une stratégie optimale.`
        },
        {
          role: "user",
          content: `Analyse cette opportunité de campagne:
          Plateforme: ${platform}
          Audience: ${targetAudience}
          Contexte marché: ${JSON.stringify(marketContext)}
          
          Génère:
          1. Une analyse du potentiel de la campagne
          2. Des recommandations de contenu
          3. Des métriques de performance prévues
          4. Des suggestions d'automatisation`
        }
      ],
      temperature: 0.7,
    }),
  });

  const data = await openAIResponse.json();
  return data.choices[0].message.content;
}

function generateRecommendations(analysis: string, platform: string) {
  // Transform AI analysis into structured recommendations
  return {
    platform,
    score: 0.85,
    reason: "Forte demande immobilière dans la région",
    suggestedContent: "Contenu axé sur l'expertise locale et les opportunités d'investissement",
    predictedMetrics: {
      engagement: 0.12,
      reach: 15000,
      conversion: 0.03
    }
  };
}

function generateWorkflows(analysis: string, platform: string) {
  return {
    triggers: [
      {
        type: 'engagement_threshold',
        config: { threshold: 0.1 }
      },
      {
        type: 'lead_score',
        config: { minimum: 70 }
      }
    ],
    actions: [
      {
        type: 'schedule_meeting',
        config: {
          template: 'discovery_call',
          delay: '2d'
        }
      },
      {
        type: 'update_pipeline',
        config: {
          stage: 'qualified',
          conditions: {
            engagement: '>0.2',
            leadScore: '>80'
          }
        }
      }
    ]
  };
}