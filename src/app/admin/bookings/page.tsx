'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, Phone, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface Booking {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  booking_date: string;
  time_slot: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
}

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('bookings').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (booking: Booking, newStatus: string) => {
    try {
      await supabase.from('bookings').update({ status: newStatus }).eq('id', booking.id);
      setBookings(bookings.map(b => b.id === booking.id ? { ...b, status: newStatus as Booking['status'] } : b));
      toast.success(`Booking marked as ${newStatus}`);

      // Send PDF confirmation if confirmed
      if (newStatus === 'confirmed' && booking.email) {
        toast.info('Sending confirmation email with PDF...');
        await fetch('/api/confirm-booking', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: booking.name,
            email: booking.email,
            date: new Date(booking.booking_date).toLocaleDateString(),
            time: booking.time_slot,
            referenceId: `#BKG-${booking.id.split('-')[0].toUpperCase()}`
          })
        });
        toast.success('Confirmation email sent!');
      }
    } catch (e) {
      toast.error('Failed to update status');
    }
  };

  const filteredBookings = bookings.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.phone.includes(search)
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Eye-Test Bookings</h1>
        <p className="text-muted-foreground mt-1">Manage customer appointments for eye tests</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input 
          placeholder="Search by name or phone..." 
          className="pl-10 py-6 text-base rounded-xl"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted-foreground">Loading bookings...</div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map(booking => (
            <div key={booking.id} className="bg-white border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center transition-colors hover:border-primary/30">
              
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-lg text-foreground">{booking.name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                    booking.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                    booking.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                    'bg-slate-100 text-slate-600'
                  }`}>
                    {booking.status}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5"><Phone className="w-4 h-4" /> {booking.phone}</div>
                  <div className="flex items-center gap-1.5 text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-md">
                    <Calendar className="w-4 h-4" /> {new Date(booking.booking_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1.5 text-primary font-medium bg-primary/5 px-2 py-0.5 rounded-md">
                    <Clock className="w-4 h-4" /> {booking.time_slot}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground/70">
                  Requested on {new Date(booking.created_at).toLocaleString()}
                </div>
              </div>

              {/* Action Buttons (Contextual based on status) */}
              <div className="flex gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0">
                {booking.status === 'pending' && (
                  <>
                    <button onClick={() => updateStatus(booking, 'confirmed')} className="flex-1 sm:flex-none px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">Confirm</button>
                    <button onClick={() => updateStatus(booking, 'cancelled')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                  </>
                )}
                {booking.status === 'confirmed' && (
                  <>
                    <button onClick={() => updateStatus(booking, 'completed')} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">Mark Done</button>
                    <button onClick={() => updateStatus(booking, 'cancelled')} className="flex-1 sm:flex-none px-4 py-2 bg-slate-100 text-slate-600 font-medium rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                  </>
                )}
              </div>

            </div>
          ))}
          {filteredBookings.length === 0 && !loading && (
             <div className="py-12 text-center text-muted-foreground border-2 border-dashed rounded-2xl">
               No bookings found.
             </div>
          )}
        </div>
      )}
    </div>
  );
}
