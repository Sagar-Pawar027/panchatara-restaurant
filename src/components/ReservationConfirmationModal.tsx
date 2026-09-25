import React, { useState } from 'react';
import { Check, Copy, Calendar, Clock, Users, MapPin, X, Utensils, ShieldCheck } from 'lucide-react';
import { ReservationData } from '../types';

interface ReservationConfirmationModalProps {
  reservation: ReservationData | null;
  isOpen: boolean;
  onClose: () => void;
  onBrowseMenu: () => void;
}

export const ReservationConfirmationModal: React.FC<ReservationConfirmationModalProps> = ({
  reservation,
  isOpen,
  onClose,
  onBrowseMenu,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !reservation) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(reservation.referenceId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#14100C] border border-[#C9A24D]/40 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black text-[#E8DFD0] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-modal-title"
      >
        {/* Subtle decorative gold glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A24D]/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8C8273] hover:text-white rounded-lg hover:bg-[#201A14] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Seal */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#C9A24D]/15 border border-[#C9A24D]/40 text-[#C9A24D] mb-3">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <span className="text-xs uppercase tracking-widest text-[#C9A24D] font-semibold block mb-1">
            Table Reserved Successfully
          </span>
          <h3 id="confirmation-modal-title" className="text-2xl font-bold font-display text-[#F7E7CE]">
            Namaste, {reservation.name}
          </h3>
          <p className="text-xs text-[#A89F91] mt-1">
            Your table reservation has been recorded at Panchtara Pure Veg.
          </p>
        </div>

        {/* Prominent Booking Reference ID Card */}
        <div className="p-4 rounded-xl bg-[#0D0A08] border border-[#C9A24D]/30 mb-6">
          <div className="text-center">
            <span className="text-[11px] uppercase tracking-wider text-[#8C8273] font-medium block">
              Booking Reference Number
            </span>
            <div className="flex items-center justify-center gap-3 mt-1.5">
              <span className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-[#F7E7CE] select-all">
                {reservation.referenceId}
              </span>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#C9A24D]/20 hover:bg-[#C9A24D]/35 text-[#E6C687] text-xs font-semibold flex items-center gap-1.5 transition-colors border border-[#C9A24D]/30 active:scale-95"
                title="Copy reference ID"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-[#A89F91] mt-2">
              Save this reference number. Show it at the front desk upon arrival.
            </p>
          </div>
        </div>

        {/* Key Reservation Details */}
        <div className="grid grid-cols-2 gap-3 text-xs mb-6 p-3.5 rounded-xl bg-[#1B1611]/80 border border-[#2B231B]">
          <div className="flex items-center gap-2 text-[#C4B9A7]">
            <Calendar className="w-4 h-4 text-[#C9A24D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#8C8273] block">Date</span>
              <span className="font-medium text-[#E8DFD0]">{reservation.date}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#C4B9A7]">
            <Clock className="w-4 h-4 text-[#C9A24D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#8C8273] block">Time Slot</span>
              <span className="font-medium text-[#E8DFD0]">{reservation.time}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#C4B9A7]">
            <Users className="w-4 h-4 text-[#C9A24D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#8C8273] block">Party Size</span>
              <span className="font-medium text-[#E8DFD0]">{reservation.guests} Guests</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#C4B9A7]">
            <MapPin className="w-4 h-4 text-[#C9A24D] shrink-0" />
            <div>
              <span className="text-[10px] text-[#8C8273] block">Dining Area</span>
              <span className="font-medium text-[#E8DFD0] truncate max-w-[120px] block">{reservation.tableAreaName}</span>
            </div>
          </div>
        </div>

        {/* Location & Advance Details */}
        <div className="text-[11px] text-[#A89F91] border-t border-[#2B231B] pt-3.5 mb-6 space-y-1.5">
          <div className="flex items-center justify-between">
            <span>50% Advance Guarantee:</span>
            <span className="text-[#F7E7CE] font-semibold tabular-nums">₹{reservation.advanceAmount} (Adjusted against food bill)</span>
          </div>
          <div className="flex items-center justify-between text-[#8C8273]">
            <span>Venue Address:</span>
            <span>Indore Bypass Road, Near Silicon City, Indore</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => {
              onClose();
              onBrowseMenu();
            }}
            className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#C9A24D] to-[#997424] hover:from-[#D8B45E] hover:to-[#A8822F] text-[#0D0B08] font-bold text-xs tracking-wide uppercase flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Pre-Order Dishes</span>
          </button>
          
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-2.5 px-5 rounded-xl bg-[#201A14] hover:bg-[#2B231B] text-[#C4B9A7] hover:text-white font-medium text-xs tracking-wide transition-colors border border-[#3A2E20]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
