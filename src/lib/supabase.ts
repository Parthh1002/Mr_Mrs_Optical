import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Client for frontend (uses anon key, restricted by RLS)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper for backend routes/actions if needed (bypasses RLS)
export function getServiceSupabase() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!serviceKey) throw new Error('Missing service role key');
  return createClient(supabaseUrl, serviceKey);
}
