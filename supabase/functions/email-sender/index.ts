import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SENDINBLUE_API_KEY = Deno.env.get("SENDINBLUE_API_KEY");

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

    const SENDINBLUE_API_KEY = Deno.env.get('SENDINBLUE_API_KEY')
    if (!SENDINBLUE_API_KEY) {
      throw new Error('Clé API SendinBlue manquante')
    }

    const response = await fetch('https://api.sendinblue.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': SENDINBLUE_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "Estimation Express",
          email: "contact@estimationexpress.com"
        },
        to: [{ email: to }],
        subject,
        htmlContent: html,
        tags: ['estimation'],
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