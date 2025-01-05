import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { OpenAI } from "https://deno.land/x/openai@v4.20.1/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { objective, goalType, mandateGoal, frequency } = await req.json();
    console.log('Received request:', { objective, goalType, mandateGoal, frequency });

    if (!objective) {
      throw new Error('Objective is required');
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get('OPENAI_API_KEY') || '',
    });

    // Generate content strategy based on objective
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert in real estate marketing for the French Riviera.
                   Generate an optimized content strategy in JSON format with the following structure:
                   {
                     "template": "message template",
                     "posts": [{"content": "post content", "type": "post type"}],
                     "seoTitles": ["title 1", "title 2"],
                     "hashtags": ["hashtag1", "hashtag2"]
                   }`
        },
        {
          role: "user",
          content: `Create a content strategy for: ${objective}
                   Type d'objectif: ${goalType}
                   ${mandateGoal ? `Objectif de mandats: ${mandateGoal} par ${frequency}` : ''}`
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!completion.choices[0].message?.content) {
      throw new Error('Invalid response from OpenAI');
    }

    // Parse the JSON response
    const strategy = JSON.parse(completion.choices[0].message.content);

    // Log the generated strategy
    console.log('Generated strategy:', strategy);

    return new Response(JSON.stringify(strategy), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in content-workflow-generator:', error);
    
    // Return a properly formatted error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});