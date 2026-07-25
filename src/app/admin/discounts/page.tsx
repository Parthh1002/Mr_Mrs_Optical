'use client';

import { Plus, Tag, Ticket, Megaphone, Power, MoreVertical, Edit, Trash2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { getDiscounts, toggleDiscountStatus } from '@/lib/api';

export default function AdminDiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDiscounts = async () => {
    setIsLoading(true);
    const data = await getDiscounts();
    setDiscounts(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    await toggleDiscountStatus(id, !currentStatus);
    fetchDiscounts();
  };


  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Discounts & Offers</h1>
          <p className="text-muted-foreground">Manage campaigns, coupons, and product discounts.</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-primary text-white gap-2">
            <Plus className="w-4 h-4" /> Create Offer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card p-6 rounded-2xl border border-border flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-blue-500/10 text-blue-600 rounded-xl"><Megaphone className="w-6 h-6" /></div>
          <div>
            <h3 className="font-bold text-foreground">Campaign Banners</h3>
            <p className="text-xs text-muted-foreground mt-1">Show promotional strips on the homepage (e.g. Monsoon Sale).</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-green-500/10 text-green-600 rounded-xl"><Tag className="w-6 h-6" /></div>
          <div>
            <h3 className="font-bold text-foreground">Product Discounts</h3>
            <p className="text-xs text-muted-foreground mt-1">Apply specific % or flat off to individual products.</p>
          </div>
        </div>
        <div className="bg-card p-6 rounded-2xl border border-border flex items-start gap-4 shadow-sm">
          <div className="p-3 bg-orange-500/10 text-orange-600 rounded-xl"><Ticket className="w-6 h-6" /></div>
          <div>
            <h3 className="font-bold text-foreground">Coupon Codes</h3>
            <p className="text-xs text-muted-foreground mt-1">Create secret codes for checkout (e.g. VISION500).</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-semibold">Offer Name / Code</th>
                <th className="px-6 py-4 font-semibold">Type</th>
                <th className="px-6 py-4 font-semibold">Details</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Loading discounts from Supabase...
                  </td>
                </tr>
              ) : discounts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No discounts found. (Check Supabase API Keys)
                  </td>
                </tr>
              ) : discounts.map((discount) => (
                <tr key={discount.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 font-bold text-foreground">{discount.title}</td>
                  <td className="px-6 py-4">
                    <span className="bg-muted px-2 py-1 rounded text-xs font-semibold capitalize">{discount.type}</span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {discount.percent_off ? `${discount.percent_off}% OFF` : 
                     discount.flat_off ? `₹${discount.flat_off} OFF` : 
                     discount.coupon_code ? `Code: ${discount.coupon_code}` : 'No details'}
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleStatus(discount.id, discount.is_active)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
                        discount.is_active ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      <Power className="w-3 h-3" /> {discount.is_active ? 'Active' : 'Paused'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-danger">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
