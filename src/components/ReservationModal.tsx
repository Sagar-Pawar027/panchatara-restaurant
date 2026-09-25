import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { TABLE_AREAS } from '../data/restaurantData';
import { ReservationData } from '../types';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reservation: ReservationData) => void;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedAreaId, setSelectedAreaId] = useState(TABLE_AREAS[0].id);
  const [guests, setGuests] = useState(4);
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('08:15 PM');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [specialRequests, setSpecialRequests] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const selectedArea = TABLE_AREAS.find((a) => a.id === selectedAreaId) || TABLE_AREAS[0];
  const advanceAmount = selectedArea.advanceFee;

  const timeSlots = [
    '12:30 PM', '01:15 PM', '02:00 PM', '02:45 PM',
    '07:00 PM', '07:45 PM', '08:15 PM', '09:00 PM', '09:45 PM', '10:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!phone.trim() || phone.trim().length < 10) {
      setError('Please provide a valid 10-digit mobile number for SMS confirmation.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const randomNum = Math.floor(100000 + Math.random() * 900000);
      const referenceId = `PANJ-RES-${randomNum}`;

      const reservation: ReservationData = {
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
      onClose();
      onSuccess(reservation);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#14120F] border border-[#C5A880]/50 rounded-lg p-6 sm:p-8 shadow-2xl text-[#FAF7F2] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#C5A880] hover:text-white rounded-lg hover:bg-[#241F1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block font-medium mb-1">
            Indore Bypass Sanctuary
          </span>
          <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#FAF7F2] font-normal">
            Reserve Your Royal Table
          </h3>
          <p className="text-xs text-[#FAF7F2]/70 mt-1">
            Zero wait time on arrival. 50% advance lock is adjusted against your food bill.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 rounded bg-red-950/50 border border-red-800 text-red-200 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seating Area Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#C5A880] mb-2.5">
              1. Select Table Ambiance
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {TABLE_AREAS.map((area) => {
                const isSelected = area.id === selectedAreaId;
                return (
                  <button
                    key={area.id}
                    type="button"
                    onClick={() => setSelectedAreaId(area.id)}
                    className={`text-left p-3.5 rounded border transition-all ${
                      isSelected
                        ? 'bg-[#221D17] border-[#C5A880] shadow-md ring-1 ring-[#C5A880]'
                        : 'bg-[#181613] border-[#2A241E] hover:border-[#3E352C] text-[#FAF7F2]/80'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-editorial-serif text-sm font-semibold text-[#FAF7F2]">
                        {area.name}
                      </span>
                      <span className="text-[10px] font-mono text-[#C5A880] bg-[#C5A880]/15 px-2 py-0.5 rounded">
                        ₹{area.advanceFee} Advance
                      </span>
                    </div>
                    <p className="text-[11px] text-[#FAF7F2]/65 line-clamp-2">
                      {area.description}
                    </p>
                    <div className="mt-2 text-[10px] text-[#C5A880] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      <span>{area.capacity}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date, Guests, & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="res-modal-date" className="block text-xs font-medium text-[#FAF7F2]/80 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#C5A880]" />
                <span>Date</span>
              </label>
              <input
                id="res-modal-date"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#FAF7F2]/80 mb-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-[#C5A880]" />
                <span>Party: {guests} Guests</span>
              </label>
              <div className="flex items-center gap-1">
                {[2, 4, 6, 8, 12].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setGuests(num)}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded border transition-all ${
                      guests === num
                        ? 'bg-[#C5A880] text-[#12110F] border-[#C5A880]'
                        : 'bg-[#100E0C] border-[#2E2821] text-[#FAF7F2]/70 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="res-modal-time" className="block text-xs font-medium text-[#FAF7F2]/80 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#C5A880]" />
                <span>Time Slot</span>
              </label>
              <select
                id="res-modal-time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
              >
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Guest Contact Information */}
          <div className="space-y-3 pt-2 border-t border-[#241F1A]">
            <span className="block text-xs font-semibold uppercase tracking-wider text-[#C5A880]">
              2. Guest Contact
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="res-modal-name" className="block text-[11px] text-[#FAF7F2]/70 mb-1">Full Name *</label>
                <input
                  id="res-modal-name"
                  type="text"
                  placeholder="Primary Guest"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="res-modal-phone" className="block text-[11px] text-[#FAF7F2]/70 mb-1">Mobile (SMS/WhatsApp) *</label>
                <input
                  id="res-modal-phone"
                  type="tel"
                  placeholder="10-digit number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="res-modal-special-notes" className="block text-[11px] text-[#FAF7F2]/70 mb-1">Special Occasion / Dietary Notes</label>
              <input
                id="res-modal-special-notes"
                type="text"
                placeholder="e.g. Jain preparation, Anniversary table rose petals"
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
              />
            </div>
          </div>

          {/* Advance Deposit Summary */}
          <div className="p-3.5 rounded bg-[#181512] border border-[#C5A880]/30 flex items-center justify-between text-xs">
            <div>
              <span className="text-[#FAF7F2] font-semibold block">{selectedArea.name}</span>
              <span className="text-[11px] text-emerald-400">100% of deposit adjusted on food bill</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-[#C5A880] uppercase block">Advance Deposit</span>
              <span className="text-base font-mono font-bold text-[#FAF7F2]">₹{advanceAmount}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded bg-gradient-to-r from-[#C5A880] to-[#997424] hover:from-[#D5B890] hover:to-[#A8822F] text-[#12110F] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Generating Booking Reference...</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>CONFIRM RESERVATION & GET BOOKING ID</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
