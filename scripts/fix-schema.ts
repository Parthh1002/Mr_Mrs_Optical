import { Client } from 'pg';

const connectionString = 'postgres://postgres.kuybjlirmlkflswizxpj:OpticalDB%402026@aws-0-ap-south-1.pooler.supabase.com:6543/postgres';

async function fixSchema() {
  const client = new Client({ connectionString });
  await client.connect();

  console.log('Connected to Postgres');

  // Alter products table if necessary
  try {
    await client.query(`
      ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;
    `);
    console.log('Added image_url column to products');
  } catch (e) {
    console.error('Error altering products:', e);
  }

  // Reload Supabase schema cache
  try {
    await client.query(`NOTIFY pgrst, 'reload schema'`);
    console.log('Schema cache reloaded');
  } catch(e) {
    console.log('Could not notify pgrst');
  }

  await client.end();
}

fixSchema().catch(console.error);
