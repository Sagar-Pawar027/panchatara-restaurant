import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Flame, Wine, Clock, Compass, Plus, Minus, ShoppingBag, Sparkles, Calendar, Check, Percent } from 'lucide-react';
import { SignatureDish, MenuItem } from '../../types/index.ts';
import { useCart } from '../../context/CartContext.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface DishDetailModalProps {
  dish: SignatureDish | MenuItem | null;
  onClose: () => void;
  onReserveClick: () => void;
}

export function DishDetailModal({ dish, onClose, onReserveClick }: DishDetailModalProps) {
  const shouldReduceMotion = useReducedMotion();
  const { addItem, openCart } = useCart();
  const { language } = useLanguage();
  const isHi = language === 'hi';

  const [quantity, setQuantity] = useState<number>(1);
  const [justAdded, setJustAdded] = useState<boolean>(false);

  useEffect(() => {
    setQuantity(1);
    setJustAdded(false);
  }, [dish]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (dish) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [dish, onClose]);

  if (!dish) return null;

  // Check if it's a SignatureDish or MenuItem
  const isSignature = 'flavorNotes' in dish;
  const signatureDish = isSignature ? (dish as SignatureDish) : null;

  const numericPrice = parseFloat(String(dish.price).replace(/[^0-9.]/g, '')) || 0;
  const totalDishPrice = numericPrice * quantity;
  const savingsAmount = Math.round(totalDishPrice * 0.25);
  const advanceAmount = Math.round(totalDishPrice * 0.5);

  const handleAddToOrder = (checkoutImmediately = false) => {
    addItem(dish, quantity);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);

    if (checkoutImmediately) {
      onClose();
      openCart('delivery');
    }
  };

  const handlePreReserveTable = () => {
    addItem(dish, quantity);
    onClose();
    openCart('dine-in');
  };

  return (
    <AnimatePresence>
      <motion.div
        id="dish-detail-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 md:p-6"
      >
        <motion.div
          id="dish-detail-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dish-modal-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#161412] text-[#FAF7F2] rounded-xl overflow-hidden border border-[#C5A880]/40 shadow-2xl max-h-[92vh] flex flex-col"
        >
          {/* Close button */}
          <button
            id="dish-modal-close-btn"
            onClick={onClose}
            aria-label="Close dish preview"
            className="absolute top-4 right-4 z-30 text-[#FAF7F2]/80 hover:text-white bg-black/70 hover:bg-black min-w-[42px] min-h-[42px] flex items-center justify-center rounded-full transition-colors border border-white/15"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish hero image */}
          {dish.image && (
            <div className="relative h-44 sm:h-56 md:h-64 w-full overflow-hidden shrink-0 bg-[#100F0D]">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161412] via-[#161412]/40 to-transparent" />
              <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
                <div>
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-semibold block">
                    {dish.category}
                  </span>
                  {dish.hindiName && (
                    <span className="text-sm text-[#C5A880] tracking-wide font-serif">
                      {dish.hindiName}
                    </span>
                  )}
                </div>
                <div className="text-2xl sm:text-3xl font-editorial-serif text-[#FAF7F2] font-semibold">
                  {dish.price}
                </div>
              </div>
            </div>
          )}

          {/* Body content */}
          <div className="p-5 sm:p-7 overflow-y-auto space-y-5 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="dish-modal-title" className="font-editorial-serif text-2xl sm:text-3xl text-[#FAF7F2] font-medium leading-tight">
                  {dish.name}
                </h2>
                {'subtitle' in dish && dish.subtitle && (
                  <p className="text-xs tracking-wider text-[#C5A880] uppercase mt-1">
                    {dish.subtitle}
                  </p>
                )}
              </div>
              {!dish.image && (
                <span className="text-2xl font-editorial-serif text-[#C5A880] font-semibold shrink-0">
                  {dish.price}
                </span>
              )}
            </div>

            <p className="text-sm text-[#FAF7F2]/80 font-light leading-relaxed">
              {dish.description}
            </p>

            {/* LEVERAGE 1 & 2 HIGHLIGHT CARD */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-xl bg-black/40 border border-[#C5A880]/30">
              {/* Leverage 1: Save Commission */}
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                  <Percent className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>0% Aggregator Commission</span>
                </div>
                <p className="text-[11px] text-white/70 leading-normal">
                  Order online directly from our kitchen! Save <strong>~25% commission markup (approx. ₹{savingsAmount})</strong> vs Zomato/Swiggy.
                </p>
              </div>

              {/* Leverage 2: 50% Pre-reservation */}
              <div className="space-y-1 border-t sm:border-t-0 sm:border-l border-white/10 sm:pl-3 pt-2 sm:pt-0">
                <div className="flex items-center gap-1.5 text-xs text-[#C5A880] font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A880] shrink-0" />
                  <span>50% Pay Now • 50% After Dining</span>
                </div>
                <p className="text-[11px] text-white/70 leading-normal">
                  Pre-reserve your table with this dish: Pay only <strong>50% advance (₹{advanceAmount})</strong> now, remaining 50% after dinner!
                </p>
              </div>
            </div>

            {/* Signature specifics if signature dish */}
            {signatureDish && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-3 border-t border-white/10">
                <div className="flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Heritage Origin</span>
                    <span className="text-xs text-[#FAF7F2]">{signatureDish.heritageOrigin}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Wine className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Recommended Beverage</span>
                    <span className="text-xs text-[#FAF7F2]">{signatureDish.winePairing}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Culinary Craft</span>
                    <span className="text-xs text-[#FAF7F2]">{signatureDish.prepTimeNote}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <Flame className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Flavor Architecture</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {signatureDish.flavorNotes.map((note) => (
                        <span key={note} className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-[#FAF7F2]/90 border border-white/5">
                          {note}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dietary Tags */}
            {dish.dietary && dish.dietary.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40 mr-1">Characteristics:</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/70 text-emerald-400 border border-emerald-500/40 font-medium">
                  100% Pure Veg
                </span>
                {dish.dietary.map((diet) => (
                  <span
                    key={diet}
                    className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 capitalize"
                  >
                    {diet.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* ORDERING QUANTITY & ACTION SECTION */}
            <div className="pt-4 border-t border-white/10 space-y-3">
              {/* Quantity selector & calculated total */}
              <div className="flex items-center justify-between bg-[#1F1C18] p-3 rounded-xl border border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-xs uppercase tracking-wider text-white/70 font-medium">Quantity:</span>
                  <div className="flex items-center gap-2 bg-[#12110F] border border-white/20 rounded-lg p-1">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      aria-label="Decrease quantity"
                      className="w-7 h-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-sm font-semibold w-6 text-center text-[#C5A880]">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      aria-label="Increase quantity"
                      className="w-7 h-7 flex items-center justify-center rounded text-white/70 hover:text-white hover:bg-white/10"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase tracking-wider text-white/50 block">Subtotal</span>
                  <span className="font-editorial-serif text-lg text-white font-bold">
                    ₹{totalDishPrice}
                  </span>
                </div>
              </div>

              {/* Primary Ordering CTAs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* 1. Add to Online Order (Zomato-style Delivery) */}
                <button
                  id="dish-modal-order-online-btn"
                  type="button"
                  onClick={() => handleAddToOrder(true)}
                  className="py-3 px-4 rounded-lg bg-[#C5A880] hover:bg-[#dfcaab] text-[#12110F] font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>
                    {justAdded ? 'Added to Order!' : `Order Online (₹${totalDishPrice})`}
                  </span>
                </button>

                {/* 2. Pre-reserve Table with this Food (Pay 50% Now) */}
                <button
                  id="dish-modal-prereserve-table-btn"
                  type="button"
                  onClick={handlePreReserveTable}
                  className="py-3 px-4 rounded-lg bg-[#27231E] hover:bg-[#342F29] border border-[#C5A880]/50 text-[#FAF7F2] font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-98"
                >
                  <Calendar className="w-4 h-4 text-[#C5A880]" />
                  <span>
                    Pre-Reserve Table (Pay ₹{advanceAmount} Now)
                  </span>
                </button>
              </div>

              {/* Sub-actions */}
              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => handleAddToOrder(false)}
                  className="text-[#C5A880] hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to cart & keep exploring</span>
                </button>

                <button
                  id="dish-modal-dismiss-btn"
                  type="button"
                  onClick={onClose}
                  className="text-white/50 hover:text-white text-[11px] uppercase tracking-widest transition-colors"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
