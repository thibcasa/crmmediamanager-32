import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string
  subject: string
  html: string
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json() as EmailRequest

    if (!to || !subject || !html) {
      throw new Error('Champs requis manquants')
    }

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    if (!RESEND_API_KEY) {
      throw new Error('Clé API Resend manquante')
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Property Prospect AI <contact@votredomaine.fr>', // Remplacez par votre domaine vérifié
        to,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, ''), // Version texte pour meilleure délivrabilité
        tags: [{ name: 'type', value: 'prospection' }],
        headers: {
          'List-Unsubscribe': '<{{unsubscribe}}>', // Requis par la loi française
          'Content-Language': 'fr-FR'
        }
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`Erreur d'envoi: ${error}`)
    }

    const result = await response.json()

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Erreur dans la fonction d'envoi d'email:", error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})