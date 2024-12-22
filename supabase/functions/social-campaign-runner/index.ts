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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Fetch active campaigns
    const { data: campaigns, error: campaignError } = await supabaseClient
      .from('social_campaigns')
      .select('*')
      .eq('status', 'active');

    if (campaignError) throw campaignError;

    console.log('Processing campaigns:', campaigns?.length);

    // Process each campaign
    for (const campaign of campaigns || []) {
      console.log(`Processing campaign: ${campaign.name}`);
      
      // Here we would integrate with social media APIs
      // For now, we'll just log the action
      console.log(`Would process ${campaign.platform} campaign with targeting:`, campaign.targeting_criteria);
      
      // Create leads with GDPR compliance
      const { error: leadError } = await supabaseClient
        .from('leads')
        .insert({
          first_name: 'Test',
          last_name: 'Lead',
          email: `test${Date.now()}@example.com`,
          source: campaign.platform,
          source_platform: campaign.platform,
          source_campaign: campaign.name,
          gdpr_consent: true,
          gdpr_consent_date: new Date().toISOString(),
          persona_type: 'property_owner',
          user_id: campaign.user_id,
          consent_details: {
            source: campaign.platform,
            campaign_id: campaign.id,
            consent_type: 'implied',
            terms_version: '1.0'
          }
        });

      if (leadError) throw leadError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Campaigns processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in social-campaign-runner:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});