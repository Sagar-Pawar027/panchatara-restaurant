import React, { useState } from 'react';
import { X, Calendar, Clock, Users, MapPin, Copy, Check, Bookmark } from 'lucide-react';
import { Reservation } from '../types';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Reservation[];
  onSelectBooking: (booking: Reservation) => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  onSelectBooking
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (refId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(refId);
    setCopiedId(refId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#121c16] border border-[#d4af37]/40 rounded-2xl p-6 sm:p-7 shadow-2xl text-white my-auto overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#8e9f94] hover:text-white p-1.5 rounded-lg bg-[#18261e] border border-[#2a3e32] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Bookmark className="w-5 h-5 text-[#d4af37]" />
          <h3 className="text-xl font-royal font-bold text-white">Your Table Reservations</h3>
        </div>
        <p className="text-xs text-[#a0aec0] mb-5">
          Review your upcoming bookings and access your Reference IDs for concierge check-in.
        </p>

        {bookings.length === 0 ? (
          <div className="text-center py-10 px-4 rounded-xl bg-[#0b120e] border border-[#1d2d23]">
            <p className="text-sm text-[#8e9f94]">No active table reservations found.</p>
            <p className="text-xs text-[#5a6b60] mt-1">Book a royal dining table today to experience pure veg luxury.</p>
          </div>
        ) : (
          <div className="space-y-3.5 max-h-[60vh] overflow-y-auto pr-1">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                onClick={() => onSelectBooking(booking)}
                className="p-4 rounded-xl bg-[#0b120e] border border-[#23352a] hover:border-[#d4af37]/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-[#d4af37] px-2 py-0.5 rounded bg-[#1b2b21] border border-[#2c4434]">
                    {booking.referenceId}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => handleCopy(booking.referenceId, e)}
                      className="text-xs text-[#8e9f94] hover:text-white flex items-center gap-1 p-1"
                      title="Copy Reference ID"
                    >
                      {copiedId === booking.referenceId ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 text-[11px]">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-[11px]">Copy</span>
                        </>
                      )}
                    </button>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="text-sm font-semibold text-white mb-2">{booking.guestName}</div>

                <div className="grid grid-cols-2 gap-2 text-xs text-[#a0aec0]">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{booking.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{booking.timeSlot}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span>{booking.guests} Guests</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37]" />
                    <span className="truncate">{booking.seatingArea}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-5 pt-3 border-t border-[#1d2d23] text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-[#8e9f94] hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
