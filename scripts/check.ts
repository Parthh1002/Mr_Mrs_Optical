import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, serviceKey!);

async function check() {
  const { data: inserted, error: insertError } = await supabase.from('products').insert({name: 'test', slug: 'test-slug', price: 10}).select();
  console.log('Inserted:', inserted);
  console.log('Error:', insertError);
}
check();
