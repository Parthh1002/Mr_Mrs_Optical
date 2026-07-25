'use server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function uploadImageLocally(formData: FormData) {
  const file = formData.get('file') as File;
  if (!file) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Generate unique filename
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
  
  // Create uploads directory if it doesn't exist
  const uploadDir = join(process.cwd(), 'public', 'uploads');
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {
    // Ignore if directory already exists
  }

  const path = join(uploadDir, filename);
  await writeFile(path, buffer);

  // Return the public URL
  return `/uploads/${filename}`;
}
