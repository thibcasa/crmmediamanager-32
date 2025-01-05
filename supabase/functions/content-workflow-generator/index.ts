import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { corsHeaders } from './utils/cors.ts';
import { 
  generateSubjects, 
  generateTitle, 
  generateContent, 
  generateVisual 
} from './utils/generators.ts';

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('Starting content workflow generation');
    const { action, objective } = await req.json()
    
    if (!objective) {
      throw new Error('Objective is required')
    }

    // Generate subjects
    const subjects = await generateSubjects(objective)
    console.log('Generated subjects:', subjects)
    
    // Generate titles
    const titles = await Promise.all(subjects.map(subject => generateTitle(subject)))
    console.log('Generated titles:', titles)
    
    // Generate content
    const contents = await Promise.all(titles.map(title => generateContent(title)))
    console.log('Generated content count:', contents.length)
    
    // Generate visuals
    const visuals = await Promise.all(contents.map(content => generateVisual(content)))
    console.log('Generated visuals count:', visuals.length)
    
    // Create workflow and pipeline
    const workflow = {
      objective,
      steps: [
        { type: 'subject', data: subjects, status: 'completed' },
        { type: 'title', data: titles, status: 'completed' },
        { type: 'content', data: contents, status: 'completed' },
        { type: 'creative', data: visuals, status: 'completed' }
      ]
    }

    const pipeline = {
      stages: [
        { name: 'Idéation', items: subjects },
        { name: 'Création', items: [...titles, ...contents] },
        { name: 'Production', items: visuals },
        { name: 'Publication', items: [] }
      ]
    }

    // Generate predictions
    const predictions = {
      engagement: Math.random() * 0.3 + 0.6,
      conversion: Math.random() * 0.15 + 0.05,
      roi: Math.random() * 3 + 2
    }

    // Generate corrections
    const corrections = {
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