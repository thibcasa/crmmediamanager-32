import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { action, objective } = await req.json()
    console.log('Received request:', { action, objective })

    if (!objective) {
      throw new Error('Objective is required')
    }

    // Générer les sujets
    const subjects = await generateSubjects(objective)
    console.log('Generated subjects:', subjects)
    
    if (!subjects || subjects.length === 0) {
      throw new Error('No subjects were generated')
    }
    
    // Générer les titres pour chaque sujet
    const titles = await Promise.all(subjects.map(subject => generateTitle(subject)))
    console.log('Generated titles:', titles)
    
    // Générer le contenu pour chaque titre
    const contents = await Promise.all(titles.map(title => generateContent(title)))
    console.log('Generated contents:', contents)
    
    // Générer les visuels pour chaque contenu
    const visuals = await Promise.all(contents.map(content => generateVisual(content)))
    console.log('Generated visuals:', visuals)
    
    // Créer le workflow
    const workflow = await createWorkflow(objective, subjects, titles, contents, visuals)
    console.log('Created workflow:', workflow)
    
    // Créer le pipeline
    const pipeline = await createPipeline(workflow)
    console.log('Created pipeline:', pipeline)
    
    // Générer les prédictions
    const predictions = await generatePredictions(pipeline)
    console.log('Generated predictions:', predictions)
    
    // Générer les suggestions de correction
    const corrections = await generateCorrections(predictions)
    console.log('Generated corrections:', corrections)

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
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function generateSubjects(objective: string): Promise<string[]> {
  try {
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API')
    }

    const subjects = data.choices[0].message.content
      .split('\n')
      .filter(Boolean)
      .map(subject => subject.trim())
      .filter(subject => subject.length > 0)

    if (subjects.length === 0) {
      throw new Error('No valid subjects were generated')
    }

    return subjects
  } catch (error) {
    console.error('Error generating subjects:', error)
    throw error
  }
}

async function generateTitle(subject: string): Promise<string> {
  try {
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API')
    }

    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating title:', error)
    throw error
  }
}

async function generateContent(title: string): Promise<string> {
  try {
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI API')
    }

    return data.choices[0].message.content.trim()
  } catch (error) {
    console.error('Error generating content:', error)
    throw error
  }
}

async function generateVisual(content: string): Promise<string> {
  try {
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

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.data || !data.data[0] || !data.data[0].url) {
      throw new Error('Invalid response format from OpenAI API')
    }

    return data.data[0].url
  } catch (error) {
    console.error('Error generating visual:', error)
    throw error
  }
}

async function createWorkflow(
  objective: string,
  subjects: string[],
  titles: string[],
  contents: string[],
  visuals: string[]
): Promise<any> {
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

async function createPipeline(workflow: any): Promise<any> {
  return {
    stages: [
      { name: 'Idéation', items: workflow.steps[0].data },
      { name: 'Création', items: [...workflow.steps[1].data, ...workflow.steps[2].data] },
      { name: 'Production', items: workflow.steps[3].data },
      { name: 'Publication', items: [] }
    ]
  }
}

async function generatePredictions(pipeline: any): Promise<any> {
  return {
    engagement: Math.random() * 0.3 + 0.6,
    conversion: Math.random() * 0.15 + 0.05,
    roi: Math.random() * 3 + 2
  }
}

async function generateCorrections(predictions: any): Promise<any> {
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