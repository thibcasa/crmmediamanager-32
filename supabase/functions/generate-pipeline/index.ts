import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: { user } } = await supabaseClient.auth.getUser(
      req.headers.get('Authorization')?.split('Bearer ')[1] ?? ''
    )

    if (!user) {
      throw new Error('Not authenticated')
    }

    // Création des étapes du pipeline par défaut
    const { data: stages, error: stagesError } = await supabaseClient
      .from('pipeline_stages')
      .insert([
        {
          name: 'Nouveau contact',
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
          name: 'Rendez-vous planifié',
          order_index: 2,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['meeting_scheduled'],
        },
        {
          name: 'Proposition',
          order_index: 3,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['proposal_sent'],
        },
        {
          name: 'Négociation',
          order_index: 4,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['follow_up_call'],
        },
        {
          name: 'Gagné',
          order_index: 5,
          user_id: user.id,
          automation_rules: [],
          required_actions: ['contract_signed'],
        }
      ])
      .select()

    if (stagesError) throw stagesError

    // Création des automatisations par défaut
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
            },
            {
              type: 'update_pipeline_stage',
              config: {
                from_stage: null,
                to_stage: stages[0].id
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
            stage_id: stages[1].id,
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
            },
            {
              type: 'update_pipeline_stage',
              config: {
                from_stage: stages[1].id,
                to_stage: stages[2].id
              }
            }
          ],
          is_active: true
        }
      ])
      .select()

    if (automationsError) throw automationsError

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