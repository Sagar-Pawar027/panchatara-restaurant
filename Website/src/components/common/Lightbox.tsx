import { useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../../types/index.ts';

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ items, currentIndex, onClose, onNavigate }: LightboxProps) {
  const shouldReduceMotion = useReducedMotion();
  const isOpen = currentIndex !== null && currentIndex >= 0 && currentIndex < items.length;
  const currentItem = isOpen ? items[currentIndex] : null;

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === 'ArrowRight' && currentIndex < items.length - 1) onNavigate(currentIndex + 1);
    };

    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, currentIndex, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && currentItem && (
        <motion.div
          id="gallery-lightbox-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Photo Lightbox viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-10 select-none"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            id="lightbox-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Close Lightbox"
            className="absolute top-6 right-6 z-20 text-[#FAF7F2]/70 hover:text-[#FAF7F2] bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Navigation Arrows */}
          {currentIndex > 0 && (
            <button
              id="lightbox-prev-btn"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex - 1);
              }}
              aria-label="Previous Image"
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 text-[#FAF7F2]/70 hover:text-[#FAF7F2] bg-black/40 hover:bg-black/80 border border-white/10 p-3 rounded-full transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {currentIndex < items.length - 1 && (
            <button
              id="lightbox-next-btn"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate(currentIndex + 1);
              }}
              aria-label="Next Image"
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 text-[#FAF7F2]/70 hover:text-[#FAF7F2] bg-black/40 hover:bg-black/80 border border-white/10 p-3 rounded-full transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Image & Caption Container */}
          <div
            className="relative max-w-5xl max-h-[88vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.img
              key={currentItem.id}
              src={currentItem.image}
              alt={currentItem.title}
              initial={shouldReduceMotion ? { opacity: 1 } : { scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={shouldReduceMotion ? { opacity: 0 } : { scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[75vh] w-auto max-w-full object-contain rounded-sm shadow-2xl border border-white/10"
            />

            <div className="mt-4 text-center text-[#FAF7F2]">
              <span className="text-xs uppercase tracking-[0.2em] text-[#C5A880] block mb-1">
                {currentItem.categoryLabel} • {currentIndex + 1} of {items.length}
              </span>
              <h3 className="font-editorial-serif text-lg md:text-xl font-normal text-[#FAF7F2]">
                {currentItem.title}
              </h3>
              <p className="text-xs text-[#FAF7F2]/70 max-w-md mx-auto mt-1 font-light">
                {currentItem.caption}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
