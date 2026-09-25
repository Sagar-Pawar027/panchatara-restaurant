import React, { useState } from 'react';
import { Calendar, Clock, Users, MapPin, Sparkles, CheckCircle, ShieldCheck } from 'lucide-react';
import { TABLE_AREAS } from '../data/restaurantData';
import { ReservationData } from '../types';

interface ReservationSectionProps {
  onReservationSuccess: (reservation: ReservationData) => void;
  activeReservation: ReservationData | null;
  onViewActiveReservation: () => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  onReservationSuccess,
  activeReservation,
  onViewActiveReservation,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState(TABLE_AREAS[0].id);
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('08:00 PM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const selectedArea = TABLE_AREAS.find((a) => a.id === selectedAreaId) || TABLE_AREAS[0];
  const advanceAmount = selectedArea.advanceFee;

  const timeSlots = [
    '12:30 PM', '01:15 PM', '02:00 PM', '02:45 PM',
    '07:00 PM', '07:45 PM', '08:15 PM', '09:00 PM', '09:45 PM', '10:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Please enter the primary guest name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setFormError('Please enter a valid 10-digit phone number for booking updates.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      // Generate authentic Panchtara reference ID
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const referenceId = `PANJ-RES-${randomNum}`;

      const newReservation: ReservationData = {
        id: `res-${Date.now()}`,
        referenceId,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        date,
        time,
        guests,
        tableAreaId: selectedArea.id,
        tableAreaName: selectedArea.name,
        specialRequests: specialRequests.trim(),
        advanceAmount,
        createdAt: new Date().toISOString(),
        status: 'Confirmed',
      };

      setIsSubmitting(false);
      onReservationSuccess(newReservation);
    }, 600);
  };

  return (
    <section id="reservations" className="py-20 sm:py-24 bg-[#0D0B08] text-[#E8DFD0] relative border-t border-[#1C1610]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest text-[#C9A24D] font-medium mb-2">
            <span>Guaranteed Table Seating</span>
            <span aria-hidden="true">·</span>
            <span>Zero Waiting Time</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-[#F7E7CE]">
            Book Your Royal Table
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#A89F91]">
            Experience Malwa fine dining without highway rush. A 50% advance token secures your selected dining gazebo and is 100% adjusted against your dining bill.
          </p>

          {/* Active Booking Banner */}
          {activeReservation && (
            <div className="mt-6 p-4 rounded-xl bg-[#C9A24D]/10 border border-[#C9A24D]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <h4 className="text-xs font-semibold text-[#F7E7CE]">
                    You have an active booking: <span className="font-mono text-[#E6C687]">{activeReservation.referenceId}</span>
                  </h4>
                  <p className="text-[11px] text-[#A89F91]">
                    {activeReservation.date} at {activeReservation.time} · {activeReservation.guests} Guests ({activeReservation.tableAreaName})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onViewActiveReservation}
                className="px-3 py-1.5 rounded-lg bg-[#C9A24D]/25 hover:bg-[#C9A24D]/40 text-[#F7E7CE] text-xs font-semibold transition-colors shrink-0"
              >
                View Reference Details
              </button>
            </div>
          )}
        </div>

        {/* Booking Form Layout */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Table Ambience & Seating Selection */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#C9A24D] mb-3">
                Step 1: Choose Dining Ambience
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {TABLE_AREAS.map((area) => {
                  const isSelected = area.id === selectedAreaId;
                  return (
                    <button
                      key={area.id}
                      type="button"
                      onClick={() => setSelectedAreaId(area.id)}
                      className={`text-left p-4 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-[#1C1610] border-[#C9A24D] shadow-lg shadow-[#C9A24D]/10 ring-1 ring-[#C9A24D]'
                          : 'bg-[#120F0C] border-[#261E14] hover:border-[#3D3021] text-[#A89F91]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-bold ${isSelected ? 'text-[#F7E7CE]' : 'text-[#C4B9A7]'}`}>
                          {area.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#C9A24D] bg-[#C9A24D]/10 px-2 py-0.5 rounded">
                          ₹{area.advanceFee} Advance
                        </span>
                      </div>
                      <p className="text-xs leading-relaxed text-[#8C8273] line-clamp-2">
                        {area.description}
                      </p>
                      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#A89F91]">
                        <Users className="w-3.5 h-3.5 text-[#C9A24D]" />
                        <span>Ideal for {area.capacity}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date & Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="booking-date" className="block text-xs font-semibold text-[#C4B9A7] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A24D]" />
                  <span>Reservation Date</span>
                </label>
                <input
                  id="booking-date"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#14100C] border border-[#2B231B] text-[#E8DFD0] text-sm focus:outline-none focus:border-[#C9A24D] focus:ring-1 focus:ring-[#C9A24D]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#C4B9A7] mb-2 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#C9A24D]" />
                  <span>Number of Guests: <span className="text-[#F7E7CE] font-bold">{guests}</span></span>
                </label>
                <div className="flex items-center gap-2">
                  {[2, 4, 6, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuests(num)}
                      className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                        guests === num
                          ? 'bg-[#C9A24D] text-[#0D0B08] border-[#C9A24D]'
                          : 'bg-[#14100C] border-[#2B231B] text-[#A89F91] hover:text-white'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Slot Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#C4B9A7] mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C9A24D]" />
                <span>Select Dining Slot</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {timeSlots.map((slot) => {
                  const isSelected = slot === time;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTime(slot)}
                      className={`py-2 px-1 text-xs font-medium rounded-lg border text-center transition-all ${
                        isSelected
                          ? 'bg-[#C9A24D]/25 border-[#C9A24D] text-[#F7E7CE] font-bold'
                          : 'bg-[#14100C] border-[#261E14] text-[#A89F91] hover:border-[#3D3021] hover:text-[#E8DFD0]'
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Guest Details & Confirmation Trigger */}
          <div className="lg:col-span-5 bg-[#14100C] border border-[#2B231B] rounded-2xl p-6 shadow-xl relative">
            <h3 className="text-lg font-bold font-display text-[#F7E7CE] mb-4 pb-3 border-b border-[#261E14] flex items-center justify-between">
              <span>Primary Guest Details</span>
              <span className="text-[10px] uppercase tracking-wider text-[#C9A24D] font-sans font-semibold">
                Direct Booking
              </span>
            </h3>

            {formError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-xs">
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="guest-name" className="block text-xs font-medium text-[#A89F91] mb-1">
                  Full Name *
                </label>
                <input
                  id="guest-name"
                  type="text"
                  placeholder="e.g. Sagar Pawar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0D0A08] border border-[#2B231B] text-[#E8DFD0] text-sm focus:outline-none focus:border-[#C9A24D]"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="guest-phone" className="block text-xs font-medium text-[#A89F91] mb-1">
                    Phone Number (SMS/WhatsApp) *
                  </label>
                  <input
                    id="guest-phone"
                    type="tel"
                    placeholder="10-digit Mobile"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0D0A08] border border-[#2B231B] text-[#E8DFD0] text-sm focus:outline-none focus:border-[#C9A24D]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="guest-email" className="block text-xs font-medium text-[#A89F91] mb-1">
                    Email Address
                  </label>
                  <input
                    id="guest-email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0D0A08] border border-[#2B231B] text-[#E8DFD0] text-sm focus:outline-none focus:border-[#C9A24D]"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="guest-special-requests" className="block text-xs font-medium text-[#A89F91] mb-1">
                  Dietary / Special Occasion Notes
                </label>
                <input
                  id="guest-special-requests"
                  type="text"
                  placeholder="e.g., Jain prep without root vegetables, Birthday celebration"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-[#0D0A08] border border-[#2B231B] text-[#E8DFD0] text-sm focus:outline-none focus:border-[#C9A24D]"
                />
              </div>

              {/* Advance Breakdown */}
              <div className="p-3.5 rounded-xl bg-[#0F0C09] border border-[#2B231B] space-y-2 text-xs">
                <div className="flex justify-between text-[#A89F91]">
                  <span>Reserved Seating:</span>
                  <span className="text-[#E8DFD0] font-semibold">{selectedArea.name}</span>
                </div>
                <div className="flex justify-between text-[#A89F91]">
                  <span>Table Hold Deposit:</span>
                  <span className="text-[#C9A24D] font-bold tabular-nums">₹{advanceAmount}</span>
                </div>
                <p className="text-[10px] text-[#8C8273] pt-1 border-t border-[#221B14] leading-relaxed">
                  * 100% of this ₹{advanceAmount} deposit is subtracted from your dining check at Panchtara.
                </p>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#997424] hover:from-[#D8B45E] hover:to-[#A8822F] text-[#0D0B08] font-bold text-xs sm:text-sm tracking-wide uppercase flex items-center justify-center gap-2 shadow-lg shadow-[#C9A24D]/15 transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-[#0D0B08] border-t-transparent rounded-full animate-spin" />
                    Generating Booking Reference...
                  </span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#0D0B08]" />
                    <span>Confirm Table & Get Reference ID</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <span className="text-[11px] text-[#8C8273] inline-flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C9A24D]" />
                  Instant Reference ID & SMS Confirmation
                </span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};
