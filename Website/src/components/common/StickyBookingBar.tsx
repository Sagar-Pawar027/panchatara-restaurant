import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Utensils, X, Sparkles } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface StickyBookingBarProps {
  onReserve: () => void;
  onPreOrder: () => void;
}

export function StickyBookingBar({ onReserve, onPreOrder }: StickyBookingBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past hero section (> 550px)
      if (window.scrollY > 550 && !isDismissed) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDismissed]);

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-3 sm:bottom-6 inset-x-3 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-40 max-w-xl w-[calc(100%-1.5rem)] sm:w-auto"
        >
          <div className="bg-[#141311]/95 backdrop-blur-md border border-[#C5A880]/35 px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-2xl flex items-center justify-between gap-2.5 sm:gap-4 text-[#FAF7F2]">
            {/* Status indicator on desktop */}
            <div className="hidden md:flex items-center gap-2 pr-1 border-r border-white/10 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-editorial-serif text-sm tracking-wide text-[#FAF7F2]">Panjtara</span>
              <span className="text-[11px] text-[#FAF7F2]/60 font-light">Open Till Midnight</span>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex items-center gap-2 flex-1 sm:flex-initial">
              <button
                id="sticky-bar-reserve-btn"
                onClick={onReserve}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 border border-[#C5A880]/70 bg-black/50 hover:bg-[#C5A880]/15 hover:border-[#C5A880] text-[#FAF7F2] text-xs uppercase tracking-widest font-semibold rounded-full transition-colors shadow-sm"
              >
                <Calendar className="w-3.5 h-3.5 text-[#C5A880]" />
                <span>{language === 'hi' ? 'टेबल बुक करें' : 'Reserve Table'}</span>
              </button>

              <button
                id="sticky-bar-preorder-btn"
                onClick={onPreOrder}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 border border-[#C5A880]/50 bg-white/5 hover:bg-white/10 text-[#FAF7F2] text-xs uppercase tracking-widest font-medium rounded-full transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
                <span className="hidden xs:inline">
                  {language === 'hi' ? 'भोजन प्री-ऑर्डर' : 'Pre-Order Meal'}
                </span>
                <span className="xs:hidden">
                  {language === 'hi' ? 'प्री-ऑर्डर' : 'Pre-Order'}
                </span>
              </button>
            </div>

            {/* Dismiss button */}
            <button
              id="sticky-bar-dismiss-btn"
              onClick={() => setIsDismissed(true)}
              aria-label="Dismiss sticky booking bar"
              className="w-7 h-7 flex items-center justify-center text-white/50 hover:text-white rounded-full hover:bg-white/10 transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
