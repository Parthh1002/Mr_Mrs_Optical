'use server';

import { supabase, getServiceSupabase } from './supabase';
import { revalidatePath } from 'next/cache';
import { prisma } from './prisma';

// --- CATEGORIES ---
export async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('sort_order', { ascending: true });
  return data || [];
}

export async function createCategory(data: { name: string, slug: string, iconImage?: string }) {
  const result = await prisma.category.create({ data });
  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
  return result;
}

export async function deleteCategory(id: string) {
  await prisma.category.delete({ where: { id } });
  revalidatePath('/admin/categories');
  revalidatePath('/catalog');
}

// --- BANNERS ---
export async function getBanners() {
  const { data } = await supabase.from('banners').select('*').order('position_index', { ascending: true });
  return data || [];
}

export async function createBanner(data: { title: string, subtitle?: string, image: string, linkUrl?: string }) {
  const result = await prisma.banner.create({ data });
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return result;
}

export async function deleteBanner(id: string) {
  await prisma.banner.delete({ where: { id } });
  revalidatePath('/admin/banners');
  revalidatePath('/');
}

// --- PRODUCTS ---
export async function getProducts() {
  const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function getActiveProducts() {
  const { data } = await supabase.from('products').select('*').eq('stock_status', 'in_stock').order('created_at', { ascending: false });
  return data || [];
}

export async function getProductById(id: string) {
  const { data } = await supabase.from('products').select('*').eq('id', id).single();
  return data;
}

export async function createProduct(data: any) {
  const result = await prisma.product.create({ data });
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  return result;
}

export async function updateProduct(id: string, data: any) {
  const result = await prisma.product.update({ where: { id }, data });
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  return result;
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

// --- BOOKINGS ---
export async function getBookings() {
  return await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createBooking(data: any) {
  const { data: result, error } = await supabase.from('bookings').insert([data]).select().single();
  if (error) throw error;
  revalidatePath('/admin/bookings');
  return result;
}

export async function updateBookingStatus(id: string, status: string) {
  const result = await prisma.booking.update({ where: { id }, data: { status } });
  revalidatePath('/admin/bookings');
  return result;
}

// --- DISCOUNTS ---
export async function getDiscounts() {
  return await prisma.discount.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function toggleDiscountStatus(id: string, isActive: boolean) {
  const result = await prisma.discount.update({ where: { id }, data: { isActive } });
  revalidatePath('/admin/discounts');
  return result;
}

// --- STORE SETTINGS ---
export async function getStoreSettings() {
  const settings = await prisma.storeSetting.findFirst();
  if (!settings) {
    return await prisma.storeSetting.create({
      data: {
        address: 'G-14, Dev Complex, Dahegam',
        phone: '+91 99999 00000',
        whatsappNumber: '+91 99999 00000',
      }
    });
  }
  return settings;
}

export async function updateStoreSettings(data: any) {
  const settings = await prisma.storeSetting.findFirst();
  if (settings) {
    const result = await prisma.storeSetting.update({ where: { id: settings.id }, data });
    revalidatePath('/admin/settings');
    revalidatePath('/');
    return result;
  }
}

// --- SITE CONTENT (VISUAL CMS) ---
export async function getSiteContent(pageKey: string) {
  const { data: content } = await supabase.from('site_content').select('*').eq('page', pageKey);
  
  // Convert array to key-value map for easier consumption on frontend
  const contentMap: Record<string, { text: string | null, image: string | null }> = {};
  if (content) {
    content.forEach(c => {
      contentMap[c.key] = {
        text: c.text_content,
        image: c.image_url
      };
    });
  }
  return contentMap;
}

export async function setSiteContent(pageKey: string, sectionKey: string, textValue: string | null, imageValue: string | null) {
  const result = await prisma.siteContent.upsert({
    where: { sectionKey },
    update: { textValue, imageValue, pageKey },
    create: { sectionKey, pageKey, textValue, imageValue }
  });
  revalidatePath(`/${pageKey === 'home' ? '' : pageKey}`);
  return result;
}

// --- MEDIA (REELS & GALLERY) WRITES USING ADMIN BYPASS ---
export async function createReel(videoUrl: string, caption: string) {
  const supabaseAdmin = getServiceSupabase();
  const { data, error } = await supabaseAdmin.from('reels').insert({
    video_url: videoUrl,
    caption
  }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteReel(id: string) {
  const supabaseAdmin = getServiceSupabase();
  const { error } = await supabaseAdmin.from('reels').delete().eq('id', id);
  if (error) throw error;
}

export async function updateReel(id: string, caption: string) {
  const supabaseAdmin = getServiceSupabase();
  const { error } = await supabaseAdmin.from('reels').update({ caption }).eq('id', id);
  if (error) throw error;
}

export async function createGalleryPhoto(imageUrl: string) {
  const supabaseAdmin = getServiceSupabase();
  const { data, error } = await supabaseAdmin.from('site_content').insert({
    key: `gallery_${Date.now()}`,
    page: 'gallery',
    image_url: imageUrl
  }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGalleryPhoto(id: string) {
  const supabaseAdmin = getServiceSupabase();
  const { error } = await supabaseAdmin.from('site_content').delete().eq('id', id);
  if (error) throw error;
}

// --- PRODUCTS WRITES USING ADMIN BYPASS ---
export async function createProductServer(productData: {
  name: string;
  price: number;
  compareAtPrice?: number;
  description?: string;
  stockStatus?: string;
  imageUrl: string;
  categoryName: string;
  brandName: string;
}) {
  const supabaseAdmin = getServiceSupabase();
  
  // 1. Find or create Category
  const categorySlug = productData.categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  let { data: catData } = await supabaseAdmin
    .from('categories')
    .select('id')
    .eq('slug', categorySlug)
    .maybeSingle();
    
  if (!catData) {
    const catName = productData.categoryName.charAt(0).toUpperCase() + productData.categoryName.slice(1);
    const { data: newCat, error: catErr } = await supabaseAdmin
      .from('categories')
      .insert({ name: catName, slug: categorySlug })
      .select('id')
      .single();
    if (catErr) throw catErr;
    catData = newCat;
  }
  
  // 2. Find or create Brand
  let { data: brandData } = await supabaseAdmin
    .from('brands')
    .select('id')
    .eq('name', productData.brandName)
    .maybeSingle();
    
  if (!brandData) {
    const { data: newBrand, error: brandErr } = await supabaseAdmin
      .from('brands')
      .insert({ name: productData.brandName })
      .select('id')
      .single();
    if (brandErr) throw brandErr;
    brandData = newBrand;
  }
  
  // 3. Generate product slug
  const productSlug = `${productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;
  
  // 4. Insert product
  const { data, error } = await supabaseAdmin
    .from('products')
    .insert({
      name: productData.name,
      slug: productSlug,
      description: productData.description || '',
      price: productData.price,
      compare_at_price: productData.compareAtPrice || productData.price,
      images: [productData.imageUrl],
      category_id: catData.id,
      brand_id: brandData.id,
      stock_status: productData.stockStatus || 'in_stock',
      is_featured: false
    })
    .select()
    .single();
    
  if (error) throw error;
  
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
  return data;
}

export async function updateProductStock(id: string, newStatus: string) {
  const supabaseAdmin = getServiceSupabase();
  const { error } = await supabaseAdmin
    .from('products')
    .update({ stock_status: newStatus })
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

export async function deleteProductServer(id: string) {
  const supabaseAdmin = getServiceSupabase();
  const { error } = await supabaseAdmin
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw error;
  revalidatePath('/admin/products');
  revalidatePath('/catalog');
}

