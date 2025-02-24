
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { client_seed } = await req.json()
    
    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Generate server seed
    const { data: serverSeedData } = await supabase.rpc('generate_server_seed')
    const server_seed = serverSeedData

    // Get next nonce
    const { data: nonceData } = await supabase.rpc('nextval', { seq_name: 'nonce_seq' })
    const nonce = nonceData

    // Hash the server seed for verification later
    const hash = await crypto.subtle.digest(
      'SHA-256',
      new TextEncoder().encode(server_seed)
    )
    const hashHex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    return new Response(
      JSON.stringify({
        server_seed: hashHex,
        nonce,
        client_seed
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
