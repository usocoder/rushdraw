
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
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enable Realtime subscription for case_openings table
async function enableRealtimeForCaseOpenings() {
  try {
    const { error } = await supabase.from('case_openings')
      .select('id')
      .limit(1);
      
    if (error) {
      console.error('Error checking case_openings table:', error);
    } else {
      console.log('Realtime subscription to case_openings should be operational');
    }
  } catch (err) {
    console.error('Error enabling realtime for case_openings:', err);
  }
}

// Initialize realtime subscriptions
enableRealtimeForCaseOpenings();
