'use client';

import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'mrandmrs_site_content';
const EVENT_NAME = 'mrandmrs_content_updated';
const CHANNEL_NAME = 'mrandmrs_content_channel';

export interface ContentEntry {
  text?: string;
  image?: string;
}

// ── Get all stored content from localStorage ──────────────────────────────────
export function getStoredContent(): Record<string, ContentEntry> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

// ── Save a single text or image item to localStorage + Broadcast + DB ────────
export async function saveContentItem(idValue: string, type: 'text' | 'image', value: string) {
  if (typeof window === 'undefined') return;

  // 1. Update localStorage
  const current = getStoredContent();
  const existing = current[idValue] || {};
  const updatedEntry = {
    ...existing,
    [type]: value,
  };
  const updatedAll = {
    ...current,
    [idValue]: updatedEntry,
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedAll));
  } catch (e) {
    console.error('Failed to write to localStorage:', e);
  }

  // 2. Dispatch local window event
  window.dispatchEvent(
    new CustomEvent(EVENT_NAME, {
      detail: { idValue, type, value, entry: updatedEntry },
    })
  );

  // 3. Broadcast to other open tabs
  try {
    if ('BroadcastChannel' in window) {
      const bc = new BroadcastChannel(CHANNEL_NAME);
      bc.postMessage({ idValue, type, value, entry: updatedEntry });
      bc.close();
    }
  } catch {
    /* ignore */
  }

  // 4. Try updating Supabase database in background (if configured)
  try {
    const updatePayload: Record<string, string> = {};
    if (type === 'text') {
      updatePayload.text_value = value;
      updatePayload.text_content = value;
    } else {
      updatePayload.image_value = value;
      updatePayload.image_url = value;
    }

    // Try section_key first, then key
    const { error: err1 } = await supabase
      .from('site_content')
      .update(updatePayload)
      .eq('section_key', idValue);

    if (err1) {
      await supabase
        .from('site_content')
        .update(updatePayload)
        .eq('key', idValue);
    }
  } catch (e) {
    // Non-blocking error since localStorage and broadcast already succeeded
    console.warn('Supabase background update skipped or failed:', e);
  }
}

// ── Subscribe to content changes across components & tabs ────────────────────
export function subscribeToContentChanges(
  callback: (idValue: string, type: 'text' | 'image', value: string) => void
) {
  if (typeof window === 'undefined') return () => {};

  const handleWindowCustomEvent = (e: Event) => {
    const detail = (e as CustomEvent).detail;
    if (detail) {
      callback(detail.idValue, detail.type, detail.value);
    }
  };

  const handleStorageEvent = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const parsed = JSON.parse(e.newValue);
        Object.entries(parsed).forEach(([key, val]: [string, any]) => {
          if (val.text) callback(key, 'text', val.text);
          if (val.image) callback(key, 'image', val.image);
        });
      } catch { /* ignore */ }
    }
  };

  window.addEventListener(EVENT_NAME, handleWindowCustomEvent);
  window.addEventListener('storage', handleStorageEvent);

  let bc: BroadcastChannel | null = null;
  try {
    if ('BroadcastChannel' in window) {
      bc = new BroadcastChannel(CHANNEL_NAME);
      bc.onmessage = (e) => {
        if (e.data) {
          callback(e.data.idValue, e.data.type, e.data.value);
        }
      };
    }
  } catch { /* ignore */ }

  return () => {
    window.removeEventListener(EVENT_NAME, handleWindowCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
    if (bc) bc.close();
  };
}
