import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { campaignConfig } = await req.json()
    console.log('Received campaign config:', campaignConfig)

    // 1. Créer la campagne et ses automatisations
    const { data: campaign, error: campaignError } = await supabaseClient
      .from('social_campaigns')
      .insert({
        persona_id: campaignConfig.persona_id,
        target_locations: campaignConfig.locations,
        platform: campaignConfig.platforms[0],
        name: `Campagne ${campaignConfig.platforms[0]} - ${new Date().toLocaleDateString()}`,
        status: 'draft',
        target_metrics: campaignConfig.objectives
      })
      .select()
      .single()

    if (campaignError) throw campaignError

    // 2. Générer le contenu initial avec OpenAI
    const contentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Tu es un expert en marketing immobilier et en création de contenu pour les réseaux sociaux.
            Génère du contenu optimisé pour ${campaignConfig.platforms[0]} ciblant des propriétaires immobiliers
            dans la région des Alpes-Maritimes.`
          },
          {
            role: "user",
            content: campaignConfig.subject
          }
        ],
      }),
    })

    const contentData = await contentResponse.json()
    const generatedContent = contentData.choices[0].message.content

    // 3. Générer l'image avec DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Professional real estate photo for social media: ${campaignConfig.subject}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    })

    const imageData = await imageResponse.json()

    // 4. Mettre à jour la campagne avec le contenu généré
    const { error: updateError } = await supabaseClient
      .from('social_campaigns')
      .update({
        message_template: generatedContent,
        posts: [{
          content: generatedContent,
          image_url: imageData.data[0].url,
          status: 'draft',
          scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }]
      })
      .eq('id', campaign.id)

    if (updateError) throw updateError

    // 5. Configurer les automatisations de suivi
    const { error: automationError } = await supabaseClient
      .from('automations')
      .insert({
        name: `Suivi ${campaign.name}`,
        user_id: campaignConfig.user_id,
        trigger_type: 'campaign_engagement',
        trigger_config: {
          campaign_id: campaign.id,
          thresholds: campaignConfig.objectives
        },
        actions: [
          {
            type: 'analyze_performance',
            config: {
              metrics: ['engagement', 'conversion', 'roi'],
              frequency: 'daily'
            }
          },
          {
            type: 'optimize_content',
            config: {
              platform: campaignConfig.platforms[0],
              target_audience: "propriétaires immobiliers"
            }
          }
        ],
        is_active: true
      })

    if (automationError) throw automationError

    return new Response(
      JSON.stringify({ 
        success: true,
        campaign,
        content: generatedContent,
        image_url: imageData.data[0].url
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in campaign orchestration:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})