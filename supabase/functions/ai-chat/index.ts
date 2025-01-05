import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.1.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, userId } = await req.json();
    console.log('Received request:', { message, userId });

    if (!message) {
      throw new Error('Message is required');
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY'),
    });
    const openai = new OpenAIApi(configuration);

    // Create chat completion
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "Vous êtes un expert en immobilier de luxe sur la Côte d'Azur, spécialisé dans la création de stratégies marketing et la génération de leads qualifiés."
        },
        {
          role: "user",
          content: message
        }
      ],
      temperature: 0.7,
    });

    if (!completion.data.choices || !completion.data.choices[0]) {
      throw new Error('Invalid response from OpenAI');
    }

    const response = {
      content: completion.data.choices[0].message?.content,
      role: 'assistant',
      metadata: {
        model: "gpt-4",
        timestamp: new Date().toISOString(),
        userId: userId
      }
    };

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    // Log the interaction
    await supabaseClient
      .from('automation_logs')
      .insert({
        user_id: userId,
        action_type: 'ai_chat',
        description: message,
        status: 'completed',
        metadata: {
          model: response.metadata.model,
          timestamp: response.metadata.timestamp,
          response: response.content
        }
      });

    return new Response(
      JSON.stringify(response),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );

  } catch (error) {
    console.error('Error in AI chat:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message || "An error occurred processing your request"
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