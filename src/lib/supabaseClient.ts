import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://siptvfxfvsihwgglozvu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcHR2ZnhmdnNpaHdnZ2xvenZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NTI4ODQsImV4cCI6MjA1MDQyODg4NH0.jflw4Ygq8Eo6TdLtm1tayo5AN4HrP4zCdJ_2o1He_cE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storageKey: 'supabase.auth.token',
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});