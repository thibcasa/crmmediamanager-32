import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, platform, targetAudience } = await req.json();
    console.log('Generating content:', { type, platform, targetAudience });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Simuler la génération de contenu
    const generatedContent = {
      content: [
        {
          type: 'post',
          text: `🏠 Propriétaires dans les Alpes-Maritimes : Découvrez la valeur réelle de votre bien immobilier ! Notre expertise du marché local vous garantit une estimation précise et personnalisée. Contactez-nous pour une évaluation gratuite de votre propriété. #ImmobilierCotedAzur #EstimationGratuite`,
          platform,
          targetAudience,
          metrics: {
            estimatedEngagement: 0.15,
            estimatedReach: 1200,
            estimatedLeads: 8
          }
        }
      ],
      recommendations: [
        "Ajoutez des photos de qualité de biens similaires",
        "Mentionnez des quartiers spécifiques",
        "Incluez des témoignages de propriétaires satisfaits"
      ]
    };

    // Enregistrer dans error_logs pour le monitoring
    await supabaseClient.from('error_logs').insert({
      error_type: 'CONTENT_GENERATION',
      error_message: `Contenu généré pour ${platform}`,
      component: 'content-generator',
      success: true,
      correction_applied: 'Optimisation du message pour le marché local'
    });

    console.log('Content generated:', generatedContent);

    return new Response(
      JSON.stringify(generatedContent),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in content generation:', error);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    await supabaseClient.from('error_logs').insert({
      error_type: 'CONTENT_GENERATION_ERROR',
      error_message: error.message,
      component: 'content-generator',
      success: false
    });

    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});