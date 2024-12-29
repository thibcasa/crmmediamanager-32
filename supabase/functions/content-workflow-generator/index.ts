import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { subject, platform, contentType } = await req.json()
    console.log('Generating content for:', { subject, platform, contentType })

    // 1. Generate SEO titles
    const seoTitlesResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: `Tu es un expert en SEO et en Clickbait dans les résultats de recherche des moteurs comme Google.
            Utilise tes connaissances dans ces domaines pour proposer 3 titres pour ce sujet.`
          },
          {
            role: "user",
            content: subject
          }
        ],
        temperature: 0.7
      }),
    })

    const seoTitlesData = await seoTitlesResponse.json()
    const seoTitles = seoTitlesData.choices[0].message.content.split('\n')

    // 2. Generate optimized content
    const contentPrompt = `Tu es un expert Social Media et tu maitrises toutes les compétences nécessaires pour mener
    une stratégie réseaux sociaux rentable. Tu maitrises également toutes les bonnes pratiques
    en community management.
    
    Tu es un expert du réseau social ${platform} et tu connais toutes les bonnes
    pratiques à suivre pour générer de l'engagement et de la viralité.
    
    Pour la forme de contenu "${contentType}", je souhaite que tu me proposes le meilleur format de publication à exploiter
    en fonction du sujet "${subject}". Tu rédigeras le contenu parfait en prenant bien soin
    d'intégrer une incitation à l'action et les hashtags les plus pertinents.`

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
            content: contentPrompt
          },
          {
            role: "user",
            content: `Génère le contenu pour le titre: ${seoTitles[0]}`
          }
        ],
        temperature: 0.7
      }),
    })

    const contentData = await contentResponse.json()
    const generatedContent = contentData.choices[0].message.content

    // 3. Generate image prompt
    const imagePromptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: "Tu es un expert en génération d'images par IA. Crée une description détaillée pour générer une image professionnelle et attrayante."
          },
          {
            role: "user",
            content: `Crée une description détaillée pour une image qui illustrera ce contenu: ${seoTitles[0]}`
          }
        ],
        temperature: 0.7
      }),
    })

    const imagePromptData = await imagePromptResponse.json()
    const imagePrompt = imagePromptData.choices[0].message.content

    // 4. Generate the image with DALL-E
    const imageResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: `Professional real estate photo: ${imagePrompt}`,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        style: "natural"
      }),
    })

    const imageData = await imageResponse.json()

    return new Response(
      JSON.stringify({
        seoTitles,
        content: generatedContent,
        imageUrl: imageData.data[0].url,
        imagePrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in content workflow generation:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})