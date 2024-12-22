import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('Content generator function called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    console.log('Starting content generation...');
    
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      throw new Error('La clé API OpenAI n\'est pas configurée. Veuillez l\'ajouter dans les paramètres.');
    }

    const { type = 'social', prompt, platform = 'linkedin', options = {} } = await req.json();
    
    console.log(`Generating ${type} content for ${platform}`);

    const systemPrompt = `Tu es un expert en stratégie immobilière et marketing digital spécialisé dans les Alpes-Maritimes.
    Ton objectif est de créer du contenu pertinent et professionnel pour les propriétaires de biens immobiliers.
    
    Pour chaque demande, tu dois :
    1. Analyser les tendances du marché local
    2. Créer du contenu adapté à la plateforme ${platform}
    3. Suggérer des actions de prospection
    4. Proposer des critères de ciblage précis`;

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('OpenAI API error:', error);
      
      if (error.includes('invalid_api_key')) {
        throw new Error('La clé API OpenAI est invalide. Veuillez vérifier votre clé sur https://platform.openai.com/api-keys');
      }
      
      throw new Error('Erreur lors de la communication avec l\'API OpenAI. Veuillez réessayer.');
    }

    const data = await response.json();
    console.log('Content generated successfully');

    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in content-generator function:', error);
    
    let errorMessage = "Une erreur est survenue lors de la génération du contenu. Veuillez réessayer.";
    
    if (error.message.includes('API OpenAI')) {
      errorMessage = error.message;
    }
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});