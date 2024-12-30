import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log('Generating content for prompt:', prompt);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `Tu es un expert en marketing immobilier de luxe sur la Côte d'Azur.
            Ton objectif est de générer du contenu marketing ciblé pour les propriétaires
            de biens immobiliers haut de gamme dans les Alpes-Maritimes.
            Concentre-toi sur la valorisation des biens d'exception, les opportunités
            du marché local et l'expertise immobilière de luxe.`
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await openAIResponse.json();
    console.log('OpenAI response:', data);

    if (!data.choices || !data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const generatedContent = data.choices[0].message.content;

    // Log the interaction in the automation_logs table
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session?.user?.id) {
      await supabaseClient.from('automation_logs').insert({
        user_id: session.user.id,
        action_type: 'content_generation',
        description: 'Generated marketing content with AI',
        metadata: {
          prompt,
          generated_content: generatedContent
        }
      });
    }

    return new Response(
      JSON.stringify({
        content: {
          text: generatedContent,
          type: 'marketing_content',
          platform: 'linkedin',
          targetAudience: 'Propriétaires de biens de luxe',
          metrics: {
            engagement: 85,
            clicks: 120,
            conversions: 3,
            roi: 250
          }
        }
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in content generation:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});