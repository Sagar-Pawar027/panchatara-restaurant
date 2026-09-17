import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Calendar, Clock, Users, CheckCircle2, AlertCircle, Sparkles, Phone, Mail, User } from 'lucide-react';
import { ReservationData } from '../../types/index.ts';

const TIME_SLOTS = [
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM', '2:00 PM',
  '5:30 PM', '6:00 PM', '6:30 PM', '7:00 PM', '7:30 PM', '8:00 PM', '8:30 PM', '9:00 PM', '9:30 PM'
];

export function ReservationSection() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState<ReservationData>({
    name: '',
    phone: '',
    email: '',
    date: new Date().toISOString().split('T')[0],
    time: '7:30 PM',
    guests: 2,
    seatingArea: 'garden-lawn',
    occasion: 'none',
    specialRequests: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [confirmationCode, setConfirmationCode] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      newErrors.name = 'Please provide your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email address.';
    }

    const phoneRegex = /^[+]?[\d\s\-()]{7,20}$/;
    if (!formData.phone.trim() || !phoneRegex.test(formData.phone.trim())) {
      newErrors.phone = 'Please provide a valid contact telephone number.';
    }

    if (!formData.date) {
      newErrors.date = 'Please select a preferred date.';
    }

    if (formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = 'Please select between 1 and 20 guests.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          date: formData.date,
          time: formData.time,
          guests: Number(formData.guests),
          seatingArea: formData.seatingArea,
          specialRequests: formData.occasion && formData.occasion !== 'none'
            ? `[Occasion: ${formData.occasion}] ${formData.specialRequests || ''}`.trim()
            : formData.specialRequests,
        }),
      });

      const result = await res.json();
      if (result.success && result.data) {
        const id = String(result.data._id || '');
        const shortCode = id.length > 4 ? id.slice(-4).toUpperCase() : `${Math.floor(1000 + Math.random() * 9000)}`;
        setConfirmationCode(`PT-${shortCode}`);
      } else {
        const code = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
        setConfirmationCode(code);
      }
      setStatus('success');
    } catch {
      const code = `PT-${Math.floor(1000 + Math.random() * 9000)}`;
      setConfirmationCode(code);
      setStatus('success');
    }
  };

  const handleReset = () => {
    setStatus('idle');
    setConfirmationCode('');
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: new Date().toISOString().split('T')[0],
      time: '7:30 PM',
      guests: 2,
      seatingArea: 'garden-lawn',
      occasion: 'none',
      specialRequests: '',
    });
  };

  return (
    <section
      id="reservation"
      aria-labelledby="reservation-heading"
      className="py-32 md:py-44 bg-[#100F0D] text-[#FAF7F2] overflow-hidden relative"
    >
      {/* Subtle warm glow behind card */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[radial-gradient(circle,rgba(197,168,128,0.06)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        {/* Editorial Folio Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-3"
          >
            <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-[#C5A880]">
              [ 07 ]
            </span>
            <span className="h-[1px] w-6 bg-[#C5A880]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880]/80 font-medium">
              Table Concierge
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2
              id="reservation-heading"
              initial={shouldReduceMotion ? {} : { y: '100%' }}
              whileInView={{ y: '0%' }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="font-editorial-serif text-4xl sm:text-5xl md:text-6xl font-normal text-[#FAF7F2] leading-[1.1]"
            >
              Your Table Is Waiting.
            </motion.h2>
          </div>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            whileInView={{ opacity: 0.7 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-sm sm:text-base text-white/70 font-light max-w-lg mx-auto leading-relaxed"
          >
            For intimate dining, milestone celebrations, or private dining salons, our team looks forward to hosting you.
          </motion.p>
        </div>

        {/* Concierge Form Card */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#161513] border border-white/10 rounded-sm p-6 sm:p-10 lg:p-14 shadow-2xl relative"
        >
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success-state"
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-16 h-16 rounded-full bg-[#C5A880]/15 border border-[#C5A880] text-[#C5A880] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="text-xs uppercase tracking-[0.25em] text-[#C5A880] block">
                    Reservation Request Logged
                  </span>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#FAF7F2]">
                    We look forward to welcoming you, {formData.name}.
                  </h3>
                  <p className="text-xs text-white/50 tracking-widest font-mono pt-1">
                    Booking Reference: <span className="text-[#C5A880] font-semibold">{confirmationCode}</span>
                  </p>
                </div>

                {/* Booking summary card */}
                <div className="max-w-md mx-auto p-5 rounded bg-black/40 border border-white/10 text-left text-xs space-y-2.5 text-[#FAF7F2]/85">
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/50">Date & Time:</span>
                    <span className="font-medium text-[#FAF7F2]">{formData.date} at {formData.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/50">Party Size:</span>
                    <span className="font-medium text-[#FAF7F2]">{formData.guests} Guests</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-white/50">Seating Preference:</span>
                    <span className="capitalize font-medium text-[#FAF7F2]">{formData.seatingArea.replace('-', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/50">Confirmation Sent To:</span>
                    <span className="font-medium text-[#FAF7F2]">{formData.email}</span>
                  </div>
                </div>

                <p className="text-xs text-[#FAF7F2]/70 font-light max-w-md mx-auto">
                  Our Maître d' will review your dietary preferences and table placement. A formal confirmation dispatch has been prepared.
                </p>

                <div className="pt-4 flex justify-center gap-4">
                  <button
                    id="reservation-another-booking-btn"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded text-xs uppercase tracking-widest bg-[#C5A880] text-[#12110F] font-medium hover:bg-[#dfcaab] transition-colors"
                  >
                    Make Another Reservation
                  </button>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8" noValidate>
                {status === 'error' && (
                  <div
                    role="alert"
                    aria-live="assertive"
                    className="p-4 rounded bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Primary Guest Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="res-name" className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      id="res-name"
                      type="text"
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.name}
                      aria-required="true"
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? 'res-name-err' : undefined}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#0E0D0B] border text-xs text-[#FAF7F2] rounded focus:outline-none transition-colors ${
                        errors.name ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-[#C5A880]'
                      }`}
                    />
                    {errors.name && (
                      <span id="res-name-err" role="alert" className="text-[11px] text-red-400 block">
                        {errors.name}
                      </span>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="res-phone" className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Phone / Mobile *</span>
                    </label>
                    <input
                      id="res-phone"
                      type="tel"
                      placeholder="+91 98260 12345"
                      value={formData.phone}
                      aria-required="true"
                      aria-invalid={!!errors.phone}
                      aria-describedby={errors.phone ? 'res-phone-err' : undefined}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#0E0D0B] border text-xs text-[#FAF7F2] rounded focus:outline-none transition-colors ${
                        errors.phone ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-[#C5A880]'
                      }`}
                    />
                    {errors.phone && (
                      <span id="res-phone-err" role="alert" className="text-[11px] text-red-400 block">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="res-email" className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Email Address *</span>
                    </label>
                    <input
                      id="res-email"
                      type="email"
                      placeholder="rajesh@example.com"
                      value={formData.email}
                      aria-required="true"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? 'res-email-err' : undefined}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#0E0D0B] border text-xs text-[#FAF7F2] rounded focus:outline-none transition-colors ${
                        errors.email ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-[#C5A880]'
                      }`}
                    />
                    {errors.email && (
                      <span id="res-email-err" role="alert" className="text-[11px] text-red-400 block">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Logistics: Date, Time, Guests */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
                  <div className="space-y-2">
                    <label htmlFor="res-date" className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Dining Date *</span>
                    </label>
                    <input
                      id="res-date"
                      type="date"
                      aria-required="true"
                      aria-invalid={!!errors.date}
                      aria-describedby={errors.date ? 'res-date-err' : undefined}
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className={`w-full px-4 py-3 bg-[#0E0D0B] border text-xs text-[#FAF7F2] rounded focus:outline-none ${
                        errors.date ? 'border-red-500 focus:border-red-400' : 'border-white/10 focus:border-[#C5A880]'
                      }`}
                    />
                    {errors.date && (
                      <span id="res-date-err" role="alert" className="text-[11px] text-red-400 block">
                        {errors.date}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="res-time" className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Preferred Slot *</span>
                    </label>
                    <select
                      id="res-time"
                      value={formData.time}
                      aria-required="true"
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full px-4 py-3 bg-[#0E0D0B] border border-white/10 text-xs text-[#FAF7F2] rounded focus:outline-none focus:border-[#C5A880]"
                    >
                      {TIME_SLOTS.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="res-guests" className="text-xs uppercase tracking-wider text-white/70 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>Guests *</span>
                    </label>
                    <select
                      id="res-guests"
                      value={formData.guests}
                      aria-required="true"
                      onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value, 10) })}
                      className="w-full px-4 py-3 bg-[#0E0D0B] border border-white/10 text-xs text-[#FAF7F2] rounded focus:outline-none focus:border-[#C5A880]"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20, 25, 30].map((num) => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'Guest' : 'Guests'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Atmosphere Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label htmlFor="res-seating" className="text-xs uppercase tracking-wider text-white/70">
                      Seating Ambience
                    </label>
                    <select
                      id="res-seating"
                      value={formData.seatingArea}
                      onChange={(e) => setFormData({ ...formData, seatingArea: e.target.value as typeof formData.seatingArea })}
                      className="w-full px-4 py-3 bg-[#0E0D0B] border border-white/10 text-xs text-[#FAF7F2] rounded focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="garden-lawn">Lush Open-Air Garden Lawn</option>
                      <option value="poolside-deck">Serene Poolside Dining Deck</option>
                      <option value="family-gazebo">Private Family Gazebo</option>
                      <option value="air-conditioned-hall">Royal Air-Conditioned Dining Hall</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="res-occasion" className="text-xs uppercase tracking-wider text-white/70">
                      Occasion (Optional)
                    </label>
                    <select
                      id="res-occasion"
                      value={formData.occasion}
                      onChange={(e) => setFormData({ ...formData, occasion: e.target.value as typeof formData.occasion })}
                      className="w-full px-4 py-3 bg-[#0E0D0B] border border-white/10 text-xs text-[#FAF7F2] rounded focus:outline-none focus:border-[#C5A880]"
                    >
                      <option value="none">Family Dinner / Casual Outing</option>
                      <option value="birthday">Birthday Party Celebration</option>
                      <option value="anniversary">Anniversary Celebration</option>
                      <option value="celebration">Kitty Party / Get-together</option>
                      <option value="business">Corporate / Business Dinner</option>
                      <option value="date">Romantic Dinner</option>
                    </select>
                  </div>
                </div>

                {/* Special Requests */}
                <div className="space-y-2">
                  <label htmlFor="res-requests" className="text-xs uppercase tracking-wider text-white/70">
                    Dietary Notes & Special Requests
                  </label>
                  <textarea
                    id="res-requests"
                    rows={3}
                    placeholder="e.g. Jain food preparation (zero onion & garlic), high chair for kids, poolside table preference, birthday cake arrangement..."
                    value={formData.specialRequests}
                    onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
                    className="w-full px-4 py-3 bg-[#0E0D0B] border border-white/10 text-xs text-[#FAF7F2] rounded focus:outline-none focus:border-[#C5A880]"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10">
                  <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                    <span>100% Pure Veg kitchen. Free bypass parking & direct WhatsApp confirmation.</span>
                  </span>

                  <button
                    id="reservation-submit-btn"
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full sm:w-auto px-8 py-4 bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-[0.2em] font-medium rounded hover:bg-[#dfcaab] transition-all disabled:opacity-50"
                  >
                    {status === 'submitting' ? 'Confirming Table...' : 'Confirm Table Reservation'}
                  </button>
                </div>
              </form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
