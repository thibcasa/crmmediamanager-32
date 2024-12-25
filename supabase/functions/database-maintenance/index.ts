import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // 1. Monitor query performance
    const { data: slowQueries, error: queryError } = await supabaseClient.rpc('get_slow_queries');
    if (queryError) throw queryError;
    console.log('Slow queries detected:', slowQueries);

    // 2. Check index usage
    const { data: unusedIndexes, error: indexError } = await supabaseClient
      .from('pg_stat_user_indexes')
      .select('*')
      .eq('idx_scan', 0);
    if (indexError) throw indexError;
    console.log('Unused indexes:', unusedIndexes);

    // 3. Clean up old data
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Clean up old generated visuals
    const { error: visualsError } = await supabaseClient
      .from('generated_visuals')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'draft');
    if (visualsError) throw visualsError;

    // Clean up old lead interactions
    const { error: interactionsError } = await supabaseClient
      .from('lead_interactions')
      .delete()
      .lt('created_at', thirtyDaysAgo.toISOString())
      .eq('status', 'completed');
    if (interactionsError) throw interactionsError;

    // Clean up expired LinkedIn connections
    const { error: linkedinError } = await supabaseClient
      .from('linkedin_connections')
      .delete()
      .eq('status', 'expired');
    if (linkedinError) throw linkedinError;

    // 4. Analyze tables for better query planning
    const tables = [
      'leads',
      'social_campaigns',
      'lead_interactions',
      'pipeline_stages',
      'meetings'
    ];

    for (const table of tables) {
      const { error: analyzeError } = await supabaseClient.rpc('analyze_table', { table_name: table });
      if (analyzeError) throw analyzeError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Database maintenance completed successfully',
        slowQueries,
        unusedIndexes
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in database maintenance:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});