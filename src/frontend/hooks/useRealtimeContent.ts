'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getStoredContent, subscribeToContentChanges } from '@/lib/contentStore';

export function useRealtimeContent(initialContent: Record<string, any>) {
  const [content, setContent] = useState<Record<string, any>>(() => {
    // Merge initialContent from server with any stored local overrides
    const stored = getStoredContent();
    const merged = { ...initialContent };

    Object.entries(stored).forEach(([key, val]) => {
      merged[key] = {
        ...merged[key],
        ...(val.text !== undefined ? { text: val.text } : {}),
        ...(val.image !== undefined ? { image: val.image } : {}),
      };
    });

    return merged;
  });

  useEffect(() => {
    // 1. Sync on mount from localStorage (in case SSR rendered defaults)
    const stored = getStoredContent();
    setContent((prev) => {
      const updated = { ...prev };
      let changed = false;
      Object.entries(stored).forEach(([key, val]) => {
        if (val.text !== undefined && updated[key]?.text !== val.text) {
          updated[key] = { ...updated[key], text: val.text };
          changed = true;
        }
        if (val.image !== undefined && updated[key]?.image !== val.image) {
          updated[key] = { ...updated[key], image: val.image };
          changed = true;
        }
      });
      return changed ? updated : prev;
    });

    // 2. Subscribe to local event + BroadcastChannel changes
    const unsubscribeLocal = subscribeToContentChanges((idValue, type, value) => {
      setContent((prev) => ({
        ...prev,
        [idValue]: {
          ...prev[idValue],
          [type]: value,
        },
      }));
    });

    // 3. Subscribe to Supabase Postgres Realtime changes (if DB is connected)
    const channel = supabase
      .channel('public:site_content')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_content' },
        (payload) => {
          if (payload.new) {
            const newRow = payload.new as any;
            const key = newRow.section_key || newRow.key;
            const textVal = newRow.text_value || newRow.text_content;
            const imgVal = newRow.image_value || newRow.image_url;

            if (key) {
              setContent((prev) => ({
                ...prev,
                [key]: {
                  text: textVal ?? prev[key]?.text,
                  image: imgVal ?? prev[key]?.image,
                },
              }));
            }
          }
        }
      )
      .subscribe();

    return () => {
      unsubscribeLocal();
      supabase.removeChannel(channel);
    };
  }, []);

  return content;
}
