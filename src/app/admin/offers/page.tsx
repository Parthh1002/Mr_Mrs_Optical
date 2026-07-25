'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Power, Image as ImageIcon, Save, CheckCircle2, Clock, Sparkles } from 'lucide-react';
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

  // Countdown Sale Banner State
  const [countdownActive, setCountdownActive] = useState(true);
  const [countdownTitle, setCountdownTitle] = useState('End of Season Sale');
  const [countdownSubtitle, setCountdownSubtitle] = useState('Get up to 50% off on polarized sunglasses and premium frames. Limited time only.');
  const [countdownTarget, setCountdownTarget] = useState('2026-12-31T23:59:59');
  const [countdownCta, setCountdownCta] = useState('Claim Offer Now');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Fetch Discounts
      const { data: discountData } = await supabase.from('discounts').select('*');
      setDiscounts(discountData || []);

      // 2. Fetch Popup settings & Countdown settings from site_content
      const { data: contentData } = await supabase.from('site_content').select('*').in('key', [
        'popup_active', 'popup_title', 'popup_desc', 'popup_image',
        'sale_countdown_active', 'sale_countdown_title', 'sale_countdown_subtitle', 'sale_countdown_target', 'sale_countdown_cta'
      ]);
      
      const contentMap: Record<string, string> = {};
      contentData?.forEach(item => { contentMap[item.key] = item.text_content || item.image_url || ''; });
      
      // Popup
      setPopupActive(contentMap['popup_active'] === 'true');
      setPopupTitle(contentMap['popup_title'] || 'GET 20% OFF TODAY!');
      setPopupDesc(contentMap['popup_desc'] || 'Sign up to our newsletter and get a discount on your first order.');
      setPopupImage(contentMap['popup_image'] || '');

      // Countdown Sale Banner
      if (contentMap['sale_countdown_active'] !== undefined) setCountdownActive(contentMap['sale_countdown_active'] === 'true');
      if (contentMap['sale_countdown_title']) setCountdownTitle(contentMap['sale_countdown_title']);
      if (contentMap['sale_countdown_subtitle']) setCountdownSubtitle(contentMap['sale_countdown_subtitle']);
      if (contentMap['sale_countdown_target']) setCountdownTarget(contentMap['sale_countdown_target']);
      if (contentMap['sale_countdown_cta']) setCountdownCta(contentMap['sale_countdown_cta']);

      // Also check local storage backup
      const localSaved = localStorage.getItem('mrandmrs_sale_countdown');
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          if (parsed.active !== undefined) setCountdownActive(parsed.active);
          if (parsed.title) setCountdownTitle(parsed.title);
          if (parsed.subtitle) setCountdownSubtitle(parsed.subtitle);
          if (parsed.target) setCountdownTarget(parsed.target);
          if (parsed.cta) setCountdownCta(parsed.cta);
        } catch { /* ignore */ }
      }

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

  const saveCountdown = async () => {
    try {
      const countdownData = {
        active: countdownActive,
        title: countdownTitle,
        subtitle: countdownSubtitle,
        target: countdownTarget,
        cta: countdownCta
      };

      // Save to localStorage for instant website sync
      localStorage.setItem('mrandmrs_sale_countdown', JSON.stringify(countdownData));
      window.dispatchEvent(new Event('countdownUpdated'));

      // Save to Supabase site_content
      const updates = [
        { key: 'sale_countdown_active', page: 'global', text_content: countdownActive ? 'true' : 'false' },
        { key: 'sale_countdown_title', page: 'global', text_content: countdownTitle },
        { key: 'sale_countdown_subtitle', page: 'global', text_content: countdownSubtitle },
        { key: 'sale_countdown_target', page: 'global', text_content: countdownTarget },
        { key: 'sale_countdown_cta', page: 'global', text_content: countdownCta },
      ];

      await supabase.from('site_content').upsert(updates, { onConflict: 'key' });

      toast.success('Countdown Sale Banner saved & updated live on website!', {
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />
      });
    } catch (e) {
      toast.error('Saved to website locally');
    }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading offers...</div>;

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-12">
      
      {/* 1. COUNTDOWN SALE BANNER CONTROL (Admin Managed) */}
      <section className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-lg">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-amber-500/20">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground font-serif">End of Season Sale Countdown Banner</h2>
            <p className="text-xs text-muted-foreground">Control the live sale banner, glass timer & end date on the homepage</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-card border border-border">
            <div>
              <h3 className="font-semibold text-sm">Banner Active Status</h3>
              <p className="text-xs text-muted-foreground">Show or hide the countdown sale banner on the live website</p>
            </div>
            <button 
              onClick={() => setCountdownActive(!countdownActive)}
              className={`w-16 h-8 rounded-full flex items-center transition-colors p-1 cursor-pointer ${countdownActive ? 'bg-amber-600 justify-end' : 'bg-slate-300 justify-start'}`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-sm" />
            </button>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${!countdownActive ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Sale Banner Title</label>
              <Input
                value={countdownTitle}
                onChange={e => setCountdownTitle(e.target.value)}
                placeholder="e.g. End of Season Sale"
                className="text-lg font-bold"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Sale Subtitle / Offer Details</label>
              <Input
                value={countdownSubtitle}
                onChange={e => setCountdownSubtitle(e.target.value)}
                placeholder="e.g. Get up to 50% off on polarized sunglasses..."
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">Target End Date & Time</label>
              <Input
                type="text"
                value={countdownTarget}
                onChange={e => setCountdownTarget(e.target.value)}
                placeholder="YYYY-MM-DDTHH:mm:ss"
              />
              <span className="text-[10px] text-muted-foreground mt-1 block">Format: 2026-12-31T23:59:59</span>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1 block">CTA Button Label</label>
              <Input
                value={countdownCta}
                onChange={e => setCountdownCta(e.target.value)}
                placeholder="e.g. Claim Offer Now"
              />
            </div>
          </div>

          <Button
            onClick={saveCountdown}
            size="lg"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold gap-2 rounded-xl py-6 cursor-pointer shadow-md"
          >
            <Save className="w-5 h-5" /> Save & Update Live Countdown on Website
          </Button>
        </div>
      </section>

      {/* 2. Homepage Popup Controls */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground">Homepage Popup Offer</h2>
          <p className="text-muted-foreground mt-1">This shows up when someone visits your website</p>
        </div>
        
        <div className="bg-white dark:bg-card border border-border rounded-2xl p-6 shadow-sm relative overflow-hidden">
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
              <Input value={popupDesc} onChange={e => setPopupDesc(e.target.value)} placeholder="e.g. Sign up to our newsletter..." />
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

      {/* 3. Standard Offers/Discounts */}
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
            <div key={discount.id} className={`bg-white dark:bg-card border rounded-2xl p-6 shadow-sm transition-colors ${discount.is_active ? 'border-primary/50 ring-1 ring-primary/20' : 'border-border opacity-70'}`}>
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
