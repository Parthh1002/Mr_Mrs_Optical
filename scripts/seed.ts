import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl!, serviceKey!);

const BRAND_PREFIXES = ['Tom Ford', 'Ray-Ban', 'Oakley', 'Gucci', 'Prada', 'Persol', 'Oliver Peoples', 'Carrera', 'Maui Jim', 'Police'];
const STYLES = ['Aviator', 'Wayfarer', 'Round', 'Square', 'Clubmaster', 'Cat-Eye', 'Rectangle', 'Geometric', 'Oversized', 'Hexagonal'];
const QUALITIES = ['Classic', 'Premium', 'Polarized', 'Titanium', 'Matte', 'Carbon', 'Vintage', 'Signature', 'Ultra-Light', 'Pro'];

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1589782862414-cb3aa2141508?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556306535-0f09a536f01f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1591076482161-42ce6da69f67?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605333555239-514be0df39a3?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509695507497-903c140c43b0?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=800&auto=format&fit=crop',
];

async function seed() {
  console.log('Seeding 100 Products with correct schema...');
  await supabase.from('products').delete().neq('id', '0'); // Clear old products
  
  const productsToInsert = [];
  
  for (let i = 0; i < 115; i++) {
    const brand = BRAND_PREFIXES[Math.floor(Math.random() * BRAND_PREFIXES.length)];
    const style = STYLES[Math.floor(Math.random() * STYLES.length)];
    const quality = QUALITIES[Math.floor(Math.random() * QUALITIES.length)];
    
    const name = `${brand} ${quality} ${style}`;
    const basePrice = Math.floor(Math.random() * 4000) + 999;
    
    const isDiscounted = Math.random() > 0.7;
    const price = isDiscounted ? Math.floor(basePrice * 0.8) : basePrice;
    const compareAt = isDiscounted ? basePrice : null;
    
    const image = PRODUCT_IMAGES[Math.floor(Math.random() * PRODUCT_IMAGES.length)];
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

    productsToInsert.push({
      name,
      slug,
      price,
      compare_at_price: compareAt,
      images: [image],
      stock_status: Math.random() > 0.1 ? 'in_stock' : 'out_of_stock', 
      is_featured: Math.random() > 0.8
    });
  }

  for (let i = 0; i < productsToInsert.length; i += 20) {
    const batch = productsToInsert.slice(i, i + 20);
    const { error } = await supabase.from('products').insert(batch);
    if (error) {
      console.error('Error inserting products batch:', error);
    }
  }

  console.log('Database seeded successfully with Demo Data!');
}

seed().catch(console.error);
