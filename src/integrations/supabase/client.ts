
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://lvyqjogxspinjufcrmnf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx2eXFqb2d4c3Bpbmp1ZmNybW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0NTkzMzUsImV4cCI6MjA1MjAzNTMzNX0.j3b2sNzvWKtMUPRt-X8uYmsXfjagz0EtlTkGWYqn34s";

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache'
    }
  }
});
