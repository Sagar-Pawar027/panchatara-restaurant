import React, { useState } from 'react';
import { X, Check, Plus, Minus, Sparkles, ShoppingBag } from 'lucide-react';
import { MENU_ITEMS, MenuItem } from '../data/restaurantData';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPreOrderSuccess: (orderRef: string, total: number) => void;
}

export const PreOrderModal: React.FC<PreOrderModalProps> = ({
  isOpen,
  onClose,
  onPreOrderSuccess,
}) => {
  const [selectedItems, setSelectedItems] = useState<{ [id: string]: number }>({
    'dal-panchtara': 1,
    'dum-biryani': 1,
  });
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');

  if (!isOpen) return null;

  const handleUpdate = (id: string, delta: number) => {
    setSelectedItems((prev) => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalAmount = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const dish = MENU_ITEMS.find((m) => m.id === id);
    return sum + (dish ? dish.price * qty : 0);
  }, 0);

  const advanceLock = Math.round(totalAmount * 0.5);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestPhone) return;

    const ref = `PANJ-PRE-${Math.floor(100000 + Math.random() * 900000)}`;
    onPreOrderSuccess(ref, totalAmount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#14120F] border border-[#C5A880]/50 rounded-lg p-6 sm:p-7 shadow-2xl text-[#FAF7F2] max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#C5A880] hover:text-white rounded-lg hover:bg-[#241F1A] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-mono mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>50% ADVANCE LOCK</span>
          </div>
          <h3 className="font-editorial-serif text-2xl text-[#FAF7F2]">
            Pre-Order Your Royal Meal
          </h3>
          <p className="text-xs text-[#FAF7F2]/70 mt-1">
            Pay 50% now & our chefs prepare your slow-dum delicacies hot for your exact arrival.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {MENU_ITEMS.slice(0, 5).map((dish) => {
              const qty = selectedItems[dish.id] || 0;
              return (
                <div
                  key={dish.id}
                  className="flex items-center justify-between p-3 rounded bg-[#1A1713] border border-[#2B241D]"
                >
                  <div className="min-w-0 flex-1">
                    <span className="font-editorial-serif text-sm font-semibold text-[#FAF7F2] block truncate">
                      {dish.name}
                    </span>
                    <span className="text-xs text-[#C5A880] font-mono">₹{dish.price}</span>
                  </div>

                  <div className="flex items-center gap-2 border border-[#3E342A] rounded bg-[#100E0C] p-1">
                    <button
                      type="button"
                      onClick={() => handleUpdate(dish.id, -1)}
                      className="p-1 hover:text-[#C5A880] text-white/70"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-2 text-xs font-mono font-bold text-[#FAF7F2]">{qty}</span>
                    <button
                      type="button"
                      onClick={() => handleUpdate(dish.id, 1)}
                      className="p-1 hover:text-[#C5A880] text-white/70"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#26201A]">
            <input
              type="text"
              placeholder="Guest Name *"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
              required
            />
            <input
              type="tel"
              placeholder="Mobile Number *"
              value={guestPhone}
              onChange={(e) => setGuestPhone(e.target.value)}
              className="px-3 py-2 text-xs rounded bg-[#100E0C] border border-[#2E2821] text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
              required
            />
          </div>

          <div className="p-3 rounded bg-[#1C1814] border border-[#C5A880]/30 space-y-1.5 text-xs">
            <div className="flex justify-between text-[#FAF7F2]/80">
              <span>Total Dishes Value:</span>
              <span className="font-mono text-[#FAF7F2]">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between font-bold text-[#C5A880]">
              <span>50% Advance Lock:</span>
              <span className="font-mono text-base">₹{advanceLock}</span>
            </div>
            <p className="text-[10px] text-[#FAF7F2]/60 pt-1">
              * Remaining 50% paid at the restaurant table on Indore Bypass.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded bg-gradient-to-r from-[#C5A880] to-[#997424] hover:from-[#D5B890] hover:to-[#A8822F] text-[#12110F] font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95"
          >
            CONFIRM PRE-ORDER & LOCK TABLE
          </button>
        </form>
      </div>
    </div>
  );
};
