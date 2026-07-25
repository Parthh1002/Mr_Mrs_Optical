'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import { createBooking } from '@/lib/api';

export default function BookAppointmentPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Mock time slots
  const timeSlots = ['10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM', '12:00 PM', '04:00 PM', '04:30 PM', '05:00 PM'];

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTime || !selectedDate) return;
    
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    
    setIsSubmitting(true);
    try {
      // 1. Save to database
      await createBooking({
        name,
        phone,
        email,
        booking_date: selectedDate,
        time_slot: selectedTime,
        status: 'pending'
      });
      
      // 2. Notify Admin via Brevo email
      await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          date: selectedDate,
          time: selectedTime
        })
      });
      
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      alert('Failed to book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full bg-card p-10 rounded-3xl border border-border text-center shadow-xl">
          <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle2 className="w-10 h-10 text-success" />
          </div>
          <h2 className="text-3xl font-[family-name:var(--font-fraunces)] font-bold text-foreground mb-4">Booking Confirmed!</h2>
          <p className="text-muted-foreground mb-6">
            Your eye test appointment has been scheduled for <strong className="text-foreground">{selectedDate}</strong> at <strong className="text-foreground">{selectedTime}</strong>. We will send you an SMS confirmation shortly.
          </p>
          <div className="bg-muted/50 p-4 rounded-xl border border-border mb-8 text-sm text-left">
            <p className="font-semibold mb-1">Reference ID: #BKG-8492</p>
            <p className="text-muted-foreground">Store: Dahegam Main Branch</p>
          </div>
          <Button onClick={() => window.location.href = '/'} className="w-full bg-primary text-white rounded-full h-12">
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-[family-name:var(--font-fraunces)] font-bold text-foreground mb-4">
            Book a Free Eye Test
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our comprehensive eye examination using state-of-the-art medical equipment. Our expert optometrists ensure your vision is perfect.
          </p>
        </div>

        <div className="bg-card rounded-3xl border border-border shadow-lg overflow-hidden flex flex-col md:flex-row">
          
          {/* Left Info Panel (Vision Express Style Trust Layer) */}
          <div className="md:w-1/3 bg-primary p-8 text-primary-foreground">
            <h3 className="text-2xl font-[family-name:var(--font-fraunces)] font-bold mb-6">What to expect</h3>
            <ul className="space-y-6">
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h4 className="font-semibold mb-1">Vision Assessment</h4>
                  <p className="text-sm text-white/70">Complete check of your current prescription and visual acuity.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h4 className="font-semibold mb-1">Eye Health Check</h4>
                  <p className="text-sm text-white/70">Screening for common eye conditions using digital retinal imaging.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">3</div>
                <div>
                  <h4 className="font-semibold mb-1">Expert Advice</h4>
                  <p className="text-sm text-white/70">Personalized lens recommendations based on your lifestyle.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Booking Form */}
          <div className="md:w-2/3 p-8 md:p-12">
            <form onSubmit={handleBooking} className="space-y-8">
              
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Calendar className="w-5 h-5 text-primary" /> 1. Select Date & Time
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label htmlFor="date">Appointment Date</Label>
                    <Input 
                      type="date" 
                      id="date" 
                      required 
                      className="h-12 bg-muted/20 border-border rounded-xl"
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <div className="space-y-4 md:col-span-2 mt-4">
                    <Label>Time Slot</Label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map(slot => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`h-12 text-sm font-medium rounded-xl border transition-all ${
                            selectedTime === slot 
                              ? 'border-primary bg-primary text-primary-foreground shadow-md' 
                              : 'border-border bg-card hover:border-primary/50 text-foreground'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                    {/* Hidden input for HTML5 validation */}
                    <input type="text" required value={selectedTime} onChange={() => {}} className="opacity-0 absolute w-0 h-0" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <MapPin className="w-5 h-5 text-primary" /> 2. Store Location
                </h3>
                <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl flex items-start gap-4">
                  <input type="radio" checked readOnly className="mt-1 w-4 h-4 text-primary accent-primary" />
                  <div>
                    <h4 className="font-semibold text-foreground">Dahegam Main Branch</h4>
                    <p className="text-sm text-muted-foreground mt-1">G-14, Dev Complex, Dahegam, Gujarat 382305</p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 border-b border-border pb-2">
                  <Clock className="w-5 h-5 text-primary" /> 3. Your Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name" className="text-foreground">Full Name</Label>
                    <Input id="name" name="name" required placeholder="John Doe" className="mt-1.5 h-12 bg-background border-border" />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-foreground">Phone Number</Label>
                    <Input id="phone" name="phone" required placeholder="+91 98765 43210" className="mt-1.5 h-12 bg-background border-border" />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <Label htmlFor="email" className="text-foreground">Email Address</Label>
                    <Input id="email" name="email" type="email" placeholder="john@example.com (Optional but recommended)" className="mt-1.5 h-12 bg-background border-border" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Any special notes?</Label>
                    <textarea 
                      id="notes" 
                      className="w-full rounded-md border border-input bg-muted/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px]" 
                      placeholder="E.g., I have my old prescription..."
                    />
                  </div>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold bg-accent hover:bg-accent/90 text-white rounded-xl shadow-lg border-none"
                disabled={isSubmitting || !selectedDate || !selectedTime}
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Booking'}
              </Button>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
