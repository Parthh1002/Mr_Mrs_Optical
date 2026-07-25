'use client';

import { useState, useEffect } from 'react';
import { Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function SettingsAdmin() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [storeInfo, setStoreInfo] = useState({
    store_name: '',
    store_address: '',
    store_phone: '',
    store_whatsapp: '',
    store_hours: '',
    store_map_url: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data } = await supabase.from('site_content').select('*').like('key', 'store_%');
      
      const newInfo = { ...storeInfo };
      data?.forEach(item => {
        if (item.key in newInfo) {
          (newInfo as any)[item.key] = item.text_content || '';
        }
      });
      setStoreInfo(newInfo);
    } catch (error) {
      toast.error('Failed to load store settings');
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = Object.entries(storeInfo).map(([key, value]) => ({
        key,
        page: 'global',
        text_content: value
      }));
      
      await supabase.from('site_content').upsert(updates, { onConflict: 'key' });
      toast.success('Store information updated successfully!', {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
      });
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-12 text-center text-muted-foreground">Loading settings...</div>;

  return (
    <div className="max-w-3xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Store Info</h1>
        <p className="text-muted-foreground mt-1">Update your contact details and opening hours</p>
      </div>

      <div className="bg-white border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        
        <div>
          <label className="text-sm font-semibold mb-2 block">Store Name</label>
          <Input 
            value={storeInfo.store_name} 
            onChange={e => setStoreInfo({ ...storeInfo, store_name: e.target.value })}
            placeholder="e.g. Mr & Mrs Optical"
            className="text-lg"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Complete Address</label>
          <Textarea 
            value={storeInfo.store_address} 
            onChange={e => setStoreInfo({ ...storeInfo, store_address: e.target.value })}
            placeholder="Enter your full shop address..."
            className="resize-none h-24"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-semibold mb-2 block">Phone Number (Calls)</label>
            <Input 
              value={storeInfo.store_phone} 
              onChange={e => setStoreInfo({ ...storeInfo, store_phone: e.target.value })}
              placeholder="e.g. +91 9876543210"
            />
          </div>
          <div>
            <label className="text-sm font-semibold mb-2 block">WhatsApp Number</label>
            <Input 
              value={storeInfo.store_whatsapp} 
              onChange={e => setStoreInfo({ ...storeInfo, store_whatsapp: e.target.value })}
              placeholder="e.g. +91 9876543210"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block">Opening Hours</label>
          <Input 
            value={storeInfo.store_hours} 
            onChange={e => setStoreInfo({ ...storeInfo, store_hours: e.target.value })}
            placeholder="e.g. Mon-Sat: 10:00 AM - 9:00 PM"
          />
        </div>

        <div>
          <label className="text-sm font-semibold mb-2 block flex items-center justify-between">
            <span>Google Maps Link</span>
            <a href="https://maps.google.com" target="_blank" className="text-xs font-normal text-blue-600 hover:underline">Find link</a>
          </label>
          <Input 
            value={storeInfo.store_map_url} 
            onChange={e => setStoreInfo({ ...storeInfo, store_map_url: e.target.value })}
            placeholder="Paste your Google Maps share link here"
          />
        </div>

        <div className="pt-6 border-t">
          <Button onClick={handleSave} disabled={saving} size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 gap-2">
            <Save className="w-5 h-5" />
            {saving ? 'Saving...' : 'Save All Changes'}
          </Button>
        </div>

      </div>
    </div>
  );
}
