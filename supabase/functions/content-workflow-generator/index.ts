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
    const { action, objective } = await req.json()
    console.log('Received request:', { action, objective })

    // Générer les sujets
    const subjects = await generateSubjects(objective)
    
    // Générer les titres pour chaque sujet
    const titles = await Promise.all(subjects.map(subject => generateTitle(subject)))
    
    // Générer le contenu pour chaque titre
    const contents = await Promise.all(titles.map(title => generateContent(title)))
    
    // Générer les visuels pour chaque contenu
    const visuals = await Promise.all(contents.map(content => generateVisual(content)))
    
    // Créer le workflow
    const workflow = await createWorkflow(objective, subjects, titles, contents, visuals)
    
    // Créer le pipeline
    const pipeline = await createPipeline(workflow)
    
    // Générer les prédictions
    const predictions = await generatePredictions(pipeline)
    
    // Générer les suggestions de correction
    const corrections = await generateCorrections(predictions)

    const result = {
      subjects,
      titles,
      contents,
      visuals,
      workflow,
      pipeline,
      predictions,
      corrections
    }

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error in workflow generation:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function generateSubjects(objective: string) {
  const prompt = `En tant qu'expert immobilier sur la Côte d'Azur, générez 3 sujets pertinents pour : ${objective}`
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Vous êtes un expert en immobilier de luxe sur la Côte d'Azur." },
        { role: "user", content: prompt }
      ]
    })
  })

  const data = await response.json()
  return data.choices[0].message.content.split('\n').filter(Boolean)
}

async function generateTitle(subject: string) {
  const prompt = `Créez un titre SEO optimisé pour ce sujet immobilier : ${subject}`
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Vous êtes un expert SEO immobilier." },
        { role: "user", content: prompt }
      ]
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}

async function generateContent(title: string) {
  const prompt = `Rédigez un article immobilier optimisé SEO pour ce titre : ${title}`
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Vous êtes un rédacteur web spécialisé en immobilier." },
        { role: "user", content: prompt }
      ]
    })
  })

  const data = await response.json()
  return data.choices[0].message.content
}

async function generateVisual(content: string) {
  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt: `Une image professionnelle pour illustrer ce contenu immobilier : ${content.substring(0, 300)}`,
      n: 1,
      size: "1024x1024"
    })
  })

  const data = await response.json()
  return data.data[0].url
}

async function createWorkflow(
  objective: string,
  subjects: string[],
  titles: string[],
  contents: string[],
  visuals: string[]
) {
  return {
    objective,
    steps: [
      { type: 'subject', data: subjects, status: 'completed' },
      { type: 'title', data: titles, status: 'completed' },
      { type: 'content', data: contents, status: 'completed' },
      { type: 'creative', data: visuals, status: 'completed' }
    ]
  }
}

async function createPipeline(workflow: any) {
  return {
    stages: [
      { name: 'Idéation', items: workflow.steps[0].data },
      { name: 'Création', items: [...workflow.steps[1].data, ...workflow.steps[2].data] },
      { name: 'Production', items: workflow.steps[3].data },
      { name: 'Publication', items: [] }
    ]
  }
}

async function generatePredictions(pipeline: any) {
  return {
    engagement: Math.random() * 0.3 + 0.6,
    conversion: Math.random() * 0.15 + 0.05,
    roi: Math.random() * 3 + 2
  }
}

async function generateCorrections(predictions: any) {
  return {
    suggestions: [
      "Ajouter plus de mots-clés ciblés dans les titres",
      "Inclure plus d'images de qualité",
      "Optimiser les heures de publication"
    ],
    impact: {
      engagement: "+15%",
      conversion: "+8%",
      roi: "+25%"
    }
  }
}