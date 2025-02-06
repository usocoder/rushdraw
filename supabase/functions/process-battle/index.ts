import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId, caseId, opponents } = await req.json()
    console.log('Processing battle:', { userId, caseId, opponents })

    // Get case items for the battle
    const { data: caseItems, error: itemsError } = await supabaseClient
      .from('case_items')
      .select('*')
      .eq('case_id', caseId)

    if (itemsError || !caseItems?.length) {
      console.error('Error fetching case items:', itemsError)
      throw new Error('Failed to fetch case items')
    }

    // Simulate spins for each player
    const results = []
    const totalPlayers = opponents + 1 // Including the initiating player

    for (let i = 0; i < totalPlayers; i++) {
      // Calculate random item based on odds
      const random = Math.random()
      let cumulativeProbability = 0
      let selectedItem = null

      for (const item of caseItems) {
        cumulativeProbability += item.odds
        if (random <= cumulativeProbability) {
          selectedItem = item
          break
        }
      }

      if (!selectedItem) {
        selectedItem = caseItems[caseItems.length - 1]
      }

      results.push({
        player: i === 0 ? 'You' : `Opponent ${i}`,
        item: selectedItem
      })
    }

    // Determine winner
    const winner = results.reduce((prev, current) => {
      return (prev.item.value > current.item.value) ? prev : current
    })

    console.log('Battle results:', { results, winner })

    // Record the case opening
    const { error: openingError } = await supabaseClient
      .from('case_openings')
      .insert({
        user_id: userId,
        case_id: caseId,
        item_won: winner.item.id,
        value_won: winner.item.value
      })

    if (openingError) {
      console.error('Error recording case opening:', openingError)
      throw openingError
    }

    // If the user won, create a winning transaction
    if (winner.player === 'You') {
      const { error: transactionError } = await supabaseClient
        .from('transactions')
        .insert({
          user_id: userId,
          type: 'case_win',
          amount: winner.item.value,
          status: 'completed'
        })

      if (transactionError) {
        console.error('Error creating win transaction:', transactionError)
        throw transactionError
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        results,
        winner
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing battle:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})