import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  to: string[]
  subject: string
  html: string
}

serve(async (req) => {
  console.log("📧 Nouvelle requête d'envoi d'email reçue");
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, subject, html } = await req.json() as EmailRequest
    console.log("📧 Destinataires:", to);
    console.log("📧 Objet:", subject);
    console.log("📧 Contenu HTML:", html);

    if (!to || !subject || !html) {
      console.error("❌ Champs requis manquants");
      throw new Error('Champs requis manquants')
    }

    const SENDINBLUE_API_KEY = Deno.env.get('SENDINBLUE_API_KEY')
    if (!SENDINBLUE_API_KEY) {
      console.error("❌ Clé API SendinBlue manquante");
      throw new Error('Clé API SendinBlue manquante')
    }

    console.log("🔄 Envoi de la requête à SendinBlue...");
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
        to: to.map(email => ({ email })),
        subject,
        htmlContent: html,
        tags: ['estimation'],
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error("❌ Erreur SendinBlue:", error);
      throw new Error(`Erreur d'envoi: ${error}`)
    }

    const result = await response.json()
    console.log("✅ Email envoyé avec succès:", result);

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error("❌ Erreur dans la fonction d'envoi d'email:", error.message);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})