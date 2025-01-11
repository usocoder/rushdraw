import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://biczkhfnrmsenbejoshe.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpY3praGZucm1zZW5iZWpvc2hlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4MzI0NDAsImV4cCI6MjAyNTQwODQ0MH0.RqOyImzPHg-DPDaxoFLGJ9Qr4LhXgXBVnRBQZbOFVFY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})