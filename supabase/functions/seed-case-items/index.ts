
// Follow Deno's ES modules approach
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing environment variables for Supabase connection");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Fetch all existing cases
    const { data: cases, error: casesError } = await supabase
      .from('cases')
      .select('id, name');
      
    if (casesError) {
      throw casesError;
    }
    
    if (!cases || cases.length === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No cases found to add items to" }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 404 }
      );
    }

    // Simple response for testing
    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Function executed successfully",
        cases: cases.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    console.error("Error in seed-case-items function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || "Unknown error occurred" 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
