
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing environment variables for Supabase connection')
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Check if admin user exists
    const { data: existingUser, error: searchError } = await supabase
      .from('auth.users')
      .select('id')
      .eq('email', 'support@rushdraw.com')
      .maybeSingle()
      
    if (searchError) {
      throw new Error(`Error searching for user: ${searchError.message}`)
    }
    
    if (existingUser) {
      console.log('Admin user already exists')
      
      // Make sure the user has admin role
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', existingUser.id)
        .eq('role', 'admin')
        .maybeSingle()
      
      if (!existingRole) {
        // Add admin role if not present
        await supabase
          .from('user_roles')
          .insert({
            user_id: existingUser.id,
            role: 'admin'
          })
        
        console.log('Added admin role to existing user')
      }
      
      return new Response(JSON.stringify({
        success: true,
        message: 'Admin user already exists and has admin role'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      })
    }
    
    // Create admin user if it doesn't exist
    const password = generateStrongPassword()
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email: 'support@rushdraw.com',
      password: password,
      email_confirm: true,
      user_metadata: {
        username: 'Support Admin',
      }
    })
    
    if (createError) {
      throw new Error(`Error creating admin user: ${createError.message}`)
    }
    
    // Add admin role
    await supabase
      .from('user_roles')
      .insert({
        user_id: newUser.user.id,
        role: 'admin'
      })
    
    console.log('Admin user created successfully')
    
    // Don't return the password in the response for security reasons
    return new Response(JSON.stringify({
      success: true,
      message: 'Admin user created successfully',
      password: password // This is only for initial setup
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('Error in create-admin-user function:', error)
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    })
  }
})

// Generate a strong random password
function generateStrongPassword(): string {
  const length = 12
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+'
  let password = ''
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }
  
  return password
}
