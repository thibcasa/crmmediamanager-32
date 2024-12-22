import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://siptvfxfvsihwgglozvu.supabase.co';
const supabaseAnonKey = 'YOUR_ANON_KEY'; // This should be replaced with the actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey);