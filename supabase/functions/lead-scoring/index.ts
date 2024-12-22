import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface LeadData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  source: string;
  status: string;
  notes?: string;
  last_contact_date: string;
  source_platform?: string;
  source_campaign?: string;
  persona_type?: string;
}

async function calculateBaseScore(lead: LeadData): Promise<number> {
  let score = 50; // Score de base

  // Scoring basé sur les informations de contact
  if (lead.email) score += 10;
  if (lead.phone) score += 15;
  
  // Bonus pour les leads récents
  const daysSinceLastContact = Math.floor((Date.now() - new Date(lead.last_contact_date).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSinceLastContact < 7) score += 20;
  else if (daysSinceLastContact < 30) score += 10;

  // Bonus pour les sources prioritaires
  if (lead.source === 'referral') score += 25;
  if (lead.source === 'linkedin') score += 20;
  if (lead.source === 'website') score += 15;

  // Ajustement selon le persona
  if (lead.persona_type === 'property_owner') score += 20;
  if (lead.persona_type === 'investor') score += 25;

  return Math.min(100, Math.max(0, score));
}

async function analyzeLeadWithAI(lead: LeadData): Promise<{ 
  correctedData: Partial<LeadData>;
  suggestedScore: number;
  confidence: number;
}> {
  const prompt = `Analyze this real estate lead and suggest corrections and a score (0-100):
  Name: ${lead.first_name} ${lead.last_name}
  Email: ${lead.email}
  Phone: ${lead.phone || 'Not provided'}
  Source: ${lead.source}
  Notes: ${lead.notes || 'No notes'}
  Persona: ${lead.persona_type || 'Unknown'}

  Please analyze for:
  1. Data quality and suggested corrections
  2. Lead potential score (0-100)
  3. Confidence in assessment (0-100)

  Format response as JSON with keys: correctedData, suggestedScore, confidence`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an AI expert in real estate lead qualification and data quality analysis. Provide responses in JSON format only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    }),
  });

  const data = await response.json();
  try {
    const analysis = JSON.parse(data.choices[0].message.content);
    return {
      correctedData: analysis.correctedData || {},
      suggestedScore: analysis.suggestedScore || 50,
      confidence: analysis.confidence || 0,
    };
  } catch (error) {
    console.error("Error parsing AI response:", error);
    return {
      correctedData: {},
      suggestedScore: 50,
      confidence: 0,
    };
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lead } = await req.json();
    
    // Calcul du score de base
    const baseScore = await calculateBaseScore(lead);
    
    // Analyse et correction par l'IA
    const aiAnalysis = await analyzeLeadWithAI(lead);
    
    // Score final pondéré
    const finalScore = Math.round(
      (baseScore * 0.6) + (aiAnalysis.suggestedScore * 0.4)
    );

    // Mise à jour du lead dans la base de données
    const supabaseAdmin = await fetch(`${SUPABASE_URL}/rest/v1/leads?id=eq.${lead.id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        score: finalScore,
        ...aiAnalysis.correctedData
      })
    });

    if (!supabaseAdmin.ok) {
      throw new Error('Failed to update lead score');
    }

    return new Response(
      JSON.stringify({
        score: finalScore,
        baseScore,
        aiAnalysis,
        corrections: aiAnalysis.correctedData
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in lead-scoring function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});