import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { message, userId } = await req.json()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          persistSession: false
        }
      }
    )

    console.log('Processing message:', message);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `Tu es un expert en marketing immobilier de luxe sur la Côte d'Azur.
            Ton objectif est d'aider à générer du contenu marketing ciblé pour les propriétaires
            de biens immobiliers haut de gamme dans les Alpes-Maritimes.
            
            Pour chaque demande, tu dois:
            1. Analyser l'objectif marketing (prospection, fidélisation, vente)
            2. Identifier le persona cible parmi les propriétaires de biens de luxe
            3. Générer du contenu adapté à LinkedIn qui met en avant:
               - L'expertise du marché immobilier local
               - La valorisation des biens d'exception
               - Les opportunités du marché des Alpes-Maritimes
            4. Suggérer des visuels professionnels qui renforcent le message
            5. Proposer un planning de publication optimal
            6. Mesurer les performances et optimiser la stratégie`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!openAIResponse.ok) {
      throw new Error(`OpenAI API error: ${openAIResponse.statusText}`);
    }

    const aiContent = await openAIResponse.json()
    const generatedContent = aiContent.choices[0].message.content

    // Log interaction in automation_logs
    await supabaseClient.from('automation_logs').insert({
      user_id: userId,
      action_type: 'ai_chat_interaction',
      description: 'Chat interaction with AI assistant',
      metadata: {
        user_message: message,
        ai_response: generatedContent
      }
    })

    console.log('Generated response:', generatedContent);

    return new Response(
      JSON.stringify({ content: generatedContent }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in AI chat:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})