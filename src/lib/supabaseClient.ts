import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://siptvfxfvsihwgglozvu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpcHR2ZnhmdnNpaHdnZ2xvenZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMyMzQ0MDAsImV4cCI6MjAxODgxMDQwMH0.SvD8sWGwKBrIBZDT_sHW_jYWXTYgMX9q9Jb_F-G1vos';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);