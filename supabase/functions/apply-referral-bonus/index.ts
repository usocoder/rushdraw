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
    console.log('Processing referral:', { referralCode, amount, userId })

    // Check if referral code exists and is valid
    const { data: referralData, error: referralError } = await supabaseClient
      .from('referral_codes')
      .select('user_id, code')
      .eq('code', referralCode)
      .single()

    if (referralError || !referralData) {
      console.error('Invalid referral code:', referralError)
      return new Response(
        JSON.stringify({ error: 'Invalid referral code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Prevent self-referral
    if (referralData.user_id === userId) {
      console.error('Self-referral attempted')
      return new Response(
        JSON.stringify({ error: 'Cannot use your own referral code' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Get commission rate based on referrer's wagering
    const { data: commissionData } = await supabaseClient.rpc(
      'get_referral_commission_rate',
      { user_id: referralData.user_id }
    )
    const commissionRate = commissionData || 0.10 // Default to 10% if no tier found
    console.log('Commission rate:', commissionRate)

    // Calculate bonus amount
    const bonusAmount = amount * commissionRate
    console.log('Bonus amount:', bonusAmount)

    // Update referral code usage and earnings
    const { error: updateError } = await supabaseClient
      .from('referral_codes')
      .update({
        times_used: supabaseClient.rpc('increment', { row_id: referralCode }),
        total_earnings: supabaseClient.rpc('add', { row_id: referralCode, amount: bonusAmount })
      })
      .eq('code', referralCode)

    if (updateError) {
      console.error('Error updating referral stats:', updateError)
      throw updateError
    }

    // Create referral record
    const { error: referralRecordError } = await supabaseClient
      .from('referrals')
      .insert({
        referrer_id: referralData.user_id,
        referred_user_id: userId,
        code_used: referralCode
      })

    if (referralRecordError) {
      console.error('Error creating referral record:', referralRecordError)
      throw referralRecordError
    }

    // Update user's profile to store the referral code used
    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ referral_code_used: referralCode })
      .eq('id', userId)

    if (profileError) {
      console.error('Error updating profile:', profileError)
      throw profileError
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        bonusAmount,
        totalAmount: amount + bonusAmount
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error processing referral:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})