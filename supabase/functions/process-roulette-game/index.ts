import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Find games that have been running for more than 20 seconds and haven't ended
    const { data: games } = await supabaseClient
      .from('roulette_games')
      .select('*')
      .is('result', null)
      .lt('start_time', new Date(Date.now() - 20000).toISOString())
      .order('created_at', { ascending: true })

    if (!games || games.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No games to process' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      )
    }

    for (const game of games) {
      // Determine result (10% chance for green, 45% each for red and black)
      const rand = Math.random()
      let result: 'red' | 'black' | 'green'
      if (rand < 0.1) {
        result = 'green'
      } else if (rand < 0.55) {
        result = 'red'
      } else {
        result = 'black'
      }

      // Update game with result
      await supabaseClient
        .from('roulette_games')
        .update({
          result,
          end_time: new Date().toISOString(),
        })
        .eq('id', game.id)

      // Get all bets for this game
      const { data: bets } = await supabaseClient
        .from('roulette_bets')
        .select('*')
        .eq('game_id', game.id)

      // Process winning bets
      for (const bet of (bets || [])) {
        if (bet.bet_color === result) {
          const multiplier = result === 'green' ? 14 : 2
          const winAmount = bet.bet_amount * multiplier

          // Create winning transaction
          await supabaseClient
            .from('transactions')
            .insert({
              user_id: bet.user_id,
              type: 'case_win',
              amount: winAmount,
              status: 'completed'
            })
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Games processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})