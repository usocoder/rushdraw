
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

    // Generate a server seed (using database function or fallback)
    let server_seed;
    try {
      const { data: serverSeedData, error: serverSeedError } = await supabase.rpc('generate_server_seed')
      if (serverSeedError) throw serverSeedError
      server_seed = serverSeedData
      console.log('Generated server seed via RPC:', server_seed)
    } catch (rpcError) {
      console.error('RPC error, using fallback server seed generation:', rpcError)
      // Fallback server seed generation
      const chars = '0123456789abcdef'
      server_seed = Array.from({ length: 32 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
      console.log('Generated fallback server seed:', server_seed)
    }

    // Get next nonce or generate one
    let nonce;
    try {
      const { data: nonceData, error: nonceError } = await supabase.rpc('nextval', { seq_name: 'nonce_seq' })
      if (nonceError) throw nonceError
      nonce = nonceData
      console.log('Generated nonce via RPC:', nonce)
    } catch (nonceError) {
      console.error('Nonce error, using timestamp as nonce:', nonceError)
      // Fallback nonce
      nonce = Date.now()
      console.log('Generated fallback nonce:', nonce)
    }

    // Hash the server seed for verification later
    const encoder = new TextEncoder()
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(server_seed))
    const hashHex = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    // Try to get user_id from auth header (but make it optional for free play)
    let userId = null
    try {
      const authHeader = req.headers.get('authorization')
      if (authHeader) {
        const token = authHeader.replace('Bearer ', '')
        const { data: { user }, error: userError } = await supabase.auth.getUser(token)
        if (!userError && user) {
          userId = user.id
          console.log('Authenticated user:', userId)
        }
      }
    } catch (authError) {
      console.warn('Auth error, proceeding without user ID:', authError)
    }

    // Store the case opening in the database if we have a user ID
    if (userId) {
      try {
        const { error: insertError } = await supabase
          .from('case_openings')
          .insert({
            user_id: userId,
            server_seed: server_seed,
            client_seed: client_seed,
            nonce: nonce,
          })

        if (insertError) {
          console.error('Error inserting case opening:', insertError)
          // Continue anyway - we'll use the generated data
        } else {
          console.log('Case opening inserted in database')
        }
      } catch (dbError) {
        console.error('Database error, continuing with generated data:', dbError)
      }
    }

    // Return response with the data needed for the roll calculation
    console.log('Returning data for provably fair calculation')
    return new Response(
      JSON.stringify({
        server_seed: server_seed, // Using unhashed seed for calculation
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
    
    // Return some random data so the client can still function
    const fallbackData = {
      error: error.message,
      fallback: true,
      server_seed: Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join(''),
      nonce: Date.now()
    }
    
    return new Response(
      JSON.stringify(fallbackData),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 even on error so client can use fallback
      },
    )
  }
})
