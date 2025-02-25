
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse request body
    const { client_seed } = await req.json()
    
    if (!client_seed) {
      throw new Error('Client seed is required')
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Generate server seed using the database function
    const { data: serverSeedData, error: serverSeedError } = await supabase.rpc('generate_server_seed')
    if (serverSeedError) throw serverSeedError
    const server_seed = serverSeedData

    // Get next nonce
    const { data: nonceData, error: nonceError } = await supabase.rpc('nextval', { seq_name: 'nonce_seq' })
    if (nonceError) throw nonceError
    const nonce = nonceData

    // Hash the server seed for verification later
    const encoder = new TextEncoder()
    const hash = await crypto.subtle.digest('SHA-256', encoder.encode(server_seed))
    const hashHex = Array.from(new Uint8Array(hash))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Get current user from auth header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('Missing authorization header')
    }

    // Store the case opening in the database
    const { error: insertError } = await supabase
      .from('case_openings')
      .insert({
        server_seed: server_seed,
        client_seed: client_seed,
        nonce: nonce,
      })

    if (insertError) {
      console.error('Error inserting case opening:', insertError)
      throw new Error('Failed to store case opening')
    }

    // Return response
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
    console.error('Error in create-case-opening:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
