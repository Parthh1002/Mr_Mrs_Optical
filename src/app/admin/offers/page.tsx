'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Power, Image as ImageIcon, Save, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Discount {
  id: string;
  code: string;
  type: string;
  value: number;
  min_spend?: number;
  starts_at?: string;
  ends_at?: string;
  is_active: boolean;
}

export default function OffersAdmin() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);

  // Popup state
  const [popupActive, setPopupActive] = useState(false);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupDesc, setPopupDesc] = useState('');
  const [popupImage, setPopupImage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Fetch Discounts
      const { data: discountData } = await supabase.from('discounts').select('*');
      setDiscounts(discountData || []);

      // 2. Fetch Popup settings from site_content
      const { data: contentData } = await supabase.from('site_content').select('*').in('key', ['popup_active', 'popup_title', 'popup_desc', 'popup_image']);
      
      const contentMap: Record<string, string> = {};
      contentData?.forEach(item => { contentMap[item.key] = item.text_content || item.image_url || ''; });
      
      setPopupActive(contentMap['popup_active'] === 'true');
      setPopupTitle(contentMap['popup_title'] || '');
      setPopupDesc(contentMap['popup_desc'] || '');
      setPopupImage(contentMap['popup_image'] || '');
    } catch (error) {
      console.error(error);
      toast.error('Failed to load offers');
    } finally {
      setLoading(false);
    }
  }

  const toggleDiscount = async (id: string, currentStatus: boolean) => {
    try {
      await supabase.from('discounts').update({ is_active: !currentStatus }).eq('id', id);
      setDiscounts(discounts.map(d => d.id === id ? { ...d, is_active: !currentStatus } : d));
      toast.success(currentStatus ? 'Offer turned off' : 'Offer activated!');
    } catch (e) {
      toast.error('Failed to update offer');
    }
  };

  const addDiscount = async () => {
    const newOffer = {
      code: `OFFER-${Math.floor(Math.random() * 1000)}`,
      type: 'percentage',
      value: 10,
      is_active: false
    };
    try {
      const { data, error } = await supabase.from('discounts').insert(newOffer).select().single();
      if (error) throw error;
      setDiscounts([...discounts, data]);
      toast.success('New offer created');
    } catch (e) {
      toast.error('Failed to create offer');
    }
  };

  const updateDiscount = async (id: string, field: keyof Discount, val: any) => {
    setDiscounts(discounts.map(d => d.id === id ? { ...d, [field]: val } : d));
    await supabase.from('discounts').update({ [field]: val }).eq('id', id);
  };

  const savePopup = async () => {
    try {
      const updates = [
        { key: 'popup_active', page: 'global', text_content: popupActive ? 'true' : 'false' },
        { key: 'popup_title', page: 'global', text_content: popupTitle },
        { key: 'popup_desc', page: 'global', text_content: popupDesc },
        { key: 'popup_image', page: 'global', image_url: popupImage },
      ];
      
      await supabase.from('site_content').upsert(updates, { onConflict: 'key' });
      toast.success('Homepage popup saved successfully!', {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
      });
    } catch (e) {
      toast.error('Failed to save popup settings');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading offers...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-12">
      {/* Homepage Popup Controls */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Homepage Popup Offer</h2>
          <p className="text-muted-foreground mt-1">This shows up when someone visits your website</p>
        </div>
        
        <div className="bg-white border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-6 border-b border-border">
            <div>
              <h3 className="font-semibold text-lg">Popup Status</h3>
              <p className="text-sm text-muted-foreground">Turn the popup on or off</p>
            </div>
            <button 
              onClick={() => setPopupActive(!popupActive)}
              className={`w-16 h-8 rounded-full flex items-center transition-colors p-1 ${popupActive ? 'bg-green-500 justify-end' : 'bg-slate-200 justify-start'}`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          <div className={`space-y-4 transition-opacity ${!popupActive ? 'opacity-50 pointer-events-none' : ''}`}>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Popup Heading</label>
              <Input value={popupTitle} onChange={e => setPopupTitle(e.target.value)} placeholder="e.g. GET 20% OFF TODAY!" className="text-lg" />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Popup Description</label>
              <Input value={popupDesc} onChange={e => setPopupDesc(e.target.value)} placeholder="e.g. Sign up to our newsletter and get a discount on your first order." />
            </div>
            <div>
              <label className="text-sm font-semibold mb-1.5 block">Image URL (Optional)</label>
              <Input value={popupImage} onChange={e => setPopupImage(e.target.value)} placeholder="https://..." />
            </div>
            <Button onClick={savePopup} className="mt-4 bg-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> Save Popup Settings
            </Button>
          </div>
        </div>
      </section>

      {/* Standard Offers/Discounts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Store Offers</h2>
            <p className="text-muted-foreground mt-1">Manage discounts and promotions</p>
          </div>
          <Button onClick={addDiscount} variant="outline" className="gap-2">
            <Plus className="w-4 h-4" /> Add New Offer
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {discounts.map(discount => (
            <div key={discount.id} className={`bg-white border rounded-2xl p-6 shadow-sm transition-colors ${discount.is_active ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border opacity-70'}`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="font-bold text-xl uppercase tracking-wider">{discount.code}</h3>
                  <p className="text-sm font-medium text-emerald-600 mt-1">
                    {discount.type === 'percentage' ? `${discount.value}% OFF` : `₹${discount.value} OFF`}
                  </p>
                </div>
                <button 
                  onClick={() => toggleDiscount(discount.id, discount.is_active)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-colors ${discount.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {discount.is_active ? 'ACTIVE' : 'OFF'}
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block text-muted-foreground uppercase tracking-wider">Offer Title / Code</label>
                  <Input value={discount.code} onChange={e => updateDiscount(discount.id, 'code', e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold mb-1 block text-muted-foreground uppercase tracking-wider">Discount Value</label>
                    <Input type="number" value={discount.value} onChange={e => updateDiscount(discount.id, 'value', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <label className="text-xs font-semibold mb-1 block text-muted-foreground uppercase tracking-wider">Min. Spend (₹)</label>
                    <Input type="number" value={discount.min_spend || 0} onChange={e => updateDiscount(discount.id, 'min_spend', parseFloat(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
