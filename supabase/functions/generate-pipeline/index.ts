import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Authenticate user
    const authHeader = req.headers.get('Authorization')?.split('Bearer ')[1]
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(authHeader)
    if (userError || !user) {
      throw new Error('Not authenticated')
    }

    console.log('Creating pipeline stages for user:', user.id)

    // Create default pipeline stages
    const { data: stages, error: stagesError } = await supabaseClient
      .from('pipeline_stages')
      .insert([
        {
          name: 'Premier contact',
          order_index: 0,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['qualification_call'],
        },
        {
          name: 'Qualification',
          order_index: 1,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['property_evaluation'],
        },
        {
          name: 'Proposition',
          order_index: 2,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['proposal_sent'],
        },
        {
          name: 'Négociation',
          order_index: 3,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['follow_up_call'],
        },
        {
          name: 'Signature',
          order_index: 4,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['contract_signed'],
        }
      ])
      .select()

    if (stagesError) {
      console.error('Error creating stages:', stagesError)
      throw stagesError
    }

    console.log('Creating automations for user:', user.id)

    // Create default automations
    const { data: automations, error: automationsError } = await supabaseClient
      .from('automations')
      .insert([
        {
          user_id: user.id,
          name: 'Email de bienvenue',
          trigger_type: 'lead_created',
          trigger_config: { delay: 0 },
          actions: [
            {
              type: 'send_email',
              template: 'welcome',
              config: {
                subject: 'Bienvenue chez Estimation Express',
                content: 'Merci de nous faire confiance pour votre projet immobilier.'
              }
            }
          ],
          is_active: true
        },
        {
          user_id: user.id,
          name: 'Suivi après qualification',
          trigger_type: 'pipeline_stage_changed',
          trigger_config: {
            delay: 24
          },
          actions: [
            {
              type: 'send_email',
              template: 'follow_up',
              config: {
                subject: 'Suivi de notre conversation',
                content: 'Suite à notre échange, je souhaite faire le point sur votre projet.'
              }
            }
          ],
          is_active: true
        },
        {
          user_id: user.id,
          name: 'Rappel rendez-vous',
          trigger_type: 'meeting_scheduled',
          trigger_config: { delay: 24 },
          actions: [
            {
              type: 'send_email',
              template: 'meeting_reminder',
              config: {
                subject: 'Rappel de notre rendez-vous',
                content: 'Je vous rappelle notre rendez-vous prévu demain.'
              }
            }
          ],
          is_active: true
        }
      ])
      .select()

    if (automationsError) {
      console.error('Error creating automations:', automationsError)
      throw automationsError
    }

    return new Response(
      JSON.stringify({ success: true, stages, automations }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})