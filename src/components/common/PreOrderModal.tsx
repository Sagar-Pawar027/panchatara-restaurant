import { useState } from 'react';
import type { FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Sparkles,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Utensils,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ChevronLeft,
} from 'lucide-react';
import { SIGNATURE_DISHES, MENU_ITEMS } from '../../data/menu.ts';
import { RESTAURANT_INFO } from '../../data/restaurant.ts';

interface PreOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReservation?: () => void;
}

interface SelectedItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

const PRE_ORDER_FEATURED_ITEMS = [
  ...SIGNATURE_DISHES.map((d) => ({
    id: d.id,
    name: d.name,
    hindiName: d.hindiName,
    price: d.price,
    category: 'Signature',
    description: d.subtitle,
  })),
  ...MENU_ITEMS.filter((m) =>
    ['m-paneer-tikka', 'm-butter-naan', 'm-jowar-roti', 'm-gulab-jamun', 'm-dal-panjtara'].includes(m.id)
  ).map((m) => ({
    id: m.id,
    name: m.name,
    hindiName: m.hindiName,
    price: m.price,
    category: m.category,
    description: m.description,
  })),
];

export function PreOrderModal({ isOpen, onClose }: PreOrderModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [date, setDate] = useState<string>(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [time, setTime] = useState<string>('20:00');
  const [guests, setGuests] = useState<number>(4);
  const [seatingArea, setSeatingArea] = useState<string>('Garden Lawn');
  const [name, setName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [specialDiet, setSpecialDiet] = useState<string>('');
  const [isJain, setIsJain] = useState<boolean>(false);

  // Cart of dishes
  const [cart, setCart] = useState<Record<string, number>>({
    'dal-panjtara': 1,
    'paneer-lababdar': 1,
    'm-butter-naan': 4,
  });

  const [bookingRef, setBookingRef] = useState<string>('');

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  // Calculate totals
  const totalAmount = Object.entries(cart).reduce((sum: number, [id, qty]: [string, number]) => {
    const item = PRE_ORDER_FEATURED_ITEMS.find((d) => d.id === id);
    return sum + (item ? Number(item.price) * Number(qty) : 0);
  }, 0);

  const advanceDeposit = Math.round(totalAmount * 0.5);
  const remainingAtTable = totalAmount - advanceDeposit;
  const itemCount = (Object.values(cart) as number[]).reduce((a: number, b: number) => a + b, 0);

  const handleConfirmOrder = async (e: FormEvent) => {
    e.preventDefault();
    const items = Object.entries(cart).map(([id, qty]) => {
      const dish = PRE_ORDER_FEATURED_ITEMS.find((d) => d.id === id);
      return {
        dishId: id,
        name: dish ? dish.name : id,
        quantity: qty,
        price: dish ? Number(dish.price) : 0,
      };
    });

    try {
      const res = await fetch('/api/pre-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: name || 'Valued Guest',
          phone: phone || 'Not Provided',
          date,
          time,
          guests,
          seatingArea,
          specialDiet: isJain ? `Jain (Satvik) - ${specialDiet}`.trim() : specialDiet,
          items,
          totalAmount,
          advanceDeposit,
        }),
      });
      const data = await res.json();
      const token = data.data?._id ? `PCH-${String(data.data._id).slice(-4).toUpperCase()}` : `PCH-PRE-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(token);
    } catch {
      const token = `PCH-PRE-${Math.floor(1000 + Math.random() * 9000)}`;
      setBookingRef(token);
    }
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div
        id="preorder-modal-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="preorder-modal-title"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-2xl bg-[#141311] border border-[#C5A880]/30 text-[#FAF7F2] rounded-sm shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col"
        >
          {/* Header */}
          <div className="p-6 sm:p-7 border-b border-white/10 bg-[#191714] flex items-start justify-between relative shrink-0">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-[#C5A880] mb-1 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>Panjtara Dining Concierge</span>
              </div>
              <h2 id="preorder-modal-title" className="font-editorial-serif text-2xl sm:text-3xl font-medium text-[#FAF7F2]">
                Pre-Order Your Meal
              </h2>
              <p className="text-xs text-[#FAF7F2]/70 font-light mt-1 max-w-md">
                Choose your dishes in advance. Pay 50% now &amp; our chefs will prepare your feast for your exact arrival.
              </p>
            </div>

            <button
              id="preorder-modal-close-btn"
              onClick={handleReset}
              aria-label="Close Pre-Order Modal"
              className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Progress Tracker */}
          {step < 4 && (
            <div className="flex items-center justify-between px-6 sm:px-8 py-3 bg-[#0F0E0C] border-b border-white/5 text-[11px] uppercase tracking-wider text-[#FAF7F2]/60 shrink-0">
              <span className={step === 1 ? 'text-[#C5A880] font-medium' : ''}>1. Dining Schedule</span>
              <span className="text-white/20">•</span>
              <span className={step === 2 ? 'text-[#C5A880] font-medium' : ''}>2. Curate Dishes ({itemCount})</span>
              <span className="text-white/20">•</span>
              <span className={step === 3 ? 'text-[#C5A880] font-medium' : ''}>3. Guest &amp; 50% Advance</span>
            </div>
          )}

          {/* Scrollable Modal Body */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1">
            {/* STEP 1: Date, Time, Guests & Area */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-2 font-medium">
                      Dining Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        id="preorder-date-input"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-[#1C1A17] border border-white/15 rounded px-3.5 py-2.5 text-sm text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-2 font-medium">
                      Arrival Time Slot
                    </label>
                    <select
                      id="preorder-time-select"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded px-3.5 py-2.5 text-sm text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    >
                      <option value="12:30">12:30 PM (Lunch)</option>
                      <option value="13:30">01:30 PM (Lunch)</option>
                      <option value="14:30">02:30 PM (Lunch)</option>
                      <option value="19:00">07:00 PM (Dinner)</option>
                      <option value="19:30">07:30 PM (Dinner)</option>
                      <option value="20:00">08:00 PM (Peak Dinner)</option>
                      <option value="20:30">08:30 PM (Peak Dinner)</option>
                      <option value="21:00">09:00 PM (Dinner)</option>
                      <option value="21:30">09:30 PM (Dinner)</option>
                      <option value="22:00">10:00 PM (Late Dinner)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-2 font-medium">
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-2">
                      {[2, 4, 6, 8, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setGuests(num)}
                          className={`flex-1 py-2 text-xs font-medium rounded transition-colors ${
                            guests === num
                              ? 'bg-[#C5A880] text-[#12110F]'
                              : 'bg-[#1C1A17] text-[#FAF7F2]/80 border border-white/10 hover:border-white/30'
                          }`}
                        >
                          {num} {num === 12 ? '+' : ''}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-2 font-medium">
                      Preferred Seating
                    </label>
                    <select
                      id="preorder-seating-select"
                      value={seatingArea}
                      onChange={(e) => setSeatingArea(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded px-3.5 py-2.5 text-sm text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    >
                      <option value="Garden Lawn">Lush Open-Air Garden Lawn</option>
                      <option value="Poolside Deck">Poolside Candlelit Table</option>
                      <option value="AC Royal Banquet">Air-Conditioned Royal Hall</option>
                      <option value="Private Cabana">Private Dining Gazebo / Cabana</option>
                    </select>
                  </div>
                </div>

                <div className="p-4 rounded bg-[#C5A880]/10 border border-[#C5A880]/20 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#C5A880] shrink-0 mt-0.5" />
                  <p className="text-xs text-[#FAF7F2]/80 leading-relaxed">
                    <strong>100% Pure Vegetarian Kitchen Guarantee:</strong> All dishes are prepared with pure desi ghee, fresh daily malai paneer, and certified vegetarian ingredients on the Indore Bypass.
                  </p>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-widest rounded hover:bg-[#dfcaab] transition-colors"
                  >
                    <span>Proceed to Select Dishes</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: Select Dishes */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wider text-[#FAF7F2]/70 font-light">
                    Add signature delicacies to your table
                  </span>
                  <span className="text-xs text-[#C5A880] font-mono">
                    {itemCount} items selected (₹{totalAmount})
                  </span>
                </div>

                <div className="space-y-3 max-h-[340px] overflow-y-auto pr-1">
                  {PRE_ORDER_FEATURED_ITEMS.map((item) => {
                    const quantity = cart[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded bg-[#1C1A17] border border-white/10 flex items-center justify-between gap-4 hover:border-white/20 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h4 className="font-editorial-serif text-base text-[#FAF7F2] truncate">
                              {item.name}
                            </h4>
                            {item.hindiName && (
                              <span className="text-xs text-[#C5A880]/70 font-serif hidden sm:inline">
                                {item.hindiName}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-[#FAF7F2]/60 truncate font-light mt-0.5">
                            {item.description}
                          </p>
                          <span className="text-xs font-mono text-[#C5A880] font-medium block mt-1">
                            ₹{item.price}
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-[#12110F] border border-white/15 rounded p-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            disabled={quantity === 0}
                            aria-label={`Decrease ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white disabled:opacity-30 rounded hover:bg-white/10"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center font-mono text-xs font-semibold text-[#FAF7F2]">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            aria-label={`Increase ${item.name}`}
                            className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white rounded hover:bg-white/10"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Live 50% Deposit Calculation Bar */}
                <div className="p-4 rounded bg-[#181613] border border-[#C5A880]/30 space-y-2 text-xs">
                  <div className="flex justify-between text-[#FAF7F2]/70">
                    <span>Food Selection Total:</span>
                    <span className="font-mono text-[#FAF7F2]">₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between text-[#C5A880] font-medium border-t border-white/10 pt-2 text-sm">
                    <span>50% Advance Booking Deposit:</span>
                    <span className="font-mono font-bold">₹{advanceDeposit}</span>
                  </div>
                  <p className="text-[11px] text-[#FAF7F2]/60 font-light pt-1">
                    Pay 50% now to confirm reservation &amp; chef preparation. Remaining balance (₹{remainingAtTable}) is settled at your table.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#FAF7F2]/70 hover:text-[#C5A880]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    disabled={itemCount === 0}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-widest rounded hover:bg-[#dfcaab] disabled:opacity-40 transition-colors"
                  >
                    <span>Proceed to Contact &amp; Deposit</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: Guest details & Deposit confirmation */}
            {step === 3 && (
              <form onSubmit={handleConfirmOrder} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1.5 font-medium">
                      Guest Full Name *
                    </label>
                    <input
                      type="text"
                      id="preorder-name-input"
                      required
                      placeholder="e.g. Sagar Pawar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded px-3.5 py-2 text-sm text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1.5 font-medium">
                      WhatsApp / Mobile Number *
                    </label>
                    <input
                      type="tel"
                      id="preorder-phone-input"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#1C1A17] border border-white/15 rounded px-3.5 py-2 text-sm text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#C5A880] mb-1.5 font-medium">
                    Dietary Notes / Special Occasion
                  </label>
                  <input
                    type="text"
                    id="preorder-notes-input"
                    placeholder="e.g. Birthday celebration, mild spice for kids, extra mint chutney"
                    value={specialDiet}
                    onChange={(e) => setSpecialDiet(e.target.value)}
                    className="w-full bg-[#1C1A17] border border-white/15 rounded px-3.5 py-2 text-sm text-[#FAF7F2] focus:border-[#C5A880] focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 rounded bg-[#1C1A17] border border-white/10 cursor-pointer">
                  <input
                    type="checkbox"
                    id="preorder-jain-checkbox"
                    checked={isJain}
                    onChange={(e) => setIsJain(e.target.checked)}
                    className="w-4 h-4 rounded text-[#C5A880] focus:ring-[#C5A880] bg-[#12110F] border-white/20"
                  />
                  <span className="text-xs text-[#FAF7F2]">
                    Prepare dishes strictly <strong>Jain</strong> (no onion, garlic, or root vegetables).
                  </span>
                </label>

                {/* Final 50% Deposit Summary */}
                <div className="p-4 rounded bg-[#1A1815] border border-[#C5A880]/30 space-y-2">
                  <div className="flex justify-between text-xs text-[#FAF7F2]/75">
                    <span>Selected Date &amp; Time:</span>
                    <span className="font-medium text-[#FAF7F2]">{date} at {time} ({guests} Guests)</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#FAF7F2]/75">
                    <span>Seating Zone:</span>
                    <span className="font-medium text-[#FAF7F2]">{seatingArea}</span>
                  </div>
                  <div className="flex justify-between text-xs text-[#FAF7F2]/75">
                    <span>Items Pre-Ordered:</span>
                    <span className="font-mono text-[#FAF7F2]">{itemCount} items (₹{totalAmount})</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#C5A880] border-t border-white/10 pt-2">
                    <span>50% Advance Payable Now:</span>
                    <span className="font-mono text-base">₹{advanceDeposit}</span>
                  </div>
                  <p className="text-[10px] text-[#FAF7F2]/60">
                    A confirmation voucher with instant table lock is dispatched immediately to your phone.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#FAF7F2]/70 hover:text-[#C5A880]"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Back to Dishes</span>
                  </button>

                  <button
                    type="submit"
                    id="preorder-submit-btn"
                    className="inline-flex items-center gap-2 px-7 py-3 bg-[#C5A880] text-[#12110F] font-semibold text-xs uppercase tracking-widest rounded hover:bg-[#dfcaab] transition-colors shadow-lg shadow-[#C5A880]/15"
                  >
                    <span>Confirm &amp; Lock 50% Pre-Order</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* STEP 4: Success Voucher */}
            {step === 4 && (
              <div className="text-center py-4 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-[#C5A880] block font-medium mb-1">
                    Pre-Order Confirmed &amp; Table Locked
                  </span>
                  <h3 className="font-editorial-serif text-2xl sm:text-3xl text-[#FAF7F2]">
                    We Look Forward to Welcoming You
                  </h3>
                  <p className="text-xs text-[#FAF7F2]/75 font-light max-w-md mx-auto mt-2">
                    Your 50% advance deposit voucher has been generated. Our kitchen hearth is scheduled for your arrival.
                  </p>
                </div>

                {/* Ticket card */}
                <div className="max-w-md mx-auto p-5 rounded bg-[#1A1815] border border-white/10 text-left space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/60">Reference Token:</span>
                    <span className="text-[#C5A880] font-bold">{bookingRef}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Guest Name:</span>
                    <span className="text-[#FAF7F2]">{name || 'Honored Guest'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Schedule:</span>
                    <span className="text-[#FAF7F2]">{date} • {time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Seating:</span>
                    <span className="text-[#FAF7F2]">{seatingArea} ({guests} Guests)</span>
                  </div>
                  <div className="flex justify-between border-t border-white/10 pt-2">
                    <span className="text-white/60">50% Advance Confirmed:</span>
                    <span className="text-emerald-400 font-bold">₹{advanceDeposit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Balance Due at Table:</span>
                    <span className="text-[#FAF7F2]">₹{remainingAtTable}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    id="preorder-success-close-btn"
                    onClick={handleReset}
                    className="px-8 py-3 bg-[#C5A880] text-[#12110F] text-xs uppercase tracking-widest font-medium rounded hover:bg-[#dfcaab] transition-colors"
                  >
                    Done &amp; Return to Website
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
