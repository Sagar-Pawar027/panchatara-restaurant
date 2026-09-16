import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, Flame, Wine, Clock, Compass } from 'lucide-react';
import { SignatureDish, MenuItem } from '../../types/index.ts';

interface DishDetailModalProps {
  dish: SignatureDish | MenuItem | null;
  onClose: () => void;
  onReserveClick: () => void;
}

export function DishDetailModal({ dish, onClose, onReserveClick }: DishDetailModalProps) {
  const shouldReduceMotion = useReducedMotion();

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

  return (
    <AnimatePresence>
      <motion.div
        id="dish-detail-modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-6"
      >
        <motion.div
          id="dish-detail-modal-card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dish-modal-title"
          initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.96, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.96, opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-[#181614] text-[#FAF7F2] rounded-lg overflow-hidden border border-[#C5A880]/30 shadow-2xl max-h-[90vh] flex flex-col"
        >
          {/* Close button */}
          <button
            id="dish-modal-close-btn"
            onClick={onClose}
            aria-label="Close dish preview"
            className="absolute top-4 right-4 z-20 text-[#FAF7F2]/80 hover:text-white bg-black/60 hover:bg-black/90 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full transition-colors border border-white/10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Dish hero image */}
          {dish.image && (
            <div className="relative h-48 sm:h-64 md:h-72 w-full overflow-hidden shrink-0 bg-[#12110F]">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181614] via-[#181614]/30 to-transparent" />
              <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-medium block">
                    {dish.category}
                  </span>
                  {dish.hindiName && (
                    <span className="text-xs text-[#C5A880]/80 tracking-wide font-serif">
                      {dish.hindiName}
                    </span>
                  )}
                </div>
                <div className="text-2xl font-editorial-serif text-[#FAF7F2] font-semibold">
                  {dish.price}
                </div>
              </div>
            </div>
          )}

          {/* Body content */}
          <div className="p-6 md:p-8 overflow-y-auto space-y-6">
            <div>
              <h2 id="dish-modal-title" className="font-editorial-serif text-2xl md:text-3xl text-[#FAF7F2] font-medium leading-tight">
                {dish.name}
              </h2>
              {'subtitle' in dish && dish.subtitle && (
                <p className="text-xs tracking-wider text-[#C5A880] uppercase mt-1">
                  {dish.subtitle}
                </p>
              )}
            </div>

            <p className="text-sm md:text-base text-[#FAF7F2]/80 font-light leading-relaxed">
              {dish.description}
            </p>

            {/* Signature specifics */}
            {signatureDish && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <Compass className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Heritage Origin</span>
                    <span className="text-xs text-[#FAF7F2]">{signatureDish.heritageOrigin}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Wine className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Recommended Beverage</span>
                    <span className="text-xs text-[#FAF7F2]">{signatureDish.winePairing}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Culinary Craft</span>
                    <span className="text-xs text-[#FAF7F2]">{signatureDish.prepTimeNote}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Flame className="w-4 h-4 text-[#C5A880] mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-white/50 block">Flavor Architecture</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
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
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-white/40 mr-1">Characteristics:</span>
                <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 font-medium">
                  100% Pure Veg
                </span>
                {dish.dietary.map((diet) => (
                  <span
                    key={diet}
                    className="text-[11px] px-2.5 py-1 rounded-full bg-[#C5A880]/15 text-[#C5A880] border border-[#C5A880]/30 capitalize"
                  >
                    {diet.replace('-', ' ')}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3 border-t border-white/10">
              <button
                id="dish-modal-reserve-btn"
                onClick={() => {
                  onClose();
                  onReserveClick();
                }}
                className="flex-1 py-3 px-6 rounded bg-[#C5A880] text-[#12110F] font-medium text-xs uppercase tracking-widest hover:bg-[#dfcaab] transition-colors text-center"
              >
                Reserve a Table at Panjtara
              </button>
              <button
                id="dish-modal-dismiss-btn"
                onClick={onClose}
                className="py-3 px-6 rounded border border-white/20 text-white/80 hover:text-white hover:border-white text-xs uppercase tracking-widest transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
