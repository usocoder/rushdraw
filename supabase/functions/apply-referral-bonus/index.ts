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

    const { referralCode, amount, userId } = await req.json()

    // Check if referral code exists and is valid
    const { data: referralData, error: referralError } = await supabaseClient
      .from('referral_codes')
      .select('user_id, code')
      .eq('code', referralCode)
      .single()

    if (referralError || !referralData) {
      return new Response(
        JSON.stringify({ error: 'Invalid referral code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get commission rate based on referrer's wagering
    const { data: commissionData } = await supabaseClient.rpc(
      'get_referral_commission_rate',
      { user_id: referralData.user_id }
    )
    const commissionRate = commissionData || 0.10 // Default to 10% if no tier found

    // Calculate bonus amount
    const bonusAmount = amount * commissionRate

    // Update referral code usage and earnings
    await supabaseClient
      .from('referral_codes')
      .update({
        times_used: supabaseClient.rpc('increment', { row_id: referralData.code }),
        total_earnings: supabaseClient.rpc('add', { row_id: referralData.code, amount: bonusAmount })
      })
      .eq('code', referralCode)

    return new Response(
      JSON.stringify({ 
        success: true,
        bonusAmount,
        totalAmount: amount + bonusAmount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})