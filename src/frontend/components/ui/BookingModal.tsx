'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, CheckCircle2 } from 'lucide-react';
import { useBookingModal } from '@/store/bookingModalStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { createBooking } from '@/lib/api';

export default function BookingModal() {
  const { isOpen, close } = useBookingModal();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(false);

  // Mock time slots
  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '04:00 PM', '05:00 PM', '06:00 PM'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phone || !date || !time) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Save booking in Supabase
      await createBooking({
        name,
        phone,
        booking_date: date,
        time_slot: time,
        status: 'pending'
      });

      // Send mock Brevo admin notification (in try block so DB works even if notify fails)
      try {
        await fetch('/api/notify-admin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, date, time })
        });
      } catch (e) {
        console.warn('Brevo notice failed:', e);
      }

      toast.success('Booking request received — we will call to confirm.');
      
      // Reset form & close
      setName('');
      setPhone('');
      setDate('');
      setTime('');
      close();
    } catch (err) {
      console.error('Booking failed:', err);
      toast.error('Failed to book. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="bg-card border border-line rounded-[2.5rem] w-full max-w-lg p-8 shadow-2xl relative z-10 overflow-hidden text-foreground text-left"
          >
            {/* Close Button */}
            <button 
              onClick={close}
              className="absolute top-6 right-6 w-10 h-10 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-foreground transition-all duration-300 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header */}
            <div className="mb-6 flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brass-dim flex items-center justify-center text-primary">
                <Calendar size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-foreground">Book Free Eye Test</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Clinical precision at Dahegam, Gujarat</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <User size={12} /> Full Name *
                </label>
                <input 
                  type="text" 
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="John Doe" 
                  className="w-full bg-background/50 border border-line rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Phone size={12} /> Phone Number *
                </label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+91 98765 43210" 
                  className="w-full bg-background/50 border border-line rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {/* Date selection */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-1.5 flex items-center gap-1.5">
                  <Calendar size={12} /> Preferred Date *
                </label>
                <input 
                  type="date" 
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full bg-background/50 border border-line rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                />
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Clock size={12} /> Preferred Time *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        time === slot 
                          ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                          : 'border-line bg-background/50 hover:border-primary/50 text-foreground'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading || !name || !phone || !date || !time}
                className="w-full h-13 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl btn-brass-sweep border-none shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? 'Submitting...' : 'Confirm Appointment'}
              </Button>

            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
